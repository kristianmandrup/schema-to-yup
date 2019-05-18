import { MappingBaseType } from "../base";
import { isFunction, isObject, isObjectType } from "../util";
export { isObject };

export function toObject(obj) {
  return isObject(obj) && ObjectEntry.create(obj).convert();
}

// Allow recursive schema
export class ObjectEntry extends MappingBaseType {
  properties: any;
  typeNameFor: (obj: any) => string;
  objTypeName: string;

  constructor(opts, config = {}) {
    super(opts, config);
    this.properties = this.value.properties;
    this.typeNameFor = this.config.typeNameFor;
    this.objTypeName = this.value.typeName || this.value.className;
  }

  get baseType() {
    return "object";
  }

  get typeName() {
    return "object";
  }

  static create(obj) {
    return new MappingObject(obj).init();
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
    return buildProperties(this.objectValue, this.mappingConfig);
  }

  get incNestingLevel() {
    let nestingLevel = this.config.nestingLevel || 0;
    return nestingLevel++;
  }

  get mappingConfig() {
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
      ...this.value
    };
  }

  get defaultObjectValueMapping() {
    return {};
  }

  get hasProperties() {
    return isObjectType(this.properties);
  }
}
