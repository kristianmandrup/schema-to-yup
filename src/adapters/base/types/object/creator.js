class InstanceCreator {
  constructor() {}

  create() {
    if (!this.properties) return this;
    this.noUnknown();
    this.camelCase();
    this.constantCase();

    const schema = this.value;
    const config = this.config;

    // recursive definition
    if (schema) {
      if (!config.buildYup) {
        this.error("convert", "Missing buildYup function from config", config);
      }

      const yupSchema = this.config.buildYup(schema, config);
      this.base = yupSchema;
    }
    return this;
  }
}
