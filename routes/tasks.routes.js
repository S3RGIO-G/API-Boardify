import { Router } from "express";
import { addTask, deleteTasks, deleteTask, getTasks, getTask, updateTask } from "../controllers/tasks.js";
import { validateAuthorization } from "../middlewares/validateAuthorization.js";

const router = Router();

router.get('/', getTasks);
router.get('/:id', getTask);

router.use(validateAuthorization);

router.post('/', addTask);

router.put('/:id', updateTask);

router.delete('/', deleteTasks);
router.delete('/:id', deleteTask);


export const tasksRoutes = router;