import type { EntityV2 } from 'v1/entity/index.js'
import { EntityConditionParser } from 'v1/entity/actions/parseCondition.js'
import { rejectExtraOptions } from 'v1/options/rejectExtraOptions.js'

import type { UpdateItemTransactionOptions } from '../options.js'
import type { TransactUpdateItemParams } from './transactUpdateItemParams.js'

type TransactionOptions = Omit<TransactUpdateItemParams, 'TableName' | 'Key' | 'UpdateExpression'>

export const parseUpdateItemTransactionOptions = <ENTITY extends EntityV2>(
  entity: ENTITY,
  updateItemTransactionOptions: UpdateItemTransactionOptions<ENTITY>
): TransactionOptions => {
  const transactionOptions: TransactionOptions = {}

  const { condition, ...extraOptions } = updateItemTransactionOptions
  rejectExtraOptions(extraOptions)

  if (condition !== undefined) {
    const {
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ConditionExpression
    } = entity.build(EntityConditionParser).parse(condition).toCommandOptions()

    transactionOptions.ExpressionAttributeNames = ExpressionAttributeNames
    transactionOptions.ExpressionAttributeValues = ExpressionAttributeValues
    transactionOptions.ConditionExpression = ConditionExpression
  }

  return transactionOptions
}
