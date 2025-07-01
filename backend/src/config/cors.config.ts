import { registerAs } from '@nestjs/config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export default registerAs(
  'cors',
  (): CorsOptions => {
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Production CORS configuration for Netlify frontend
    const productionOrigins = [
      process.env.CORS_ORIGIN,
      'https://caboai.netlify.app',
      'https://letty-ai.netlify.app',
      /\.netlify\.app$/,
      /\.railway\.app$/,
    ].filter(Boolean);

    // Development CORS configuration
    const developmentOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
      'http://localhost:8080',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
    ];

    return {
      origin: isProduction ? productionOrigins : developmentOrigins,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'Cache-Control',
        'X-API-Key',
        'X-Client-Version',
      ],
      exposedHeaders: [
        'X-Total-Count',
        'X-Page-Count',
        'X-Rate-Limit-Remaining',
        'X-Rate-Limit-Reset',
      ],
      credentials: true,
      optionsSuccessStatus: 200,
      maxAge: isProduction ? 86400 : 3600, // 24 hours in production, 1 hour in development
    };
  },
);