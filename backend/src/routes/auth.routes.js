import { Router } from 'express';
import { forgotPassword, login, register } from '../controllers/auth.controller.js';
import { forgotPasswordValidator, loginValidator, registerValidator } from '../validators/auth.validator.js';

const router = Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/forgot-password', forgotPasswordValidator, forgotPassword);

export default router;
