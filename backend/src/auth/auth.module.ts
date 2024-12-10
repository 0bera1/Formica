// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy'; // Strateji burada ekleniyor
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET }), UsersModule],
  providers: [AuthService, JwtStrategy], // JwtStrategy burada ekleniyor
  controllers: [AuthController],
})
export class AuthModule {}
