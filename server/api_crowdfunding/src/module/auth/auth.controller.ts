import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { Public } from '@/decorators/customize';
import { CreateAuthDto } from './dto/create-auth.dto';
import { GoogleAuthGuard } from './passport/google-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @Public()
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @Public()
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @Public()
  async googleCallback(@Req() req, @Res() res) {
    const response = await this.authService.loginGoogle(req.user);
    res.cookie('access_token', response.access_token, {
      httpOnly: true,
      sameSite: 'lax', // dev localhost
      secure: false, // dev; production => true + HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // ví dụ 7 ngày
      path: '/', // gửi cho mọi route API của backend
    });
    res.redirect(`http://localhost:5173`);
  }
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }
  @Patch('active')
  @Public()
  handleActiveAccount(@Request() req) {
    return this.authService.acctiveAccount(req.body);
  }

  @Post('register')
  @Public()
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.register(registerDto);
  }
}
