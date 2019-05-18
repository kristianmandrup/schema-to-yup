const noItems  = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "http://example.com/person.schema.json",
  title: "Person",
  description: "A person",
  type: "object",
  properties: {
    friendNames: {
      description: "Names of friends",
      type: "array"
    }
  }
};

const emptyItems ={
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "http://example.com/person.schema.json",
  title: "Person",
  description: "A person",
  type: "object",
  properties: {
    friendNames: {
      description: "Names of friends",
      type: "array",
      items: {}
    }
  }
};

const itemsObjString = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "http://example.com/person.schema.json",
  title: "Person",
  description: "A person",
  type: "object",
  properties: {
    friendNames: {
      description: "Names of friends",
      type: "array",
      items: {
        type: "string"
      }
    }
  }
};

const itemsArrayOneString = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "http://example.com/person.schema.json",
  title: "Person",
  description: "A person",
  type: "object",
  properties: {
    friendNames: {
      description: "Names of friends",
      type: "array",
      items: [
        {
          type: "string"
        }
      ]
    }
  }
};

const itemsArrayStringNumber = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "http://example.com/person.schema.json",
  title: "Person",
  description: "A person",
  type: "object",
  properties: {
    friendNames: {
      description: "Names of friends",
      type: "array",
      items: [
        {
          type: "string"
        },
        {
          type: "number"
        }
      ]
    }
  }
};

export const schemas = {
  noItems,
  emptyItems,
  itemsObjString,
  itemsArrayOneString,
  itemsArrayStringNumber
}