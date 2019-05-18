export function isObject(type) {
  return type && type === "object";
}

export function isObjectType(obj) {
  return obj === Object(obj);
}
