import { Router } from "express";
import { addBoard, deleteBoard, getBoard, getBoards, updateBoard } from "../controllers/boards.js";
import { validateAuthorization } from "../middlewares/validateAuthorization.js";

const router = Router();

router.get('/', getBoards);
router.get('/:id', getBoard);

router.use(validateAuthorization);

router.post('/', addBoard);

router.put('/:id', updateBoard);

router.delete('/:id', deleteBoard);

export const boardsRoutes = router;