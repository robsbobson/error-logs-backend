import { UserRepository } from './user.repository';
import { CreateUserDto, PublicUserDto, User, UserRole, UpdateUserRoleDto } from './user.types';
import { hashPassword } from '../../core/utils/password.util';
import { OperationalError } from '../../core/middleware/error.handler';

// Helper to convert User entity to PublicUserDto
function toPublicUserDto(user: User): PublicUserDto {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password_hash, ...publicData } = user;
  return publicData;
}

export const UserService = {
  async createUser(userData: CreateUserDto): Promise<PublicUserDto> {
    // Validate input (basic)
    if (!userData.username || !userData.email || !userData.password) {
      throw new OperationalError('Username, email, and password are required', 400);
    }

    // Check if username or email already exists
    const existingByUsername = await UserRepository.findByUsername(userData.username);
    if (existingByUsername) {
      throw new OperationalError('Username already exists', 409); // 409 Conflict
    }
    const existingByEmail = await UserRepository.findByEmail(userData.email);
    if (existingByEmail) {
      throw new OperationalError('Email already exists', 409);
    }

    // Hash password
    const password_hash = await hashPassword(userData.password);

    // Determine role (default to USER)
    const role = userData.role ?? UserRole.USER;

    // Create user in repository
    const newUser = await UserRepository.createUser({
      username: userData.username,
      email: userData.email,
      password_hash,
      role,
    });

    return toPublicUserDto(newUser);
  },

  async getUserById(id: string): Promise<PublicUserDto | null> {
    const user = await UserRepository.findById(id);
    if (!user) {
      return null;
    }
    return toPublicUserDto(user);
  },

  async listAllUsers(): Promise<PublicUserDto[]> {
    const users = await UserRepository.listUsers();
    return users.map(toPublicUserDto);
  },

  async updateUserRole(id: string, roleData: UpdateUserRoleDto): Promise<PublicUserDto | null> {
     // Validate role
    if (!Object.values(UserRole).includes(roleData.role)) {
        throw new OperationalError('Invalid user role provided', 400);
    }

    const updatedUser = await UserRepository.updateUserRole(id, roleData.role);
    if (!updatedUser) {
      return null; // Or throw NotFound error
    }
    return toPublicUserDto(updatedUser);
  },

  async deleteUser(id: string): Promise<boolean> {
    // Add checks here? e.g., prevent deleting the last admin?
    const userToDelete = await UserRepository.findById(id);
    if (!userToDelete) {
        throw new OperationalError('User not found', 404);
    }

    if (userToDelete.role === UserRole.ADMIN) {
        const adminCount = await UserRepository.countAdmins();
        if (adminCount <= 1) {
            throw new OperationalError('Cannot delete the last administrator', 400);
        }
    }

    return UserRepository.deleteUser(id);
  },
}; 