import { Loggable } from "./types/_loggable";
import defaults from "./defaults";

export class Base extends Loggable {
  constructor(config = {}) {
    super(config);
    // config = {
    //   createYupSchemaEntry,
    //   ...config
    // };
    const schemaType = config.schemaType || "json-schema";
    const $defaults = defaults[schemaType];
    this.config = { ...$defaults, ...config };
  }
}
