import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'error'>
  implements OnModuleInit
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'stdout',
          level: 'info',
        },
        {
          emit: 'stdout',
          level: 'warn',
        },
      ],
    });
  }

  async onModuleInit() {
    this.$on('error', (event) => {
      this.logger.verbose(event.target);
    });
    if (process.env.NODE_ENV !== 'production') {
      this.$on('query', (event) => {
        this.logger.verbose(
          `[query]: ${event.query}, [params]: ${event.params}`,
        );
      });
    }

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