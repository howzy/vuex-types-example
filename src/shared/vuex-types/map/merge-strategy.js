import { isPlainObject, merge } from '@/shared/util'
export function defaultMergeStrategy() {
  return function (prevState, nextState) {
    return merge(prevState, nextState);
  }
}

export function wrapMergeStrategyToFunc(mapMergeStrategy) {
  const mergeStrategy = typeof mapMergeStrategy === 'function'
    ? mapMergeStrategy()
    : mapMergeStrategy;
  function proxy(target) {
    return mergeStrategy[target] || defaultMergeStrategy();
  }
  return proxy;
}

export function whenMergeStrategyIsObjectOrFunction(mapMergeStrategy) {
  return (typeof mapMergeStrategy === 'function' || isPlainObject(mapMergeStrategy))
    ? wrapMergeStrategyToFunc(mapMergeStrategy)
    : undefined
}

export function whenMergeStrategyIsOmitted(mapMergeStrategy) {
  return (!mapMergeStrategy)
    ? () => defaultMergeStrategy()
    : undefined
}

export default [
  whenMergeStrategyIsObjectOrFunction,
  whenMergeStrategyIsOmitted
]


// const mapMergeStrategy = {
//   a(prevState, nextState) {
//     return {

//     }
//   }
// }
