const innerSchema = {
  "required": [
    "username",
    "password",
    "confirmPassword"
  ],
  "properties": {
    "username": {
      "minLength": 3,
      "type": "string"
    },
    "password": {
      "minLength": 6,
      "type": "string"
    },
    "confirmPassword": {
      "refValueFor": "password",
      "type": "string"
    }
  },
  "type": "object"
}

const { buildYup } = require("../src");

describe("Login form schema using refValue for confirmPassword property", () => {
  let loginSchema, config, schema
  beforeEach(() => {
    loginSchema = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "http://example.com/login.schema.json",
      title: "Login",
      description: "Login form",
      type: "object",
      ...innerSchema
    };
  
    config = {
      logging: true,
      // for error messages...
      errMessages: {
        confirmPassword: {
          refValueFor: "confirm password field must have the same value as password",
          required: "this field is required"
        }
      }
    };
    schema = buildYup(loginSchema, config);
  })

    it('is invalid if blank and displays correct message', async () => {
    try {
      schema.validateSync({ username: "jimmy", "password": "xyz123", "confirmPassword": "" });
    } catch (e) {
      expect(e.errors[0]).toBe('this field is required');
    }
  })

  it('is invalid if if confirmPassword does not match password', async () => {
    try {
      schema.validateSync({ username: "jimmy", "password": "xyz123", "confirmPassword": "xyz1234" });
    } catch (e) {
      expect(e.errors[0]).toBe('confirm password field must have the same value as password');
    }
  })

  it('is invalid with invalid data', async () => {
    try {
      const valid = await schema.isValid({ username: "jimmy", "password": "xyz123", "confirmPassword": "bad" });
      expect(valid).toBe(false);  
    } catch (e) {
      console.log(e)
    }
  })

  it('is valid with valid data', async () => {
    try {
      const valid = await schema.isValid({ username: "jimmy", "password": "xyz123", "confirmPassword": "xyz123" });
      expect(valid).toBe(true);  
    } catch (e) {
      console.log(e)
    }
  })
});
