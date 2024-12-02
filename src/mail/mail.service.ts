import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
    constructor(
      private readonly mailerService: MailerService,
      private configService: ConfigService
    
    ) {
      console.log(this.configService.get('config.gmail_user'))
      console.log(this.configService.get('config.gmail_password'))

    }
    

    async sendEmail(to: string, subject: string, text: string) {
        await this.mailerService.sendMail({
        to, // dirección de destino
        subject, // asunto
        text, // contenido del mensaje
      // html: '<b>Hola!</b>', // si deseas enviar como HTML
    });
    }
}
