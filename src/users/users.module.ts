import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthenticationProvider } from './entities/authenticationProvider.entity';
import { JwtModule } from '@nestjs/jwt';
import { TransactionsService } from '../transactions/transactions.service';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { Category } from 'src/transactions/entities/category.entity';
import { Coin } from 'src/transactions/entities/coin.entity';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule, // Asegúrate de importar ConfigModule
    JwtModule.registerAsync({
      imports: [ConfigModule], // Asegúrate de incluir ConfigModule
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('config.jwt_secret'), // Usa la variable de entorno
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    HttpModule,
    TypeOrmModule.forFeature([User, AuthenticationProvider, Transaction, Category, Coin]),
  ],
  controllers: [UsersController],
  providers: [UsersService, TransactionsService],
})
export class UsersModule {}