import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_STATUS } from 'src/common/constants/response.constant';

@Injectable()
export class UserResponseInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 1. Get the message from the decorator
    const message =
      this.reflector.get<string>('response_message', context.getHandler()) ||
      'Success';

    return next.handle().pipe(
      map((data: T) => {
        return {
          status: RESPONSE_STATUS.SUCCESS, // This is your 'success' constant
          message: message,
          data: this.sanitize(data),
        };
      }),
    );
  }

  private sanitize(data: T): unknown {
    if (!data) return null;

    // 1. JSON.parse returns 'any', so we cast to 'unknown' first to satisfy strict linting
    const plainData = JSON.parse(JSON.stringify(data)) as unknown;

    if (Array.isArray(plainData)) {
      return plainData.map((item: Record<string, unknown>) => {
        // Use underscores for unused variables to satisfy 'no-unused-vars'
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _p, passwordConfirm: _pc, __v: _v, ...rest } = item;
        return rest;
      });
    }

    // 2. Cast to the specific shape we need to destructure
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      password: _p,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      passwordConfirm: _pc,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      __v: _v,
      ...rest
    } = plainData as Record<string, unknown>;

    return rest;
  }
}
