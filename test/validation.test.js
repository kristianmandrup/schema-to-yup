const { buildYup } = require("../");

const invalidjson = {
  title: "users",
  type: "object",
  required: ["username", "first_name", "last_name", "id_number"],
  properties: {
    username: { type: "string", required: true },
    first_name: { type: "string", required: true },
    last_name: { type: "string", required: true },
    id_number: { type: "string", minLength: 12, maxLength: 13, required: true }
  }
};
test("yup validates invalid json to return false", () => {
  const yupSchema = buildYup(invalidjson);
  const valid = yupSchema.isValidSync({
    username: 123,
    foo: "bar",
    erm: ["this", "that"]
  });
  expect(valid).toBe(false);
});


const email = {
  title: "users",
  type: "object",
  required: ["email"],
  properties: {
    email_address: { type: "string", "email": true }
  }
}
test("yup validates valid email to return true", () => {
  const yupSchema = buildYup(email);
  const valid = yupSchema.isValidSync({
    email_address: "foobar@mystique.com"
  });
  expect(valid).toBe(true);
});
test("yup validates invalid email to return false", () => {
  const yupSchema = buildYup(email);
  const valid = yupSchema.isValidSync({
    email_address: "foobar@myst"
  });
  expect(valid).toBe(false);
});

