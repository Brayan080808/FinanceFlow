// import { Module } from '@nestjs/common';
// import { UsersModule } from './users/users.module';
// import { TransactionsModule } from './transactions/transactions.module';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Transaction } from './transactions/entities/transaction.entity'
// import { Coin } from './transactions/entities/coin.entity';
// import { Category } from './transactions/entities/category.entity';
// import { User } from './users/entities/user.entity'
// import { AuthenticationProvider } from './users/entities/authenticationProvider.entity'
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { MailModule } from './mail/mail.module';
// import { ConfigModule } from '@nestjs/config';
// import configurationApp from 'config/configuration-app';

            
// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       envFilePath: `./env/${process.env.NODE_ENV}.env`,
//       load: [configurationApp],
//       isGlobal: true,
//     }),
//     PassportModule.register({ session: false }),
//     JwtModule.register({
//       secret: process.env.JWT_SECRET || 'defaultSecret', // Cambia esto por una clave segura
//       signOptions: { expiresIn: '1h' }, // Duración del token
//     }),
//     UsersModule, TransactionsModule,MailModule,
//     TypeOrmModule.forRoot({
//       type: 'postgres', // Cambia según tu base de datos (mysql, sqlite, etc.)
//       host: 'localhost',
//       port: 5433, // Cambia según tu configuración
//       username: 'postgres',
//       password: '080808',
//       database: 'DbFinanceFlow',
//       entities: [ Category, Transaction, Coin, User, AuthenticationProvider ], // Añade tus entidades aquí
//       synchronize: true, // Cambia a false en producción y usa migraciones
//       logging: true, // Habilita el logging
//     })
    
//   ]
// })
// export class AppModule {}



// import { Module } from '@nestjs/common';
// import { UsersModule } from './users/users.module';
// import { TransactionsModule } from './transactions/transactions.module';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Transaction } from './transactions/entities/transaction.entity';
// import { Coin } from './transactions/entities/coin.entity';
// import { Category } from './transactions/entities/category.entity';
// import { User } from './users/entities/user.entity';
// import { AuthenticationProvider } from './users/entities/authenticationProvider.entity';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { MailModule } from './mail/mail.module';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import configurationApp from 'config/configuration-app';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       envFilePath: `./env/${process.env.NODE_ENV}.env`,
//       load: [configurationApp],
//       isGlobal: true,
//     }),
//     PassportModule.register({ session: false }),
//     JwtModule.registerAsync({
//       imports: [ConfigModule], // Importa ConfigModule aquí
//       useFactory: async (configService: ConfigService) => ({
//         secret: configService.get<string>('config.jwt_secret'), // Usa la variable de entorno
//         signOptions: { expiresIn: '1h' }, // Duración del token
//       }),
//       inject: [ConfigService],
//     }),
//     UsersModule,
//     TransactionsModule,
//     MailModule,
//     TypeOrmModule.forRoot({
//       type: 'postgres', // Cambia según tu base de datos (mysql, sqlite, etc.)
//       host: 'localhost',
//       port: 5433, // Cambia según tu configuración
//       username: 'postgres',
//       password: '080808',
//       database: 'DbFinanceFlow',
//       entities: [Category, Transaction, Coin, User, AuthenticationProvider], // Añade tus entidades aquí
//       synchronize: true, // Cambia a false en producción y usa migraciones
//       logging: true, // Habilita el logging
//     }),
//   ],
// })
// export class AppModule {}




import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transactions/entities/transaction.entity';
import { Coin } from './transactions/entities/coin.entity';
import { Category } from './transactions/entities/category.entity';
import { User } from './users/entities/user.entity';
import { AuthenticationProvider } from './users/entities/authenticationProvider.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MailModule } from './mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configurationApp from 'config/configuration-app';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./env/${process.env.NODE_ENV}.env`,
      load: [configurationApp],
      isGlobal: true,
    }),
    PassportModule.register({ session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('config.jwt_secret'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    TransactionsModule,
    MailModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Asegúrate de importar ConfigModule
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres', // Cambia según tu base de datos
        host: configService.get('config.database_host'), // Usa variable de entorno
        port: configService.get('config.database_port'), // Usa variable de entorno
        username: configService.get('config.database_username'), // Usa variable de entorno
        password: configService.get('config.database_password'), // Usa variable de entorno
        database: configService.get('config.database_name'), // Usa variable de entorno
        entities: [Category, Transaction, Coin, User, AuthenticationProvider],
        synchronize: true, // Cambia a false en producción y usa migraciones
        logging: true, // Habilita el logging
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}