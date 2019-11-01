const { buildYup } = require("../src");

let valid;

const message = {
  title: "users",
  type: "object",
  required: ["amazon"],
  properties: {
    amazon: { type: "string", pattern: /(foo|bar)/ }
  }
};

try {
  const yupSchema = buildYup(message, {
    errMessages: {
      amazon: {
        pattern: "Pattern must be foo or bar"
      }
    }
  });
  valid = yupSchema.validateSync({
    amazon: "dfds"
  });
  // should not print
  console.log("pattern", { valid }, yupSchema);
} catch (e) {
  console.log(e);
  if (e.errors) {
    valid = e.errors[0];
    console.log("pattern message", { msg: valid });
  }
}
