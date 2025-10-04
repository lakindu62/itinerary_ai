import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import z, { ZodType } from 'zod';
import { Logger } from '@nestjs/common';

export const ZodBody = (schema: ZodType<any>) => {
  return createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const body: unknown = request.body;

    const result = schema.safeParse(body);
    if (result.error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const tree = z.treeifyError(result.error);
      Logger.error(tree);
    }
    if (!result.success) {
      const errorMessages = result.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
      }));

      throw new BadRequestException({
        message: 'Validation failed',
        errors: errorMessages,
      });
    }

    return result.data as unknown;
  })();
};
