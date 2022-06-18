import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import 'dotenv/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import Utility from 'src/shared/utils';
import { AuthPayload } from '../auth.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: ['RS256'],
      ignoreExpiration: false,
      secretOrKey: Utility.loadPublicKey(),
    });
  }

  async validate(payload: AuthPayload) {
    return { id: payload.sub, name: payload.user };
  }
}
