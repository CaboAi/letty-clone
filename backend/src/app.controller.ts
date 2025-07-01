import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'CaboAi Backend API is running!';
  }

  @Get('health')
  getHealth(): object {
    return { status: 'healthy', service: 'caboai-backend' };
  }
}
