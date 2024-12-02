import { Controller } from '@nestjs/common';
import { Body,Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
    constructor(
      private readonly mailService: MailService,
    ) {}

    @Post('send')
    async sendEmail(@Body() body: { to: string; subject: string; text: string }) {
      await this.mailService.sendEmail(body.to, body.subject, body.text);
      return { message: 'Email enviado' };
    }
}
