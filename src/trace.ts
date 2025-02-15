export interface TracerProvider {
    trace<T>(name: string, fn: () => Promise<T>): Promise<T>
}

export class NoopTracerProvider implements TracerProvider {
    trace<T>(name: string, fn: () => Promise<T>): Promise<T> {
        return fn();
    }
}

let tracerProvider: TracerProvider = new NoopTracerProvider();

export function setTrace(provider: TracerProvider) {
    tracerProvider = provider;
}

export function trace<T>(name: string, fn: () => Promise<T>): Promise<T> {
    return tracerProvider.trace(name, fn);
}
