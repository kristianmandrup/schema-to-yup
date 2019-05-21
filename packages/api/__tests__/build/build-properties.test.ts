import { buildProperties } from "../../lib/build/build-properties";

describe("buildProperties", () => {
  describe("empty properties", () => {
    const schema = {
      title: "person",
      type: "object",
      properties: {}
    };
    const config = {};
    const built = buildProperties(schema, config);
    test("empty mapping", () => {
      expect(built).toBe({});
    });
  });

  describe("one name: string property", () => {
    const schema = {
      title: "person",
      type: "object",
      properties: {
        name: {
          type: "string"
        }
      }
    };
    const config = {};
    const built = buildProperties(schema, config);
    test("ES string mapping", () => {
      expect(built).toBe({
        name: {
          type: "string"
        }
      });
    });
  });
});
