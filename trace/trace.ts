import * as cls from 'cls-hooked';
import { getLogger } from '../logger/logger';

const namespace = cls.createNamespace('trace');

export interface Trace {
    start(): void;
    end(): void;
    getParent(): Trace | null;
    getName(): string;
}

let traceFactory: (name: string, parent: Trace | null) => Trace = (name, parent) => new NoopTrace(name, parent);

export function setTrace(fn: (name: string, parent: Trace | null) => Trace) {
    traceFactory = fn;
}

export async function trace<T>(name: string, fn: () => Promise<T>): Promise<T> {
    getLogger().debug("[%s] Starting trace", name);
    let trace: Trace;

    const parent = namespace.get('trace') as Trace;
    getLogger().debug("[%s] Parent: %s", name, parent?.getName());
    trace = traceFactory(name, parent);

    return namespace.runAndReturn(async () => {
        namespace.set('trace', trace);
        trace.start();
        try {
            return await fn();
        } finally {
            trace.end();
            namespace.set('trace', trace.getParent()); // Set back to parent segment
        }
    });
}

class NoopTrace implements Trace {
    constructor(private readonly name: string, private readonly parent: Trace | null) {}

    start(): void {
        getLogger().info("starting trace", this.name);
    }

    end(): void {
        getLogger().info("ending trace", this.name);
    }

    getParent(): Trace | null {
        return this.parent;
    }

    getName(): string {
        return this.name;
    }
}