import { build } from "../..";

describe("array", () => {
  test("no items", () => {
    const json = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "http://example.com/person.schema.json",
      title: "Person",
      description: "A person",
      type: "object",
      properties: {
        friendNames: {
          description: "Names of friends",
          type: "array"
        }
      }
    };

    const config = {};
    const { properties } = build(json, config);
    // console.log({ mapping });
    // console.log("Array - no items", JSON.stringify(mapping, null, 2));
    expect(properties).toEqual({
      friendNames: {
        // include_in_parent: true,
        type: "nested"
      }
    });
  });

  test("empty items", () => {
    const json = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "http://example.com/person.schema.json",
      title: "Person",
      description: "A person",
      type: "object",
      properties: {
        friendNames: {
          description: "Names of friends",
          type: "array",
          items: {}
        }
      }
    };

    const config = {};
    const { properties } = build(json, config);
    // console.log({ properties });
    // console.log("Array - no items", JSON.stringify(properties, null, 2));
    expect(properties).toEqual({
      friendNames: {
        // include_in_parent: true,
        type: "nested"
      }
    });
  });

  test("empty items", () => {
    const json = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "http://example.com/person.schema.json",
      title: "Person",
      description: "A person",
      type: "object",
      properties: {
        friendNames: {
          description: "Names of friends",
          type: "array",
          items: {}
        }
      }
    };

    const config = {};
    const { properties } = build(json, config);
    // console.log({ properties });
    // console.log("Array - empty items", JSON.stringify(properties, null, 2));
    expect(properties).toEqual({
      friendNames: {
        // include_in_parent: true,
        type: "nested"
      }
    });
  });

  test("items object - string type", () => {
    const json = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "http://example.com/person.schema.json",
      title: "Person",
      description: "A person",
      type: "object",
      properties: {
        friendNames: {
          description: "Names of friends",
          type: "array",
          items: {
            type: "string"
          }
        }
      }
    };

    const config = {
      typeMap: {
        string: "string"
      }
    };

    const { properties } = build(json, config);
    // console.log({ properties });
    // console.log("Array - empty items", JSON.stringify(properties, null, 2));
    expect(properties).toEqual({
      friendNames: {
        // include_in_parent: true,
        type: "string"
      }
    });
  });

  test("items array - one item string type", () => {
    const json = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "http://example.com/person.schema.json",
      title: "Person",
      description: "A person",
      type: "object",
      properties: {
        friendNames: {
          description: "Names of friends",
          type: "array",
          items: [
            {
              type: "string"
            }
          ]
        }
      }
    };

    const config = {
      typeMap: {
        string: "text"
      }
    };
    const { properties } = build(json, config);
    // console.log({ properties });
    // console.log("Array - empty items", JSON.stringify(properties, null, 2));
    expect(properties).toEqual({
      friendNames: {
        // include_in_parent: true,
        type: "text"
      }
    });
  });

  describe("items array - two items string and number type", () => {
    const json = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "http://example.com/person.schema.json",
      title: "Person",
      description: "A person",
      type: "object",
      properties: {
        friendNames: {
          description: "Names of friends",
          type: "array",
          items: [
            {
              type: "string"
            },
            {
              type: "number"
            }
          ]
        }
      }
    };

    const config = {};

    test("throws", () => {
      const fn = () => build(json, config);
      expect(fn).toThrow();
    });
  });
});
