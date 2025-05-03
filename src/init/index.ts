import { registerInitStep, initialize } from './initialization';
import { registerDatabaseStep } from './database';

// Initialize the database step
registerDatabaseStep();

export { registerInitStep, initialize }; 