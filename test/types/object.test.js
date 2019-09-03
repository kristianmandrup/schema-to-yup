const { types } = require("../../src");
const { createObjectHandler } = require("../../src/types/object");
const { toYupObject } = types;
const yup = require("yup");

const isObject = fieldDef => fieldDef && fieldDef.type === "object";
const config = { isObject };

const create = fieldDef => {
  const obj = fieldDef instanceof Object ? { ...fieldDef, config } : fieldDef;
  return toYupObject(obj, config);
};

const createObject = value => {
  const obj = { value, config, key: "x", type: "object" };
  return toYupObject(obj, config);
};

const createObjectNoKey = value => {
  const obj = { value, config, type: "object" };
  return toYupObject(obj, config);
};

describe("toYupObject", () => {
  test("null - %", () => {
    expect(create(null)).toBeFalsy();
  });

  test("empty value - ok", () => {
    expect(createObject({})).toBeTruthy();
  });

  test("no key - throws missing key", () => {
    expect(() => createObjectNoKey({})).toThrow();
  });
});

describe("ObjectHandler", () => {
  describe("createObjectHandler", () => {
    describe("config object - null", () => {
      test("creates using empty config", () => {
        expect(createObjectHandler(null)).toBeTruthy();
      });
    });

    describe("config object", () => {
      test("creates using config", () => {
        expect(createObjectHandler({x: 2})).toBeTruthy();
      });
    });
  });

  describe("instance", () => {
    describe("handle", () => {
      describe("recursive object schema", () => {
        const dogSchema = {
          type: 'object',
          title: 'Dog',
          properties: {
            name: 'age',
            type: 'number'
          }
        }

        const schema = {
          type: 'object',
          title: 'Person',
          properties: {
            name: {
              type: 'string'
            },
            dog: dogSchema            
          }
        }
        const instance = createObjectHandler({schema})
        const result = instance.handle(dogSchema)

        test("result is as expected", () => {        
          expect(result).toBeTruthy();
        });    
      });
    });
  })
});
