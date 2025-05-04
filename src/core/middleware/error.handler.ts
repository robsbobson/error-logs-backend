import { Request, Response, NextFunction } from 'express';
import config from '../../core/config';

interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean; // To distinguish between operational and programmer errors
}

// Basic error handling middleware
export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction): void => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Log the error (can be expanded with a dedicated logger)
  console.error('ERROR 💥', {
    statusCode: err.statusCode,
    message: err.message,
    stack: config.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.originalUrl,
    method: req.method,
    isOperational: err.isOperational ?? false,
  });

  // Send response to client
  // In development, send detailed error. In production, send generic message for non-operational errors.
  if (config.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      stack: err.stack,
      error: err,
    });
    return;
  }

  // Production error handling
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
    return;
  }

  // Programming or other unknown error: don't leak error details
  // 1) Log error (already done above)
  // 2) Send generic message
  res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!',
  });
};

// Utility class for operational errors
export class OperationalError extends Error implements AppError {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // Ensure the correct prototype chain
    Object.setPrototypeOf(this, OperationalError.prototype);

    // Capture stack trace, excluding constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
} 