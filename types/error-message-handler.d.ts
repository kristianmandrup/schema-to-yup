export class ErrorMessageHandler extends TypeMatcher {
    constructor(typeHandler: any, config?: {});
    typeHandler: any;
    init(): void;
    constraints: any;
    errMessages: any;
    key: any;
    value: any;
    parentNode: any;
    keyPath: any;
    type: any;
    description: any;
    title: any;
    errMessageMap(value?: {}): any;
    get errMessageKey(): any;
    get errMessagesMapKey(): any;
    setErrMessage(): ErrorMessageHandler;
    validationErrorMessage(msgName: any): any;
    errMessageFor(msgName: any): any;
}
import { TypeMatcher } from "./types/_type-matcher";
