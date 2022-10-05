import { validateAny } from './any'
import { validateLeaf } from './leaf'
import { validateSet } from './set'
import { validateList } from './list'
import { validateMap } from './map'
import type { Attribute } from './types/attribute'

/**
 * Validates an attribute definition
 *
 * @param attribute Attribute
 * @param path _(optional)_ Path of the attribute in the related item (string)
 * @return void
 */
export const validateAttribute = <AttributeInput extends Attribute>(
  attribute: AttributeInput,
  path?: string
): void => {
  switch (attribute._type) {
    case 'boolean':
    case 'binary':
    case 'number':
    case 'string':
      return validateLeaf(attribute, path)
    case 'set':
      return validateSet(attribute, path)
    case 'list':
      return validateList(attribute, path)
    case 'map':
      return validateMap(attribute, path)
    case 'any':
      return validateAny(attribute, path)
  }
}
