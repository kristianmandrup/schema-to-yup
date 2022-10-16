export function createObjectHandler(config?: {}): ObjectHandler;
export class ObjectHandler {
    constructor(config?: {});
    config: {};
    schema: any;
    isObject(obj: any): any;
    handle(obj: any): any;
}
