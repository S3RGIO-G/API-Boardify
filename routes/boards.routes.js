import { Router } from "express";
import { addBoard, deleteBoard, getBoard, getBoards, updateBoard } from "../controllers/boards.js";

const router = Router();

router.get('/', getBoards);

router.get('/:id', getBoard);

router.post('/', addBoard);

router.put('/:id', updateBoard);

router.delete('/:id', deleteBoard);

export const boardsRoutes = router;