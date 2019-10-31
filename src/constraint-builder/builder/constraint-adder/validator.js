export class ConstraintEntryValidator {
  constructor(opts = {}) {
    const { constraintEntryForKey, key } = opts;
    this.ctx = opts;
    this.key = key;
    this.constraintEntryForKey = constraintEntryForKey;
  }

  validate() {
    this.validateEntryPresent();
    this.validateEntryIsList();
  }

  validateEntryPresent() {
    if (!constraintEntryForKey) {
      this.error(
        `validateEntryPresent: missing constraintsMap entry for ${key}`,
        this.ctx
      );
    }
  }

  validateEntryIsList() {
    if (!Array.isArray(list)) {
      this.error(
        `validateEntryIsList: constraintsMap entry for ${key} is not a list`,
        ctx
      );
    }
  }
}
