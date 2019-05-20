import { isArray } from "../lib/util";

describe("isArray", () => {
  test("type: array - true", () => {
    expect(isArray("array")).toBeTruthy();
  });
  test("type: integer - true", () => {
    expect(isArray("integer")).toBeTruthy();
  });

  test("type: array - false", () => {
    expect(isArray("array")).toBeFalsy();
  });
});
