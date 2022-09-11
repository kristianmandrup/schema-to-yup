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
    if (!value.errMessage) return;
    const valueKey = this.errMessageKey;
    const errMessageMap = this.errMessageMap(value);
    errMessageMap[this.key] = value[valueKey] || errMessageMap[this.key];
    return this;
  }

  validationErrorMessage(msgName) {
    const { constraints, key, description, title } = this;
    const errMsg = this.errMessageFor(msgName);
    return typeof errMsg === "function"
      ? errMsg(constraints, { key, title, description })
      : errMsg;
  }

  errMessageFor(msgName) {
    const { errMessages, key } = this;
    const errMsg = errMessages[key];
    return errMsg ? errMsg[msgName] : errMessages[`$${msgName}`];
  }
}
