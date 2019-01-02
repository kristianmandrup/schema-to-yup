// - `alpha-numeric`
// - `alpha`
// - `ascii`
// - `byte`
// - `credit-card`
// - `currency-amount`
// - `data-uri`
// - `date-time`
// - `date`
// - `domain-name`
// - `email`
// - `hash`
// - `hex-color`
// - `ipv4`
// - `ipv6`
// - `isbn`
// - `magnet-uri`
// - `mime-type`
// - `mobile-phone`
// - `mongo-id`
// - `postal-code`
// - `uri`
// - `uuid`

// const validator = require("validator");
import dashify from 'dashify';

//const camelCase = require("camelcase");
import camelCase from 'uppercamelcase';

import { addMethod, string } from 'yup';

const toConstraintsMap = (values, opts = {}) => {
  return values.reduce((acc, value) => {
    if (typeof value !== "string" && !(value instanceof Object)) {
      if (opts.throws !== false) {
        throw `toConstraintsMap: invalid entry ${value}`;
      } else {
        return acc;
      }
    }
    if (typeof value === "string") {
      acc[name] = {};
    } else {
      if (!value.name) {
        if (opts.throws !== false) {
          throw `toConstraintsMap: invalid entry ${value} missing name`;
        } else {
          return acc;
        }
      }
      acc[value.name] = value;
    }
    return acc;
  }, {});
};

// const defaultConstraints = [
//   'ascii',
//   {
//     name: alphanumeric,
//     optsKey: "locale"
//   },
//   // ...
// ]

const defaultConstraints = {
  alphanumeric: {
    optsKey: "locale"
  },
  alpha: {
    optsKey: "locale"
  },
  ascii: {},
  byte: {},
  creditCard: {},
  currency: {
    opts: "currencyOpts"
  },
  dataUri: {},
  dateTime: {},
  date: {},
  domainName: {
    opts: "domainOpts"
  },
  hash: {
    opts: "hashAlgo"
  },
  hexColor: {},
  ipv4: {},
  ipv6: {},
  isbn: {},
  magnetUri: {},
  mimeType: {},
  mobilePhone: {},
  mongoId: {},
  postalCode: {},
  uuid: {}
};

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

const defaults = {
  createValidatorName: (validatorName, key) => {
    const name = validatorName || key;
    validatorName = camelCase(name);
    validatorName = validatorName.replace(/Uri$/, "URI");
    validatorName = validatorName.replace(/Id$/, "ID");
    return `is${validatorName}`;
  },
  createTestName: (testName, key) => (testName = dashify(testName || key))
};

const fallBackFnMap = {
  isMagnetURI: (value, isMagnetUri) => {
    return /magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32}/i.test(value);
  }
};

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

  if (Array.isArray(constraints)) {
    constraints = toConstraintsMap(constraints);
  }

  if (!override) {
    constraints = {
      ...defaultConstraints,
      ...(constraints || {})
    };
  } else {
    constraints = constraints || defaultConstraints;
  }

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
