import express from 'express';
import { register, registerAdmin, login, adminLogin } from '../controllers/authController.js';

const router = express.Router();

// Register a new user
router.post('/register', register);

// Register a new admin
router.post('/admin/register', registerAdmin);

// Login user
router.post('/login', login);

// Admin login
router.post('/admin/login', adminLogin);

export default router;