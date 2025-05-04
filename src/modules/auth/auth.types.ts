import { UserRole } from "../user/user.types";

// Payload for the login request
export interface LoginPayload {
  username: string;
  password: string;
}

// Payload encoded within the JWT
export interface JwtPayload {
  userId: string;
  username: string;
  role: UserRole;
  // Optional: Add issued at (iat) and expiration (exp) if needed for client-side checks
  // iat?: number;
  // exp?: number;
}

// Structure of the response after successful login
export interface LoginResponse {
  token: string;
  // Optionally include user details (excluding sensitive info)
  // user: PublicUserDto;
}

// Extend Express Request type to include the user payload after JWT verification
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
} 