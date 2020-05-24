import { extend } from "../util";

export default function createEffect(target) {
  const targetedMergeStrategy = mergeStrategies[target];
  return function (selector) {
    return function (state, payload) {
      const prevTargetedState = extend({}, state[target]);
      const targetedState = targetedMergeStrategy(prevTargetedState, (payload.selector || selector)(payload, state))
    }
  }
}