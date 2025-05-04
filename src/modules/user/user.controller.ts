import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserRoleDto } from './user.types';
import { OperationalError } from '../../core/middleware/error.handler';

// Utility to wrap async route handlers and catch errors
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next); // Pass errors to the global error handler
};

export const UserController = {
  handleCreateUser: asyncHandler(async (req: Request, res: Response) => {
    const createUserDto: CreateUserDto = req.body;
    // Add input validation here (e.g., using Zod or express-validator)
    const newUser = await UserService.createUser(createUserDto);
    res.status(201).json({ status: 'success', data: newUser });
  }),

  handleGetUserById: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await UserService.getUserById(id);
    if (!user) {
      return next(new OperationalError('User not found', 404));
    }
    res.status(200).json({ status: 'success', data: user });
  }),

  handleListUsers: asyncHandler(async (req: Request, res: Response) => {
    const users = await UserService.listAllUsers();
    res.status(200).json({ status: 'success', results: users.length, data: users });
  }),

  handleUpdateUserRole: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updateUserRoleDto: UpdateUserRoleDto = req.body;
    // Add input validation here
    const updatedUser = await UserService.updateUserRole(id, updateUserRoleDto);
    if (!updatedUser) {
       return next(new OperationalError('User not found', 404));
    }
    res.status(200).json({ status: 'success', data: updatedUser });
  }),

  handleDeleteUser: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const success = await UserService.deleteUser(id);
    // Service throws error if user not found or cannot be deleted
    res.status(204).send(); // No Content
  }),
}; 