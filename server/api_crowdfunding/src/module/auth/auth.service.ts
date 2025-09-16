import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '@/module/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { comparePasswordHelper } from '@/helpers/passwordHelpers';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (user.isActive === false)
      throw new BadRequestException('Account is not active');
    if (!user) return null; // kiểm tra null trước
    const isValid = await comparePasswordHelper(pass, user.password);
    return isValid ? user : null;
  }

  async login(user: any) {
    if (!user) throw new UnauthorizedException('Invalid credentials'); // thêm guard rail
    const payload = {
      email: user.email,
      sub: user._id?.toString?.() ?? user._id,
    };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(registerDto: CreateAuthDto) {
    return await this.usersService.create(registerDto);
  }
  async validateGoogleLogin(googleUser: {
    providerId: string;
    email?: string;
    name?: string;
    avatar?: string;
  }) {
    const user = await this.usersService.createUserOAuth(googleUser);
    if (!user) {
      throw new UnauthorizedException(
        'Cannot create or find user from Google profile',
      );
    }
    const payload = {
      sub: user._id, // thay bằng user._id
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    };

    return { accessToken: this.jwtService.sign(payload) };
  }
  /**
   *
   * @param body {codeId, email}
   * @returns
   */
  async acctiveAccount(body: { codeId: string; email: string }) {
    if (!body.codeId || !body.email) {
      throw new BadRequestException('codeId and email are required');
    }
    const { codeId, email } = body;
    return this.usersService.activate({ codeId, email });
  }
}
