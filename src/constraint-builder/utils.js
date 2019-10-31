import * as yup from "yup";

export const yupTypeFor = type => typeof type === "string" && yup[type]();

const error = (msg, data) => {
  data ? console.error(msg, data) : console.error(msg);
  throw `contraintFnFor: ${msg}`;
};

export const contraintFnFor = (opts = {}) => {
  const { methodName, type, yupTypeInst } = opts;
  if (!methodName) error("missing methodName", opts);
  const inst = yupTypeInst || yupTypeFor(type);
  if (!inst) error("missing yup type instance", opts);
  const fn = inst[methodName];
  if (!fn)
    error(`invalid yup ${type} method: ${methodName}`, { inst, ...opts });
  return fn.bind(inst);
};
