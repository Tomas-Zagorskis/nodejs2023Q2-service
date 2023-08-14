import { ConsoleLogger, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { appendFile, mkdir, readdir, rm, stat } from 'fs/promises';
import { resolve } from 'path';

@Injectable()
export class LoggingService extends ConsoleLogger {
  log(message: string, context: string) {
    this.writeToLog('log', `📢   ${message}`, context);
  }
  error(message: string, trace: string, context?: string) {
    this.writeToLog('error', `❌   ${message}`, context, trace);
  }

  warn(message: string, context: string) {
    this.writeToLog('warn', `⚠️   ${message}`, context);
  }

  debug(message: string, context: string) {
    this.writeToLog('debug', `🐞   ${message}`, context);
  }

  protected getTimestamp(): string {
    return '';
  }

  private writeToLog(
    level: string,
    message: string,
    context: string,
    trace?: string,
  ) {
    const logMessage = trace ? `${message}\n${trace}` : message;
    const logEntry = `[${new Date().toLocaleString('sv-SE', {
      timeZone: 'Europe/Vilnius',
    })}] [${level}]- ${logMessage}`;

    if (level === 'log' || level === 'error') {
      this.writeToFile(logEntry, level);
    }

    if (+process.env.LOGGING_LEVEL === 0 && level === 'log') {
      super[level](logEntry, context);
    }
    if (
      +process.env.LOGGING_LEVEL === 1 &&
      level !== 'error' &&
      level !== 'debug'
    ) {
      super[level](logEntry, context);
    }
    if (+process.env.LOGGING_LEVEL === 2) {
      super[level](logEntry, context);
    }
  }

  private async writeToFile(logEntry: string, level: string) {
    const dirPath = resolve(__dirname, `../logs/${level}s`);

    if (!existsSync(dirPath)) {
      await mkdir(dirPath, { recursive: true });
    }

    const ls = await readdir(dirPath);
    let number = 1;

    if (ls.length > 0) {
      const sortedFiles = ls.sort(
        (a, b) => +b.split('.')[0] - +a.split('.')[0],
      );
      number = +sortedFiles[0].split('.')[0];
    }

    let filePath = resolve(dirPath, `${number}.app-${level}s.log`);
    if (!existsSync(filePath)) {
      await appendFile(filePath, '');
    }

    const stats = await stat(filePath, {});
    const fileSizeKb = (stats.size / 1024).toFixed(1);

    if (+fileSizeKb >= +process.env.LOG_FILE_MAX_SIZE_KB) {
      number++;

      if (number > 10) {
        // keep 10 files of logs
        await rm(`${dirPath}/${number - 5}.app-${level}s.log`);
      }
    }

    filePath = resolve(dirPath, `${number}.app-${level}s.log`);
    await appendFile(filePath, logEntry + '\n');
  }
}
