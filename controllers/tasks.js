import { connect } from "../services/mongoDB.js";
import { ObjectId } from "mongodb";
import { validateTask } from '../schemas/task.js';

export async function getTasks(req, res) {
  const { name, idUser, idList, desc } = req.query;
  const task = {};
  name ? task.name = name : null;
  idUser ? task.idUser = idUser : null;
  idList ? task.idList = idList : null;
  desc ? task.description = desc : null;

  try {
    const db = await connect('tasks');
    const tasks = await db.find(task).sort({ "position": 1 }).toArray();
    const tasksMap = tasks.map((task) => {
      return { ...task, id: task._id, _id: undefined }
    })
    res.send(tasksMap);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "Something went wrong" });
  }
}

export async function getTask(req, res) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).send({ error: "Task id is not valid" });

    const db = await connect("tasks");
    const task = await db.findOne({ _id: new ObjectId(id) });

    if (!task) res.status(404).send({ error: "Task does not exist" });
    else res.send({ ...task, id: task._id, _id: undefined });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "Something went wrong" });
  }
}

export async function addTask(req, res) {
  const { idToken } = req.body;
  const result = validateTask(req.body);
  if (result.error) return res.status(400).send({ error: JSON.parse(result.error) })

  const { position, idList } = result.data;
  if (!ObjectId.isValid(idList)) return res.status(400).send({ error: "Task idList is not valid" });

  try {
    const [dbTasks, dbLists] = await Promise.all([connect('tasks'), connect('lists')]);

    const list = await dbLists.findOne({ _id: new ObjectId(idList), idUser: idToken })
    if (!list) return res.status(404).send({ error: "List does not exist" });
    if (list.idUser !== idToken) return res.status(403).send({ error: "Invalid owner" });

    const taskFound = await dbTasks.findOne({ position, idList });
    if (taskFound) return res.status(400).send({ error: "The position is occupied" });

    const newTask = await dbTasks.insertOne({ ...result.data });
    res.send({ id: newTask.insertedId });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "Something wen wrong" });
  }
}

export async function updateTask(req, res) {
  const { id } = req.params;
  const { idToken } = req.body;
  const result = validateTask(req.body, true);

  if (!ObjectId.isValid(id)) return res.status(400).send({ error: "Task id is not valid" });
  if (result.error) return res.status(400).send({ error: JSON.parse(result.error) })

  try {
    const db = await connect('tasks');
    const task = await db.findOne({ _id: new ObjectId(id) });
    const { position: pos, idList: list } = result.data;

    if (!task) return res.status(404).send({ error: "Task does not exist" });
    else if (task.idUser !== idToken) return res.status(403).send({ error: "Invalid owner" });

    const found = await db.findOne({ position: pos || task.position, idList: list || task.idList });
    if (found && found._id.toString() !== task._id.toString())
      return res.status(400).send({ error: "The position is occupied" });

    const updated = await db.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: result.data }, { returnDocument: "after" });

    res.send({ ...updated, id: updated._id, _id: undefined });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "Something went wrong" })
  }
}

export async function deleteTasks(req, res) {
  const { idToken } = req.body;
  const { idList, hasDescription, name } = req.query;
  const filters = { idUser: idToken };

  name ? filters.name = name : null;
  idList ? filters.idList = idList : null;
  hasDescription ? filters.hasDescription = hasDescription : null;

  if (!idList && !hasDescription && !name) return res.status(400).send({ error: "There are no filters" });
  if (idList && !ObjectId.isValid(idList))
    return res.status(400).send({ error: "Task idList is not valid" });

  try {
    const db = await connect('tasks');
    const tasks = await db.deleteMany(filters);

    res.send({ deleted: Boolean(tasks.deletedCount), counter: tasks.deletedCount });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "Something went wrong" });
  }
}

export async function deleteTask(req, res) {
  const { id } = req.params;
  const { idToken } = req.body;
  if (!ObjectId.isValid(id)) return res.status(400).send({ error: "Task id is not valid" });

  try {
    const db = await connect('tasks');
    const task = await db.findOne({ _id: new ObjectId(id) });

    if (!task) return res.status(404).send({ error: "Task does not exist" });
    else if (task.idUser !== idToken) return res.status(403).send({ error: "Invalid owner" });

    const deleted = await db.findOneAndDelete({ _id: task._id });
    res.send({ ...deleted, id: deleted._id, _id: undefined });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "Something went wrong" });
  }
}