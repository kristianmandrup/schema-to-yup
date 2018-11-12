const { buildYup } = require("../");

let valid
test("yup inserts custom messages", () => {
  const message = {
    title: "users",
    type: "object",
    required: ["username"],
    properties: {
      username: { type: "string", matches: "foo" },
    }
  };

  const config = {
    errMessages: {
      username: {
        required: 'User is required',
        matches: 'User must be foo'
      }
    }
  }
  try {
    const yupSchema = buildYup(message,config);
    valid = yupSchema.validateSync({
      //username: ''
      foo: 'dfds'
    });
  } catch(e) {
    valid = e.errors[0];
  }
  expect(valid).toBe('User is required');
})


