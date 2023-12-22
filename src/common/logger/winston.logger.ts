import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class WinstonLogger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
            winston.format.simple(),
            winston.format.splat(),
            winston.format.printf((info) => {
              let data = info.message.data;
              if (typeof info.message.data === 'object') {
                data = JSON.stringify(info.message.data);
              }
              return `${info.timestamp} ${info.level.toUpperCase()}: [email:${
                info.message.email
              }] [rowId:${info.message.rowId}] [tableName:${
                info.message.tableName
              }] [proctype:${info.message.proctype}] [data:${data}] [sourceIp:${
                info.message.sourceIp
              }] [result:${info.message.result || null}] [trace:${
                info.message.trace || null
              }]`;
            }),
            winston.format.prettyPrint(),
            winston.format.colorize({ all: true }),
          ),
        }),
      ],
    });
  }

  log(message: string) {
    this.logger.info(message);
  }
  info(
    email: string = null,
    service: string = null,
    procType: string = null,
    data: any = null,
  ) {
    this.logger.info({ email, service, procType, data });
  }

  error(
    email: string = null,
    service: string = null,
    procType: string = null,
    data: any = null,
    errorMessage: string,
    trace: string,
  ) {
    this.logger.error({
      email,
      service,
      procType,
      data,
      result: errorMessage,
      trace,
    });
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
