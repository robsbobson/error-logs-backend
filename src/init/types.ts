/**
 * Types for the initialization module
 */

export interface InitStep {
  name: string;
  execute: () => Promise<boolean>;
  priority: number;
}

export interface StartupLogEntry {
  start_datetime: string;
  start_duration: number;
  status: 'success' | 'error';
  status_message: string;
  process_log: string;
} 