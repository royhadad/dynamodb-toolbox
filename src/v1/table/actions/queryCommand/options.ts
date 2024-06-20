import type { TableV2 } from 'v1/table/index.js'
import type { EntityV2 } from 'v1/entity/index.js'
import type { EntityPathsIntersection } from 'v1/entity/actions/parsePaths.js'
import type { Condition } from 'v1/entity/actions/parseCondition.js'
import type { CapacityOption } from 'v1/options/capacity.js'
import type {
  SelectOption,
  AllProjectedAttributesSelectOption,
  SpecificAttributesSelectOption
} from 'v1/options/select.js'

import type { Query } from './types.js'

export type QueryOptions<
  TABLE extends TableV2 = TableV2,
  ENTITIES extends EntityV2[] = EntityV2[],
  QUERY extends Query<TABLE> = Query<TABLE>
> = {
  capacity?: CapacityOption
  exclusiveStartKey?: Record<string, unknown>
  limit?: number
  maxPages?: number
  reverse?: boolean
  filters?: EntityV2[] extends ENTITIES
    ? Record<string, Condition>
    : { [ENTITY in ENTITIES[number] as ENTITY['name']]?: Condition<ENTITY> }
} & (QUERY['index'] extends string
  ? {
      // consistent must be false if a secondary index is queried
      consistent?: false
      select?: SelectOption
    }
  : {
      consistent?: boolean
      // "ALL_PROJECTED_ATTRIBUTES" is only available if a secondary index is queried
      select?: Exclude<SelectOption, AllProjectedAttributesSelectOption>
    }) &
  (
    | { attributes?: undefined; select?: SelectOption }
    | {
        attributes: EntityPathsIntersection<ENTITIES>[]
        // "SPECIFIC_ATTRIBUTES" is the only valid option if projectionExpression is present
        select?: SpecificAttributesSelectOption
      }
  )
