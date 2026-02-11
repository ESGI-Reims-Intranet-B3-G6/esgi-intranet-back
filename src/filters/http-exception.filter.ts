import { Response } from 'express';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(HttpExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    this.logger.error(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let message: string = exception.message;
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let details: object | null = null;

    // If the exception is a NestJS HttpException
    if (exception instanceof HttpException) {
      message = exception.message;
      statusCode = exception.getStatus();
      if (exception instanceof UnauthorizedException && exception.cause) {
        details = exception.cause;
      }
    }

    const responseBody = {
      message,
      status: statusCode,
      details,
    };

    response.status(statusCode).json(responseBody);
  }
}
