import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtWith2FAAuthGuard } from 'src/modules/auth/guards/jwt-with-2fa-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserDocument } from '../models/user.model';
import { JsonResponse } from 'src/lib/responses/json-response';
import { serialize } from 'src/helpers/serialize';
import { UserDetailsSerialization } from '../serialization/user-details.serialzation';

@Controller('profile')
@UseGuards(JwtWith2FAAuthGuard)
export class ProfileController {
  @Get()
  async getProfile(@CurrentUser() currentUser: UserDocument) {
    return new JsonResponse({
      data: {
        user: serialize(currentUser, UserDetailsSerialization),
      },
    });
  }
}
