import { Constraint } from "./test/_helpers";

describe("Constraint", () => {
  describe("create", () => {
    it("throws if no opts", () => {
      expect(() => new Constraint()).toThrow();
    });
  });

  describe("instance", () => {
    const instance = new Constraint();

    it("has yup", () => {
      expect(instance.yup).toBeDefined();
    });
  });
});
