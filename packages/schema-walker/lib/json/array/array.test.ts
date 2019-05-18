import { schemas } from './_schemas_'
import { toArray } from ".";

const build = toArray

describe("array", () => {
  test("no items", done => {
    const schema = schemas.noItems
    const onComplete = (result) => {
      done()
    }
    const config = {
      onComplete
    };
    build(schema, config);
    // console.log({ mapping });
    // console.log("Array - no items", JSON.stringify(mapping, null, 2));
  });

  test("empty items", done => {
    const schema = schemas.emptyItems
    const onComplete = (result) => {
      done()
    }
    const config = {
      onComplete
    };
    build(schema, config);

  });

  test("items object - string type", done => {
    const schema = schemas.itemsObjString
    const onComplete = (result) => {
      done()
    }
    const config = {
      onComplete
    };
    build(schema, config);

  });
    
  itemsArrayOneString
  test("items array - one item string type", done => {
    const schema = schemas.itemsArrayOneString
    const onComplete = (result) => {
      done()
    }
    const config = {
      onComplete
    };
    build(schema, config);
  });

  describe("items array - two items string and number type", done => {
    const schema = schemas.itemsArrayStringNumber
    const onComplete = (result) => {
      done()
    }
    const config = {
      onComplete
    };
    build(schema, config);
  });
});
