import express from 'express';
import dotenv from 'dotenv';
import { initialize } from './init';

// Load environment variables
dotenv.config();

// Initialize the application
async function startApp() {
  try {
    // Run initialization process
    const initSuccess = await initialize();
    
    if (!initSuccess) {
      console.error('Application initialization failed. Exiting.');
      process.exit(1);
    }
    
    // Create Express app
    const app = express();
    const port = process.env.PORT || 3000;
    
    // Basic middleware
    app.use(express.json());
    
    // Basic route
    app.get('/', (req, res) => {
      res.json({ status: 'ok', message: 'Error Logs Backend API' });
    });
    
    // Start server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start the application:', error);
    process.exit(1);
  }
}

// Start the application
startApp(); 