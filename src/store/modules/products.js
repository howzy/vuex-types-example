import shop from '@/api/shop'

export default {
  namespace: 'products',
  mapTypesToModule: [
    'DECREMENT_PRODUCT_INVENTORY',
    'GET_ALL_PRODUCTS'
  ],
  mapTargetsToModule: ['products'],
  mapDefinitionToModule({ types }) {
    return {
      state: {},

      getters: {},

      mutations: {
        [types.DECREMENT_PRODUCT_INVENTORY] (state, { id }) {
          const product = state.products.data.find(product => product.id === id)
          product.inventory--
        }
      },

      actions: {
        [types.GET_ALL_PRODUCTS] ({ commit }) {
          commit(types.SET_PRODUCTS_LOADING)
          shop.getProducts(products => {
            commit(types.SET_PRODUCTS_SUCCESS, {
              data: {
                data: products
              }
            })
          })
        }
      }
    }
  }
}
