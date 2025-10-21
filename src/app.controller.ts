import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('health')
  async healthCheck() {
    try {
      const usersCount = await this.prisma.users.count();
      return { ok: true, db: 'connected', usersCount };
    } catch (error) {
      return { ok: false, db: 'error', message: error.message };
    }
  }
}
