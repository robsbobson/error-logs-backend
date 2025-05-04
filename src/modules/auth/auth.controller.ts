import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { LoginPayload } from './auth.types';

// Utility to wrap async route handlers and catch errors
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next); // Pass errors to the global error handler
};

export const AuthController = {
  handleLogin: asyncHandler(async (req: Request, res: Response) => {
    const loginPayload: LoginPayload = req.body;
    // Add input validation here (e.g., using Zod)
    const result = await AuthService.login(loginPayload);
    res.status(200).json({ status: 'success', data: result });
  }),

  // Optional: Add a controller for token verification/refresh if needed
}; 