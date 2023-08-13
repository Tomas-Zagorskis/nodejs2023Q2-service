import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class LoggingService extends ConsoleLogger {
  log(message: string, ...optionalParams: string[]) {
    super.log(`📢   ${message}`, ...optionalParams);
  }

  error(message: string, ...optionalParams: string[]) {
    super.error(`❌   ${message}`, ...optionalParams);
  }

  warn(message: string, ...optionalParams: string[]) {
    super.error(`⚠️   ${message}`, ...optionalParams);
  }

  debug(message: string, ...optionalParams: string[]) {
    super.error(`🐞   ${message}`, ...optionalParams);
  }
}
