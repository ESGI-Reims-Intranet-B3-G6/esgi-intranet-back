import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

const getCurrentUserByContext = (context: ExecutionContext) => context.switchToHttp().getRequest<Request>().user;

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext) =>
  getCurrentUserByContext(context)
);
