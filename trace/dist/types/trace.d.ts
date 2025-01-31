export interface Trace {
    start(): void;
    end(): void;
    getParent(): Trace | null;
    getName(): string;
}
export declare function setTrace(fn: (name: string, parent: Trace | null) => Trace): void;
export declare function trace<T>(name: string, fn: () => Promise<T>): Promise<T>;
