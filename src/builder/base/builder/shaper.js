class Shaper {
  toShape({ name }) {
    const properties = {
      ...this.properties
    };
    const keys = Object.keys(properties);

    return keys.reduce((acc, key) => {
      const value = properties[key];
      const instanceEntry = this.propToInstanceEntry({
        name,
        key,
        value
      });
      this.logInfo("propsToShape", { key, instanceEntry });
      acc[key] = instanceEntry;
      return acc;
    }, {});
  }
}
