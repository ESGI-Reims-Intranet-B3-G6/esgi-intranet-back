import { Response } from 'express';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
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

    if (exception instanceof BadRequestException) {
      try {
        details = {
          messages: (exception.getResponse() as { message: string[] }).message,
        };
      } catch {
        details = null;
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
