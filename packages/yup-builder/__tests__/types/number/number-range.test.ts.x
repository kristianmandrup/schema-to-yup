import { createRange } from "./_imports";
import { createNum } from "./_helpers";

function addContraints(obj) {
  const num = createNum(obj);
  const range = createRange(num);
  range.add();
  return range;
}

describe("createRange", () => {
  describe("add", () => {
    test("no valid range constraints - none added", () => {
      const range = addContraints({ x: 2 });

      expect(range.constraintsAdded).toEqual({});
    });

    test("valid range constraint: max - max added", () => {
      const range = addContraints({ max: 2 });
      expect(range.constraintsAdded.max).toBeTruthy();
    });
  });
});
