const { buildYup } = require("../");

const json = {
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
  // { log: console.log }
  const yupSchema = buildYup(json);
  //console.log(yupSchema)
  const valid = yupSchema.isValidSync({
    username: 123,
    foo: "bar",
    erm: ["this", "that"]
  });
  // console.log("Is it valid:" + JSON.stringify(valid));
  expect(valid).toBe(false);
});
