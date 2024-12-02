import { Controller, Get, Post, Body, Patch, Param, Res, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAuthticationProviderDto } from './dto/create-authticationProvider.dto';
import { Response, Request } from 'express';
import { ConfigAcountDto } from './dto/config-acount.dto';
import { ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UseGuards } from '@nestjs/common';
import { JwtUserGuard } from 'src/guards/jwt-users.guard';
import { ConfigService } from '@nestjs/config';

interface IUserRequest extends Request {
  user: any;
}


@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  @Post('login')
    async authentication(@Body() createAuthticationProviderDto:CreateAuthticationProviderDto, @Res() res: Response) {

      const provider:any = structuredClone(createAuthticationProviderDto)

      if(provider.siteProvider == 'Github'){ 
        const clientId = this.configService.get('config.github_client_id')
        const clientSecret = this.configService.get('config.github_secret_key')


        // const clientId = "Ov23liLaFblHYoYJ1Bn0"
        // const clientSecret = "21a94dd0aee1e59f96079711fd3162e173307dc1"

        const response = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              client_id: clientId,
              client_secret: clientSecret,
              code: provider.code,
          }),
        }).then(response => response.json());

        const user = await fetch('https://api.github.com/user', {
          method: 'GET',
          headers: {
              Authorization: `token ${response.access_token}`,
              Accept: 'application/vnd.github.v3+json',
          },
        }).then(response => response.json());
 
        const { tokenAuth, created } = await this.usersService.authentication(
        {"idProvider":user.id,"siteProvider":provider.siteProvider,"email":user.email}
      )
        
   

      res.cookie('accessToken', tokenAuth.accessToken, {
        httpOnly: true, // La cookie no se puede acceder desde JavaScript
        secure: false, // Solo enviar la cookie por HTTPS en producción
        maxAge: 1000*60*15, // Duración de la cookie en milisegundos (1 hora en este caso)
      });
      
      res.cookie('refreshToken', tokenAuth.refreshToken, {
        httpOnly: true, // La cookie no se puede acceder desde JavaScript
        secure: false, // Solo enviar la cookie por HTTPS en producción
        maxAge: 1000*60*60*24*7, // Duración de la cookie en milisegundos (1 hora en este caso)
      });

      if (!created) res.status(200)  
      

      return res.send({ name: user.name, picture: user.avatar_url })
  
      }
      else if(provider.siteProvider == 'Google'){
        const { tokenAuth, created } = await this.usersService.authentication(createAuthticationProviderDto);

        res.cookie('accessToken', tokenAuth.accessToken, {
              httpOnly: true, // La cookie no se puede acceder desde JavaScript
              secure: false, // Solo enviar la cookie por HTTPS en producción
              maxAge: 1000*60*15, // Duración de la cookie en milisegundos (1 hora en este caso)
        });
            
        res.cookie('refreshToken', tokenAuth.refreshToken, {
              httpOnly: true, // La cookie no se puede acceder desde JavaScript
              secure: false, // Solo enviar la cookie por HTTPS en producción
              maxAge: 1000*60*60*24*7, // Duración de la cookie en milisegundos (1 hora en este caso)
        });
          
    
        if (!created) res.status(200)  
  


      }

    return res.send({ message: 'Login exitoso' })

    }

  @Get('logout')
  logout(@Res() res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.status(200).json({ message: 'Logout successful' });
  }

  @Get('access')
  access(@Req() request: Request, @Res() res: Response){
    const refreshToken = request.cookies.refreshToken; // Obtener el token de refresco

    if (!refreshToken) {
      throw new ForbiddenException('Access denied: No access token provided');
    }
    try{
      const payload = this.jwtService.verify(refreshToken, { secret: 'defaultSecret' });

      
      const accessToken = this.usersService.access(payload.userId);


      res.cookie('accessToken', accessToken, {
        httpOnly: true, // La cookie no se puede acceder desde JavaScript
        secure: false, // Solo enviar la cookie por HTTPS en producción
        maxAge: 1000*60*15, // Duración de la cookie en milisegundos (1 hora en este caso)
      });
      res.status(200)
      res.send({'message':'yes login'})


    }
    catch(error){
        // throw new ForbiddenException('Access denied: Invalid refresh token');
        res.status(401)
        res.send({'message':'No login'})
    }

  }

  @Patch('config')
  @UseGuards(JwtUserGuard)
  configAcount(@Body() configAcountDto:ConfigAcountDto,@Req() request: IUserRequest, @Res() res: Response) {
    const id = request.user.userId;
    this.usersService.configAcount(configAcountDto,id);
    res.status(201);
    return res.send({'message':'sucess'});
  }


  @Get('coin')
  @UseGuards(JwtUserGuard)
  async coinUser(@Req() request:  IUserRequest,@Res() res: Response){
    
    const coin = await this.usersService.userCoin(request.user.userId);

    res.status(200);

    return res.send({coin}) 
  }
    

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }
}
