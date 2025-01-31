import winston from 'winston';
import { Logger } from './logger';
export declare const winstonLogger: winston.Logger;
export declare class WinstonLogger implements Logger {
    private readonly logger;
    constructor(logger: winston.Logger);
    info(msg: string, ...args: any[]): void;
    debug(msg: string, ...args: any[]): void;
    warn(msg: string, ...args: any[]): void;
    error(msg: string, error: Error): void;
}
