export class TypeHandlerConfig {
  enabled = [];
  extends = [];
  convert = {};
}

export class YupBuilderConfig extends TypeHandlerConfig {
  boolean = new TypeHandlerConfig();
  string = new TypeHandlerConfig();
  number = new TypeHandlerConfig();
  object = new TypeHandlerConfig();
  array = new TypeHandlerConfig();
  date = new TypeHandlerConfig();
  mixed = new TypeHandlerConfig();

  createCustomConstraintBuilder = (typeHandler, config) => {};
  createErrorMessageHandler = (typeHandler, config) => {};
  validationErrorMessage = (msgName, typeHandler) => {};
  createWhenCondition = (opts) => {};

  isBoolean = (obj) => {
    return false;
  };
  isDate = (obj) => {
    return false;
  };
  isString = (obj) => {
    return false;
  };
  isNumber = (obj) => {
    return false;
  };
  isObject = (obj) => {
    return false;
  };

  format = false;
  schemaParserMap = {};
  messages = {};
  mode = {};
  mixedEnabled = {};
  locale = "en";
  schemaType = "json-schema";
  logging = false;
  logTypes = [];
  logDetailed = [];
  warnOnInvalid = false;
  buildProp;
  types = {};
  typeHandlers = {};
  multiArgsValidatorMethods = {};
  errMessageKey = "errMessage";
  errMessagesMapKey = "errMessages";
  schemaParserMap = {};
  createPropertyValueHandler = (opts, config) => {};
  buildProperties = (obj) => {};
  getProps = (obj) => {};
  getType = (obj) => {};
  getName = (obj) => {};
  isRequired = (value) => {};
  setRequired = (value, key, required) => {};
  setPropEntry = (propObj, key, value) => {};
  getConstraints = (value) => {};
  buildYup = (schema, config, parentNode) => {};
  toMultiType = (multiPropertyValueResolver) => {};
  toSingleType = (singlePropertyValueResolver) => {};
  init = (schema, config) => {};
  createYupSchemaEntry = (opts) => {};
}
