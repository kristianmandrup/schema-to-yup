export function buildYup(schema: any, config?: {}, parentNode?: any): yup.ObjectSchema<any, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<any>, import("yup/lib/object").AssertsShape<any>>;
export class YupBuilder extends Base {
    constructor(schema: any, config?: {}, parentNode?: any);
    init(schema: any, config: any, parentNode?: any): void;
    schema: any;
    parentNode: any;
    type: any;
    properties: any;
    additionalProps: any;
    required: any;
    shapeConfig: any;
    validSchema: boolean;
    get validator(): typeof yup;
    setLocale(): void;
    getAdditionalProperties(schema: any): any;
    getRequired(obj: any): any;
    getProps(obj: any): any;
    getType(obj: any): any;
    getName(obj: any): any;
    get yupSchema(): yup.ObjectSchema<any, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<any>, import("yup/lib/object").AssertsShape<any>>;
    buildProperties(): {};
    getRequiredPropsList(): any[];
    buildProp(propObj: any, key: any): any;
    setRequired(value: any, key: any, required: any): any;
    setPropEntry(propObj: any, key: any, value: any): void;
    isRequired(value: any): any;
    propsToShape(opts?: {}): any;
    objPropsShape: any;
    addPropsShape: any;
    additionalPropsToShape(shape: any, opts?: {}): any;
    objPropsToShape({ name }?: {
        name: any;
    }): any;
    reducePropToShape(acc: any, key: any, prop: any): any;
    propToYupSchemaEntry({ name, key, value }: {
        name: any;
        key: any;
        value?: {};
    }): any;
    createYupSchemaEntry(opts?: {}): any;
    onConstraintAdded(constraint: any): void;
}
import * as yup from "yup";
import { Base } from "./entry";
