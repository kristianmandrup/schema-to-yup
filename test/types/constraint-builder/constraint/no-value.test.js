import { createOpts, yup, NoValueConstraintBuilder } from "./_helpers";

describe("NoValueConstraintBuilder", () => {
  const yupConstraintMethodName = "email";
  const yupTypeInst = yup.string();
  const constraintFn = yupTypeInst.email.bind(yupTypeInst);
  const type = "string";
  const $opts = createOpts({
    type,
    constraintFn,
    yupConstraintMethodName,
    yupTypeInst
  });

  const clazz = NoValueConstraintBuilder;
  const create = opts => new clazz(opts);
  const factory = opts => () => new clazz(opts);

  describe("create", () => {
    describe("invalid opts", () => {
      describe("empty", () => {
        const opts = $opts.invalid.empty;
        it("throws", () => {
          expect(factory(opts)).toThrow();
        });
      });

      describe("with method name", () => {
        const opts = $opts.invalid.withMethodName;
        it("throws", () => {
          expect(factory(opts)).toThrow();
        });
      });

      describe("with invalid method name", () => {
        const opts = $opts.invalid.withTypeAndInvalidMethodName;
        it("throws", () => {
          expect(factory(opts)).toThrow();
        });
      });

      describe("with invalid type", () => {
        const opts = $opts.invalid.withInvalidType;
        it("throws", () => {
          expect(factory(opts)).toThrow();
        });
      });
    });

    describe("valid opts", () => {
      describe("fn", () => {
        const opts = $opts.valid.withFn;
        it("ok", () => {
          expect(factory(opts)).not.toThrow();
        });
      });

      describe("name and type", () => {
        const opts = $opts.valid.withMethodNameAndType;
        it("ok", () => {
          expect(factory(opts)).not.toThrow();
        });
      });

      describe("yup and name", () => {
        const opts = $opts.valid.withYupAndMethodName;
        it("ok", () => {
          expect(factory(opts)).not.toThrow();
        });
      });

      describe("fn and name", () => {
        const opts = $opts.valid.withFnAndName;
        it("ok", () => {
          expect(factory(opts)).not.toThrow();
        });
      });
    });
  });

  describe("instance", () => {
    const opts = $opts.valid.withMethodNameAndType;
    const instance = create(opts);

    it("has yup", () => {
      expect(instance.constraintFn).toBeDefined();
    });

    describe("build", () => {
      it("builds", () => {
        expect(() => instance.build()).not.toThrow();
      });
    });
  });
});
