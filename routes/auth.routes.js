import { Router } from 'express';
import { login, logout, register, validate } from '../controllers/auth.js';
import { validateAuthorization } from '../middlewares/validateAuthorization.js';

const router = Router();

router.post('/login', login)
router.post('/logout', logout)
router.post('/register', register)
router.get('/validate', validateAuthorization, validate)

export const authRoutes = router;