import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AUTH_MESSAGES } from 'src/common/constants/message.constant';
import { UserDocument } from '../../users/schemas/user.schema';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = UserDocument>(
    err: Error | null,
    user: TUser | false,
    info: Error | undefined,
  ): TUser {
    // 'err' is a system error
    // 'user' is what's returned from Strategy validate()
    // 'info' contains Passport error messages (like "jwt expired")

    if (err || !user) {
      console.log(info);
      // You can get specific here:
      if (info?.message === 'No auth token') {
        throw new UnauthorizedException(AUTH_MESSAGES.TOKEN_REQUIRED);
      } else if (info?.message === 'jwt expired') {
        throw new UnauthorizedException(AUTH_MESSAGES.TOKEN_EXPIRED);
      }

      //   Fallback to your constant
      throw err || new UnauthorizedException(AUTH_MESSAGES.TOKEN_INVALID);
    }

    return user;
  }
}
