export class Guard extends Base {
    constructor(obj: any, config: any);
    obj: any;
    isValid(): boolean;
    verify(): boolean;
}
import { Base } from "./base";
