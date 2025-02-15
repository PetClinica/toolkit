import { trace } from "@opentelemetry/api";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { ZipkinExporter } from "@opentelemetry/exporter-zipkin";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { BatchSpanProcessor, SimpleSpanProcessor, SpanProcessor } from "@opentelemetry/sdk-trace-node";
import { PrismaInstrumentation } from "@prisma/instrumentation";
import { TracerProvider } from "./trace";

export type TraceConfig = {
  url: string;
  serviceName: string;
  prismaInstrumentation: boolean;
  batchProcessor?: boolean
}

export type ShutdownFunc = () => Promise<void>

let serviceName = "service"

export function configOtel(cfg: TraceConfig): ShutdownFunc {
  const exporter = new ZipkinExporter({ url: cfg.url, serviceName: cfg.serviceName })

  let processor: SpanProcessor = new BatchSpanProcessor(exporter);
  if (!cfg.batchProcessor) {
    processor = new SimpleSpanProcessor(exporter);
  }

  serviceName = cfg.serviceName;
  const sdk = new NodeSDK({
    serviceName: cfg.serviceName,
    spanProcessors: [processor],
    instrumentations: [
      new PrismaInstrumentation({
        enabled: cfg.prismaInstrumentation,
        middleware: cfg.prismaInstrumentation
      }),
      ...getNodeAutoInstrumentations()
    ],
  })
  sdk.start();

  return async () => {
    await sdk.shutdown();
  }
}

export class OtelTracerProvider implements TracerProvider {
  private readonly tracer

  constructor() {
    this.tracer = trace.getTracer(serviceName);
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
