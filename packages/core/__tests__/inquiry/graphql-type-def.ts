import { graphQLTypeDef } from "../../lib/inquiry/graphql-type-def";
const { getProps } = graphQLTypeDef;

describe("getProps", () => {
  describe("empty object", () => {
    const props = getProps({});

    test("is empty array", () => {
      expect(props).toEqual([]);
    });
  });
});
