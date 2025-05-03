import { getDbConnection } from '../db';
import { InitStep, StartupLogEntry } from '../types';

/**
 * Registry of initialization steps
 */
const initSteps: InitStep[] = [];

/**
 * Process log messages
 */
let processLog: string[] = [];

/**
 * Log a message to the process log
 */
function logMessage(message: string): void {
  const timestamp = new Date().toISOString();
  processLog.push(`[${timestamp}] ${message}`);
  console.log(`[INIT] ${message}`);
}

/**
 * Register an initialization step
 */
export function registerInitStep(step: InitStep): void {
  initSteps.push(step);
}

/**
 * Logs the result of the initialization process to the database.
 */
async function logInitializationResult(
  success: boolean,
  errorMessage: string,
  duration: number,
  logEntries: string[]
): Promise<void> {
  try {
    // Initialize the database connection
    const db = getDbConnection();
    
    const logEntry: StartupLogEntry = {
      start_datetime: new Date().toISOString(),
      start_duration: duration,
      status: success ? 'success' : 'error',
      status_message: success ? 'Initialization completed successfully' : errorMessage,
      process_log: logEntries.join('\\n')
    };
    
    db.prepare(`
      INSERT INTO startup_log 
      (start_datetime, start_duration, status, status_message, process_log) 
      VALUES (?, ?, ?, ?, ?)\
    `).run(
      logEntry.start_datetime,
      logEntry.start_duration,
      logEntry.status,
      logEntry.status_message,
      logEntry.process_log
    );
    
    db.close();
    logMessage('Startup log saved successfully.');
  } catch (error) {
    // Log error saving startup log, but don't let it fail the overall initialization status if it was successful otherwise
    const logSaveErrorMsg = `Failed to save startup log: ${error instanceof Error ? error.message : String(error)}`;
    logMessage(logSaveErrorMsg); // Add to in-memory log
    console.error(logSaveErrorMsg); // Log to console as well
  }
}

/**
 * Run all initialization steps
 */
export async function initialize(): Promise<boolean> {
  processLog = []; // Reset process log
  logMessage('Starting application initialization...');
  
  const startTime = Date.now();
  let success = true;
  let errorMessage = '';
  
  try {
    // Sort steps by priority (lower priority value = higher priority)
    const sortedSteps = [...initSteps].sort((a, b) => a.priority - b.priority);
    
    // Execute all steps in order
    for (const step of sortedSteps) {
      logMessage(`Executing step: ${step.name}`);
      const stepSuccess = await step.execute();
      
      if (!stepSuccess) {
        success = false;
        errorMessage = `Step ${step.name} failed`;
        logMessage(errorMessage);
        break; // Stop initialization on first failure
      }
    }
    
    if (success) {
      logMessage('Application initialization completed successfully.');
    }
  } catch (error) {
    success = false;
    errorMessage = error instanceof Error ? error.message : String(error);
    logMessage(`Initialization error: ${errorMessage}`);
  }
  
  const duration = Date.now() - startTime;
  
  // Log the initialization result separately
  await logInitializationResult(success, errorMessage, duration, processLog);
  
  // Return the overall success status of the initialization steps
  return success;
} 