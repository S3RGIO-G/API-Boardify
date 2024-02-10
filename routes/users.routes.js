import { Router } from "express";
import { getUserById, searchUsers } from "../controllers/users.js";

const router = Router();

router.get('/search', searchUsers);
router.get('/:id', getUserById);
router.post('/test/test', (req, res) => {
  res.setHeader('set-cookie', "credentials=asdasdasdas; Path=/; Secure; SameSite=None; Partitioned;")
  res.cookie()
  res.send(true)
})

export const usersRoutes = router;
