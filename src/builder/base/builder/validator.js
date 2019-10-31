class BuilderValidator {
  // throws if invalid
  validate() {
    this.validateType();
    this.validateProperties();
  }

  validateType(type) {
    type = type || this.type;
    if (!isObject(type)) {
      this.error(`invalid schema: must be type: "object", was type: ${type}`);
    }
  }

  validateProperties(properties) {
    properties = properties || this.properties;
    if (!isObjectType(properties)) {
      this.error(`invalid schema: must have a properties object`, properties);
    }
  }
}
