import express from 'express';
import { AuthController } from './auth.controller';

const router = express.Router();

// Define auth routes
router.post('/login', AuthController.handleLogin);

// Optional: Add routes for token refresh, logout, etc.

export default router; 