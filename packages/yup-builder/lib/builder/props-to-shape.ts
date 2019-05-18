import { Loggable } from "@schema-validator/core";

export class TransformProps extends Loggable {
  name: string;
  properties: any;

  constructor({ properties, name, config }: any = {}) {
    super(config);
    this.name = name;
    this.properties = properties;
  }

  toShape() {
    const { properties } = this;
    const keys = Object.keys(properties);
    return keys.reduce((acc, key) => {
      // this.logInfo("propsToShape", {
      //   key
      // });
      const value = properties[key];
      const yupSchemaEntry = this.propToValidatorSchemaEntry({
        name,
        key,
        value
      });
      this.logInfo("propsToShape", { key, yupSchemaEntry });
      acc[key] = yupSchemaEntry;
      return acc;
    }, {});
  }

  propToValidatorSchemaEntry({ name, key, value = {} }) {
    const entryBuilder =
      this.createSchemaEntry || this.config.createYupSchemaEntry;
    return entryBuilder({ name, key, value, config: this.config });
  }

  createSchemaEntry(opts: any = {}) {
    const { config } = this;
    const { createSchemaEntry } = this;
    if (!createSchemaEntry) {
      this.error(
        "createSchemaEntry",
        "missing createSchemaEntry on config",
        config
      );
    }

    return config.createSchemaEntry(opts);
  }
}
