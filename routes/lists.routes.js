import { Router } from "express";
import { addList, deleteList, getList, getLists, updateList } from "../controllers/lists.js";

const router = Router();

router.get('/', getLists);

router.get('/:id', getList);

router.post('/', addList);

router.put('/:id', updateList);

router.delete('/:id', deleteList);

export const listsRoutes = router;