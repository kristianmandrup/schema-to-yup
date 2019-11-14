import { buildYup } from "./_helpers";

describe("string: email", () => {
  let valid;
  let message = {
    title: "email",
    type: "object",
    properties: {
      emailAdr: {
        type: "string",
        format: "email"
      }
    }
  };
  const errMsg = "Email format incorrect";

  let config = {
    errMessages: {
      emailAdr: {
        format: errMsg
      }
    }
  };

  // Below test fails
  // Expects "Email format incorrect" but returns "email must be a valid email"
  it("yup inserts custom messages for email format", () => {
    try {
      const yupSchema = buildYup(message, config);
      valid = yupSchema.validateSync({ emailAdr: "xx" });
    } catch (e) {
      // console.log(e);
      valid = e.errors[0];
    }
    expect(valid).toBe(errMsg);
  });
});
