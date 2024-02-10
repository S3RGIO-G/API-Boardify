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
    res.status(500).send({ error: "something_went_wrong" });
  }
}

export async function getBoard(req, res) {
  const { id } = req.params;
  let _id = null;
  try {
    _id = new ObjectId(id);
  } catch (err) {
    return res.status(400).send({ error: "Board ID is not valid" });
  }

  try {
    const db = await connect("boards");
    const board = await db.findOne({ _id });
    if (!board) throw Error("Board does not exist");
    else res.send({ ...board, id: board._id, _id: undefined });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
}

export async function addBoard(req, res){
  const result = validateBoard(req.body);
  if (result.error) return res.status(400).send({ error: JSON.parse(result.error) })

  try {
    const db = await connect('boards');
    const newBoard = await db.insertOne({ ...result.data });
    res.send({ id: newBoard.insertedId });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
}
export async function updateBoard(req, res){
  const { id } = req.params;
  let _id = null;
  try {
    _id = new ObjectId(id);
  } catch (err) {
    return res.status(400).send({ error: "Board ID is not valid" });
  }

  const result = validateBoard(req.body, true);
  if (result.error) return res.status(400).send({ error: JSON.parse(result.error) })

  try {
    const db = await connect('boards');
    const updated = await db.findOneAndUpdate({ _id }, { $set: result.data }, { returnDocument: "after" });

    if (updated) res.send({ ...updated, id: updated._id, _id: undefined });
    else throw Error("Board id does not exist");
  } catch (err) {
    res.status(400).send({ error: err.message })
  }
}
export async function deleteBoard(req, res){
  const { id } = req.params;
  let _id = null;
  try {
    _id = new ObjectId(id);
  } catch (err) {
    return res.status(400).send({ error: "Board ID is not valid" });
  }

  try {
    const db = await connect('boards');
    const deleted = await db.findOneAndDelete({ _id });

    if (deleted) res.send({ ...deleted, id: deleted._id, _id: undefined });
    else throw Error('Board id does not exist');
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
}