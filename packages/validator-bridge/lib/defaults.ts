import dashify from "dashify";
import camelCase from "uppercamelcase";

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
  isMagnetURI: (value, isMagnetUri) => {
    return /magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32}/i.test(value);
  }
};
