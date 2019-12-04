var yup = require("yup");

//check validity
describe.only("yup schema validation", () => {
  const name = yup.string().oneOf(["a", "b"]);
  const shapeConfig = {
    name
  };
  console.log({ name });

  const { _whitelist } = name;
  const list = _whitelist && _whitelist.list;
  console.log({ list });

  const schema = yup.object().shape(shapeConfig);
  test("valid json is valid", () => {
    const valid = schema.isValidSync({ name: "a" });
    expect(valid).toBe(true);
  });

  test("invalid json is invalid", () => {
    const valid = schema.isValidSync({ name: "c" });
    expect(valid).toBe(false);
  });
});
