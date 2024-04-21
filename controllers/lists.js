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
    console.error(err.message);
    res.status(500).send({ error: "Something went wrong" });
  }
}

export async function getList(req, res) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).send({ error: "List id is not valid" });

    const db = await connect("lists");
    const list = await db.findOne({ _id: new ObjectId(id) });

    if (!list) return res.status(404).send({ error: "List does not exist" });
    else res.send({ ...list, id: list._id, _id: undefined });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "Something went wrong" });
  }
}

export async function addList(req, res) {
  const { idToken } = req.body;
  const result = validateList(req.body);
  if (result.error) return res.status(400).send({ error: JSON.parse(result.error) })

  const { position, idBoard } = result.data;
  if (!ObjectId.isValid(idBoard)) return res.status(400).send({ error: "List idBoard is not valid" });

  try {
    const [dbLists, dbBoards] = await Promise.all([connect('lists'), connect('boards')]);

    const board = await dbBoards.findOne({ _id: new ObjectId(idBoard) })
    if (!board) return res.status(404).send({ error: "Board does not exist" })
    if (board.idUser !== idToken) return res.status(403).send({ error: "Invalid owner" });

    const listFound = await dbLists.findOne({ position, idBoard });
    if (listFound) return res.status(400).send({ error: "The position is occupied" });

    const newList = await dbLists.insertOne({ ...result.data });
    res.send({ id: newList.insertedId });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ error: "Something went wrong" });
  }
}

export async function updateList(req, res) {
  const { idToken } = req.body;
  const { id } = req.params;
  const result = validateList(req.body, true);

  if (!ObjectId.isValid(id)) return res.status(400).send({ error: "List id is not valid" });
  if (result.error) return res.status(400).send({ error: JSON.parse(result.error) })

  try {
    const db = await connect('lists');
    const list = await db.findOne({ _id: new ObjectId(id) });
    const { position: pos, idBoard: board } = result.data;

    if (!list) return res.status(404).send({ error: "List does not exist" });
    else if (list.idUser !== idToken) return res.status(403).send({ error: "Invalid owner" });

    const found = await db.findOne({ position: pos || list.position, idBoard: board || list.idBoard });
    if (found && found._id.toString() !== list._id.toString())
      return res.status(400).send({ error: "The position is ocuppied" });

    const updated = await db.findOneAndUpdate({ _id: list._id }, { $set: result.data }, { returnDocument: "after" });

    res.send({ ...updated, id: updated._id, _id: undefined });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ error: "Something wen wrong" })
  }
}

export async function deleteLists(req, res) {
  const { idToken } = req.body;
  const { idBoard, name, position } = req.query;
  const filters = { idUser: idToken };

  name ? filters.name = name : null;
  idBoard ? filters.idBoard = idBoard : null;
  position ? filters.position = position : null;

  if (!idBoard && !name && !position) return res.status(400).send({ error: "There are no filters" });
  if (idBoard && !ObjectId.isValid(idBoard))
    return res.status(400).send({ error: "List idBoard is not valid" });

  try {
    const db = await connect("lists");
    const lists = await db.deleteMany(filters);
    res.send({ deleted: Boolean(lists.deletedCount), counter: lists.deletedCount });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "Something went wrong" });
  }
}

export async function deleteList(req, res) {
  const { id } = req.params;
  const { idToken } = req.body;
  if (!ObjectId.isValid(id)) return res.status(400).send({ error: "List id is not valid" });

  try {
    const db = await connect('lists');
    const list = await db.findOne({ _id: new ObjectId(id) })

    if (!list) return res.status(404).send({ error: "List does not exist" });
    else if (list.idUser !== idToken) return res.status(403).send({ error: "Invalid owner" });

    const deleted = await db.findOneAndDelete({ _id: list._id });
    res.send({ ...deleted, id: deleted._id, _id: undefined });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "Something went wrong" });
  }
}