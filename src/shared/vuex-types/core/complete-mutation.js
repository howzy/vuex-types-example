import effects from '../effects';
import { merge } from '@/shared/util';
import { defaultMergeStrategy } from '../map/merge-strategy';
export default function completeMutation(initMapMergeStrategy, targets) {
  const mutations = {};
  effects.types.forEach(type => {
    mutations[`SET_${type.toUpperCase()}`] = effects[`on${type}`]({
      mergeStrategy: defaultMergeStrategy()
    })
  });
  if (targets && targets.length) {
    targets.forEach(target => {
      effects.types.forEach(type => {
        const effectHandler = effects[`on${type}`]({ mergeStrategy: initMapMergeStrategy(target) });
        mutations[`SET_${target.toUpperCase()}_${type.toUpperCase()}`] = function (state, payload) {
          payload = Object.assign({}, payload || {}, { target });
          effectHandler.call(this, state, payload);
        }
      });
    });
  }
  return mutations;
}
