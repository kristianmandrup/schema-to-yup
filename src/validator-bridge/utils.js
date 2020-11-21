import { defaultConstraints } from './default-constraints';

export const defaults = {
  createValidatorName: (validatorName, key) => {
    const name = validatorName || key;
    validatorName = camelCase(name);
    validatorName = validatorName.replace(/Uri$/, "URI");
    validatorName = validatorName.replace(/Id$/, "ID");
    return `is${validatorName}`;
  },
  createTestName: (testName, key) => (testName = dashify(testName || key))
};

export const fallBackFnMap = {
  isMagnetURI: (value) => {
    return /magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32}/i.test(value);
  }
};

export const constraintsFor = (constraints) => {
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
  return constraints
}