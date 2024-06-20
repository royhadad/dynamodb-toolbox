import type { Schema, SchemaAction } from 'v1/schema/index.js'
import type { Attribute } from 'v1/schema/attributes/index.js'

import type {
  FormatOptions,
  FormattedValueOptions,
  FormattedValueDefaultOptions,
  FromFormatOptions
} from './types.js'
import { formatAttrRawValue, AttrFormattedValue } from './attribute.js'
import { formatSchemaRawValue, SchemaFormattedValue } from './schema.js'

/**
 * Returns the type of formatted values for a given Schema or Attribute
 *
 * @param Schema Schema | Attribute
 * @return Value
 */
export type FormattedValue<
  SCHEMA extends Schema | Attribute,
  OPTIONS extends FormattedValueOptions<SCHEMA> = FormattedValueDefaultOptions
> = SCHEMA extends Schema
  ? SchemaFormattedValue<SCHEMA, OPTIONS>
  : SCHEMA extends Attribute
  ? AttrFormattedValue<SCHEMA, OPTIONS>
  : never

export class Formatter<SCHEMA extends Schema | Attribute = Schema | Attribute>
  implements SchemaAction<SCHEMA> {
  schema: SCHEMA

  constructor(schema: SCHEMA) {
    this.schema = schema
  }

  format<OPTIONS extends FormatOptions<SCHEMA>>(
    rawValue: unknown,
    options: OPTIONS = {} as OPTIONS
  ): FormattedValue<SCHEMA, FromFormatOptions<SCHEMA, OPTIONS>> {
    type Formatted = FormattedValue<SCHEMA, FromFormatOptions<SCHEMA, OPTIONS>>

    if (this.schema.type === 'schema') {
      return formatSchemaRawValue(this.schema, rawValue, options) as Formatted
    } else {
      return formatAttrRawValue(this.schema, rawValue, options) as Formatted
    }
  }
}
