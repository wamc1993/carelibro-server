import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { instanceToInstance } from 'class-transformer';
import { Injectable, NotAcceptableException } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotAcceptableException('could not find the user');
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (user && passwordValid) {
      return user;
    }
    return null;
  }

  private sign(email: string, id: number): string {
    const payload = { email, sub: id };
    return this.jwtService.sign(payload);
  }

  async login(user: any) {
    const { email, id } = user;
    const accessToken = this.sign(email, id);

    return {
      accessToken,
      user: instanceToInstance(user, { groups: ['withDates'] }),
    };
  }

  async signup(user: CreateUserDto) {
    const saltOrRounds = 10;
    user.password = await bcrypt.hash(user.password, saltOrRounds);

    const newUser = await this.usersService.create(user);
    const accessToken = this.sign(newUser.email, newUser.id);

    return {
      accessToken,
      user: instanceToInstance(newUser, { groups: ['withDates'] }),
    };
  }
}
