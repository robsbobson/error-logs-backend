import { registerInitStep, initialize } from './initialization';
// import { initAppDb } from './database'; // Old import
import { databaseSetupStep } from './database.setup'; // New import
import { adminUserSetupStep } from './admin.setup'; // Import admin setup step

// Register the imported initialization steps
// registerInitStep(initAppDb); // Old registration
registerInitStep(databaseSetupStep); // Register new step
registerInitStep(adminUserSetupStep); // Register admin setup step

// Register other init steps here

export { registerInitStep, initialize }; 