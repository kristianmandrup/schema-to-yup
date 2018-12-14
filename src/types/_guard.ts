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
    return this.isPresent(this.obj) && this.isValid(this.obj);
  }
}

module.exports = {
  Guard
};
