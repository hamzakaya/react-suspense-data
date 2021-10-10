import { DependencyList, ReactElement, useMemo } from 'react'

const PENDING = Symbol('suspense.pending')
const SUCCESS = Symbol('suspense.success')
const ERROR = Symbol('suspense.error')

type RenderCallback<T> = (data: T) => ReactElement<any, any> | null

export interface SuspendableProps<T> {
  data: () => T
  children: RenderCallback<T>
}

/**
 * @param data
 * @param children
 * @constructor
 */
export const Suspendable = <T>({ data, children }: SuspendableProps<T>) => {
  return children(data())
}

/**
 * @param promiseProvider
 * @param deps
 */
export function useSuspendableData<T>(
  promiseProvider: () => PromiseLike<T>,
  deps: DependencyList | undefined,
): () => T {
  if (typeof promiseProvider !== 'function') {
    throw Error('promiseProvider is not a function')
  }

  return useMemo(() => {
    let status = PENDING
    let error: any
    let result: T
    const suspender = Promise.resolve()
      .then(() => promiseProvider())
      .then(r => {
        status = SUCCESS
        result = r
      })
      .catch(err => {
        status = ERROR
        error = err
      })
    return () => {
      switch (status) {
        case PENDING:
          throw suspender
        case ERROR:
          throw error
        case SUCCESS:
          return result
        default:
          throw Error('internal error')
      }
    }
  }, deps)
}
