import { TypeMatcher } from "./types/_type-matcher";

export class ErrorMessageHandler extends TypeMatcher {
  constructor(typeHandler, config = {}) {
    super(config);
    this.typeHandler = typeHandler;
    this.init();
  }

  init() {
    const { typeHandler } = this;
    this.constraints = typeHandler.constraints;
    this.errMessages = typeHandler.errMessages;
    this.key = typeHandler.key;
    this.value = typeHandler.value; // raw type constraints
    this.constraints = typeHandler.constraints; // type constraints (possibly filtered)
    this.parentNode = typeHandler.parentNode;
    this.keyPath = typeHandler.keyPath;
    this.type = typeHandler.type;
    this.description = typeHandler.description;
    this.title = typeHandler.title;
    this.setErrMessage();
  }

  errMessageMap(value = {}) {
    const key = this.errMessagesMapKey;
    return value[key] || this.errMessages;
  }

  get errMessageKey() {
    return this.config.errMessageKey || "errMessage";
  }

  get errMessagesMapKey() {
    return this.config.errMessagesMapKey || "errMessages";
  }

  setErrMessage() {
    const { typeHandler } = this;
    const { value } = typeHandler;
    if (!value.errMessage && !value.errMessages) return;
    const valueKey = this.errMessageKey;
    this.errMessages = { [this.key]: this.errMessageMap(value)};
    return;
  }

  validationErrorMessage(msgName) {
    const {
      constraints,
      key,
      description,
      title,
      typeHandler,
      keyPath,
      parentNode,
    } = this;
    const errMsg = this.errMessageFor(msgName);
    return typeof errMsg === "function"
      ? errMsg(constraints, {
          key,
          title,
          description,
          typeHandler,
          parentNode,
          keyPath,
        })
      : errMsg;
  }

  errMessageFor(msgName) {
    const { errMessages, key } = this;
    const errMsg = errMessages[key];
    return errMsg ? errMsg[msgName] : errMessages[`$${msgName}`];
  }
}
