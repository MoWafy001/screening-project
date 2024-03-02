import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtWith2FAAuthGuard extends AuthGuard('jwt-with-2fa') {}
