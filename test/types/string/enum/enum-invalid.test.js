import { createStr, createSchema } from "../_helpers";
import { json } from "./fixtures";

const { email } = json.properties;
describe("enum", () => {
  const conf = { ...email, key: "email" };
  const entry = createStr(conf);
  const schema = createSchema(entry, "email");

  test("invalid email - not an email", () => {
    const valid = schema.isValidSync({
      email: "abc"
    });
    expect(valid).toBeFalsy();
  });
});
