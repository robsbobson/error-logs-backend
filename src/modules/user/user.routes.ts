import express from 'express';
import { UserController } from './user.controller';
// Placeholder imports for middleware - will be implemented later
import { authenticateJWT, authorizeRole } from '../auth/auth.middleware'; 
import { UserRole } from './user.types';

const router = express.Router();

// Define user routes
// All user management routes require authentication and ADMIN role
router.post(
    '/',
    authenticateJWT, 
    authorizeRole([UserRole.ADMIN]), 
    UserController.handleCreateUser
);

router.get(
    '/', 
    authenticateJWT, 
    authorizeRole([UserRole.ADMIN]), 
    UserController.handleListUsers
);

router.get(
    '/:id',
    authenticateJWT, 
    authorizeRole([UserRole.ADMIN]), // Or maybe self? Add logic later
    UserController.handleGetUserById
);

router.patch(
    '/:id/role',
    authenticateJWT, 
    authorizeRole([UserRole.ADMIN]), 
    UserController.handleUpdateUserRole
);

router.delete(
    '/:id',
    authenticateJWT, 
    authorizeRole([UserRole.ADMIN]), 
    UserController.handleDeleteUser
);

export default router; 