import { list, map, number } from '~/attributes/index.js'
import { schema } from '~/schema/index.js'

import { ConditionParser } from '../../conditionParser.js'

describe('parseCondition - singleArgFn', () => {
  const simpleSchema = schema({
    num: number()
  })

  test('exists', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({ attr: 'num', exists: true }).toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: 'attribute_exists(#c_1)',
      ExpressionAttributeNames: { '#c_1': 'num' },
      ExpressionAttributeValues: {}
    })
  })

  test('not exists', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({ attr: 'num', exists: false }).toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: 'attribute_not_exists(#c_1)',
      ExpressionAttributeNames: { '#c_1': 'num' },
      ExpressionAttributeValues: {}
    })
  })

  const mapSchema = schema({
    map: map({
      nestedA: map({
        nestedB: number()
      })
    })
  })

  test('deep maps', () => {
    expect(
      mapSchema
        .build(ConditionParser)
        .parse({ attr: 'map.nestedA.nestedB', exists: true })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: 'attribute_exists(#c_1.#c_2.#c_3)',
      ExpressionAttributeNames: {
        '#c_1': 'map',
        '#c_2': 'nestedA',
        '#c_3': 'nestedB'
      },
      ExpressionAttributeValues: {}
    })
  })

  const listSchema = schema({
    listA: list(
      map({
        nested: map({
          listB: list(map({ value: number() }))
        })
      })
    ),
    list: list(list(list(number())))
  })

  test('deep maps and lists', () => {
    expect(
      listSchema
        .build(ConditionParser)
        .parse({ attr: 'listA[1].nested.listB[2].value', exists: true })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: 'attribute_exists(#c_1[1].#c_2.#c_3[2].#c_4)',
      ExpressionAttributeNames: {
        '#c_1': 'listA',
        '#c_2': 'nested',
        '#c_3': 'listB',
        '#c_4': 'value'
      },
      ExpressionAttributeValues: {}
    })
  })

  test('deep lists', () => {
    expect(
      listSchema
        .build(ConditionParser)
        .parse({ attr: 'list[1][2][3]', exists: true })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: 'attribute_exists(#c_1[1][2][3])',
      ExpressionAttributeNames: { '#c_1': 'list' },
      ExpressionAttributeValues: {}
    })
  })
})
