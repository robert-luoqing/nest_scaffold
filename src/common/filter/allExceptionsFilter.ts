import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // 检查是否是 HTTP 异常
    let code = exception.code;
    let message = exception.message;
    if (!code) {
      code = exception instanceof HttpException ? exception.getStatus() : 500;
    }

    message = message || 'Internal server error';

    response.status(200).json({
      code: code,
      message,
    });
  }
}
