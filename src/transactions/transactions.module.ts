import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction } from './entities/transaction.entity';
import { Category } from './entities/category.entity';
import { Coin } from './entities/coin.entity';
import { User } from 'src/users/entities/user.entity';
import { JwtUserGuard } from 'src/guards/jwt-users.guard';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule, // Asegúrate de importar ConfigModule
    TypeOrmModule.forFeature([Transaction, Category, Coin, User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('config.jwt_secret'), // Usa la variable de entorno
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, JwtUserGuard, JwtService],
})
export class TransactionsModule {}

