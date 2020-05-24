import { wrapMapToModuleConstant, wrapMapToModuleFunc } from './wrap-map'

export function whenMapTargetsToModuleIsFunction(mapTargetsToModule) {
  return (typeof mapTargetsToModule === 'function')
    ? wrapMapToModuleFunc(mapTargetsToModule, 'mapTargetsToModule')
    : undefined
}
export function whenMapTargetsToModuleIsArray(mapTargetsToModule) {
  return Array.isArray(mapTargetsToModule)
    ? wrapMapToModuleConstant(() => mapTargetsToModule)
    : undefined
}

export function whenMapTargetsToModuleIsMissing(mapTargetsToModule) {
  return (!mapTargetsToModule)
    ? wrapMapToModuleConstant(() => ([]))
    : undefined
}

export default [
  whenMapTargetsToModuleIsFunction,
  whenMapTargetsToModuleIsArray,
  whenMapTargetsToModuleIsMissing
]
