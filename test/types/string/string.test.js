import { createStr, createStrNoKey, create } from "./_helpers";

describe("toYupString", () => {
  test("null - %", () => {
    expect(create(null)).toBeFalsy();
  });

  test("number - %", () => {
    expect(create(1)).toBeFalsy();
  });

  test("entryay - %", () => {
    expect(create([1])).toBeFalsy();
  });

  test("object - %", () => {
    expect(create({ x: 2 })).toBeFalsy();
  });

  test("int object - %", () => {
    expect(create({ type: "int" })).toBeFalsy();
  });

  test("string object - ok", () => {
    expect(createStr({})).toBeTruthy();
  });

  test("string - throws missing key", () => {
    expect(() => createStrNoKey("x")).toThrow();
  });

  test("null - throws missing value", () => {
    expect(() => createStr(null)).toThrow();
  });
});
