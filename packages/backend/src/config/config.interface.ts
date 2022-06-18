export type EnvType = 'dev' | 'test' | 'prod';

export interface ServerOptions {
  port: number;
  globalPrefix: string;
}

export interface ThrottlerOptions {
  ttl: number;
  limit: number;
}

export interface SwaggerOptions {
  title: string;
  description: string;
  version: string;
  path: string;
}
