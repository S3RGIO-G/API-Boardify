import { validateUser } from '../schemas/usuario.js';
import bcrypt from 'bcryptjs';
import { createToken } from '../services/jwt.js';
import { connect } from '../services/mongoDB.js';
import { ObjectId } from 'mongodb';
import cookie from 'cookie';

// ** LOGIN ----------------------
export async function login(req, res) {
  const db = await connect("users");
  const { email, password } = req.body;

  if (!email || !password) return res.status(404).json({ error: "Parameters can not to be null" });

  try {
    const user = await db.findOne({ email });
    if (!user) return res.status(400).send({ error: "email_not_registered" });
    user._id = user._id.toString();

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(404).send({ error: "invalid_password" });

    const token = await createToken({ id: user._id })
    console.log(token);
    // res.cookie("credentials", token, { sameSite: "none", secure: true, maxAge: 1000 * 60 * 60 * 24 });
    // res.setHeader('set-cookie', `credentials=${token}; Path=/; Secure; SameSite=None; Partitioned;`)
    res.setHeader('set-cookie', cookie.serialize('credentials', token, { secure: true, sameSite: 'none', path: '/', partitioned: true, maxAge: 60 * 60 * 24 * 2, httpOnly: false }))

    res.send({ id: user._id, email: user.email, userName: user.userName, photo: user.photo })
  }
  catch (err) {
    res.status(500).send({ error: "something_went_wrong" });
  }
}

// ** LOGOUT ----------------------
export function logout(req, res) {
  // res.cookie("credentials", "", { expires: new Date(0) })
  res.setHeader('set-cookie', cookie.serialize('credentials', "", { secure: true, sameSite: 'none', path: '/', partitioned: true, expires: new Date(0) }));

  return res.sendStatus(200);
}

// ** REGISTER ----------------------
export async function register(req, res) {
  const result = validateUser(req.body);
  if (result.error) return res.status(400).json({ error: JSON.parse(result.error) })

  const { email, password, userName, photo } = result.data;

  try {
    const db = await connect("users");
    const userFound = await db.findOne({ $or: [{ email }, { userName }] });

    if (userFound) return res.status(400).send({ error: "email_or_username_in_use" });

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await db.insertOne({ userName, email, password: hashPassword, photo });
    res.send(newUser.insertedId);
  }
  catch (err) {
    res.status(500).send({ error: "something_went_wrong" });
  }
}

// ** VALIDATE ----------------------
export async function validate(req, res) {
  const { id } = req.body;
  if (!id) return res.status(400).send({ error: "Id cant be null" });
  let _id = null;
  try {
    _id = new ObjectId(id);
  } catch (err) {
    return res.status(400).send({ error: "User ID is not valid" });
  }

  try {
    const db = await connect("users");
    const userFound = await db.findOne({ _id });

    if (!userFound) return res.status(400).send({ error: "User not found" });
    res.send({
      id: userFound._id,
      email: userFound.email,
      userName: userFound.userName,
      photo: userFound.photo
    });
  } catch (err) {
    res.status(500).send({ message: "something_went_wrong" });
  }
}