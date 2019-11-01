const { buildYup } = require("../");

const userSchema = {
  title: "users",
  type: "object",
  properties: {
    username: { type: "string", required: true, email: true },
    // last_name: { type: "string", required: false }
    last_name: { type: "string" }
  }
};

test.only("yup validates valid json to return true - error messages", done => {
  const yupSchema = buildYup(userSchema, {
    err: msg => console.error(`ERROR: ${msg}`)
  });
  const { fields } = yupSchema;

  console.log({ fields });
  const { username, last_name } = fields;
  console.log("username", username.tests);
  console.log("last_name", last_name && last_name.tests);

  yupSchema
    .validate({
      username: "mike"
    })
    .then(valid => {
      console.log({ valid });
      expect(valid).toBeTruthy();
      done();
    })
    .catch(err => {
      const { errors, name } = err;
      console.log("ERRORS", { err, errors, name });
      expect(errors[0]).toBeFalsy();
      done();
    });
});

test("yup validates invalid json (required missing) to return false", () => {
  const yupSchema = buildYup(userSchema);
  const valid = yupSchema.isValidSync({
    first_name: "mike"
  });
  expect(valid).toBe(false);
});
