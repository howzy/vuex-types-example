import effects from '../effects'
export default function completeTypes(types, targets) {
  let targetsWithEffect = targets.length
    ? targets.reduce((arr, target) => {
      arr.push.apply(arr, effects.types.map(type => `SET_${target.toUpperCase()}_${type.toUpperCase()}`))
      return arr;
    }, []) : []
  return (
    Array.isArray(types)
      ? types
      : [types]
  ).concat(effects.types.map(type => `SET_${type.toUpperCase()}`)).concat(targetsWithEffect);
}