export interface Logger {
  info(msg: string, ...args: any[]): void;
  debug(msg: string, ...args: any[]): void;
  warn(msg: string, ...args: any[]): void;
  error(msg: string, error: Error): void;
}

class DefaultLogger implements Logger {
  info(msg: string, ...args: any[]): void {
    console.info(msg, ...args);
  }
  debug(msg: string, ...args: any[]): void {
    console.debug(msg, ...args);
  }
  warn(msg: string, ...args: any[]): void {
    console.warn(msg, ...args);
  }
  error(msg: string, error: Error): void {
    console.error(msg, error);
  }
}

let logger: Logger = new DefaultLogger();

export function getLogger(): Logger {
  return logger;
}

export function setLogger(newLogger: Logger) {
  logger = newLogger;
}
