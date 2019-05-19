import { SchemaEntryWalker } from "../entry";
import { util } from "@schema-validator/core";
const { isFunction, isObject, isObjectType } = util;
export { isObject };

export function toObject(obj) {
  return isObject(obj) && ObjectSchemaEntryWalker.create(obj).walk();
}

// Allow recursive schema
export class ObjectSchemaEntryWalker extends SchemaEntryWalker {
  config: any;
  properties: any;
  typeNameFor: (obj: any) => string;
  objTypeName: string;
  result: any;

  constructor(opts, config = {}) {
    super(opts, config);
    this.properties = this.entry.properties;
    this.typeNameFor = this.config.typeNameFor;
    this.objTypeName = this.entry.typeName || this.entry.className;
  }

  get children() {
    return this.properties || [];
  }

  get baseType() {
    return "object";
  }

  get typeName() {
    return "object";
  }

  static create(obj) {
    return new ObjectSchemaEntryWalker(obj).init();
  }

  createMappingResult() {
    return this.shouldBuildValueMapping
      ? this.buildObjectValueMapping()
      : this.defaultObjectValueMapping;
  }

  get shouldBuildValueMapping() {
    return this.hasProperties && !this.wasCacheHit;
  }

  createResult() {
    const mapping = this.createMappingResult();
    const props = mapping.properties;
    return Object.keys(props).reduce((acc, key) => {
      if (key === "_type_") return acc;
      acc[key] = props[key];
      return acc;
    }, {});
  }

  buildObjectValueMapping() {
    const { buildProperties } = this.config;
    return buildProperties(this.objectValue, this.recursiveConfig);
  }

  get incNestingLevel() {
    let nestingLevel = this.config.nestingLevel || 0;
    return nestingLevel++;
  }

  get recursiveConfig() {
    return {
      result: this.result,
      name: this.key,
      nestingLv: this.incNestingLevel,
      nested: true,
      ...this.config
    };
  }

  get resolvedTypeName() {
    return this.objTypeName || this.resolveConfigTypeName(this.key);
  }

  resolveConfigTypeName(name) {
    return isFunction(this.typeNameFor) && this.typeNameFor(name);
  }

  get objectValue() {
    return {
      wasCacheHit: this.wasCacheHit,
      parentName: this.key,
      typeName: this.resolvedTypeName,
      ...this.entry
    };
  }

  get defaultObjectValueMapping() {
    return {};
  }

  get hasProperties() {
    return isObjectType(this.properties);
  }
}
