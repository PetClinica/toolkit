import winston from 'winston';
import { Logger } from './logger';

function getFormats() {
  const formats = new Array(winston.format.splat(), winston.format.timestamp());
  formats.push(
    process.env.ENV === 'local'
      ? winston.format.simple()
      : winston.format.json(),
  );
  return formats;
}

export const winstonLogger = winston.createLogger({
  level: process.env.LOG_LEVEL,
  format: winston.format.combine(...getFormats()),
  transports: [
    new winston.transports.Console({
      forceConsole: true,
    }),
  ],
});

export class WinstonLogger implements Logger {
  constructor(private readonly logger: winston.Logger) {}

  info(msg: string, ...args: any[]): void {
    this.logger.info(msg, ...args);
  }
  debug(msg: string, ...args: any[]): void {
    this.logger.debug(msg, ...args);
  }
  warn(msg: string, ...args: any[]): void {
    this.logger.warn(msg, ...args);
  }
  error(msg: string, error: Error): void {
    this.logger.error(`${msg}: ${error.message}`);
  }
}
