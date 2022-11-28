export interface TypeHandlerConfig {
  enabled?: string[];
  extends?: string[];
  convert?: object;
}

export interface YupBuilderConfig extends TypeHandlerConfig {
  boolean?: TypeHandlerConfig;
  string?: TypeHandlerConfig;
  number?: TypeHandlerConfig;
  object?: TypeHandlerConfig;
  array?: TypeHandlerConfig;
  date?: TypeHandlerConfig;
  mixed?: TypeHandlerConfig;
  createCustomConstraintBuilder?: (typeHandler: any, config: any) => any;
  createErrorMessageHandler?: (typeHandler: any, config: any) => any;
  validationErrorMessage?: (msgName: any, typeHandler: any) => void;
  createWhenCondition?: (opts: any) => void;
  isBoolean?: (obj: any) => boolean;
  isDate?: (obj: any) => boolean;
  isString?: (obj: any) => boolean;
  isNumber?: (obj: any) => boolean;
  isObject?: (obj: any) => boolean;
  format?: boolean;
  dependenciesMap?: object;
  schemaParserMap?: object;
  messages?: object;
  mode?: object;
  mixedEnabled?: object;
  locale?: string;
  schemaType?: string;
  logging?: boolean;
  logTypes?: string[];
  logDetailed?: object[];
  warnOnInvalid?: boolean;
  types?: object;
  typeHandlers?: object;
  multiArgsValidatorMethods?: object;
  errMessageKey?: string;
  errMessagesMapKey?: string;
  buildProp?: (propObj, key) => object;
  createPropertyValueHandler?: (opts: any, config: any) => object;
  buildProperties?: (obj: any) => object;
  getProps?: (obj: any) => object[];
  getType?: (obj: any) => string;
  getName?: (obj: any) => string;
  isRequired?: (value: any) => boolean;
  setRequired?: (value: any, key: any, required: any) => void;
  setPropEntry?: (propObj: any, key: any, value: any) => void;
  getConstraints?: (value: any) => object[];
  buildYup?: (schema: any, config: any, parentNode: any) => object;
  toMultiType?: (multiPropertyValueResolver: any) => object;
  toSingleType?: (singlePropertyValueResolver: any) => object;
  init?: (schema: any, config: any) => void;
  createYupSchemaEntry?: (opts: any) => object;
}
