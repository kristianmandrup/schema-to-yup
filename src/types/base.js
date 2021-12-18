import defaultSchemaParserMap from "./schema-parser-maps";
// import { createYupSchemaEntry } from '../create-entry';
import { TypeMatcher } from "./_type-matcher";
import { createSchemaParserBuilder } from './schema-parser-builder'

class Base extends TypeMatcher {
  constructor(config = {}) {
    super(config);
    const schemaType = config.schemaType || "json-schema";
    const schemaParserMap = config.schemaParserMap || defaultSchemaParserMap
    const builder = config.createSchemaParserBuilder || createSchemaParserBuilder(schemaParserMap, schemaType)
    const schemaParser = builder.build();
    this.config = { ...schemaParser, ...config };
  }

  createSchemaParserBuilder(schemaParserMap, schemaType) {
    return new SchemaParserBuilder(schemaParserMap, schemaType)
  }
}

export { Base };
