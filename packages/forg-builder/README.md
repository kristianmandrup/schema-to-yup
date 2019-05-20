# `@schema-validator/forg-builder`

Forg validator builder

## Usage

```ts
import { createForgBuilder } from "@schema-validator/forg-builder";

const onComplete = result => console.log("DONE", result);

const config = {
  onComplete
};

const forgBuilder = createForgBuilder(config);

// listen for onComplete of builder
```

The builder should be listening to events carrying constraint information that trigger it to build an internal model. It should then receive an `onComplete` event (no more constraints to be found), which it can delegate to whoever is listening for the builder to finish. This is the async model.

Alternatively call the internal build methods directly with constraints (synchronous model).
