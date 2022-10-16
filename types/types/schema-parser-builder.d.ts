export function createSchemaParserBuilder(schemaParserMap: any, schemaType: any): SchemaParserBuilder;
export class SchemaParserBuilder {
    constructor(schemaParserMap: any, name: any);
    schemaParserMap: any;
    name: any;
    lookup(name?: any): any;
    build(): any;
    extend(name: any): void;
}
