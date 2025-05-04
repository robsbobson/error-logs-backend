import bcrypt from 'bcrypt';

const saltRounds = 10; // Recommended value

/**
 * Hashes a plain text password.
 * @param plainPassword The password to hash.
 * @returns A promise that resolves with the hashed password.
 */
export const hashPassword = async (plainPassword: string): Promise<string> => {
  return bcrypt.hash(plainPassword, saltRounds);
};

/**
 * Compares a plain text password with a hash.
 * @param plainPassword The plain text password.
 * @param hash The hashed password to compare against.
 * @returns A promise that resolves with true if the passwords match, false otherwise.
 */
export const comparePassword = async (plainPassword: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hash);
}; 