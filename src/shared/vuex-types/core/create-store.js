import completeModule from './complete-module';
import { Vuex } from '../install';
//创建一个store
export default function createStore(options) {
  if (!Vuex) {
    throw new Error('Vuex-types has not been installed,please install Vuex-types first!');
  }
  //递归注册模块
  function installModules(root, path = []) {
    const modulesStack = root.map(completeModule);
    modulesStack.forEach(module => {
      if (!path.length) {
        modulesMap[module.namespace] = module;
      } else {
        let copy = path.slice(),
          namespace = copy.shift(),
          parent = modulesMap[namespace];
        while (namespace = copy.shift()) {
          parent = parent.children[namespace];
        }
        let children = parent.children || (parent.children = {});
        children[module.namespace] = module;
      }
      //注入命名空间
      let nsPath = path.concat(module.namespace);
      nsMap[nsPath.join('/')] = nsPath;
    })
    return modulesStack.reduce((memo, module) => {
      let child = memo[module.namespace] = module.result;
      if (child.modules) {
        child.modules = installModules(child.modules, path.concat(module.namespace));
      }
      return memo;
    }, {});
  }
  //遍历获取types树
  function getTypesFromModulesMap(modulesMap, store) {
    function iterateModules(modules, from = []) {
      return Object.keys(modules).forEach(path => {
        let typesMap = map.types || (map.types = {}),
          namespacedTypesMap = typesMap.root || (typesMap.root = {}),
          module = modules[path];
        if (!from.length) {
          targets[module.namespace] = { _self: module.targets };
          typesMap[module.namespace] = { _self: module.types };
          namespacedTypesMap[module.namespace] = module.namespacedTypes;
        } else {
          const namespace = store._modules.getNamespace(from.concat([module.namespace]));
          let copy = from.slice(),
            parentPath = copy.shift(),
            targetsParent = targets[parentPath],
            typesParent = typesMap[parentPath],
            namespacedTypesParent = namespacedTypesMap[parentPath];
          while (parentPath = copy.shift()) {
            targetsParent = targetsParent[parentPath];
            typesParent = typesParent[parentPath];
            namespacedTypesParent = namespacedTypesParent[parentPath];
          }
          targetsParent[module.namespace] = { _self: module.targets };
          typesParent[module.namespace] = { _self: module.types };
          namespacedTypesParent[module.namespace] = Object.keys(module.types).reduce((memo, type) => {
            memo[type] = [namespace, module.types[type]].join('');
            return memo;
          }, {});
        }
        if (module.children) {
          iterateModules(module.children, from.concat([module.namespace]));
        }
      });
    }
    let map = {},
      targets = map.targets || (map.targets = {});
    iterateModules(modulesMap);
    return map;
  }
  const modulesMap = {},//模块映射
    nsMap = {};//命名空间映射
  let { root, modules = [], plugins = [] } = options,
    //对plugin进行标准化
    normalizedPlugins = plugins.map(plugin => {
      if (plugin.inject) {
        return function (store) {
          plugin.inject.call(plugin, store);
        }
      }
      return plugin;
    }),
    configModules = installModules(modules),
    rootModule = completeModule(root),
    definition = {
      ...rootModule.result,
      modules: configModules,
      plugins: [
        //注入types,targets,namespaces
        store => {
          const map = getTypesFromModulesMap(modulesMap, store);
          map.types.root = Object.assign({}, map.types.root, { ...rootModule.types });
          map.targets.root = Object.assign({}, map.targets.root, { _self: rootModule.targets });
          const utility = {
            ...map,
            namespaces: nsMap
          };
          Object.keys(utility).forEach(type => {
            Object.defineProperty(store, type, {
              writable: false,
              configurable: false,
              enumerable: false,
              value: utility[type]
            });
          });
          store.vuex = Vuex;
          Object.freeze(store.vuex);
        },
        ...normalizedPlugins
      ]
    }
  return new Vuex.Store(definition);
}