const { createRangeConstraint } = require("./_imports");
const { createNum } = require("./_helpers");

function addContraints(obj) {
  const num = createNum(obj);
  const range = createRangeConstraint(num);
  range.add();
  return range;
}

// TODO: fix - missing constrainBuilder when creating RangeConstraint
describe.skip("createRangeConstraint", () => {
  describe("add", () => {
    test("no valid range constraints - none added", () => {
      const range = addContraints({ x: 2 });
      console.log({constraintsAdded: range.constraintsAdded})
      expect(range.constraintsAdded).toEqual({});
    });

    test("valid range constraint: max - max added", () => {
      const range = addContraints({ max: 2 });
      console.log({constraintsAdded: range.constraintsAdded})
      expect(range.constraintsAdded.max).toBeTruthy();
    });
  });
});
