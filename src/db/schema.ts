export const startupLogTableSchema = `
  CREATE TABLE IF NOT EXISTS startup_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    start_datetime TEXT NOT NULL,
    start_duration INTEGER NOT NULL,
    status TEXT NOT NULL,
    status_message TEXT NOT NULL,
    process_log TEXT NOT NULL
  )
`;

export const usersTableSchema = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('ADMIN', 'USER')) DEFAULT 'USER',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`;

// Optional: Trigger to update 'updated_at' timestamp
export const updateUserTimestampTrigger = `
  CREATE TRIGGER IF NOT EXISTS update_user_updated_at
  AFTER UPDATE ON users
  FOR EACH ROW
  BEGIN
    UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
  END;
`; 