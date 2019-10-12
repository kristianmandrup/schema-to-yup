import * as yup from "yup";

export const yupTypeFor = type => typeof type === "string" && yup[type]();

export const yupContraintFnFor = (opts = {}) => {
  const { methodName, type, yupTypeInst } = opts;
  if (!methodName) return;
  const inst = yupTypeInst || yupTypeFor(type);
  if (!inst) throw "missing yup type instance";
  const fn = inst[methodName];
  if (!fn) throw `invalid yup ${type} method: ${methodName}`;
  return fn.bind(inst);
};
