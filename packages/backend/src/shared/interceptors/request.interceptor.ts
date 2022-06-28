import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    console.log(
      `path: ${request.path} query: ${JSON.stringify(
        request.query,
      )} body: ${JSON.stringify(request.body)}`,
    );

    return next.handle().pipe();
  }
}
