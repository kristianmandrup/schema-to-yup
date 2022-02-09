import { createStr } from "./_helpers";
describe.skip("const", () => {
  describe("schema opts", () => {
    test("simple value: abc", () => {
      expect(() => createStr({ const: "abc" })).not.toThrow();
    });

    test("data ref: 1/password", () => {
      expect(() =>
        createStr({
          const: {
            $data: "1/password",
          },
        })
      ).not.toThrow();
    });
  });
});
