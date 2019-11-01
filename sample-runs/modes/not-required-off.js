const { buildYup } = require("../../src");

let valid;
const message = {
  title: "users",
  type: "object",
  properties: {
    username: { type: "string" }
  }
};
try {
  const yupSchema = buildYup(message, {
    mode: {
      notRequired: "off"
    },
    errMessages: {
      username: {
        required: "User is required"
      }
    }
  });
  valid = yupSchema.validateSync({
    foo: "dfds"
  });
  // should not print
  console.log("required", { valid }, yupSchema);
  console.log(...yupSchema.fields.username.tests);
} catch (e) {
  console.log(e);
  if (e.errors) {
    valid = e.errors[0];
    console.log("required", { msg: valid });
  }
}
