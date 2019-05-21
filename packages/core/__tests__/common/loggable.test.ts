import { Loggable } from "../../lib/common";

const config = {
  log: (...args: any[]) => args
};
const log = new Loggable(config);

describe("Loggable", () => {
  describe("warn", () => {
    describe("method, msg", () => {
      expect(log.warn("x", "y")).toEqual(["x", "y"]);
    });

    describe("w value arg", () => {
      expect(log.warn("x", "y", "z")).toEqual(["x", "y", "z"]);
    });
  });

  describe("error", () => {
    describe("method, msg", () => {
      expect(log.error("x", "y")).toEqual(["x", "y"]);
    });

    describe("w value arg", () => {
      expect(log.error("x", "y", "z")).toEqual(["x", "y", "z"]);
    });
  });

  describe("logInfo", () => {
    describe("method, msg", () => {
      expect(log.logInfo("x", "y")).toEqual(["x", "y"]);
    });

    describe("w value arg", () => {
      expect(log.logInfo("x", "y", "z")).toEqual(["x", "y", "z"]);
    });
  });
});
