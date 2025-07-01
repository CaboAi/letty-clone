import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import compression from 'compression';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    const app = await NestFactory.create(AppModule, {
      logger: process.env.NODE_ENV === 'production' 
        ? ['error', 'warn', 'log'] 
        : ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT', 3000);
    const nodeEnv = configService.get<string>('NODE_ENV', 'development');
    const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');

    // Security middleware
    if (nodeEnv === 'production') {
      app.use(helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
          },
        },
        crossOriginEmbedderPolicy: false,
      }));
      
      app.use(compression());
    }

    // Global API prefix
    app.setGlobalPrefix(apiPrefix);

    // CORS configuration
    const corsConfig = configService.get('cors');
    app.enableCors(corsConfig);

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
        validationError: {
          target: false,
          value: false,
        },
      }),
    );

    // Swagger documentation (only in development)
    if (nodeEnv !== 'production') {
      const config = new DocumentBuilder()
        .setTitle('CaboAI API')
        .setDescription('AI-powered business communication platform for Los Cabos')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('Auth', 'Authentication endpoints')
        .addTag('Users', 'User management')
        .addTag('Businesses', 'Business management')
        .addTag('Conversations', 'AI conversation handling')
        .addTag('Analytics', 'Business analytics')
        .addTag('Health', 'Health check endpoints')
        .addServer(`http://localhost:${port}`, 'Development server')
        .build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('docs', app, document, {
        swaggerOptions: {
          persistAuthorization: true,
        },
      });
      
      logger.log(`📚 Swagger documentation available at http://localhost:${port}/docs`);
    }

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      logger.log(`🔄 Received ${signal}, shutting down gracefully...`);
      app.close().then(() => {
        logger.log('✅ Application closed successfully');
        process.exit(0);
      }).catch((error) => {
        logger.error('❌ Error during shutdown:', error);
        process.exit(1);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Start the server
    await app.listen(port, '0.0.0.0');
    
    logger.log(`🚀 CaboAI Backend is running on port ${port}`);
    logger.log(`🌍 Environment: ${nodeEnv}`);
    logger.log(`📡 API Prefix: /${apiPrefix}`);
    
    if (nodeEnv === 'production') {
      logger.log(`🏥 Health check: ${configService.get('RAILWAY_PUBLIC_DOMAIN') || 'localhost:' + port}/health`);
    }

  } catch (error) {
    logger.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();