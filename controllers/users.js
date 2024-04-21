import { ObjectId } from "mongodb";
import { connect } from "../services/mongoDB.js";

export async function getUsers(req, res) {
  const { email, username } = req.query;
  const user = {};
  email ? user.email = email : null;
  username ? user.userName = username : null;

  try {
    const db = await connect("users");
    const users = await db.find(user).toArray();
    const usersMap = users.map(u => ({ ...u, id: u._id, _id: undefined, password: undefined }))
    res.send(usersMap)
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "Something went wrong" });
  }
}

export async function getUser(req, res) {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.status(400).send({ error: "User id is not valid" });

  try {
    const db = await connect("users");
    const user = await db.findOne({ _id: new ObjectId(id) });

    if (!user) res.status(404).send({ error: "User does not exist" });
    else res.send({ ...user, id: user._id, _id: undefined, password: undefined });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "Something went wrong" });
  }
}