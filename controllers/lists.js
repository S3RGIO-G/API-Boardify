import { ObjectId } from "mongodb";
import { connect } from "../services/mongoDB.js";
import { validateList } from "../schemas/list.js";

export async function getLists(req, res) {
  const { position, name, idUser, idBoard } = req.query;

  const list = {};
  name ? list.name = name : null;
  idUser ? list.idUser = idUser : null;
  position ? list.position = position : null;
  idBoard ? list.idBoard = idBoard : null;

  try {
    const db = await connect('lists');
    const lists = await db.find(list).sort({ "position": 1 }).toArray();
    const listsMap = lists.map(l => ({ ...l, id: l._id, _id: undefined }))
    res.send(listsMap);
  } catch (err) {
    res.status(500).send({ error: "something_went_wrong" });
  }
}

export async function getList(req, res) {
  const { id } = req.params;
  let _id = null;
  try {
    _id = new ObjectId(id);
  } catch (err) {
    return res.status(400).send({ error: "List ID is not valid" });
  }

  try {
    const db = await connect("lists");
    const list = await db.findOne({ _id });

    if (!list) throw Error("List does not exist");
    else res.send({ ...list, id: list._id, _id: undefined });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
}

export async function addList(req, res) {
  const result = validateList(req.body);

  if (result.error) return res.status(400).send({ error: JSON.parse(result.error) })

  try {
    const db = await connect('lists');
    const newList = await db.insertOne({ ...result.data });
    res.send({ id: newList.insertedId });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
}

export async function updateList(req, res) {
  const { id } = req.params;
  let _id = null;
  try {
    _id = new ObjectId(id);
  } catch (err) {
    return res.status(400).send({ error: "List ID is not valid" });
  }

  const result = validateList(req.body, true);
  if (result.error) return res.status(400).send({ error: JSON.parse(result.error) })
  const { position } = result.data;
  try {
    const db = await connect('lists');
    if (position) {
      const found = await db.findOne({ position });
      if (found) throw Error("That position is used");
    }
    const updated = await db.findOneAndUpdate({ _id }, { $set: result.data }, { returnDocument: "after" });

    if (updated) res.send({ ...updated, id: updated._id, _id: undefined });
    else throw Error("List id does not exist");
  } catch (err) {
    res.status(400).send({ error: err.message })
  }
}

export async function deleteList(req, res) {
  const { id } = req.params;
  let _id = null;
  try {
    _id = new ObjectId(id);
  } catch (err) {
    return res.status(400).send({ error: "List ID is not valid" });
  }

  try {
    const db = await connect('lists');
    const deleted = await db.findOneAndDelete({ _id });

    if (deleted) res.send({ ...deleted, id: deleted._id, _id: undefined });
    else throw Error('List id does not exist');
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
}