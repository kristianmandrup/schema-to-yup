import {
  createSchemaTypeWalkerMap
  // schemaTypeWalkerMap
} from "../../lib/resolver/walker-map";

describe("createSchemaTypeWalkerMap", () => {
  const config = {};
  const schemaTypeWalkerMap = createSchemaTypeWalkerMap(config);

  describe("array", () => {
    const opts = {};
    const { array } = schemaTypeWalkerMap;
    // const walker = array(opts);

    describe("walk", () => {});
  });

  describe("object", () => {});

  describe("primitive", () => {});
});
