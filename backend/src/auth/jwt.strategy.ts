import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './jwt-payload.interface';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, // JWT Secret'ı burada kullanıyoruz
    });
    console.log('JWT_SECRET:', process.env.JWT_SECRET); // JWT_SECRET değerini logla
  }

  async validate(payload: JwtPayload) {
    console.log('JWT Payload:', payload); // Payload'ı logla
    const { sub } = payload;
    const user = await this.usersService.findOne(sub);

    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    console.log('User found:', user); // Kullanıcı bulunduysa logla
    return user;
  }
}
