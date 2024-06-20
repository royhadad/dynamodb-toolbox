import { isFunction } from 'v1/utils/validation/isFunction.js'

import type { AttributeValue } from '../attributes/index.js'

export const isDynamicDefault = (
  defaultValue: unknown
): defaultValue is (input?: unknown) => AttributeValue => isFunction(defaultValue)
