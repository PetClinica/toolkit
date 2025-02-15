# Toolkit

Tracer interface and implementations

## Usage

How to trace an execution:

```ts
import { trace } from "trace";

async function execute(): Promise<string> {
  return Promise.resolve("hello");
}

async function main() {
  const result: string = await trace("trace-name", async () => {
    return await execute();
  });
  console.log(result); // prints hello
}

main();
```

How to set a new tracer implementation:

```ts
import { setTrace, Trace } from 'trace';

class MyTrace implements Trace {
  ... // implement the methods here
}

setTrace((name: string, parent: Trace | null) => {
  return MyTrace(name, parent)
})
```
