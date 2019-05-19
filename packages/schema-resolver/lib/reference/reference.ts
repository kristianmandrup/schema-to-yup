import { InfoHandler } from "../info";
import dotProp from "dot-prop";
import { createRefValidator } from "./ref-validator";
import { classify, stringify } from "../util";

export const createReference = (opts, config = {}) =>
  new Reference(opts, config);

export class Reference extends InfoHandler {
  reference: any; // IRef
  schema: any; // ISchema
  visitedPaths: string[];
  refValidator: any; // IRefValidator
  hits: any;
  wasCacheHit: boolean;
  protected _refObject: any;

  constructor(opts: any = {}, config: any = {}) {
    super(config);
    const { schema, reference } = opts;
    this.config = config;
    this.reference = reference;
    this.schema = schema;
    this.visitedPaths = config.visitedPaths || {};
    this.refValidator = createRefValidator(config);
    this.hits = config.hits || {};
    this.wasCacheHit = false;
  }

  get state() {
    return {
      hits: this.hits,
      visitedPaths: this.visitedPaths
    };
  }

  get $config() {
    return {
      ...this.config,
      ...this.state
    };
  }

  get normalizedRef() {
    this.validateRef();
    return this.reference.replace(/^#\//, "");
  }

  referencePathResolvedAndVisited(obj) {
    this.visitedPaths[this.cacheKey] = obj;
  }

  get cacheKey() {
    return this.dotPath;
  }

  get referenceFromCache() {
    const hit = this.visitedPaths[this.cacheKey];
    if (!hit) return;
    this.wasCacheHit = true;
    this.hits[this.reference] = (this.hits[this.reference] || 0) + 1;
    return hit;
  }

  get name() {
    return (this.refObject && this.refObject.name) || this.refName;
  }

  get typeName() {
    return classify(this.name);
  }

  get refName() {
    const paths = this.normalizedRef.split("/");
    return paths[paths.length - 1];
  }

  get dotPath() {
    return this.normalizedRef.replace("/", ".");
  }

  get refObject() {
    this._refObject = this._refObject || this.resolvedRefObject;
    return this._refObject;
  }

  get resolvedRefObject() {
    return this.referenceFromCache || this.resolveRefObject;
  }

  validateRef() {
    this.refValidator.validate(this.reference);
  }

  get resolveRefObject() {
    this.validateRef();
    this.handleFoundReference();

    const obj = dotProp.get(this.schema, this.dotPath);
    this.referenceNotAnObject(obj);
    this.referencePathResolvedAndVisited(obj);
    return obj;
  }

  handleFoundReference() {
    const found = dotProp.has(this.schema, this.dotPath);
    if (found) return;
    this.error(
      "resolveRefObject",
      `No value found in schema at: ${this.dotPath} - ${stringify(this.schema)}`
    );
  }

  referenceNotAnObject(obj) {
    typeof obj !== "object" &&
      this.error(
        "resolveRefObject",
        `No object value found at: ${this.dotPath} - - ${stringify(
          this.schema
        )}`
      );
  }
}
