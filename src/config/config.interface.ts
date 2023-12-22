import {IJwtConfig} from './jwt-config.interface';
export interface IConfig {
  port: number;
  mongo: {
    uri: string;
    useNewUrlParser: boolean;
  };
  logger:{
    level:string
  },
  jwt: IJwtConfig;
}
