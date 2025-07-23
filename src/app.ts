import express from 'express';
import { config } from './config';
import routes from './routes/index.route';
import { requestLogger } from './middlewares/requestLogger';
import { errorHandler } from './middlewares/errorHandler';
import { connectScyllaDb, disconnectScyllaDb } from './db/scyllaDbClient';
import { authHandler } from './middlewares/authHandler';
const PORT = config.port;
const app = express();

// Middleware setup
app.use(express.json());

// Request logging middleware
app.use(requestLogger);

// Authentication middleware
app.use(authHandler);

// Routes setup
app.use('/api', routes);

// Error handling middleware
app.use(errorHandler);

// Start the server
(async()=>{
  await connectScyllaDb();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})();

//disconnect Scylladb on process exit
process.on('SIGINT', async() => {
  console.log('Shutting down server...');
  await disconnectScyllaDb();
  process.exit(0);
});