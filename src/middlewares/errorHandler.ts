import { NextFunction, Request, Response } from 'express';
import logger from '../logger/winston';

/**
 * Middleware to handle errors in the application.
 * Logs the error details and sends a generic error response.
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  // Log the error details
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  // Send a generic error response
  res.status(500).json({
    status: 'error',
    message: 'An unexpected error occurred. Please try again later.',
  });    
}