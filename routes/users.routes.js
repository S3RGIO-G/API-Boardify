import { Router } from "express";
import { getUser, getUsers } from "../controllers/users.js";

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUser);

export const usersRoutes = router;
