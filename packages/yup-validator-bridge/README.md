# `@schema-validator/validator-bridge`

Used to extend the Yup API to support additional string validation methods from [validator](https://www.npmjs.com/package/validator)

You can use `extendYupApi` to extend the Yup API with extra string [validation methods](https://www.npmjs.com/package/validator#validators) that are called on matching JSON schema `format`, such as `"format": "alpha"`.

```js
const validator = require("validator");
const { extendYupApi } = require("json-schema-to-yup/validator-bridge");

// by default extends with string format validation methods of validator
// See https://www.npmjs.com/package/validator
extendYupApi({ validator });
```

You can optionally pass in a custom `validator` and a constraints map of your choice.

You can either extend the default constraints or override them with your own map.

## Forg bridge

A similar bridge should be available for Forg (community effort?)

## Usage

```ts
const myValidator = new MyValidator();
const constraints = ["creditCard", "currency", { name: "hash", opts: "algo" }];
extendYupApi({ validator: myValidator, override: true, constraints });

const { buildValidator } = // ...

// type def sample schema, using credit-card format validator
const schema = {
  name: "BankAccount",
  fields: {
    accountNumber: {
      type: "String",
      format: "credit-card" // use credit card validation from validator npm module
    }
  }
};

// opt in to use generic string format validation, via format: true config option
const validator = buildValidator(schema, { format: true, schemaType: "type-def" });
// ...do your validation
const valid = await validator.isValid({
  accountNumber: "123-4567-1828-2929"
});
```

```

```
