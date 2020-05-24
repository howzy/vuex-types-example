import { wrapMapToModuleConstant, wrapMapToModuleFunc } from './wrap-map'

export function whenMapTypesToModuleIsFunction(mapTypesToModule) {
  return (typeof mapTypesToModule === 'function')
    ? wrapMapToModuleFunc(mapTypesToModule, 'mapTypesToModule')
    : undefined
}
export function whenMapTypesToModuleIsArray(mapTypesToModule) {
  return Array.isArray(mapTypesToModule)
    ? wrapMapToModuleConstant(() => mapTypesToModule)
    : undefined
}

export function whenMapTypesToModuleIsMissing(mapTypesToModule) {
  return (!mapTypesToModule)
    ? wrapMapToModuleConstant(() => ([]))
    : undefined
}

export default [
  whenMapTypesToModuleIsFunction,
  whenMapTypesToModuleIsArray,
  whenMapTypesToModuleIsMissing
]
