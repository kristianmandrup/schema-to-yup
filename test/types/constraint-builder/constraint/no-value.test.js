import { NoValueConstraintBuilder } from "./_helpers";

describe("NoValueConstraintBuilder", () => {
  describe("create", () => {
    it("throws if no opts", () => {
      expect(() => new NoValueConstraintBuilder()).toThrow();
    });
  });

  describe("instance", () => {
    const opts = {};
    const instance = new NoValueConstraintBuilder(opts);

    it("has yup", () => {
      expect(instance.yup).toBeDefined();
    });

    describe("build", () => {
      describe("valid value", () => {
        it("builds", () => {
          expect(instance.build({})).not.toThrow();
        });
      });

      describe("invalid value (null)", () => {
        it("throws", () => {
          expect(instance.build(null)).toThrow();
        });
      });
    });
  });
});
