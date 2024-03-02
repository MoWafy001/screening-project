import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  login(loginDto: any) {
    throw new Error('Method not implemented.');
  }
  signup(registerDto: any) {
    throw new Error('Method not implemented.');
  }
}
