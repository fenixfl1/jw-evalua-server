import { SimpleCondition } from '@src/types/api.types'

interface SimpleWhereBuilderReturn {
  where: string
  values: unknown[]
}

export function simpleWhereBuilder(
  condition: SimpleCondition<any>
): SimpleWhereBuilderReturn {
  let where = 'WHERE 1 = 1'
  const values: unknown[] = []

  Object.entries(condition.condition).forEach(([key, value], index) => {
    where += ` AND "${key}" = $${index + 1}`
    values.push(value)
  })

  return { where, values }
}
