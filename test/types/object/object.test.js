import { create, createObject, createObjectNoKey } from "./_helpers";

describe("toYupObject", () => {
  test("null - %", () => {
    expect(create(null)).toBeFalsy();
  });

  test("empty value - ok", () => {
    expect(createObject({})).toBeTruthy();
  });

  test("no key - throws missing key", () => {
    expect(() => createObjectNoKey({})).toThrow();
  });
});
