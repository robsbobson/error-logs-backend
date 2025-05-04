import { getDbConnection } from '../../db';
import { User, UserRole } from './user.types';
import { randomUUID } from 'crypto';

// Type guard for better-sqlite3 row
function isUserRow(row: any): row is User {
  return (
    typeof row === 'object' &&
    row !== null &&
    typeof row.id === 'string' &&
    typeof row.username === 'string' &&
    typeof row.email === 'string' &&
    typeof row.password_hash === 'string' &&
    typeof row.role === 'string' && Object.values(UserRole).includes(row.role) &&
    typeof row.created_at === 'string' &&
    typeof row.updated_at === 'string'
  );
}

export const UserRepository = {
  async findByUsername(username: string): Promise<User | null> {
    const db = getDbConnection();
    try {
      const row = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
      if (isUserRow(row)) {
        return row;
      }
      return null;
    } finally {
      db.close();
    }
  },

  async findByEmail(email: string): Promise<User | null> {
    const db = getDbConnection();
    try {
      const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
       if (isUserRow(row)) {
        return row;
      }
      return null;
    } finally {
      db.close();
    }
  },

  async findById(id: string): Promise<User | null> {
    const db = getDbConnection();
    try {
      const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
       if (isUserRow(row)) {
        return row;
      }
      return null;
    } finally {
      db.close();
    }
  },

  async createUser(
    userData: Omit<User, 'id' | 'created_at' | 'updated_at'>
  ): Promise<User> {
    const db = getDbConnection();
    const userId = randomUUID();
    try {
      const stmt = db.prepare(`
        INSERT INTO users (id, username, email, password_hash, role)
        VALUES (?, ?, ?, ?, ?)
        RETURNING *;
      `);
      const newUserRow = stmt.get(
        userId,
        userData.username,
        userData.email,
        userData.password_hash,
        userData.role
      );
       if (!isUserRow(newUserRow)) {
           throw new Error('Failed to create user or retrieve the created user data.')
       }
      return newUserRow;
    } finally {
      db.close();
    }
  },

  async updateUserRole(id: string, role: UserRole): Promise<User | null> {
    const db = getDbConnection();
    try {
      const stmt = db.prepare(`
        UPDATE users
        SET role = ?
        WHERE id = ?
        RETURNING *;
      `);
      const updatedUserRow = stmt.get(role, id);
      if (!isUserRow(updatedUserRow)) {
          return null; // User not found or update failed
      }
      return updatedUserRow;
    } finally {
      db.close();
    }
  },

  async deleteUser(id: string): Promise<boolean> {
    const db = getDbConnection();
    try {
      const result = db.prepare('DELETE FROM users WHERE id = ?').run(id);
      return result.changes > 0;
    } finally {
      db.close();
    }
  },

  async listUsers(): Promise<User[]> {
    const db = getDbConnection();
    try {
      const rows = db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
      // Validate each row
      return rows.filter(isUserRow);
    } finally {
      db.close();
    }
  },

  async countAdmins(): Promise<number> {
      const db = getDbConnection();
      try {
          const result = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'ADMIN'").get() as { count: number };
          return result.count ?? 0;
      } finally {
          db.close();
      }
  }
}; 