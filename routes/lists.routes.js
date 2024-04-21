import { Router } from "express";
import { addList, deleteList, deleteLists, getList, getLists, updateList } from "../controllers/lists.js";
import { validateAuthorization } from "../middlewares/validateAuthorization.js";

const router = Router();

router.get('/', getLists);
router.get('/:id', getList);

router.use(validateAuthorization);

router.post('/', addList);

router.put('/:id', updateList);

router.delete('/', deleteLists)
router.delete('/:id', deleteList);

export const listsRoutes = router;