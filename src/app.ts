import express from 'express';
import routes from './routes/index.route';
import { requestLogger } from './middlewares/requestLogger';
import { errorHandler } from './middlewares/errorHandler';
import { authHandler } from './middlewares/authHandler';
const app = express();

// Middleware setup
app.use(express.json());

// Request logging middleware
app.use(requestLogger);

// Authentication middleware
app.use(authHandler);

// Routes setup
app.use('/api', routes);

// 404 Handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route Not Found',
  });
});

// Error handling middleware
app.use(errorHandler);

export default app;