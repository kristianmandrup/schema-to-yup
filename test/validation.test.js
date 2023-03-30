const { buildYup } = require("../src");

const schema = {
  title: "users",
  type: "object",
  required: ["id"],
  properties: {
    username: { type: "string" },
    id: { type: "string", minLength: 2, maxLength: 4, required: true }
  }
};

const config = {
  explNotRequired: { 
      mode: {
        notRequired: true, // default setting
      }
  },  
  explRequired: { 
    mode: {
      notRequired: false, // default setting
    }
  },  
}

test("yup validates invalid username and missing id to return false", () => {
  const yupSchema = buildYup(schema);
  const valid = yupSchema.isValidSync({
    username: 123,
    foo: "bar",
    erm: ["this", "that"]
  });
  expect(valid).toBe(false);
});

test("yup validates only id present and valid to return true", () => {
  const yupSchema = buildYup(schema);
  const valid = yupSchema.isValidSync({
    username: "a",
    id: "abc",
  });
  expect(valid).toBe(true);
});


test("yup validates only id present and valid and props default mode for required to return true", () => {
  const yupSchema = buildYup(schema);
  // console.info('mode: default', yupSchema.fields.username)
  const valid = yupSchema.isValidSync({
    id: "abc",
  });
  expect(valid).toBe(true);
});


test("yup validates only id present and valid and props expl not required to return true", () => {
  const yupSchema = buildYup(schema, config.explNotRequired);
  // console.info('mode: not required', yupSchema.fields.username)
  const valid = yupSchema.isValidSync({
    id: "abc",
  });
  expect(valid).toBe(true);
});

test("yup validates only id present and valid and props expl required to return false", () => {
  const yupSchema = buildYup(schema, config.explRequired);
  // console.info('mode: required', yupSchema.fields.username)
  const valid = yupSchema.isValidSync({
    id: "abc",
  });
  expect(valid).toBe(false);
});

const email = {
  title: "users",
  type: "object",
  required: ["email"],
  properties: {
    email_address: { type: "string", email: true }
  }
};
test("yup validates valid email to return true", () => {
  const yupSchema = buildYup(email);
  const valid = yupSchema.isValidSync({
    email_address: "foobar@mystique.com"
  });
  expect(valid).toBe(true);
});
test("yup validates invalid email to return false", () => {
  const yupSchema = buildYup(email);
  const valid = yupSchema.isValidSync({
    email_address: "foobar@myst"
  });
  expect(valid).toBe(false);
});

const regex = {
  title: "users",
  type: "object",
  required: ["amazon"],
  properties: {
    amazon: { type: "string", pattern: /(foo|bar)/ }
  }
};
test("yup validates pattern to return true", () => {
  const yupSchema = buildYup(regex);
  const valid = yupSchema.isValidSync({
    amazon: "foo"
  });
  expect(valid).toBe(true);
});
test("yup validates invalid pattern to return false", () => {
  const yupSchema = buildYup(regex);
  const valid = yupSchema.isValidSync({
    amazon: "foz"
  });
  expect(valid).toBe(false);
});
const misnamed_regex = {
  title: "users",
  type: "object",
  required: ["amazon"],
  properties: {
    amazon: { type: "string", matches: /(foo|bar)/ }
  }
};
test("yup validates normalised pattern name to return false", () => {
  const yupSchema = buildYup(misnamed_regex);
  const valid = yupSchema.isValidSync({
    amazon: "foz"
  });
  expect(valid).toBe(false);
});
const misnamed_regex2 = {
  title: "users",
  type: "object",
  required: ["amazon"],
  properties: {
    amazon: { type: "string", regex: /(foo|bar)/ }
  }
};
test("yup validates normalised pattern name to return false", () => {
  const yupSchema = buildYup(misnamed_regex2);
  const valid = yupSchema.isValidSync({
    amazon: "foz"
  });
  expect(valid).toBe(false);
});

const url = {
  title: "users",
  type: "object",
  required: ["email"],
  properties: {
    linkedin: { type: "string", url: true }
  }
};
test("yup validates valid url to return true", () => {
  const yupSchema = buildYup(url);
  const valid = yupSchema.isValidSync({
    linkedin: "https://www.linkedin.com"
  });
  expect(valid).toBe(true);
});
test("yup validates invalid url to return false", () => {
  const yupSchema = buildYup(url);
  const valid = yupSchema.isValidSync({
    linkedin: "fooobaaaar"
  });
  expect(valid).toBe(false);
});
