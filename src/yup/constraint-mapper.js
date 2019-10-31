class ConstraintMapper {
  get base() {
    return {
      oneOf: "oneOf",
      enum: "oneOf",
      anyOf: "oneOf"
      // ... TODO: add more to cover all mixed aliases
    };
  }

  get string() {
    return {};
  }

  get number() {
    return {};
  }
}
