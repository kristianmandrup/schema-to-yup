import { SingleValueConstraintBuilder } from "./_helpers";

describe("SingleValueConstraintBuilder", () => {
  describe("create", () => {
    it("throws if no opts", () => {
      expect(() => new SingleValueConstraintBuilder()).toThrow();
    });
  });

  describe("instance", () => {
    const opts = {};
    const instance = new SingleValueConstraintBuilder(opts);

    it("has yup", () => {
      expect(instance.yup).toBeDefined();
    });

    describe("build", () => {
      describe("valid single value", () => {
        it("builds", () => {
          expect(instance.build("x")).not.toThrow();
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
