import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Database file path
const DB_FILE_PATH = path.resolve(process.cwd(), 'app.sqlite');

/**
 * Get database connection
 * Creates the database file if it doesn't exist
 */
export function getDbConnection(): Database.Database {
  // Ensure the database directory exists
  const dbDir = path.dirname(DB_FILE_PATH);
  if (!fs.existsSync(dbDir)) {
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

/**
 * Create the startup_log table if it doesn't exist
 */
export function createStartupLogTable(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS startup_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      start_datetime TEXT NOT NULL,
      start_duration INTEGER NOT NULL,
      status TEXT NOT NULL,
      status_message TEXT NOT NULL,
      process_log TEXT NOT NULL
    )
  `);
} 