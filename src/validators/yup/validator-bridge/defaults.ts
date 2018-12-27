import camelCase from "uppercamelcase";
import dashify from "dashify";

export const defaultConstraints: any = {
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

export const defaults: any = {
  createValidatorName: (validatorName, key) => {
    const name = validatorName || key;
    validatorName = camelCase(name);
    validatorName = validatorName.replace(/Uri$/, "URI");
    validatorName = validatorName.replace(/Id$/, "ID");
    return `is${validatorName}`;
  },
  createTestName: (testName, key) => (testName = dashify(testName || key))
};
