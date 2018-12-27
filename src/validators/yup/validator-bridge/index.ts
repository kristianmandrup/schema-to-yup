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
//const camelCase = require("camelcase");

// const defaultConstraints = [
//   'ascii',
//   {
//     name: alphanumeric,
//     optsKey: "locale"
//   },
//   // ...
// ]

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

export { extendYupApi } from "./extend-api";
