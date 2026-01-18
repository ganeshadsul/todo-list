// src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { RESPONSE_STATUS } from '../constants/response.constant';
interface MongooseCastError {
  name: string;
  path: string;
  value: string;
}
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 1. Determine Status Code safely
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as
        | string
        | { message: string | string[] };

      message = typeof res === 'object' ? res.message : res;
    } else if (this.isCastError(exception)) {
      status = HttpStatus.BAD_REQUEST; // Change 500 to 400
      message = `Invalid format for field: ${exception.path}`;
    } else if (exception instanceof Error) {
      // Handles standard JavaScript Errors
      message = exception.message;
    }

    // 3. Final formatted response
    response.status(status).json({
      status: RESPONSE_STATUS.ERROR,
      // Check for array and pick the first message safely
      message: Array.isArray(message) ? message[0] : message,
      data: null,
      meta: {
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    });
  }
  private isCastError(error: unknown): error is MongooseCastError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      (error as Record<string, unknown>).name === 'CastError'
    );
  }
}
