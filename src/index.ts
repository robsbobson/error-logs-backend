import express from 'express';
import dotenv from 'dotenv';

// Loading environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing JSON
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the node-backend-starter application!' });
});

// Starting the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 