import { wrapMapToModuleConstant, wrapMapToModuleFunc } from './wrap-map'
import { isPlainObject } from '@/shared/util';

export function whenMapDefaultStateToModuleIsFunction(mapDefaultStateToModule) {
  return (typeof mapDefaultStateToModule === 'function')
    ? wrapMapToModuleFunc(mapDefaultStateToModule, 'mapDefaultStateToModule')
    : undefined
}
export function whenMapDefaultStateToModuleIsObject(mapDefaultStateToModule) {
  return isPlainObject(mapDefaultStateToModule)
    ? wrapMapToModuleConstant(() => mapDefaultStateToModule)
    : undefined
}

export function whenMapDefaultStateToModuleIsMissing(mapDefaultStateToModule) {
  return (!mapDefaultStateToModule)
    ? wrapMapToModuleConstant(() => ({}))
    : undefined
}

export default [
  whenMapDefaultStateToModuleIsFunction,
  whenMapDefaultStateToModuleIsObject,
  whenMapDefaultStateToModuleIsMissing
]
