const { buildYup } = require("../src");

const schema = {
    type: "object",
    properties: {
      name: {
        type: "string",
        minLength: 2,
        maxLength: 10,
        strict: true,
        uppercase: "please only use uppercase characters"
      }
    }
  };

test("yup validates valid json - true", () => {
  const yupSchema = buildYup(schema);
  const valid = yupSchema.isValidSync({
    name: "ABC",
  });
  expect(valid).toBe(true);
});

test("yup validates invalid json - false", () => {
    const yupSchema = buildYup(schema);
    const valid = yupSchema.isValidSync({
        name: "ab",
    });
    expect(valid).toBe(false);
});
  

