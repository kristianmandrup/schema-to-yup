import { Integer, integer } from './integer'
import { Positive, positive } from './positive'
import { Negative, negative } from './negative'
import { Round, round } from './round'
import { Range, range } from './range'
import { Truncate, truncate } from './truncate'

export const factories = {
  integer,
  positive,
  negative,
  round,
  range,
  truncate
}

export const classMap = {
  Integer,
  Positive,
  Negative,
  Round,
  Range,
  Truncate
}

export const constraints = {
  classMap: {
    integer: Integer,
    positive: Positive,
    negative: Negative,
    round: Round,
    range: Range,
    truncate: Truncate
  }
}

