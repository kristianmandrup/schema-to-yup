import defaults from "./defaults";
import { Loggable } from "./_loggable";

class Base extends Loggable {
  constructor(config = {}) {
    super(config);
    const schemaType = config.schemaType || "json-schema";
    const $defaults = defaults[schemaType];
    this.config = { ...$defaults, ...config };
  }
}

export { Base };
