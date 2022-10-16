export function createMultiPropertyValueResolver(opts: any, config: any): MultiPropertyValueResolver;
export class MultiPropertyValueResolver extends BasePropertyValueResolver {
    resolve(): any;
    oneOf(): any;
    notOneOf(): any;
    createEntry(value: any): any;
    normalizedValue(value: any): any;
    mixed(): any;
}
import { BasePropertyValueResolver } from "./base-property-value-resolver";
