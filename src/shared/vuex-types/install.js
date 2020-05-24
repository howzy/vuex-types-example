import { capitalize, extend, hasOwn } from '../util';
import _Vuex from 'vuex';
export let Vuex;
//array to object
function normalize(options) {
  return typeof options === 'function'
    ? options
    : function () {
      return Array.isArray(options)
        ? options.reduce((memo, o) => {
          memo[o] = o;
          return memo;
        }, {})
        : options;
    }
}

//options merge strategy
function mapHelperMergeStrat(parent, child) {
  if (!child) return Object.create(parent || null);
  if (!parent) return child;
  let ret = extend({}, parent),
    keys = Object.keys(parent);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i], parentVal = parent[key];
    if (hasOwn(child, key)) {
      ret[key] = function () {
        let childExtendeeVal = normalize(child[key]).apply(this, arguments),
          parentExtendeeVal = normalize(parentVal).apply(this, arguments);
        return extend(parentExtendeeVal, childExtendeeVal);
      };
    }
  }
  keys = Object.keys(child);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    if (hasOwn(ret, key)) {
      continue;
    }
    ret[key] = child[key];
  }
  return ret;
}
export default function (Vue, config = {}) {
  if (Vuex && Vuex === _Vuex) {
    console.warn('Vuex-types has been installed, do not install again!');
    return;
  };
  Vuex = _Vuex;
  let { mapPrefix = '_mapped', namespaceSep = '/' } = config,
    helperTypeArray = ['state', 'getters', 'mutations', 'actions'];

  Vuex.install(Vue);
  let strat = Vue.config.optionMergeStrategies;
  //配置_mappedState等helper的merge options
  helperTypeArray.forEach(type => {
    strat[`${mapPrefix}${capitalize(type)}`] = mapHelperMergeStrat;
  });
  //代理store.types到Vue实例上
  Object.defineProperty(Vue.prototype, '$types', {
    get() {
      if (this.$store) {
        return this.$store.types;
      }
      return {};
    },
    enumerable: false,
    configurable: false
  });
  //注入vuex,同时改造vuex helpers,
  Vue.mixin({
    beforeCreate() {
      //Vuex.Store实例化时内部存在new Vue,但是并有没有注入store,所以需要判断this.$store;
      if (this.$store) {
        let vuex = this.$store.vuex,
          options = this.$options;
        options.computed || (options.computed = {});
        options.methods || (options.methods = {});
        helperTypeArray.forEach(type => {
          let capitalizedType = capitalize(type),
            mapType = `${mapPrefix}${capitalizedType}`,
            mapHelperCallee = `map${capitalizedType}`;
          if (mapType in options) {
            let _mappedSource = options[mapType];
            //标准化source
            let _normalizedMappedSource = Object.keys(_mappedSource).map(key => ({
              namespace: key,
              value: _mappedSource[key]
            }));
            _normalizedMappedSource.forEach(source => {
              let isRoot = source.namespace === 'root',
                mapHelper = source.namespace && !isRoot
                  ? vuex.createNamespacedHelpers(source.namespace)[mapHelperCallee]
                  : vuex[mapHelperCallee],
                types = this.$store.types,
                _mappedResult = mapHelper(
                  typeof source.value === 'function'
                    ? source.value.call(this, {
                      types: isRoot
                        ? types.root
                        : source.namespace
                          .split(namespaceSep)
                          .reduce((memo, ns) => memo[ns], types)._self,
                      rootTypes: types.root,
                      rootCommit: this.$store.commit,
                      rootDispatch: this.$store.dispatch
                    })
                    : source.value
                );
              if (type === 'state' || type === 'getters') {
                options.computed = Object.assign({}, options.computed, _mappedResult);
              } else {
                options.methods = Object.assign({}, options.methods, _mappedResult);
              }
            })
          }
        });
      }
    }
  });
}