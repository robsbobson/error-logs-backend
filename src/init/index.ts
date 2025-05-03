import { registerInitStep, initialize } from './initialization';
import { initAppDb } from './database'; // Import the step object

// Register the imported initialization steps
registerInitStep(initAppDb);

export { registerInitStep, initialize }; 