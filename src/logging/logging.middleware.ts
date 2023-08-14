import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, baseUrl: url, body, query } = req;

    const qParams = Object.entries(query)
      .map((param) => `${param[0]} = ${param[1]}`)
      .join('; ');
    const queries = qParams.length > 0 ? `- query params: ${qParams}` : '';
    const stringifyBody = JSON.stringify(body);
    const bodyRes = stringifyBody.length > 2 ? `- body: ${stringifyBody}` : '';

    res.on('finish', () => {
      const { statusCode } = res;

      this.logger.log(
        `${method}: ${url} status: ${statusCode} ${bodyRes}${queries}`,
      );
    });
    next();
  }
}
