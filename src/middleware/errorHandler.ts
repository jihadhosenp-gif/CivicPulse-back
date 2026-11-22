import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../utils/constants';

export interface ErrorResponse {
  success: boolean;
  message: string;
  errors?: Array<{ field?: string; message: string }>;
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction
): void => {
  let statusCode = (err as AppError).statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Internal Server Error';
  const errors: ErrorResponse['errors'] = [];

  if ((err as any).name === 'ValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Validation error';
    for (const [field, errObj] of Object.entries((err as any).errors || {})) {
      errors.push({ field, message: (errObj as any).message || String(errObj) });
    }
  }

  if ((err as any).name === 'CastError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Invalid resource ID';
  }

  if ((err as any).code === 11000) {
    statusCode = HTTP_STATUS.CONFLICT;
    message = 'Duplicate field value';
  }

  res.status(statusCode).json({ success: false, message, errors });
};