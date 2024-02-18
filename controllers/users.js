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
    const usersMap = users.map(u => ({ ...u, id: u.id, _id: undefined }))
    res.send(usersMap)
  } catch (err) {
    res.status(500).send({ error: "something_went_wrong" });
  }
}

export async function getUser(req, res) {
  const { id } = req.params;
  let _id = null;
  try {
    _id = new ObjectId(id);
  } catch (err) {
    return res.status(400).send({ error: "User ID is not valid" });
  }

  try {
    const db = await connect("users");
    const user = await db.findOne({ _id });
    if (!user) res.status(400).send({ error: "User does not exist" });
    else res.send({ ...user, id: user._id, _id: undefined });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
}