import googleOauthConfig from '@/config/google-oauth.config';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(googleOauthConfig.KEY)
    private googleConfiguration: ConfigType<typeof googleOauthConfig>,
    private authService:AuthService,
  ) {
    super({
      clientID: googleConfiguration.clientID,
      clientSecret: googleConfiguration.clientSecret,
      callbackURL: googleConfiguration.callbackURL,
      scope: ['email', 'profile'],
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
    const fullName = profile.name?.familyName + ' ' + profile.name?.givenName;
    const user = await this.authService.validateGoogleLogin({
      providerId: profile.id,
      email: profile.emails?.[0]?.value,
      name: fullName,
      avatar: profile.photos?.[0]?.value,
    });
    // done(null, user);
    return user;
  }
}
