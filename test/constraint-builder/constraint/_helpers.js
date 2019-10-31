export {
  Constraint,
  SingleValueConstraintBuilder,
  ListValueConstraintBuilder,
  NoValueConstraintBuilder
} from "../../../../src/types/constraint-builder/constraint";
import * as yup from "yup";

export { yup };

export const createOpts = opts => {
  const { constraintFn, yupConstraintMethodName, type, yupTypeInst } = opts;
  return {
    valid: {
      withFn: {
        constraintFn
      },
      withYupAndMethodName: {
        yupTypeInst,
        yupConstraintMethodName
      },
      withMethodNameAndType: {
        yupConstraintMethodName,
        type
      },
      withFnAndName: {
        constraintFn,
        yupConstraintMethodName
      }
    },
    // missing constrainFn and name
    invalid: {
      empty: {},
      withMethodName: {
        yupConstraintMethodName
      },
      withTypeAndInvalidMethodName: {
        type,
        yupConstraintMethodName: "BAD"
      },
      withInvalidType: {
        type: "BAD TYPE"
      }
    }
  };
};
