export class Constraint extends TypeMatcher {
    constructor(typeHandler: any, map: any);
    map: any;
    typeHandler: any;
    get delegates(): string[];
    add(): void;
    entryNames(entry: any): any[];
    addConstraints(method: any, names?: any[]): Constraint;
    validateAndTransform(name: any): any;
    invalidMsg(name: any, value: any): string;
    get explainConstraintValidMsg(): string;
    invalidConstraintMsg(name: any, value: any): string;
    validate(name: any, cv: any): Constraint;
    isValidConstraint(value: any): boolean;
    handleInvalidConstraint(name: any, value: any): Constraint;
}
import { TypeMatcher } from "../_type-matcher";
