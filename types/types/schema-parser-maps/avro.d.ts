export default defaults;
declare namespace defaults {
    function getProps(obj: any): any;
    function getType(obj: any): any;
    function getName(obj: any): any;
    function getConstraints(obj: any): any;
    function isString(obj: any): boolean;
    function isArray(obj: any): boolean;
    function isInteger(obj: any): boolean;
    function isFloat(obj: any): boolean;
    function isDouble(obj: any): boolean;
    function isBoolean(obj: any): boolean;
    function isDate(obj: any): boolean;
    function isNumber(obj: any): boolean;
    function isObject(obj: any): boolean;
    function isRequired(obj: any): any;
}
