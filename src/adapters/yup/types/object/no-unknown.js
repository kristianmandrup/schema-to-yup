export class NoUnknown {
  apply() {
    const { noUnknown, propertyNames } = this.value;
    const names = noUnknown || propertyNames;

    if (!names) return this;

    const errMsg = this.errMsgOneOf("noUnknown", "propertyNames");
    const typeInstance = this.typeInstance.noUnknown(names, errMsg);

    this.applyToTypeInstance(typeInstance);
    return this;
  }
}
