import { Router } from "express";
import { addTask, deleteAll, deleteById, getAll, getById, updateTask } from "../controllers/tasks.js";

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);

router.post('/', addTask);

router.put('/:id', updateTask);

router.delete('/', deleteAll);
router.delete('/:id', deleteById);


export const tasksRoutes = router;