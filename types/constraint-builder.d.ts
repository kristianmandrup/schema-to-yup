export class ConstraintBuilder extends TypeMatcher {
    constructor(typeHandler: any, config?: {});
    typeHandler: any;
    type: any;
    builder: any;
    constraintsAdded: {};
    get delegators(): string[];
    build(propName: any, opts?: {}): any;
    idObj: {
        propName: any;
        method: any;
        constraintName: any;
        key: any;
    };
    base: any;
    yupRefMap(): {
        string: string[];
        number: string[];
        date: string[];
        array: string[];
    };
    getFirstValue(potentialValues: any, opts?: {}): any;
    nonPresentConstraintValue(constraintValue: any, { constraintName, constraintFn, errFn }: {
        constraintName: any;
        constraintFn: any;
        errFn: any;
    }): any;
    presentConstraintValue(constraintValue: any, { constraintName, constraintFn, errFn }: {
        constraintName: any;
        constraintFn: any;
        errFn: any;
    }): any;
    multiValueConstraint(values: any, { constraintFn, constraintName, errFn }: {
        constraintFn: any;
        constraintName: any;
        errFn: any;
    }): any;
    callConstraintFn(constraintFn: any, constraintName: any, values: any, errFn: any): any;
    isMultiArgsCall(constraintName: any): any;
    get multiArgsValidatorMethods(): any;
    isNoValueConstraint(constraintName: any): boolean;
    get noValueConstraints(): string[];
    addTrueValueConstraint(propName: any, { constraintName, errName }?: {
        constraintName: any;
        errName: any;
    }): any;
    addConstraint(propName: any, opts: any): any;
    onConstraintAdded({ method, name, value }: {
        method: any;
        name: any;
        value: any;
    }): any;
    get constraintsMap(): {
        simple: string[];
        value: string[];
    };
    logDetailed(label: any, ...values: any[]): void;
    validationErrorMessage(msgName: any): any;
    get aliasMap(): {
        oneOf: string;
        enum: string;
        anyOf: string;
    };
}
import { TypeMatcher } from "./types/_type-matcher";
