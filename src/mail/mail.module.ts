// // src/mail/mail.module.ts
// import { Module } from '@nestjs/common';
// import { MailerModule } from '@nestjs-modules/mailer';
// import { TransportOptions } from 'nodemailer';
// import { MailController } from './mail.controller';
// import { MailService } from './mail.service'
// import { ConfigService } from '@nestjs/config';


// const service = ConfigService

// @Module({
//   imports: [
//     MailerModule.forRoot({
//       transport: {
//         host: 'smtp.gmail.com',
//         port: 587,
//         secure: false, // true para 465, false para otros puertos
//         auth: {
//           user: ConfigService.get('config-gmail_user'), // tu correo de Gmail
//           pass: "gbeuhbnrolnzgjfm", // tu contraseña de Gmail o App Password
//         },
//       } as TransportOptions,
//       defaults: {
//         from: '"No Reply" <no-reply@gmail.com>', // dirección de correo predeterminada
//       },
//     })

//   ],
//   controllers: [MailController],
//   providers: [MailService],
//   exports: [MailerModule],
// })
// export class MailModule {}

import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { TransportOptions } from 'nodemailer';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule, // Asegúrate de importar ConfigModule
    MailerModule.forRootAsync({
      imports: [ConfigModule], // Importa ConfigModule aquí también
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: configService.get('GMAIL_USER'), // Cambia esto a la variable correcta
            pass: configService.get('GMAIL_PASSWORD'), // Cambia esto a la variable correcta
          },
        } as TransportOptions,
        defaults: {
          from: '"No Reply" <no-reply@gmail.com>',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailerModule],
})
export class MailModule {}