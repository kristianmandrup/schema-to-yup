const { buildYup } = require("../../../schema-to-yup");

let valid;
test("yup inserts custom messages for required fields", () => {
  const message = {
    title: "users",
    type: "object",
    required: ["username"],
    properties: {
      username: { type: "string", matches: "foo" }
    }
  };
  const config = {
    errMessages: {
      username: {
        required: "User is required",
        matches: "User must be foo"
      }
    }
  };
  try {
    const yupSchema = buildYup(message, config);
    valid = yupSchema.validateSync({
      foo: "dfds"
    });
  } catch (e) {
    valid = e.errors[0];
  }
  expect(valid).toBe("User is required");
});
test("yup inserts custom messages for regex fields", () => {
  const message2 = {
    title: "users",
    type: "object",
    required: ["amazon"],
    properties: {
      amazon: { type: "string", pattern: /(foo|bar)/ }
    }
  };
  const config = {
    errMessages: {
      amazon: {
        pattern: "Pattern must be foo or bar"
      }
    }
  };
  try {
    const yupSchema = buildYup(message2, config);
    valid = yupSchema.validateSync({
      amazon: "dfds"
    });
  } catch (e) {
    valid = e.errors[0];
  }
  expect(valid).toBe("Pattern must be foo or bar");
});
