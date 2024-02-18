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
    res.status(500).send({ error: "something_went_wrong" });
  }
}

export async function getTask(req, res) {
  const { id } = req.params;
  let _id = null;
  try {
    _id = new ObjectId(id);
  } catch (err) {
    return res.status(400).send({ error: "Task ID is not valid" });
  }

  try {
    const db = await connect("tasks");
    const task = await db.findOne({ _id });

    if (!task) throw Error("Task does not exist");
    else res.send({ ...task, id: task._id, _id: undefined });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
}

export async function addTask(req, res) {
  const result = validateTask(req.body);

  if (result.error) return res.status(400).send({ error: JSON.parse(result.error) })

  const { position, idList } = result.data;
  try {
    const db = await connect('tasks');
    const taskFound = await db.findOne({ position, idList });
    if (taskFound) throw Error("The task position is occupied");

    const newTask = await db.insertOne({ ...result.data });
    res.send({ id: newTask.insertedId });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
}

export async function updateTask(req, res) {
  const { id } = req.params;
  let _id = null;
  try {
    _id = new ObjectId(id);
  } catch (err) {
    return res.status(400).send({ error: "Task ID is not valid" });
  }

  const result = validateTask(req.body, true);
  if (result.error) return res.status(400).send({ error: JSON.parse(result.error) })

  const { position, idList } = result.data;
  try {
    const db = await connect('tasks');

    if (position) {
      const found = await db.findOne({ position, idList });
      if (found) throw Error("That position is used");
    }

    const taskUpdate = await db.findOneAndUpdate({ _id }, { $set: result.data }, { returnDocument: "after" });
    if (taskUpdate) res.send({ ...taskUpdate, id: taskUpdate._id, _id: undefined });
    else throw Error("Task id does not exist");
  } catch (err) {
    res.status(400).send({ error: err.message })
  }
}

export async function deleteTasks(req, res) {
  const { idUser, idList } = req.query;
  const task = {};

  idUser ? task.idUser = idUser : null;
  idList ? task.idList = idList : null;
  if (!Object.entries(task).length) return res.status(400).send({ error: "There are no filters" })

  try {
    const db = await connect('tasks');
    const tasks = await db.deleteMany(task);

    res.send({ deleted: true, counter: tasks.deletedCount });
  } catch (err) {
    res.status(500).send({ error: "something_went_wrong" });
  }
}

export async function deleteTask(req, res) {
  const { id } = req.params;
  let _id = null;
  try {
    _id = new ObjectId(id);
  } catch (err) {
    return res.status(400).send({ error: "Task ID is not valid" });
  }

  try {
    const _id = new ObjectId(id);
    const db = await connect('tasks');
    const deleted = await db.findOneAndDelete({ _id });

    if (deleted) res.send({ ...deleted, id: deleted._id, _id: undefined });
    else throw Error('Task id does not exist');
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
}