export class ItemsOf {
  constructor() {}

  itemsOf() {
    const { items, itemsOf } = this.constraints;
    const $of = items || itemsOf || this.constraints.of;

    if (this.isNothing($of)) return;

    if (Array.isArray($of)) {
      this.error("itemsOf", "does not (yet) support an Array of schemas");
      return;
    }

    if (!this.isObjectType($of)) {
      this.error("itemsOf", `must be a schema object, was ${typeof $of}`);
      return;
    }

    if (!this.createYupSchemaEntry) {
      this.warn(
        "missing createYupSchemaEntry in config, needed for recursive validation"
      );
      return;
    }

    try {
      const schemaConf = {
        key: this.key,
        value: $of,
        config: this.config
      };

      const schemaEntry = this.createYupSchemaEntry(schemaConf);

      return this.addConstraint("of", {
        value: schemaEntry,
        propValue: $of
      });
    } catch (ex) {
      this.error("itemsOf: Error", ex);
    }
    return this;
  }
}
