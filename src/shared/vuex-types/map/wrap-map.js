
export function wrapMapToModuleConstant(getConstant) {
  return function initConstantSelector() {
    const constant = getConstant()
    function constantSelector() { return constant }
    return constantSelector
  }
}

export function wrapMapToModuleFunc(mapToModule, methodName) {
  return function initProxySelector() {
    return mapToModule
  }
}
