import { Router } from "express";
import { getUserById, searchUsers } from "../controllers/users.js";

const router = Router();

router.get('/search', searchUsers);
router.get('/:id', getUserById);

export const usersRoutes = router;
