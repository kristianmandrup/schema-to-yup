export function createRegExpConstraint(typer: any, map: any): RegExpConstraint;
export class RegExpConstraint extends Constraint {
    constructor(typer: any, map?: {});
    transform(value: any): RegExp;
    toRegExp(value: any): RegExp;
    isRegExpLike(value: any): boolean;
}
import { Constraint } from "./base";
