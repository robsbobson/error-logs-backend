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
    let db: ReturnType<typeof getDbConnection> | null = null;
    try {
      // Using console.log instead of logMessage to avoid circular dependencies
      console.log('[INIT] Checking database...');
      
      // Get database connection (creates the file if it doesn't exist)
      db = getDbConnection();
      
      // Check if startup_log table exists and create it if needed
      if (!tableExists(db, 'startup_log')) {
        console.log('[INIT] Creating startup_log table...');
        createStartupLogTable(db);
      }
      
      console.log('[INIT] Database initialized successfully');
      return true;
    } catch (error) {
      console.log(`[INIT] Database initialization failed: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    } finally {
      // Ensure database connection is closed
      if (db) {
        db.close();
      }
    }
  }
};

// Export the database initialization step object
export { initAppDb }; 