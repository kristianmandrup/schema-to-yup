import { TypeMatcher } from "./_type-matcher";

class Guard extends TypeMatcher {
  constructor(obj, config) {
    super(config);
    this.obj = obj;
  }

  isValid() {
    return false;
  }

  verify() {
    return this.isPresent(this.obj) && this.isValid(this.obj);
  }
}

export { Guard };
