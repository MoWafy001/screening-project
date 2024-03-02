import { Injectable } from '@nestjs/common';
import { SignupDto } from '../dtos/signup.dto';
import { UsersService } from 'src/modules/users/services/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  // login(loginDto: any) {
  //   throw new Error('Method not implemented.');
  // }
  signup(signupDto: SignupDto) {
    return this.usersService.create(signupDto);
  }
}
