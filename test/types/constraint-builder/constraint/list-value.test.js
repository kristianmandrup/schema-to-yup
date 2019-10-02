import { ListValueConstraintBuilder } from "./_helpers";

describe("ListValueConstraintBuilder", () => {
  describe("create", () => {
    it("throws if no opts", () => {
      expect(() => new ListValueConstraintBuilder()).toThrow();
    });
  });

  describe("instance", () => {
    const opts = {};
    const instance = new ListValueConstraintBuilder(opts);

    it("has yup", () => {
      expect(instance.yup).toBeDefined();
    });

    describe("build", () => {
      describe("valid list value", () => {
        it("builds", () => {
          expect(instance.build(["x"])).not.toThrow();
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
