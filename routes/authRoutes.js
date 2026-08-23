import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// @route   POST /api/register
// @desc    Register a new worker or admin
router.post('/register', registerUser);

// @route   POST /api/login
// @desc    Authenticate a user and return their details
router.post('/login', loginUser);

export default router;