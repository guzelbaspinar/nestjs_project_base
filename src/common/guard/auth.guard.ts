import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { WinstonLogger } from '../logger/winston.logger';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private reflector: Reflector,
    private readonly loggerService: WinstonLogger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const allowedRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!request.headers.authorization) {
      const error = new Error('Authorization token is required.');
      this.loggerService.error(
        request.user ? request.user.email : '',
        AuthGuard.name,
        'canActivate',
        '',
        error.message,
        error.stack,
      );
      throw new HttpException(error.message, HttpStatus.FORBIDDEN);
    }

    if (request.headers.authorization.split(' ')[0] !== 'Bearer') {
      const error = new Error('Invalid token type.');
      this.loggerService.error(
        request.user ? request.user.email : '',
        AuthGuard.name,
        'canActivate',
        '',
        error.message,
        error.stack,
      );
      throw new HttpException(error.message, HttpStatus.FORBIDDEN);
    }

    const token = request.headers.authorization.split(' ')[1];

    const user = await this.validateToken(token);
    if (!user) {
      const error = new Error('Authorization token is not valid!');
      this.loggerService.error(
        request.user ? request.user.email : '',
        AuthGuard.name,
        'canActivate',
        '',
        error.message,
        error.stack,
      );
      throw new HttpException(error.message, HttpStatus.FORBIDDEN);
    }
    const hasRole = () => {
      if (!allowedRoles) {
        return true;
      }
      return allowedRoles.includes(user.role);
    };
    if (!user || (!user.role && !hasRole())) {
      const error = new Error('You are not authorized to view.');
      this.loggerService.error(
        request.user ? request.user.email : '',
        AuthGuard.name,
        'canActivate',
        '',
        error.message,
        error.stack,
      );
      throw new HttpException(error.message, HttpStatus.FORBIDDEN);
    }
    request.user = user;
    return true;
  }

  private async validateToken(token: string): Promise<any> {
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const decodedToken = this.jwtService.verify(token, { secret });
      return decodedToken.user;
    } catch (error) {
      this.loggerService.error(
        '',
        AuthGuard.name,
        'canActivate',
        '',
        'Authorization token not valid.',
        error.stack,
      );
      throw new HttpException(
        'Authorization token not valid.',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
