import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAuthticationProviderDto } from './dto/create-authticationProvider.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthenticationProvider } from './entities/authenticationProvider.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigAcountDto } from './dto/config-acount.dto';
import { TransactionsService } from '../transactions/transactions.service'
import { Coin } from 'src/transactions/entities/coin.entity';

interface TokenAuth{
  accessToken: string,
  refreshToken: string
}

@Injectable()
export class UsersService {
  constructor(
    private jwtService: JwtService,
    private readonly transactionsService: TransactionsService,

    @InjectRepository(User)
    private readonly users: Repository<User>,

    @InjectRepository(Coin)
    private readonly coins: Repository<Coin>,

    @InjectRepository(AuthenticationProvider)
    private readonly authenticationProviders: Repository<AuthenticationProvider>,
  ) {}

  async configAcount(configAcountDto:ConfigAcountDto,id: number){


      const coin = await this.coins.findOne({ where: { code: configAcountDto.selectedCurrency } });

      console.log(configAcountDto)


      const user = await this.update(id,{"coin": coin})

      const expenseTags = configAcountDto.expenseTags.map((name) => ({name, user, income:false}))
      const incomeTags = configAcountDto.incomeTags.map((name) => ({ name, user, income:true}))

      const tags = expenseTags.concat(incomeTags);
      const tagsName = configAcountDto.expenseTags.concat(configAcountDto.incomeTags)



      await this.transactionsService.syncCategorias(tags,tagsName,user);


  }


  async authentication(authenticationProvider: CreateAuthticationProviderDto){
    const user = await this.users.findOne({where:{authenticationProvider}})

    
    if(user){

      return {
        "tokenAuth":await this.login(user),
        "created":false
      }
    }
    return {
      "tokenAuth":await this.createAcount(authenticationProvider),
      "created":true
    }
  }

  login(user:User):TokenAuth {
    const accessToken = this.jwtService.sign({ userId: user.id }, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign({ userId: user.id }, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }

  access(user:number):string{
    return this.jwtService.sign({ userId: user }, { expiresIn: '15m' });
  }

  async createAcount (authenticationProvider: CreateAuthticationProviderDto): Promise<TokenAuth>{
    const provider = this.authenticationProviders.create(authenticationProvider);
    await this.authenticationProviders.save(provider);

    const user = this.users.create({ authenticationProvider:provider })

    await this.users.save(user)

    return await this.login(user)
  }

  async findOne(id: number) {
    const user = await this.users.findOne({where:{id}})

    if (!user) throw new NotFoundException("This user don't exist ")

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    Object.assign(user,updateUserDto);

    return this.users.save(user);
  }


  async userCoin(userId: number) {


    const result = await this.users
    .createQueryBuilder('user')
    .innerJoin('user.coin', 'coin') // Realiza un INNER JOIN con la relación coin
    .select('coin.currency AS coin') // Selecciona la columna currency
    .where('user.id = :id', { id: userId }) // Filtra por el id del usuario
    .getRawOne();
        


    return result; // Devuelve la moneda o null si no se encuentra
}

}
