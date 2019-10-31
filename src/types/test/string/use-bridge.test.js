import { createStr, createSchema } from "./_helpers";

// TODO: requires using validator-bridge
describe.skip("genericFormat", () => {
  describe("schema opts", () => {
    test("hexColor", () => {
      expect(createStr({ hexColor: true })).toBeTruthy();
    });
  });

  describe("validate", () => {
    const entry = createStr({ hexColor: true });
    const schema = createSchema(entry, "color");

    test("valid hexColor", () => {
      const valid = schema.isValidSync({
        color: "#ff0000"
      });
      expect(valid).toBeFalsy();
    });

    test("invalid hexColor", () => {
      const valid = schema.isValidSync({
        color: "zxy"
      });
      expect(valid).toBeFalsy();
    });
  });
});
