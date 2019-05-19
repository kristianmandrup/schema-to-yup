import {
  Loggable,
  isFunction,
  isStringType,
  isObjectType,
  isArrayType
} from "@schema-validator/core";

export class SchemaEntryError extends Error {}

export const createSchemaEntry = (obj, config = {}) =>
  new SchemaEntry(obj, config);

export class SchemaEntry extends Loggable {
  parentName: string;
  key: string;
  value: any;
  type: any;
  typeMappers: any;
  typeOrder: string[];
  typeObjMapperFor: any;
  typeObj: any;

  constructor(opts: any, config: any = {}) {
    super(config);
    const { parentName, key, value } = opts;
    this.parentName = parentName;
    this.key = key;
    this.value = value;
    this.type = value.type;
    this.typeMappers = {
      ...this.defaults.typeMappers,
      ...(config.typeMappers || {})
    };
    this.typeOrder = config.typeOrder || this.defaults.typeOrder;
    this.typeObjMapperFor = config.typeObjMapperFor || chooseObjMapper;
  }

  typeMapperFor(type) {
    return this.typeMappers[type];
  }

  get defaultTypeOrder() {
    return ["string", "number", "boolean", "array", "object", "date"];
  }

  get isValidSchema() {
    return this.isValidStringSchemaType || this.isValidObjSchemaType;
  }

  get isValidStringSchemaType() {
    return isStringType(this.type);
  }

  get isValidObjSchemaType() {
    return isObjectType(this.type);
  }

  toEntry() {
    const type = this.type;
    if (!this.isValidSchema) {
      this.error("toEntry", `Not a valid schema: type ${type}`, {
        value: this.value
      });
    }
    return (
      this.toEntryStringType(type) ||
      this.toEntryArrayType(type) ||
      this.toEntryObjType(type)
    );
  }

  toEntryArrayType(type?: any) {
    if (!isArrayType(type)) return;
    return {};
  }

  toEntryObjType(type?: any) {
    if (!isObjectType(type)) return;
    type = type || this.type;
    if (!this.isValidObjSchemaType) {
      this.error("toEntryObjType", `Not a valid schema: type ${type}`, {
        value: this.value
      });
    }
    const keys = Object.keys(type);
    const key = keys[0];
    const mapperFn = this.typeObjMapperFor(key);
    if (!isFunction(mapperFn)) {
      this.error("toEntryObjType", `Invalid type obj key ${key}`, {
        mapperFn,
        key,
        typeObj: this.typeObj
      });
    }
    const foundValue = mapperFn(this.obj, { key: this.key, type });
    return foundValue;
  }

  toEntryStringType(type?: any) {
    if (!isStringType(type)) return;
    type = type || this.type;
    if (!this.isValidStringSchemaType) {
      this.error("toEntryStringType", `Not a valid schema: type ${type}`, {
        value: this.value
      });
    }
    let foundValue;
    this.typeOrder.find(type => {
      const typeFn = this.typeMapperFor(type);
      if (!typeFn) {
        this.info("toEntryStringType", `skipped ${type}`);
        return false;
      }
      if (!isFunction(typeFn)) {
        this.error("toEntryStringType", `Invalid type function ${type}`, {
          typeFn,
          type,
          typeOrder: this.typeOrder
        });
      }
      foundValue = typeFn(this.obj, this.key);
      return foundValue;
    });
    return foundValue || this.defaultTypeHandler(this.config);
  }

  get obj() {
    return {
      parentName: this.parentName,
      key: this.key,
      value: this.value,
      type: this.type,
      config: this.config
    };
  }

  defaultTypeHandler(config) {
    this.error("defaultTypeHandler", `No type matched for type: ${this.type}`, {
      obj: this.obj,
      config
    });
  }
}
