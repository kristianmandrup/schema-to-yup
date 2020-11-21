import { Email, email } from './email'
import { Format, format } from './format'
import { Lowercase, lowercase } from './lowercase'
import { MaxLength, maxLength } from './max-length'
import { MinLength, minLength } from './min-length'
import { Pattern, pattern } from './pattern'
import { Trim, trim } from './trim'
import { Uppercase, uppercase } from './uppercase'
import { Url, url } from './url'

export const factories = {
  email,
  format,
  lowercase,
  maxLength,
  minLength,
  pattern,
  trim,
  uppercase,
  url
}

export const classMap = {
  Email,
  Format,
  Lowercase,
  MaxLength,
  MinLength,
  Pattern,
  Trim,
  Uppercase,
  Url
}

export const constraints = {
  classMap: {
    email: Email,
    format: Format,
    lowercase: Lowercase,
    maxLength: MaxLength,
    minLength: MinLength,
    pattern: Pattern,
    trim: Trim,
    uppercase: Uppercase,
    url: Url
  }
}
