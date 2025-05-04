import express, { Express, Request, Response, NextFunction } from 'express';
import http from 'http';
import { initialize } from './init';
import config from './core/config';
import { errorHandler, OperationalError } from './core/middleware/error.handler';
import userRoutes from './modules/user/user.routes';
import authRoutes from './modules/auth/auth.routes';

/**
 * Creates and configures the Express application.
 */
function createApp(): Express {
  const app = express();
  
  // Core Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Basic health check route
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'API is healthy' });
  });
  
  // API Routes (prefixed)
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/users', userRoutes);
  
  // Catch-all for undefined routes
  app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new OperationalError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
  
  // Global Error Handling Middleware (must be last)
  app.use(errorHandler);
  
  return app;
}

/**
 * Starts the HTTP server.
 */
function startServer(app: Express): http.Server {
  const port = config.PORT;
  
  // Start server
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port} in ${config.NODE_ENV} mode`);
  });
  
  // Handle server errors (e.g., port already in use)
  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    // Handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(`Port ${port} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`Port ${port} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
  });
  
  console.log('[SERVER] Server setup complete.');
  return server;
}

// Centralized error handling for top-level async operations
process.on('unhandledRejection', (reason: Error | any) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(reason.name, reason.message, reason.stack);
  // Optionally close server gracefully before exiting
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(error.name, error.message, error.stack);
  process.exit(1);
});

// Initialize the application
async function startApp() {
  try {
    console.log('[APP] Starting initialization...');
    // Run initialization process
    const initSuccess = await initialize();
    
    if (!initSuccess) {
      console.error('[APP] Application initialization failed. See logs above. Shutting down.');
      throw new Error('Application initialization failed.'); 
    }
    console.log('[APP] Initialization complete.');
    
    // Create Express app
    const app = createApp();
    console.log('[APP] Express app configured.');
    
    // Start the server
    startServer(app);
    
  } catch (error) {
    console.error('[APP] Failed to start the application:', error);
    process.exit(1); 
  }
}

// Start the application
startApp(); 