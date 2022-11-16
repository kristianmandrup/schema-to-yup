import { toConstraintsMap, extendYupApi } from '.';
import * as yup from 'yup';
describe("toConstraintsMap", () => {
  test("no args - throws", () => {
    expect(() => toConstraintsMap()).toThrow();
  });

  test("null - throws", () => {
    expect(() => toConstraintsMap(null)).toThrow();
  });

  test("number: 0 - throws", () => {
    expect(() => toConstraintsMap(0)).toThrow();
  });

  test("string: abc - throws", () => {
    expect(() => toConstraintsMap(abc)).toThrow();
  });

  test("string item: [`abc`] - ok", () => {
    expect(() => toConstraintsMap(["abc"])).not.toThrow();
  });

  test("object item: `[{}]` - throws", () => {
    expect(() => toConstraintsMap([{}])).toThrow();
  });

  test("object item: `[{name: 'xyz'}]` - ok", () => {
    expect(() => toConstraintsMap([{ name: "xyz" }])).not.toThrow();
    expect(toConstraintsMap([{ name: "xyz" }])).toEqual({
      xyz: { name: "xyz" }
    });
  });
});

describe("extendYupApi", () => {
  const validator = {
    hash: () => true
  };

  const constraints = [{ name: "hash" }];
  test("can add named constraint from validator", () => {
    expect(() =>
      extendYupApi({ constraints, validator, logging: true })
    ).not.toThrow();
    const schema = yup.string().hash();
    expect(typeof schema).toEqual("object");
  });
});
