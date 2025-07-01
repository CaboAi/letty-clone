import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => {
    const isProduction = process.env.NODE_ENV === 'production';
    
    return {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
      synchronize: process.env.DB_SYNCHRONIZE === 'true' && !isProduction,
      logging: process.env.DB_LOGGING === 'true' && !isProduction,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      subscribers: [__dirname + '/../subscribers/*{.ts,.js}'],
      migrationsRun: isProduction,
      autoLoadEntities: true,
      retryAttempts: 3,
      retryDelay: 3000,
      maxQueryExecutionTime: 30000,
      extra: {
        connectionLimit: 10,
        acquireTimeout: 60000,
        timeout: 60000,
        ...(isProduction && {
          ssl: {
            rejectUnauthorized: false,
          },
        }),
      },
    };
  },
);