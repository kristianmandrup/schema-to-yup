export class PropertyNormalizer {
  normalizeRequired() {
    const properties = {
      ...this.properties
    };
    const required = [...this.required] || [];
    const keys = Object.keys(properties);

    return keys.reduce((acc, key) => {
      const value = properties[key];
      const isRequired = required.indexOf(key) >= 0;
      if (isObjectType(value)) {
        value.required = this.isRequired(value) || isRequired;
      } else {
        this.warn(`Bad value: ${value} must be an object`);
      }

      acc[key] = value;
      return acc;
    }, {});
  }

  isRequired(value) {
    return this.config.isRequired(value);
  }
}
