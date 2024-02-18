import { Router } from "express";
import { addTask, deleteTasks, deleteTask, getTasks, getTask, updateTask } from "../controllers/tasks.js";

const router = Router();

router.get('/', getTasks);
router.get('/:id', getTask);

router.post('/', addTask);

router.put('/:id', updateTask);

router.delete('/', deleteTasks);
router.delete('/:id', deleteTask);


export const tasksRoutes = router;