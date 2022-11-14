const { buildYup } = require("../src");

const schema = {
  title: "Schema title",
  description: "Schema description",
  type: "object",
  properties: {
    firstName: {
      type: "string",
    },
    lastName: {
      type: "string",
    },
    requireAddress: {
      type: "string",
      enum: ["yes", "no"],
    },
    addressLine1: {
      type: "string",
    },
    addressLine2: {
      type: "string",
    },
  },
  required: ["firstName", "lastName", "requireAddress"],
  oneOf: [
    {
      properties: {
        requireAddress: {
          const: "yes",
        },
        addressLine1: {
          minLength: 2,
        },
        addressLine2: {
          minLength: 2,
        },
      },
      required: ["addressLine1", "addressLine2"],
    },
    {
      properties: {
        requireAddress: {
          const: "no",
        },
      },
    },
  ],
};

const object = {
  firstName: "han",
  lastName: "yolo",
  requireAddress: "yes",
  addressLine2: "houseNumber",
};

test("oneOf const", async () => {
  const yupSchema = buildYup(schema);
  // console.dir(schema)
  try {
    const valid = await yupSchema.isValid(object);
    expect(valid).toBe(false);
  } catch (e) {
    console.log(e);
  }
});
