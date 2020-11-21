import { CamelCase, camelCase } from './camel-case'
import { ConstantCase, constantCase } from './constant-case'
import { NoUnknown, noUnknown } from './no-unknown'
import { Recursive, recursive } from './recursive'

export const classMap = {
  CamelCase,
  ConstantCase,
  NoUnknown,
  Recursive
}

export const constraints = {
  classMap: {
    camelCase: CamelCase,
    constantCase: ConstantCase,
    noUnknown: NoUnknown,
    recursive: Recursive
  }
}

export const factories = {
  camelCase,
  constantCase,
  noUnknown,
  recursive,
}


