// src/middleware/validateSchemaParts.ts
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

type RequestPart = 'body' | 'query' | 'params';

type SchemaMap = Partial<Record<RequestPart, Joi.ObjectSchema>>;

/**
 * Middleware to validate request parts (body, query, params) against provided Joi schemas.
    * If validation fails, it responds with a 400 status and error details.
    * If validation succeeds,it calls the next middleware.
 */

export const validate = (schemaMap: SchemaMap) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parts: RequestPart[] = ['body', 'query', 'params'];

    for (const part of parts) {
      const schema = schemaMap[part];
      if (!schema) continue;

      const { error, value } = schema.validate(req[part], {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        return res.status(400).json({
          status: 'error',
          message: `Validation failed for ${part}`,
          details: error.details.map((d) => d.message),
        });
      }
    }

    next();
  };
};
