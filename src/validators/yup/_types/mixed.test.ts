import { mixed } from "./_imports";
const { toSchemaEntry } = mixed;

const defaultConfig = {};

const create = (fieldDef, config = defaultConfig) => {
  const obj = fieldDef instanceof Object ? { ...fieldDef, config } : fieldDef;
  return toSchemaEntry(obj, config);
};

describe("toSchemaEntry", () => {
  describe("instance", () => {
    const max = 42;
    const min = 10;
    const mixed: any = create({
      strict: true,
      maximum: max,
      minimum: min
    });

    mixed.aliasMap = {
      max: "maximum",
      min: "minimum"
    };

    // process aliases
    test("normalize", () => {
      expect(mixed).toBeTruthy();
    });

    describe("normalize", () => {
      mixed.normalize();
      test("normalizes max via alias map", () => {
        expect(mixed.constraints.max).toEqual(max);
      });

      test("normalizes min via alias map", () => {
        expect(mixed.constraints.min).toEqual(min);
      });
    });
  });
});
