# Logger

Logger interface and implementations

## Usage

How to get and use the logger:

```ts
import { getLogger } from "logger";

const world = "world";
getLogger().debug("Hello %s", world);
getLogger().info("Hello %s", world);
getLogger().warn("Hello %s", world);
getLogger().error("Error", new Error("world"));
```

How to set a new logger implementation:

```ts
import { setLogger, Logger } from 'logger';

class MyLogger implements Logger {
  ... // implement the methods here
}

setLogger(new MyLogger());
```
