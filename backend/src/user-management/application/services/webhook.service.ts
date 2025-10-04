import { Inject, Injectable, Logger } from '@nestjs/common';
import { AuthWebhookHandler } from 'src/user-management/domain/interfaces/auth-webhook.interface';
import { UserService } from './user.service';
import { Request } from 'express';
import { UserType } from 'src/user-management/domain/user/value-objects/user-role.vo';
import { BusinessAccountService } from './business-account.service';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  constructor(
    @Inject('AuthWebhookHandler')
    private authWebhookHanlder: AuthWebhookHandler,
    private userService: UserService,
    private businessAccountService: BusinessAccountService,
  ) {}
  async processAuthWebhook(req: Request) {
    const evt = await this.authWebhookHanlder.verifyWebhook(req);
    console.log('🚀 ~ WebhookService ~ processAuthWebhook ~ evt:', evt);

    switch (evt.type) {
      case 'user.created': {
        const dto = this.authWebhookHanlder.mapToCreateUserDto(evt);
        await this.userService.createUser(dto);
        break;
      }
      case 'user.deleted': {
        const event = evt as { data: { id: string } };
        const deletedUser = await this.userService.deleteUser(event.data.id);
        if (deletedUser && deletedUser?.userType == UserType.BUSINESS_USER) {
          await this.businessAccountService.deleteBusinessAccount(
            deletedUser.businessAccountId!,
          );
          this.logger.debug('deleted business account', deletedUser);
        } else {
          this.logger.debug('deleted traveller account', deletedUser);
        }

        break;
      }
    }
  }
}
