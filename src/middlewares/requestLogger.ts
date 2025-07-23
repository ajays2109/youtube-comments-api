import { Request, Response, NextFunction } from 'express';
import logger from '../logger/winston';

/**
 * Middleware to log incoming requests.
 * Logs the request method, URL, IP address, headers, and body.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
    const start = process.hrtime();


    const originalSend = res.send.bind(res);
    let responseBody: any;
    res.send = (body: any) => {
        responseBody = body;
        return originalSend(body);
    };
    res.on('finish', () => {
        const [seconds, nanoseconds] = process.hrtime(start);
        const duration = (seconds * 1000 + nanoseconds / 1e6).toFixed(2); // Convert to ms
        const logData: Record<string, any> = {
            method: req.method,
            url: req.originalUrl,
            ip: req.ip,
            responseStatus: res.statusCode,
            responseBody: tryParseJson(responseBody),
            duration: `${duration} ms`
        };
        // log full request details only in development mode
        if (process.env.NODE_ENV === 'development') {
            logData.headers = req.headers;
            logData.body = req.body;
        }
        logger.info('HTTP Request Completed',logData);
    });
    // Call the next middleware
    next();
}

// Safe parser for response body (string or JSON)
function tryParseJson(body: any) {
  try {
    return typeof body === 'string' ? JSON.parse(body) : body;
  } catch {
    return body;
  }
}
