const { buildYup } = require("../");

const userSchema = {
  title: "users",
  type: "object",
  properties: {
    // level: { type: "number", notRequired: true }
    level: { type: "number" }
  }
};

test.only("yup validates valid json to return true - error messages", done => {
  try {
    const yupSchema = buildYup(userSchema, {
      err: msg => console.error(`ERROR: ${msg}`)
    });
    const { fields } = yupSchema;

    console.log({ fields });
    const { level } = fields;
    console.log("level", level.tests);

    yupSchema
      .validate({})
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
