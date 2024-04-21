import { ObjectId } from "mongodb";
import { connect } from "../services/mongoDB.js";
import { validateBoard } from "../schemas/board.js";

export async function getBoards(req, res) {
  const { name, idUser } = req.query;
  const board = {};
  name ? board.name = name : null;
  idUser ? board.idUser = idUser : null;

  try {
    const db = await connect('boards');
    const boards = await db.find(board).toArray();
    const boardsMap = boards.map(l => ({ ...l, id: l._id, _id: undefined }))
    res.send(boardsMap);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "Something went wrong" });
  }
}

export async function getBoard(req, res) {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.status(400).send({ error: "Board id is not valid" });

  try {
    const db = await connect("boards");
    const board = await db.findOne({ _id: new ObjectId(id) });

    if (!board) res.status(404).send({ error: "Board does not exist" });
    else res.send({ ...board, id: board._id, _id: undefined });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "Something went wrong" });
  }
}

export async function addBoard(req, res) {
  const { idToken } = req.body;
  const result = validateBoard(req.body);
  if (result.error) return res.status(400).send({ error: JSON.parse(result.error) });

  const { idUser } = result.data;
  if (idToken !== idUser) return res.status(403).send({ error: "Invalid owner" });

  try {
    const db = await connect('boards');
    const newBoard = await db.insertOne({ ...result.data });
    res.send({ id: newBoard.insertedId });
  } catch (err) {
    res.status(500).send({ error: "Something went wrong" });
  }
}

export async function updateBoard(req, res) {
  const { id } = req.params;
  const { idToken } = req.body;
  const result = validateBoard(req.body, true);

  if (result.error) return res.status(400).send({ error: JSON.parse(result.error) })
  if (!ObjectId.isValid(id)) return res.status(403).send({ error: "Board id is not valid" });

  try {
    const db = await connect('boards');
    const board = await db.findOne({ _id: new ObjectId(id) });
    if (!board) return res.status(404).send({ error: "Board does not exist" });
    else if (board.idUser !== idToken) return res.status(403).send({ error: "Invalid owner" });

    const updated = await db.findOneAndUpdate({ _id: board._id }, { $set: result.data }, { returnDocument: "after" });

    res.send({ ...updated, id: updated._id, _id: undefined });
  } catch (err) {
    res.status(500).send({ error: "Something went wrong" })
  }
}

export async function deleteBoard(req, res) {
  const { id } = req.params;
  const { idToken } = req.body;
  if (!ObjectId.isValid(id)) return res.status(400).send({ error: "Board id is not valid" });

  try {
    const db = await connect('boards');
    const board = await db.findOne({ _id: new ObjectId(id) });
    if (!board) return res.status(404).send({ error: "Board does not exist" });
    else if (board.idUser !== idToken) return res.status(403).send({ error: "Invalid owner" });

    const deleted = await db.findOneAndDelete({ _id: board._id });
    res.send({ ...deleted, id: deleted._id, _id: undefined });
  } catch (err) {
    res.status(500).send({ error: "Something went wrong" });
  }
}