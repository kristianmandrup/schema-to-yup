const { Base } = require("./base");

class Guard extends Base {
  constructor(obj, config) {
    super(config);
    this.obj = obj;
  }

  isValid() {
    return false;
  }

  verify() {
    return !this.isNothing() && this.isValid(this.obj);
  }
}

module.exports = {
  Guard
};
