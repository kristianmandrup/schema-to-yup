import { ErrorMessageHandler } from "../../error-message-handler";
import { Loggable } from "./_loggable";

export class TypeErrorHandler extends Loggable {
  constructor(handler, opts = {}) {
    super(opts)
    this.handler = handler
    this.init()
  }

  init() {
    const { config } = this;
    const errorMessageHandlerFactoryFn =
      this.config.createErrorMessageHandler || this.createErrorMessageHandler;

    this.errorMessageHandler = errorMessageHandlerFactoryFn(this, config);
  }

  createErrorMessageHandler(typeHandler, config = {}) {
    return new ErrorMessageHandler(typeHandler, config);
  }

  valErrMessage(msgName) {
    return this.errorMessageHandler.valErrMessage(msgName);
  }

  valErrMessageOr(...msgNames) {
    for (name of msgNames) {
      const errMsg = this.valErrMessage(msgName)
      if (errMsg) return errMsg
    }
  }

  message() {
    return config.messages[this.key] || config.messages[this.type] || {};
  }

  errMessage(errKey = "default") {
    return this.message[errKey] || "error";
  }

  errorMsg(msg) {
    this.throwError(msg);
  }

  error(name, msg) {
    const label = `[${name}]`;
    const fullMsg = [label, msg].join(" ");
    this.errorMsg(fullMsg);
  }

  // throw ConvertYupSchemaError(fullMsg);
  throwError(msg) {
    throw msg;
  }
}
