import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  wrapResults(records, wrapper) {
    if (!records) return records;
    return Array.isArray(records)
      ? records.map((r) => {
          return wrapper(r);
        })
      : wrapper(records);
  }
}
