import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserDocument } from '../../users/schemas/user.schema';
import { AUTH_MESSAGES } from 'src/common/constants/message.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      // 1. Tell the strategy where to find the token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 2. Ensure we don't allow expired tokens
      ignoreExpiration: false,
      // 3. The secret key used to verify the signature
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: JwtPayload): Promise<UserDocument> {
    const user = await this.userService.findOne(payload.sub);

    if (!user) throw new UnauthorizedException(AUTH_MESSAGES.TOKEN_INVALID);
    return user;
  }
}
