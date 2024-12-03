// import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { JwtService } from '@nestjs/jwt';
// import { TokenExpiredError } from '@nestjs/jwt';

// @Injectable()
// export class JwtUserGuard implements CanActivate {
//   constructor(
//     private readonly jwtService: JwtService,
//     private configService: ConfigService,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const accessToken = request.cookies.accessToken; // Obtener el token de acceso
//     const refreshToken = request.cookies.refreshToken; // Obtener el token de refresco

//     if (!accessToken) {
//       throw new ForbiddenException('Access denied: No access token provided');
//     }
    

//     try {
//       // Intentar verificar el token de acceso
//       const payload = this.jwtService.verify(accessToken, { secret: this.configService.get('config.jwt_secret') });
//       request.user = payload; // Almacena el payload en la solicitud
//       return true; // Acceso permitido
//     } catch (error) {
//       // Si el token de acceso está caducado, intentar usar el token de refresco
//       if (error instanceof TokenExpiredError && refreshToken) {
//         try {
//           // Verifica el token de refresco
//           const refreshPayload = this.jwtService.verify(refreshToken, { secret: this.configService.get('config.jwt_secret') });
          
//           // Generar un nuevo token de acceso
//           const newAccessToken = this.jwtService.sign({ userId: refreshPayload.userId }, { secret: this.configService.get('config.jwt_secret'), expiresIn: '1h' });

//           // Almacenar el nuevo token de acceso en las cookies (ajusta según tu lógica)
//           request.res.cookie('accessToken', newAccessToken, { 
//             httpOnly: true, // La cookie no se puede acceder desde JavaScript
//             secure: false, // Solo enviar la cookie por HTTPS en producción
//             maxAge: 1000*60*15, // Duración de la cookie en milisegundos (1 hora en este caso)
//             });
          

          
//           // También puedes devolver el nuevo token si es necesario
//           request.user = { userId: refreshPayload.userId }; // Puedes incluir más información si es necesario
//           return true; // Acceso permitido
//         } catch (refreshError) {
//           (refreshError);
//           throw new ForbiddenException('Access denied: Invalid refresh token');
//         }
//       }
      
//       // Si el token de acceso es inválido, simplemente devuelve false
//       (error);
//       return false; // Acceso denegado
//     }
//   }
// }


import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class JwtUserGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.cookies.accessToken; // Obtener el token de acceso
    const refreshToken = request.cookies.refreshToken; // Obtener el token de refresco

    request.user = 1
    return true
  
  }
}