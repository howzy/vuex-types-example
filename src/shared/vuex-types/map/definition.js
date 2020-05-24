import { wrapMapToModuleConstant, wrapMapToModuleFunc } from './wrap-map'
import { isPlainObject } from '@/shared/util';

export function whenMapDefinitionToModuleIsFunction(mapDefinitionToModule) {
  return (typeof mapDefinitionToModule === 'function')
    ? wrapMapToModuleFunc(mapDefinitionToModule, 'mapDefinitionToModule')
    : undefined
}
export function whenMapDefinitionToModuleIsObject(mapDefinitionToModule) {
  return isPlainObject(mapDefinitionToModule)
    ? wrapMapToModuleConstant(() => mapDefinitionToModule)
    : undefined
}

export function whenMapDefinitionToModuleIsMissing(mapDefinitionToModule) {
  return (!mapDefinitionToModule)
    ? wrapMapToModuleConstant(() => ({}))
    : undefined
}

export default [
  whenMapDefinitionToModuleIsFunction,
  whenMapDefinitionToModuleIsObject,
  whenMapDefinitionToModuleIsMissing
]
