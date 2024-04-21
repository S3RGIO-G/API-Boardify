import { validateUser } from '../schemas/usuario.js';
import { createToken } from '../services/jwt.js';
import { connect } from '../services/mongoDB.js';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import cookie from 'cookie';

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email or Password can not to be null" });

    const db = await connect("users");
    const user = await db.findOne({ email });
    if (!user) return res.status(400).send({ error: "Email not registered" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).send({ error: "Invalid password" });

    const token = await createToken({ id: user._id.toString() })

    res.setHeader('set-cookie', cookie.serialize('credentials', token, { secure: true, sameSite: 'none', expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), path: "/" }))

    res.send({ id: user._id, email: user.email, userName: user.userName, photo: user.photo })
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "Something went wrong" });
  }
}

export function logout(req, res) {
  res.setHeader('set-cookie', cookie.serialize('credentials', "", { secure: true, sameSite: 'none', expires: new Date(0), path: "/" }));
  return res.sendStatus(200);
}

export async function register(req, res) {
  const result = validateUser(req.body);
  if (result.error) return res.status(400).json({ error: JSON.parse(result.error) })
  const { email, password, userName, photo } = result.data;

  try {
    const db = await connect("users");
    const userFound = await db.findOne({ $or: [{ email }, { userName }] });

    if (userFound) return res.status(400).send({ error: "Email or UserName in use" });

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await db.insertOne({ userName, email, password: hashPassword, photo });
    res.send(newUser.insertedId);
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "Something went wrong" });
  }
}

export async function validate(req, res) {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).send({ error: "Id cant be null" });
  if (!ObjectId.isValid(idToken)) return res.status(400).send({ error: "User ID is not valid" });

  try {
    const db = await connect("users");
    const userFound = await db.findOne({ _id: new ObjectId(idToken) });
    if (!userFound) return res.status(404).send({ error: "User not found" });

    res.send({ ...userFound, id: userFound._id, _id: undefined, password: undefined });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Something went wrong" });
  }
}