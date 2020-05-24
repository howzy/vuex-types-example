import createTypes from './create-types'
import completeTypes from './complete-types'
import completeState from './complete-state'
import completeMutation from './complete-mutation'
import defaultMapTypesToModuleFactories from '../map/type';
import defaultMapTargetsToModuleFactories from '../map/target';
import defaultMapDefinitionToModuleFactories from '../map/definition';
import defaultMapMergeStrategyFactories from '../map/merge-strategy';
import { merge } from '@/shared/util';


function match(arg, factories, name) {
  for (let i = factories.length - 1; i >= 0; i--) {
    const result = factories[i](arg)
    if (result) return result
  }
  return () => {
    throw new Error(`Invalid value of type ${typeof arg} for ${name} argument`)
  }
}
function moduleMaker({
  namespace,
  initMapTypesToModule,
  initMapTargetsToModule,
  initMapDefinitionToModule,
  initMapMergeStrategy
}) {
  const mapTypesToModule = initMapTypesToModule();
  const mapDefinitionToModule = initMapDefinitionToModule();
  const mapTargetsToModule = initMapTargetsToModule();
  const typesList = mapTypesToModule();
  const targets = mapTargetsToModule();
  const completedTypesList = completeTypes(typesList, targets);
  let types = createTypes(completedTypesList),
    namespaced = !!namespace,
    namespacedTypes = namespaced ? createTypes(completedTypesList, namespace) : null,
    result = Object.assign({}, {
      namespaced
    }, mapDefinitionToModule.call(null, { types, namespace }));
  let state = result.state;
  result.state = typeof state === 'function' ? state() : state;
  //需要接口加载的数据目标
  if (targets && targets.length > 0) {
    targets.forEach(target => {
      merge(result.state, completeState(target));
    });
  }
  result.mutations = merge(result.mutations || {}, completeMutation(initMapMergeStrategy, targets));
  return {
    result,
    targets,
    types,
    namespacedTypes,
    namespace
  };
}

function createModuleFactory(
  {
    moduleFactory = moduleMaker,
    mapTypesToModuleFactories = defaultMapTypesToModuleFactories,
    mapTargetsToModuleFactories = defaultMapTargetsToModuleFactories,
    mapDefinitionToModuleFactories = defaultMapDefinitionToModuleFactories,
    mapMergeStrategyFactories = defaultMapMergeStrategyFactories
  } = {}
) {
  return function createModule(
    {
      namespace,
      mapTypesToModule,
      mapTargetsToModule,
      mapDefaultStateToModule,
      mapDefinitionToModule,
      mapMergeStrategy
    }
  ) {
    const initMapTypesToModule = match(mapTypesToModule, mapTypesToModuleFactories, 'mapTypesToModule');
    const initMapTargetsToModule = match(mapTargetsToModule, mapTargetsToModuleFactories, 'mapTargetsToModule')
    const initMapDefinitionToModule = match(mapDefinitionToModule, mapDefinitionToModuleFactories, 'mapDefinitionToModule');
    const initMapMergeStrategy = match(mapMergeStrategy, mapMergeStrategyFactories, 'mapMergeStrategy')
    return moduleFactory({
      namespace,
      initMapTypesToModule,
      initMapTargetsToModule,
      initMapDefinitionToModule,
      initMapMergeStrategy
    })

  }
}

export default createModuleFactory()