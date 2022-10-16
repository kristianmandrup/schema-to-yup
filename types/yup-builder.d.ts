export function buildYup(schema: any, config: {}, parentNode: any): yup.ObjectSchema<{
    [x: string]: yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>;
}, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
    [x: string]: yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>;
}>, import("yup/lib/object").AssertsShape<{
    [x: string]: yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>;
}>>;
export class YupBuilder extends Base {
    constructor(schema: any, config: {}, parentNode: any);
    init(schema: any, config: any, parentNode: any): void;
    schema: any;
    parentNode: any;
    type: any;
    properties: any;
    additionalProps: any;
    required: any;
    shapeConfig: {};
    validSchema: boolean;
    get validator(): typeof yup;
    setLocale(): void;
    getAdditionalProperties(schema: any): any;
    getRequired(obj: any): any;
    getProps(obj: any): any;
    getType(obj: any): any;
    getName(obj: any): any;
    get yupSchema(): yup.ObjectSchema<{
        [x: string]: yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        [x: string]: yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>;
    }>, import("yup/lib/object").AssertsShape<{
        [x: string]: yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>;
    }>>;
    buildProperties(): {};
    getRequiredPropsList(): any[];
    buildProp(propObj: any, key: any): any;
    setRequired(value: any, key: any, required: any): any;
    setPropEntry(propObj: any, key: any, value: any): void;
    isRequired(value: any): any;
    propsToShape(opts?: {}): {};
    objPropsShape: {};
    addPropsShape: any;
    additionalPropsToShape(opts: any, shape: any): any;
    objPropsToShape({ name }: {
        name: any;
    }): {};
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
