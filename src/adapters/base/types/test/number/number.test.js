const {
  createEntry,
  createNumEntry,
  createIntEntry,
  createNumNoKey,
  isNumber
} = require("./_helpers");

describe("isNumber", () => {
  test("int", () => {
    expect(isNumber({ type: "int" })).toBeTruthy();
  });

  test("integer", () => {
    expect(isNumber({ type: "integer" })).toBeTruthy();
  });

  test("number", () => {
    expect(isNumber({ type: "number" })).toBeTruthy();
  });
});

describe("toYupNumber", () => {
  test("null - %", () => {
    expect(createEntry(null)).toBeFalsy();
  });

  test("string - %", () => {
    expect(createEntry("x")).toBeFalsy();
  });

  test("number - %", () => {
    expect(createEntry(1)).toBeFalsy();
  });

  test("entryay - %", () => {
    expect(createEntry([1])).toBeFalsy();
  });

  test("object - %", () => {
    expect(createEntry({ x: 2 })).toBeFalsy();
  });

  test("int object - ok", () => {
    expect(createIntEntry({})).toBeTruthy();
  });

  test("number object - ok", () => {
    expect(createNumEntry({})).toBeTruthy();
  });

  test("no key - throws missing key", () => {
    expect(() => createNumNoKey({})).toThrow();
  });
});
