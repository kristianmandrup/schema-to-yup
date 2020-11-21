import { IsType, isType } from './is-type'
import { Label, label } from './label'
import { OneOf, oneOf } from './one-of'
import { NotOneOf, notOneOf } from './not-one-of'
import { Nullable, nullable } from './nullable'
import { When, when } from './when'

export const factories = {
  isType,
  label,
  oneOf,
  notOneOf,
  nullable,
  when
}

export const classMap = {
  IsType,
  Label,
  OneOf,
  NotOneOf,
  Nullable,
  When
}

export const constraints = {
  classMap: {
    isType: IsType,
    label: Label,    
    oneOf: OneOf,
    notOneOf: NotOneOf,
    nullable: Nullable,
    when: When
  }
}
