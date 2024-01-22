import cloneDeep from 'lodash.clonedeep'

import type { AttributeBasicValue, AttributeValue, PrimitiveAttribute } from 'v1/schema'
import type { ExtensionParser, ParsingOptions } from 'v1/validation/parseClonedInput/types'
import { parseAttributeClonedInput } from 'v1/validation/parseClonedInput/attribute'
import { isArray } from 'v1/utils/validation/isArray'
import { DynamoDBToolboxError } from 'v1/errors'

import type { ReferenceExtension, UpdateItemInputExtension } from 'v1/operations/updateItem/types'
import { $SUM, $SUBTRACT, $ADD } from 'v1/operations/updateItem/constants'
import {
  hasSumOperation,
  hasSubtractOperation,
  hasAddOperation
} from 'v1/operations/updateItem/utils'

import { parseReferenceExtension } from './reference'

const ACCEPTABLE_LENGTH_SET = new Set<number>([1, 2])

export const parseNumberExtension = (
  attribute: PrimitiveAttribute<'number'>,
  inputValue: AttributeValue<UpdateItemInputExtension> | undefined,
  options: ParsingOptions<UpdateItemInputExtension>
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  const { clone = true } = options

  if (hasSumOperation(inputValue)) {
    return {
      isExtension: true,
      *extensionParser() {
        const parsers: Generator<
          AttributeValue<ReferenceExtension>,
          AttributeValue<ReferenceExtension>
        >[] = []

        const isInputValueArray = isArray(inputValue[$SUM])
        if (isInputValueArray) {
          for (const sumElement of inputValue[$SUM]) {
            parsers.push(
              parseAttributeClonedInput<ReferenceExtension, UpdateItemInputExtension>(
                attribute,
                sumElement,
                // References are allowed in sums
                { ...options, parseExtension: parseReferenceExtension }
              )
            )
          }
        }

        if (clone) {
          if (isInputValueArray) {
            const clonedValue = {
              [$SUM]: parsers.map(parser => parser.next().value)
            }
            yield clonedValue

            const linkedValue = {
              [$SUM]: parsers.map(parser => parser.next().value)
            }
            yield linkedValue
          } else {
            const inputClone = { [$SUM]: cloneDeep(inputValue[$SUM]) }

            const clonedValue = inputClone
            yield clonedValue

            const linkedValue = clonedValue
            yield linkedValue
          }
        }

        if (!isInputValueArray || !ACCEPTABLE_LENGTH_SET.has(inputValue[$SUM].length)) {
          throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
            message: `Sum for number attribute ${attribute.path} should be a tuple of length 1 or 2`,
            path: attribute.path,
            payload: {
              received: inputValue[$SUM]
            }
          })
        }

        const parsedValue = { [$SUM]: parsers.map(parser => parser.next().value) }
        yield parsedValue

        const collapsedValue = { [$SUM]: parsers.map(parser => parser.next().value) }
        return collapsedValue
      }
    }
  }

  if (hasSubtractOperation(inputValue)) {
    return {
      isExtension: true,
      *extensionParser() {
        const parsers: Generator<
          AttributeValue<ReferenceExtension>,
          AttributeValue<ReferenceExtension>
        >[] = []

        const isInputValueArray = isArray(inputValue[$SUBTRACT])
        if (isInputValueArray) {
          for (const subtractElement of inputValue[$SUBTRACT]) {
            parsers.push(
              parseAttributeClonedInput<ReferenceExtension, UpdateItemInputExtension>(
                attribute,
                subtractElement,
                // References are allowed in subtractions
                { ...options, parseExtension: parseReferenceExtension }
              )
            )
          }
        }

        if (clone) {
          if (isInputValueArray) {
            const clonedValue = {
              [$SUBTRACT]: parsers.map(parser => parser.next().value)
            }
            yield clonedValue

            const linkedValue = {
              [$SUBTRACT]: parsers.map(parser => parser.next().value)
            }
            yield linkedValue
          } else {
            const inputClone = { [$SUBTRACT]: cloneDeep(inputValue[$SUBTRACT]) }

            const clonedValue = inputClone
            yield clonedValue

            const linkedValue = clonedValue
            yield linkedValue
          }
        }

        if (!isInputValueArray || !ACCEPTABLE_LENGTH_SET.has(inputValue[$SUBTRACT].length)) {
          throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
            message: `Subtraction for number attribute ${attribute.path} should be a tuple of length 1 or 2`,
            path: attribute.path,
            payload: {
              received: inputValue[$SUBTRACT]
            }
          })
        }

        const parsedValue = { [$SUBTRACT]: parsers.map(parser => parser.next().value) }
        yield parsedValue

        const collapsedValue = { [$SUBTRACT]: parsers.map(parser => parser.next().value) }
        return collapsedValue
      }
    }
  }

  if (hasAddOperation(inputValue)) {
    const parser = parseAttributeClonedInput<ReferenceExtension, UpdateItemInputExtension>(
      attribute,
      inputValue[$ADD],
      // References are allowed in additions
      { ...options, parseExtension: parseReferenceExtension }
    )

    return {
      isExtension: true,
      *extensionParser() {
        if (clone) {
          const clonedValue = { [$ADD]: parser.next().value }
          yield clonedValue

          const linkedValue = { [$ADD]: parser.next().value }
          yield linkedValue
        }

        const parsedValue = { [$ADD]: parser.next().value }
        yield parsedValue

        const collapsedValue = { [$ADD]: parser.next().value }
        return collapsedValue
      }
    }
  }

  return {
    isExtension: false,
    basicInput: inputValue as AttributeBasicValue<UpdateItemInputExtension> | undefined
  }
}
