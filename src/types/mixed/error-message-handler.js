import { TypeMatcher } from "../_type-matcher";

export class ErrorMessageHandler extends TypeMatcher {
  constructor(typeHandler, config = {}) {
    super(config);
    this.typeHandler = typeHandler;
    this.constraints = typeHandler.constraints;
    this.errMessages = typeHandler.errMessages;
    this.key = typeHandler.key;
    this.type = typeHandler.type;
  }

  valErrMessage(msgName) {
    const { constraints } = this;
    const errMsg = this.errMessageFor(msgName);
    return typeof errMsg === "function" ? errMsg(constraints) : errMsg;
  }

  errMessageFor(msgName) {
    const { errMessages, key } = this;
    const errMsg = errMessages[key];
    return errMsg ? errMsg[msgName] : errMessages[`$${msgName}`];
  }
}
