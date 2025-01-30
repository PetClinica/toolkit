import { Logger } from "../logger/logger";

export type LogCall = {
    msg: string,
    args: string[]
}

export class TestLogger implements Logger {
    private calls: LogCall[] = [];

    debug(msg: string, ...args: any[]) {
        this.log(msg, ...args);
    }
    info(msg: string, ...args: any[]) {
        this.log(msg, ...args);
    }
    warn(msg: string, ...args: any[]) {
        this.log(msg, ...args);
    }
    error(msg: string, ...args: any[]) {
        this.log(msg, ...args);
    }

    private log(msg: string, ...args: any[]) {
        this.calls.push({msg, args});
        console.log(msg, ...args);
    }

    getCalls(): LogCall[] {
        return Array.from(this.calls);
    }

    reset() {
        this.calls = [];
    }
}