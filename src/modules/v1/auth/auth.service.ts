import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserModel } from './../users/schemas/user.schema';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel.name) private readonly User: Model<UserModel>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userService.findForAuth(email);
    if (!user) throw new UnauthorizedException('Incorrect credentials.');

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched)
      throw new UnauthorizedException('Incorrect credentials.');

    const payload = { sub: user._id.toString(), email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
