import { MaxDate, maxDate } from './max-date'
import { MinDate, minDate } from './min-date'

export const factories = {
  minDate,
  maxDate,
}

export const classMap = {
  MaxDate,
  MinDate,
}

export const constraints = {
  classMap: {
    minDate: MinDate,
    maxDate: MaxDate
  }
}
