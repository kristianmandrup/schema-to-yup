import { Loggable } from "../../../../_loggable";

export class BasicConstraint extends Loggable {
  constructor(typeHandler) {
    super(typeHandler.config);
    this.typeHandler = typeHandler;
  }
}
