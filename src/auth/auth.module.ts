import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './local.auth';
import { JwtStrategy } from '../common/guards/jwt.auth';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { SECRET } from '../common/constants/jwtConstans';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: SECRET,
      signOptions: { expiresIn: '1200s' },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthService, UsersService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
