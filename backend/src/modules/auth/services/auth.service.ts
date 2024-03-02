import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from '../dtos/signup.dto';
import { UsersService } from 'src/modules/users/services/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: any) {
    const user = await this.usersService.findOne(loginDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.password !== loginDto.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user._id };

    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async signup(signupDto: SignupDto) {
    return this.usersService.create(signupDto);
  }
}
