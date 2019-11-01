const { buildYup } = require("../");

const userSchema = {
  title: "users",
  type: "object",
  properties: {
    username: { type: "string", required: true, email: true },
    first_name: { type: "string" },
    last_name: { type: "string", notRequired: true },
    // nothing: {},
    level: { type: "number" },
    age: { type: "number", notRequired: true }
  }
};

test.only("yup validates valid json to return true - error messages", done => {
  try {
    const yupSchema = buildYup(userSchema, {
      err: msg => console.error(`ERROR: ${msg}`)
    });
    const { fields } = yupSchema;

    console.log({ fields });
    const { username, first_name, last_name, age, level } = fields;
    console.log("username", username.tests);
    console.log("last_name", last_name && last_name.tests);
    console.log("first_name", first_name && first_name.tests);
    console.log("age", age.tests);
    console.log("level", level.tests);
    // console.log("nothing", nothing && nothing.tests);

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
  } catch (e) {
    console.error(e);
    done();
  }
});

test("yup validates invalid json (required missing) to return false", () => {
  const yupSchema = buildYup(userSchema);
  const valid = yupSchema.isValidSync({
    first_name: "mike"
  });
  expect(valid).toBe(false);
});
