import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { AUTH_MESSAGES } from 'src/common/constants/message.constant';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(AUTH_MESSAGES.SUCCES)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
