import { buildWalker, RootSchemaWalker } from "../../lib/walker";

const create = (opts, config) => buildWalker(opts, config);

describe("RootSchemaWalker", () => {
  // config: any;
  // schema: any;
  // name: string = "unknown";
  // type: any;
  // properties: any;
  // required: any;
  // shapeConfig: any;
  // validSchema: boolean = false;
  // validator: any;
  // createSchemaValidator: (config: any) => any;

  const opts = {};
  const config = {};
  const entry = {};

  describe("create", () => {
    const walker = create(opts, config);

    describe("init", () => {});
  });

  describe("instance", () => {
    const walker = create(opts, config);
    describe("invalidProperties", () => {
      test("throws", () => {
        expect(() => walker.invalidProperties()).toThrow();
      });
    });

    describe("getRequired", () => {
      test("get list of required props for entry", () => {
        expect(walker.getRequired(entry)).toEqual([]);
      });
    });

    describe("getProps", () => {
      test("get list of props for entry", () => {
        expect(walker.getProps(entry)).toEqual([]);
      });
    });

    describe("getType", () => {
      test("get type of entry", () => {
        expect(walker.getProps(entry)).toEqual("object");
      });
    });

    describe("getName", () => {
      const entry = {
        name: "blip"
      };
      test("get name of entry", () => {
        expect(walker.getName(entry)).toEqual("blip");
      });
    });

    describe("normalizeRequired", () => {
      test("set properties to entry properties with normalized required", () => {
        expect(walker.getName(entry)).toEqual("name");
      });
    });

    describe("isRequired", () => {
      describe("required prop", () => {
        const required = {
          required: true
        };
        test("is true", () => {
          expect(walker.isRequired(required)).toBeTruthy();
        });
      });

      describe("not required prop", () => {
        const notRequired = {};
        test("is false", () => {
          expect(walker.isRequired(notRequired)).toBeFalsy();
        });
      });
    });
  });
});
