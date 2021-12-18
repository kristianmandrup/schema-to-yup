export const createSchemaParserBuilder = (schemaParserMap, schemaType) => {
  return new SchemaParserBuilder(schemaParserMap, schemaType)
}

export class SchemaParserBuilder {
  constructor(schemaParserMap, name) {
    this.schemaParserMap = schemaParserMap
    this.name = name
  }

  lookup(name = this.name) {
    return this.schemaParserMap[name]
  }  

  build() {
    const entry = this.lookup();
    if (entry.extends) {
      const result = this.extend(entry.extends)
      if (result) return result
    }
    return entry
  }

  extend(name) {
    const baseMap = this.lookup(name)
    if (!baseMap) return 
    entry = {
      ...baseMap,
      ...this.lookup()
    }
  }
}