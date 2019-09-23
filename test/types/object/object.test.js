import { create, createObject, createObjectNoKey } from "./_helpers";

describe("toYupObject", () => {
  test("null - %", () => {
    expect(create(null)).toBeFalsy();
  });

  // TODO: fix?
  test.skip("empty value - ok", () => {
    expect(createObject({})).toBeTruthy();
  });

  test.skip("no key - throws missing key", () => {
    expect(() => createObjectNoKey({})).toThrow();
  });
});
