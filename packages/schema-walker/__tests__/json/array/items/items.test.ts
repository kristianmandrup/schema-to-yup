import { createItemsMapping } from "./items";
import { arrays } from "../data";

const create = (opts, config) => {
  return createItemsMapping(opts, config);
};

describe("ItemsMapping", () => {
  const strItem = {
    type: "string"
  };
  const intItem = {
    type: "integer"
  };
  const owner = { name: "person" };

  const items = [strItem, intItem];
  const config = {};
  const opts = { items, owner };
  const resolver = create(opts, config);

  describe("typeResolver", () => {
    const resolved = resolver.typeResolver(strItem);
    test("resolves", () => {
      expect(resolved).toEqual({
        type: "keyword"
      });
    });
  });

  describe("resolve", () => {
    const resolved = resolver.resolve();

    test("resolves", () => {
      expect(resolved).toEqual([
        {
          type: "keyword"
        },
        {
          type: "integer"
        }
      ]);
    });
  });

  describe("array with an integer enum type", () => {
    const { numberOfChildren } = arrays;
    const { items } = numberOfChildren;
    const opts = { items, owner };
    const resolver = create(opts, config);

    const numericEnum = items[0];
    describe("resolveItem", () => {
      const resolved = resolver.resolveItem(numericEnum);
      test("single enum type resolved", () => {
        expect(resolved).toEqual({
          type: "integer"
        });
      });
    });

    describe("resolve", () => {
      const opts = { items, owner };
      const resolver = create(opts, config);
      const resolved = resolver.resolve();
      test("single enum type resolved", () => {
        expect(resolved).toEqual([
          {
            type: "integer"
          }
        ]);
      });
    });
  });
});
