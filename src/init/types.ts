/**
 * Types for the initialization module
 */

/**
 * Represents a single step in the application initialization process.
 */
export interface InitStep {
  name: string; // Unique name for the step
  priority: number; // Execution order (lower value = higher priority)
  execute: () => Promise<boolean>; // The function to execute, returns true on success
}

/**
 * Represents an entry in the startup log database table.
 */
export interface StartupLogEntry {
  id?: number; // Optional because it's auto-incremented
  start_datetime: string; // ISO 8601 format
  start_duration: number; // Duration in milliseconds
  status: 'success' | 'error'; // Initialization status
  status_message: string; // Message describing the status
  process_log: string; // Detailed log of initialization steps
} 