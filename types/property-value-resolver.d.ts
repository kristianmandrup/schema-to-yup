export function createPropertyValueResolver(opts: any, config: any, entryHandler: any): PropertyValueResolver;
export class PropertyValueResolver extends BasePropertyValueResolver {
    initResolvers(): void;
    multiTypeResolver: any;
    singleTypeResolver: any;
    createMultiTypeResolver(): MultiPropertyValueResolver;
    createSingleTypeResolver(): SinglePropertyValueResolver;
    resolve(): any;
    toMultiType(): any;
    toSingleType(): any;
    toDefaultEntry(): boolean;
    defaultType(): boolean;
}
import { BasePropertyValueResolver } from "./base-property-value-resolver";
import { MultiPropertyValueResolver } from "./multi-property-value-resolver";
import { SinglePropertyValueResolver } from "./single-property-value-resolver";
