import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
