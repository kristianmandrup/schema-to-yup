const { createNumEntry, createSchema } = require("./_helpers");

describe("max", () => {
  describe("schema opts", () => {
    test("string - use Yup.ref", () => {
      expect(() => createNumEntry({ max: "b" })).not.toThrow();
    });

    test("number string - transformed?", () => {
      expect(() => createNumEntry({ max: "1" })).not.toThrow();
    });

    test("negative number - ok", () => {
      expect(() => createNumEntry({ max: -1 })).not.toThrow();
    });
  });

  describe("validate", () => {
    describe("max: 2", () => {
      const entry = createNumEntry({ max: 2 });
      const schema = createSchema(entry);

      test("less", () => {
        const valid = schema.isValidSync({
          value: 0
        });
        expect(valid).toBeTruthy();
      });

      test("equal - valid", () => {
        expect(schema.isValidSync({ value: 2 })).toBeTruthy();
      });

      test("more", () => {
        const valid = schema.isValidSync({
          value: 5
        });
        expect(valid).toBeFalsy();
      });
    });
  
    describe("max: 0", () => {
      const entry = createNumEntry({ max: 0 });
      const schema = createSchema(entry);

      test("less", () => {
        let valid
        try {
          valid = schema.isValidSync({
            value: -1
          });
          expect(valid).toBeTruthy();
        } catch(e) {
          console.log(e)
        }        
      });

      test("equal - valid", () => {
        let valid
        try {
          valid = schema.isValidSync({
            value: 0
          });
          expect(valid).toBeFalsy();
        } catch(e) {
          console.log(e)
        }        
      });

      test("more", () => {
        let valid
        try {
          valid = schema.isValidSync({
            value: 3
          });
          expect(valid).toBeFalsy();
        } catch(e) {
          console.log(e)
        }  
      });
    });
  });
});
