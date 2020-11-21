import defaults from "./defaults";
import { Loggable } from "./_loggable";

class Base extends Loggable {
  constructor(config = {}) {
    super(config);
    const schemaType = config.schemaType || "json-schema";
    const $defaults = defaults[schemaType];
    this.config = { ...$defaults, ...config };
  }

  setClassMap(defaults) {
    const { config } = this
    const classMap = config && config.classMap
    this.classMap = {
      ...defaults.classMap,
      ...classMap || {}
    }
  }
}

export { Base };
