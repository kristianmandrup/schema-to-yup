import dashify from 'dashify';
import camelCase from 'uppercamelcase';

import { addMethod, string } from 'yup';
import { constraintsFor, fallBackFnMap, defaults } from './utils';

// Template:
// Yup.addMethod(Yup.string, "isHexColor", function(args) {
//   const { message } = args;
//   return this.test("hex-color", message, function(value) {
//     const { path, createError } = this;
//     // [value] - value of the property being tested
//     // [path]  - property name,
//     // ...
//     return validator.isHexColor(value) || createError({ path, message });
//   });
// });




function extendYupApi({
  constraints,
  override = false,
  validator,
  createValidatorName,
  createTestName
} = {}) {
  if (!validator) {
    throw "extendYupApi: missing validator option";
  }


  constraints = constraintsFor(constraints)
  createValidatorName = createValidatorName || defaults.createValidatorName;
  createTestName = createTestName || defaults.createTestName;

  Object.keys(constraints).map(key => {
    let { testName, optsKey, validatorName, logging } = constraints[key];
    const fullValidatorName = createValidatorName(validatorName, key);
    testName = createTestName(testName, key);

    // See https://github.com/jquense/yup#yupaddmethodschematype-schema-name-string-method--schema-void
    addMethod(string, key, (args = {}) => {
      const { message } = args;
      const opts = args[optsKey];
      return string().test(testName, message, value => {
        // return this.transform(value => {
        const { path, createError } = this;
        // [value] - value of the property being tested
        // [path]  - property name,
        // ...
        let validatorFn = validator[fullValidatorName];
        validatorFn = validatorFn || fallBackFnMap[fullValidatorName];

        if (typeof validatorFn !== "function") {
          throw Error("No method named ${validatorName} on validator");
        }
        const valid = validatorFn(value, opts);
        if (logging === true) {
          console.log("Yup validator bridge", {
            key,
            fullValidatorName,
            testName,
            value,
            valid
          });
        }
        return valid || createError({ path, message });
      });
    });
  });
}

export {
  extendYupApi,
  toConstraintsMap
};
