import { jsonSchema } from "../../lib/inquiry/json-schema";
const { getProps } = jsonSchema;

describe("getProps", () => {
  describe("empty object", () => {
    const props = getProps({});

    test("is empty array", () => {
      expect(props).toEqual([]);
    });
  });
});
