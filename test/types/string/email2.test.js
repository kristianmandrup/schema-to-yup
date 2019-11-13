import { buildYup } from "./_helpers";

describe("string: email", () => {
  let valid;
  let message = {
    title: "email",
    type: "object",
    properties: {
      email: {
        type: "string",
        format: "email"
      }
    }
  };
  let config = {
    errMessages: {
      email: "Email format incorrect"
    }
  };

  // Below test fails
  // Expects "Email format incorrect" but returns "email must be a valid email"
  it("yup inserts custom messages for email format", () => {
    try {
      const yupSchema = buildYup(message, config);
      valid = yupSchema.validateSync({ email: "as" });
    } catch (e) {
      // console.log(e);
      valid = e.errors[0];
    }
    expect(valid).toBe(config.errMessages.email);
  });
});
