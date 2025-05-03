import { getDbConnection, createStartupLogTable, tableExists } from '../db';
import { InitStep } from '../types';
import { registerInitStep } from './initialization';

/**
 * Initialize the application database
 */
const initAppDb: InitStep = {
  name: 'init_app_db',
  priority: 1, // Highest priority (executed first)
  execute: async (): Promise<boolean> => {
    try {
      // Using console.log instead of logMessage to avoid circular dependencies
      console.log('[INIT] Checking database...');
      
      // Get database connection (creates the file if it doesn't exist)
      const db = getDbConnection();
      
      // Check if startup_log table exists and create it if needed
      if (!tableExists(db, 'startup_log')) {
        console.log('[INIT] Creating startup_log table...');
        createStartupLogTable(db);
      }
      
      console.log('[INIT] Database initialized successfully');
      db.close();
      return true;
    } catch (error) {
      console.log(`[INIT] Database initialization failed: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }
};

// Register the database initialization step
registerInitStep(initAppDb);

// Export nothing - this module self-registers
export {};

export const registerDatabaseStep = () => {
  // Register the database initialization step
}; 