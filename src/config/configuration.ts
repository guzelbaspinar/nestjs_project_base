import { IConfig } from './config.interface';

export default (): IConfig => ({
  port: parseInt(process.env.PORT, 10) || 8080,
  mongo: {
    uri: process.env.MONGO_DB_URI || 'mongodb://localhost:27017/nestdb',
    useNewUrlParser: Boolean(process.env.MONGO_DB_USE_NEW_URL_PARSER) || true,
  },
  logger: {
    level: process.env.LOGGER_LEVEL || 'info',
  },
  jwt: {
    secretKey: process.env.JWT_SECRET || 'mySecretKey',
    refreshSecretKey: process.env.JWT_REFRESH_SECRET || 'MyRefreshSecretKey',
    algorithm: 'HS256',
    expiresIn: '365 days',
    refreshExpiresIn: '30 days',
    grantType: 'Bearer',
  },
});
