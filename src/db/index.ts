import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import config from '../core/config'; // Use config module

// Determine Database file path using config
const DB_FILE_PATH = path.resolve(process.cwd(), config.DATABASE_PATH);

console.log(`[DB] Using database file at: ${DB_FILE_PATH}`);

/**
 * Get database connection
 * Creates the database file if it doesn't exist
 */
export function getDbConnection(): Database.Database {
  // Ensure the database directory exists
  const dbDir = path.dirname(DB_FILE_PATH);
  if (!fs.existsSync(dbDir)) {
    console.log(`[DB] Creating database directory: ${dbDir}`);
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  // Connect to the database
  const db = new Database(DB_FILE_PATH);
  
  // Enable foreign keys
  db.pragma('foreign_keys = ON');
  
  return db;
}

/**
 * Check if a table exists in the database
 */
export function tableExists(db: Database.Database, tableName: string): boolean {
  const result = db.prepare(
    `SELECT name FROM sqlite_master WHERE type='table' AND name=?`
  ).get(tableName);
  
  return !!result;
}

// Removed createStartupLogTable function 