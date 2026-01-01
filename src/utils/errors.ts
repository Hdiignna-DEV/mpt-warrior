// Error handling utilities

import { logger } from '@/utils/logger';
import { APIResponse } from '@/types/index';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(400, 'VALIDATION_ERROR', message, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, 'NOT_FOUND', `${resource} tidak ditemukan`);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Anda tidak memiliki otorisasi') {
    super(401, 'UNAUTHORIZED', message);
    this.name = 'UnauthorizedError';
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: unknown) {
    super(500, 'DATABASE_ERROR', message, details);
    this.name = 'DatabaseError';
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message: string, details?: unknown) {
    super(502, 'EXTERNAL_SERVICE_ERROR', `Kesalahan dari ${service}: ${message}`, details);
    this.name = 'ExternalServiceError';
  }
}

/**
 * Handle API errors dengan logging dan response yang konsisten
 */
export function handleError(error: unknown): {
  statusCode: number;
  code: string;
  message: string;
  details?: unknown;
} {
  if (error instanceof AppError) {
    logger.error(error.message, { code: error.code, details: error.details }, error);
    return {
      statusCode: error.statusCode,
      code: error.code,
      message: error.message,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    logger.error(error.message, {}, error);
    return {
      statusCode: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Terjadi kesalahan internal',
    };
  }

  logger.error('Unknown error', error);
  return {
    statusCode: 500,
    code: 'UNKNOWN_ERROR',
    message: 'Terjadi kesalahan yang tidak diketahui',
  };
}

/**
 * Create API response yang konsisten
 */
export function createResponse<T>(
  data: T,
  message?: string
): APIResponse<T> {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create error response
 */
export function createErrorResponse(
  error: unknown,
  statusCode?: number
): APIResponse<null> {
  const errorInfo = handleError(error);
  return {
    success: false,
    error: errorInfo.message,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Validate required fields
 */
export function validateRequired(
  obj: Record<string, any>,
  fields: string[]
): void {
  const missing = fields.filter((field) => !obj[field]);
  if (missing.length > 0) {
    throw new ValidationError(`Field diperlukan: ${missing.join(', ')}`);
  }
}

/**
 * Validate number range
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): void {
  if (value < min || value > max) {
    throw new ValidationError(`${fieldName} harus antara ${min} dan ${max}`);
  }
}

/**
 * Validate email format
 */
export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Format email tidak valid');
  }
}

/**
 * Validate URL format
 */
export function validateUrl(url: string): void {
  try {
    new URL(url);
  } catch {
    throw new ValidationError('Format URL tidak valid');
  }
}

/**
 * Async error wrapper untuk request handler
 */
export function asyncHandler(
  fn: (req: any, res: any) => Promise<void>
) {
  return (req: any, res: any) => {
    Promise.resolve(fn(req, res)).catch((error) => {
      const errorInfo = handleError(error);
      res.status(errorInfo.statusCode).json(createErrorResponse(error));
    });
  };
}

/**
 * Retry logic untuk failed operations
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      logger.warn(`Attempt ${attempt} failed, retrying...`, {
        attempt,
        maxAttempts,
        error: lastError.message,
      });

      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  throw lastError || new Error('All retry attempts failed');
}
