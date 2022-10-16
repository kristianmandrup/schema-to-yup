export class TypeMatcher extends Loggable {
    isNothing(val: any): boolean;
    isPresent(num: any): boolean;
    hasKey(value: any, key: any): boolean;
    toNumber(num: any): number;
    isNumberLike(num: any): boolean;
    isObjectType(obj: any): boolean;
    isArrayType(value: any): boolean;
    isNumberType(num: any): boolean;
    isStringType(val: any): boolean;
    isFunctionType(val: any): boolean;
    isDateType(val: any): boolean;
}
import { Loggable } from "./_loggable";
