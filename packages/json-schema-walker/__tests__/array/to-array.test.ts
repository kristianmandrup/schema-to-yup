import { toArray, ArraySchemaEntryWalker } from "../../lib/array";

const create = opts => ({
  type: "array",
  ...opts
});

const config = {};
const schema = {};

const objFor = (opts = {}) => {
  const value = create(opts);
  return { key: "name", type: value.type, value, schema, config };
};

const array = opts => {
  const $opts = objFor(opts);
  return toArray($opts);
};

describe.only("MappingArray", () => {
  const obj = objFor();
  const mapper = ArraySchemaEntryWalker.create(obj);

  describe("type", () => {
    test("default: is array", () => {
      expect(mapper.type).toEqual("nested");
    });
  });
});
