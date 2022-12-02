import type { _MapAttributeAttributes, Narrow } from './attributes/types'
import type { _Item } from './interface'

type ItemTyper = <_MAP_ATTRIBUTE_ATTRIBUTES extends _MapAttributeAttributes = {}>(
  _attributes: Narrow<_MAP_ATTRIBUTE_ATTRIBUTES>
) => _Item<_MAP_ATTRIBUTE_ATTRIBUTES>

// TODO: Enable item opening
/**
 * Defines an Entity items shape
 *
 * @param attributes Object of attributes
 * @return Item
 */
export const item: ItemTyper = <_MAP_ATTRIBUTE_ATTRIBUTES extends _MapAttributeAttributes = {}>(
  attributes: Narrow<_MAP_ATTRIBUTE_ATTRIBUTES>
): _Item<_MAP_ATTRIBUTE_ATTRIBUTES> =>
  ({
    _type: 'item',
    _open: false,
    _attributes: attributes
  } as _Item<_MAP_ATTRIBUTE_ATTRIBUTES>)
