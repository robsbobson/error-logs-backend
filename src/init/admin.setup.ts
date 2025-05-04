import { UserRepository } from '../modules/user/user.repository';
import { UserService } from '../modules/user/user.service';
import { UserRole } from '../modules/user/user.types';
import config from '../core/config';
import { InitStep } from './types';

/**
 * Initialization step to ensure at least one ADMIN user exists.
 */
const adminUserSetupStep: InitStep = {
  name: 'admin_user_setup',
  priority: 10, // Run after database schema setup
  execute: async (): Promise<boolean> => {
    console.log('[INIT] Checking for initial admin user...');
    try {
      const adminCount = await UserRepository.countAdmins();

      if (adminCount === 0) {
        console.log('[INIT] No admin users found. Creating initial admin...');

        const username = config.INITIAL_ADMIN_USERNAME;
        const password = config.INITIAL_ADMIN_PASSWORD;
        const email = `${username}@example.local`; // Or use another env var

        if (!username || !password) {
          console.error(
            '[INIT] ERROR: INITIAL_ADMIN_USERNAME and INITIAL_ADMIN_PASSWORD environment variables must be set to create the initial admin user.'
          );
          return false;
        }

        await UserService.createUser({
          username,
          email, // Consider making email configurable too
          password,
          role: UserRole.ADMIN,
        });

        console.log(`[INIT] Initial admin user '${username}' created successfully.`);
      } else {
        console.log(`[INIT] Found ${adminCount} existing admin user(s). Skipping creation.`);
      }

      return true;
    } catch (error) {
      console.error(
        `[INIT] Failed to set up initial admin user: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : ''
      );
      return false;
    }
    // Note: UserRepository methods close their own DB connections.
  }
};

export { adminUserSetupStep }; 