const ifThenSchema = {
  type: "object",
  properties: {
    foo: {
      type: "string"
    },
    bar: {
      type: "string"
    }
  },
  if: {
    properties: {
      foo: {
        enum: ["bar"]
      }
    },
    required: ["foo"]
  },
  then: {
    required: ["bar"]
  }
};

const ifThenElseSchema = {
  type: "object",
  properties: {
    foo: {
      type: "string"
    },
    bar: {
      type: "string"
    }
  },
  if: {
    properties: {
      foo: {
        enum: ["bar"]
      }
    },
    required: ["foo"]
  },
  then: {
    required: ["bar"]
  },
  else: false
};

describe("if then", () => {});

describe("if then else", () => {});
