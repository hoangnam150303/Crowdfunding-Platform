import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // quan trọng: dùng 'email' thay cho 'username'
      passwordField: 'password', // tường minh
      // passReqToCallback: true,        // bật nếu muốn đọc req trong validate
    });
  }

  // Nếu không dùng passReqToCallback:
  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new UnauthorizedException();
    return user;
  }


}
