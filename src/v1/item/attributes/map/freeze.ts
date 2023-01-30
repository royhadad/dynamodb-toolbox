import type { RequiredOption } from '../constants/requiredOptions'
import { validateAttributeProperties } from '../shared/validate'
import { freezeAttribute, FreezeAttribute } from '../freeze'
import {
  $type,
  $attributes,
  $required,
  $hidden,
  $key,
  $open,
  $savedAs,
  $default
} from '../constants/attributeOptions'
import type { MapAttributeAttributes } from '../types/attribute'

import type { _MapAttribute, MapAttribute } from './interface'

export type FreezeMapAttribute<_MAP_ATTRIBUTE extends _MapAttribute> = MapAttribute<{
  attributes: _MapAttribute extends _MAP_ATTRIBUTE
    ? MapAttributeAttributes
    : {
        [KEY in keyof _MAP_ATTRIBUTE[$attributes]]: FreezeAttribute<
          _MAP_ATTRIBUTE[$attributes][KEY]
        >
      }
  required: _MAP_ATTRIBUTE[$required]
  hidden: _MAP_ATTRIBUTE[$hidden]
  key: _MAP_ATTRIBUTE[$key]
  open: _MAP_ATTRIBUTE[$open]
  savedAs: _MAP_ATTRIBUTE[$savedAs]
  default: _MAP_ATTRIBUTE[$default]
}>

type MapAttributeFreezer = <_MAP_ATTRIBUTE extends _MapAttribute>(
  _mapAttribute: _MAP_ATTRIBUTE,
  path: string
) => FreezeMapAttribute<_MAP_ATTRIBUTE>

/**
 * Freezes a map instance
 *
 * @param _mapAttribute MapAttribute
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return void
 */
export const freezeMapAttribute: MapAttributeFreezer = <_MAP_ATTRIBUTE extends _MapAttribute>(
  _mapAttribute: _MAP_ATTRIBUTE,
  path: string
) => {
  validateAttributeProperties(_mapAttribute, path)

  const attributesSavedAs = new Set<string>()

  const keyAttributesNames = new Set<string>()

  const requiredAttributesNames: Record<RequiredOption, Set<string>> = {
    always: new Set(),
    atLeastOnce: new Set(),
    onlyOnce: new Set(),
    never: new Set()
  }

  const attributes: _MAP_ATTRIBUTE[$attributes] = _mapAttribute[$attributes]
  const frozenAttributes: {
    [KEY in keyof _MAP_ATTRIBUTE[$attributes]]: FreezeAttribute<_MAP_ATTRIBUTE[$attributes][KEY]>
  } = {} as any

  for (const attributeName in attributes) {
    const attribute = attributes[attributeName]

    const attributeSavedAs = attribute[$savedAs] ?? attributeName
    if (attributesSavedAs.has(attributeSavedAs)) {
      throw new DuplicateSavedAsAttributesError({ duplicatedSavedAs: attributeSavedAs, path })
    }
    attributesSavedAs.add(attributeSavedAs)

    if (attribute[$key]) {
      keyAttributesNames.add(attributeName)
    }

    requiredAttributesNames[attribute[$required]].add(attributeName)

    frozenAttributes[attributeName] = freezeAttribute(attribute, [path, attributeName].join('.'))
  }

  return {
    path,
    type: _mapAttribute[$type],
    attributes: frozenAttributes,
    keyAttributesNames,
    requiredAttributesNames,
    required: _mapAttribute[$required],
    hidden: _mapAttribute[$hidden],
    key: _mapAttribute[$key],
    open: _mapAttribute[$open],
    savedAs: _mapAttribute[$savedAs],
    default: _mapAttribute[$default]
  }
}

export class DuplicateSavedAsAttributesError extends Error {
  constructor({ duplicatedSavedAs, path }: { duplicatedSavedAs: string; path: string }) {
    super(
      `Invalid map attributes at path ${path}: More than two attributes are saved as '${duplicatedSavedAs}'`
    )
  }
}
