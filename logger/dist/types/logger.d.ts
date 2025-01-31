export interface Logger {
    info(msg: string, ...args: any[]): void;
    debug(msg: string, ...args: any[]): void;
    warn(msg: string, ...args: any[]): void;
    error(msg: string, error: Error): void;
}
export declare function getLogger(): Logger;
export declare function setLogger(newLogger: Logger): void;
