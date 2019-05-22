import {
  PrimitiveSchemaEntryWalker
  // factories
} from "../../lib/walker";

// const create = (opts, config) => factories.createPrimitiveWalker(opts, config);
const create = (opts, config) => new PrimitiveSchemaEntryWalker(opts, config);

describe("PrimitiveSchemaEntryWalker", () => {
  const opts = {};
  const config = {};
  const entry = {};

  describe("create", () => {
    const walker = create(opts, config);

    describe("init", () => {});
  });

  describe("instance", () => {
    const walker = create(opts, config);
  });
});
