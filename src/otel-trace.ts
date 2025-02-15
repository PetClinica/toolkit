import { trace } from "@opentelemetry/api";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { ZipkinExporter } from "@opentelemetry/exporter-zipkin";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { TracerProvider } from "./trace";

export type TraceConfig = {
  url: string;
  serviceName: string;
}

function config(cfg: TraceConfig) {
  const sdk = new NodeSDK({
    serviceName: cfg.serviceName,
    traceExporter: new ZipkinExporter({ url: cfg.url, serviceName: cfg.serviceName }),
    instrumentations: [getNodeAutoInstrumentations()],
  })
  sdk.start();
}

export class OtelTracerProvider implements TracerProvider {
  private readonly tracer

  constructor(private readonly cfg : TraceConfig) {
    config(this.cfg);
    this.tracer = trace.getTracer(this.cfg.serviceName);
  }

  trace<T>(name: string, fn: () => Promise<T>): Promise<T> {
    return this.tracer.startActiveSpan(name, async (span) => {
      try {
        return await fn();
      } catch (err: any) {
        span.recordException(err);
        return await Promise.reject(err);
      } finally {
        span.end();
      }
    });
  }
}
