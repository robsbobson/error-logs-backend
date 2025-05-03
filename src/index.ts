import express, { Express } from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { initialize } from './init';

// Load environment variables
dotenv.config();

/**
 * Creates and configures the Express application.
 */
function createApp(): Express {
  const app = express();
  
  // Basic middleware
  app.use(express.json());
  
  // Basic route
  app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Error Logs Backend API' });
  });
  
  return app;
}

/**
 * Starts the HTTP server.
 */
function startServer(app: Express): http.Server {
  const port = process.env.PORT || 3000;
  
  // Start server
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  
  // Handle server errors (e.g., port already in use)
  server.on('error', (error) => {
    console.error('Server failed to start:', error);
    throw error; // Re-throw the error to be caught by the top-level handler
  });
  
  return server;
}


// Initialize the application
async function startApp() {
  try {
    // Run initialization process
    const initSuccess = await initialize();
    
    if (!initSuccess) {
      // Log the error, but throw instead of exiting
      console.error('Application initialization failed. Shutting down.');
      throw new Error('Application initialization failed.'); 
    }
    
    // Create Express app
    const app = createApp();
    
    // Start the server
    startServer(app);
    
  } catch (error) {
    console.error('Failed to start the application:', error);
    // Ensure process exits if an error occurs during startup
    process.exit(1); 
  }
}

// Start the application
startApp(); 