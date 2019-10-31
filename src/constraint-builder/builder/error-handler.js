export class ErrorHandlerBuilder {
  createErrorFn({ constraintName, errorName }) {
    return (
      this.getErrorMessageFnFor(constraintName) ||
      (errorName && this.getErrorMessageFnFor(errorName))
    );
  }

  getErrorMessageFnFor(name) {
    const errorMessageMap = this.errMessages[this.key];
    const errorMsgOrHandler = errorMessageMap && errorMessageMap[name];
    if (!errorMsgOrHandler) return;
    return typeof errorMsgOrHandler === "function"
      ? errorMsgOrHandler
      : () => errorMsgOrHandler;
  }
}
