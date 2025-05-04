import { getDbConnection, tableExists } from '../db';
import {
    startupLogTableSchema,
    usersTableSchema,
    updateUserTimestampTrigger
} from '../db/schema';
import { InitStep } from './types'; // Assuming types will be created here

/**
 * Initialize database schema (create tables, triggers, etc.)
 */
const databaseSetupStep: InitStep = {
  name: 'database_schema_setup',
  priority: 1, // Highest priority
  execute: async (): Promise<boolean> => {
    let db: ReturnType<typeof getDbConnection> | null = null;
    try {
      console.log('[INIT] Setting up database schema...');
      db = getDbConnection();

      // Use a transaction for schema setup
      db.transaction(() => {
        // Create startup_log table
        if (!tableExists(db!, 'startup_log')) {
          console.log('[INIT] Creating startup_log table...');
          db!.exec(startupLogTableSchema);
        } else {
          console.log('[INIT] startup_log table already exists.');
        }

        // Create users table
        if (!tableExists(db!, 'users')) {
          console.log('[INIT] Creating users table...');
          db!.exec(usersTableSchema);
          console.log('[INIT] Applying user timestamp trigger...');
          db!.exec(updateUserTimestampTrigger);
        } else {
          console.log('[INIT] users table already exists.');
        }

        // Add more table/schema creation logic here if needed

      })(); // Execute transaction immediately

      console.log('[INIT] Database schema setup completed successfully');
      return true;
    } catch (error) {
      console.error(
        `[INIT] Database schema setup failed: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : ''
      );
      return false;
    } finally {
      db?.close();
    }
  }
};

export { databaseSetupStep }; 