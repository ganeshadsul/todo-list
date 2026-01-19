import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SUCCESS } from '../constants/message.constant';

@Injectable()
export class GlobalTransformInterceptor<T> implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 1. Grab the custom message from the @ResponseMessage decorator
    const message =
      this.reflector.get<string>('response_message', context.getHandler()) ||
      SUCCESS;

    return next.handle().pipe(
      map((data: T) => {
        // 2. Wrap the data in our standard professional format
        return {
          status: 'success',
          message: message,
          data: data,
        };
      }),
    );
  }
}
