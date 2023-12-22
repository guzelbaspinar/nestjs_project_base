export interface IJwtConfig {
  secretKey: string;
  refreshSecretKey: string;
  algorithm: string;
  refreshExpiresIn: string;
  expiresIn: string;
  grantType: string;
}
