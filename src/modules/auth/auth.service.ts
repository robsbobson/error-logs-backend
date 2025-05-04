import jwt from 'jsonwebtoken';
import { UserRepository } from '../user/user.repository';
import { comparePassword } from '../../core/utils/password.util';
import config from '../../core/config';
import { LoginPayload, JwtPayload, LoginResponse } from './auth.types';
import { OperationalError } from '../../core/middleware/error.handler';
import { User } from '../user/user.types';

export const AuthService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { username, password } = payload;

    if (!username || !password) {
      throw new OperationalError('Username and password are required', 400);
    }

    // Find user by username
    const user = await UserRepository.findByUsername(username);
    if (!user) {
      throw new OperationalError('Invalid username or password', 401); // Unauthorized
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw new OperationalError('Invalid username or password', 401);
    }

    // Generate JWT
    const jwtPayload: JwtPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
    };

    // Temporarily ignore TS error for jwt.sign options
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore 
    const token = jwt.sign(jwtPayload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN,
    });

    return { token };
  },

  verifyToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      // Add type assertion or validation if necessary
      if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded && 'username' in decoded && 'role' in decoded) {
          return decoded as JwtPayload;
      } else {
          throw new Error('Invalid token payload structure');
      }
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new OperationalError('Token has expired', 401);
        } else if (error instanceof jwt.JsonWebTokenError) {
            throw new OperationalError(`Invalid token: ${error.message}`, 401);
        } else {
            // Rethrow unexpected errors
             throw new OperationalError('Could not verify token', 500);
        }
    }
  },
}; 