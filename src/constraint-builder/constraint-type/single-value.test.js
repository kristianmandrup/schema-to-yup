import { createOpts, yup, SingleValueConstraintBuilder } from "./test/_helpers";

describe("SingleValueConstraintBuilder", () => {
  const yupConstraintMethodName = "min";
  const yupTypeInst = yup.number();
  const constraintFn = yupTypeInst.min.bind(yupTypeInst);
  const type = "string";
  const $opts = createOpts({
    type,
    constraintFn,
    yupConstraintMethodName,
    yupTypeInst
  });

  const clazz = SingleValueConstraintBuilder;
  const create = opts => new clazz(opts);
  const factory = opts => () => new clazz(opts);

  describe("create", () => {
    describe("valid", () => {
      describe("withFn", () => {
        const opts = $opts.valid.withFn;
        it("ok", () => {
          expect(factory(opts)).not.toThrow();
        });
      });
    });

    describe("invalid", () => {
      describe("empty", () => {
        const opts = $opts.invalid.empty;
        it("throws", () => {
          expect(factory(opts)).toThrow();
        });
      });
    });
  });

  describe("instance", () => {
    const opts = $opts.valid.withMethodNameAndType;
    const instance = create(opts);

    it("has constraintFn", () => {
      expect(instance.constraintFn).toBeDefined();
    });

    describe("build", () => {
      describe("valid single value", () => {
        it("builds", () => {
          expect(instance.build(1)).toBeTruthy();
        });
      });

      describe("invalid value (null)", () => {
        it("falsy", () => {
          expect(instance.build(null)).toBeFalsy();
        });
      });
    });
  });
});