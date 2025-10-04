import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

/**
 * Interface to support Mongoose StrictModeError for user-defined properties.
 */
interface StrictModeError extends Error {
  path: string;
}

/**
 * Shape of structured HTTP exception responses.
 */
interface ExceptionResponse {
  message?: string;
  error?: string;
}

/**
 * Global exception filter to catch and handle all unhandled exceptions.
 * Formats error responses based on environment and logs full details.
 */
@Injectable()
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  /**
   * Main exception-catching method.
   * @param exception The error thrown in request handling
   * @param host ArgumentsHost for HTTP context resolution
   */
  catch(exception: unknown, host: ArgumentsHost) {
    // Extract HTTP context
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Default error payload values
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';
    let errorLocation = 'Unknown location';

    // Optionally, request-specific trace ID for linking logs
    const traceId =
      (request as any).traceId ||
      `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Extract probable error location from stack trace
    if (exception instanceof Error && exception.stack) {
      const stackLines = exception.stack.split('\n');
      const locationLine = stackLines.find((line) => line.includes('/src/'));
      if (locationLine) {
        const match = locationLine.match(/\((.+?):\d+:\d+\)/);
        errorLocation = match ? match[1] : 'Unknown location';
      }
    }

    // Handle NestJS HTTP exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'object') {
        message =
          (exceptionResponse as ExceptionResponse).message || exception.message;
        error = (exceptionResponse as ExceptionResponse).error || 'Error';
      } else {
        message = exception.message;
      }
    }
    // Handle Mongoose StrictModeError (e.g., invalid schema fields)
    else if (
      exception instanceof Error &&
      exception.name === 'StrictModeError'
    ) {
      status = HttpStatus.BAD_REQUEST;
      const field = (exception as StrictModeError).path;
      message = `Invalid field: ${field} is not allowed`;
      error = 'Bad Request';
    }
    // Handle any other Error instance
    else if (exception instanceof Error) {
      message = exception.message;
    }

    // Ensure Error instance for logging
    const errorToLog =
      exception instanceof Error
        ? exception
        : new Error(
            typeof exception === 'string'
              ? exception
              : 'Unknown error occurred',
          );

    // Build error log context for internal audit and debugging
    const errorContext = {
      statusCode: status,
      message: message,
      error: error,
      method: request.method,
      url: request.url,
      userId: (request as any).user?.id || 'anonymous', // update as needed for Clerk integration
      ip: request.ip,
      userAgent: request.headers['user-agent'],
      errorLocation,
      originalMessage: errorToLog.message,
      stack: errorToLog.stack
        ? errorToLog.stack.split('\n').slice(0, 5).join('\n')
        : '',
      traceId,
    };

    // Always log full details for server diagnostics
    this.logger.error(
      `[${traceId}] ${message} (${errorLocation}) - ${error}`,
      errorToLog.stack,
      JSON.stringify(errorContext),
    );

    // Prepare response payload for client (controlled by environment)
    const isDev = process.env.NODE_ENV === 'development';
    const responsePayload: any = {
      statusCode: status,
      message,
      error,
      errorLocation,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Preserve detailed error information from HTTP exceptions (like validation errors)
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      if (
        typeof exceptionResponse === 'object' &&
        (exceptionResponse as any).errors
      ) {
        responsePayload.errors = (exceptionResponse as any).errors;
      }
    }

    // In development, include stack trace for faster debugging
    if (isDev && errorToLog.stack) {
      responsePayload.stack = errorToLog.stack;
    }
    // In production, hide stack from frontend but still log it

    // Send formatted error response
    response.status(status).json(responsePayload);
  }
}
