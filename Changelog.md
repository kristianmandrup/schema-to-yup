# Changelog

# 1.11.18

Fixes `itemsOf` for array type.

# 1.11.4

Added new `refValue` field to allow validating via previous property value

## 1.11.3

Fixed bug when constraint value is 0 (such as in Person schema example!)
Added better and more detailed logging and logging options

## 1.10.4

Add support for yup `setLocale` API (by `@gabrielburich`)

## 1.6.4

List similar JSON schema -> model projects

## 1.6.3

- [Fix pattern matching](https://github.com/kristianmandrup/json-schema-to-yup/pull/4)

## 1.6.1

- [Email fix](https://github.com/kristianmandrup/json-schema-to-yup/pull/3) by [@matthewfaircliff](https://github.com/matthewfaircliff)

Cheers :)

## 1.6.0

Fixed core bug: Now updates this.base with every constraint

## 1.5.1

- Fixed `errMessages` error to fix [issues/1](https://github.com/kristianmandrup/json-schema-to-yup/issues/1)
