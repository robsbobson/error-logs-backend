import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { UserRole } from '../user/user.types';
import { OperationalError } from '../../core/middleware/error.handler';
import { JwtPayload } from './auth.types';

/**
 * Middleware to authenticate JWT token from Authorization header.
 */
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = AuthService.verifyToken(token);
      req.user = decoded; // Attach user payload to request object
      next();
    } catch (error) {
      // Let the error handler deal with OperationalErrors from verifyToken
      if (error instanceof OperationalError) {
          return next(error);
      }
      // Handle other unexpected errors during verification
      return next(new OperationalError('Invalid token', 401)); 
    }
  } else {
    return next(new OperationalError('Authentication token required', 401));
  }
};

/**
 * Middleware factory to authorize based on user roles.
 * Must be used *after* authenticateJWT.
 * @param allowedRoles Array of roles allowed to access the route.
 */
export const authorizeRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      // This should ideally not happen if authenticateJWT runs first
      return next(new OperationalError('Authentication required', 401));
    }

    const { role } = req.user as JwtPayload; // req.user is populated by authenticateJWT

    if (!allowedRoles.includes(role)) {
      return next(new OperationalError('Forbidden: You do not have permission to perform this action', 403));
    }

    next(); // User has the required role
  };
}; 