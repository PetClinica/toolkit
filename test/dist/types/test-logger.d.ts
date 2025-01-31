import { Logger } from "../../logger/src/logger";
export type LogCall = {
    msg: string;
    args: string[];
};
export declare class TestLogger implements Logger {
    private calls;
    debug(msg: string, ...args: any[]): void;
    info(msg: string, ...args: any[]): void;
    warn(msg: string, ...args: any[]): void;
    error(msg: string, ...args: any[]): void;
    private log;
    getCalls(): LogCall[];
    reset(): void;
}
