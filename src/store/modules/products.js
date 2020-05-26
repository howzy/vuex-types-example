import shop from '@/api/shop'

export default {
  namespace: 'products',
  mapTypesToModule: [
    'SET_PRODUCTS',
    'DECREMENT_PRODUCT_INVENTORY',
    'GET_ALL_PRODUCTS'
  ],
  mapDefinitionToModule({ types }) {
    return {
      state: {
        all: []
      },

      getters: {},

      mutations: {
        [types.SET_PRODUCTS] (state, products) {
          state.all = products
        },

        [types.DECREMENT_PRODUCT_INVENTORY] (state, { id }) {
          const product = state.all.find(product => product.id === id)
          product.inventory--
        }
      },

      actions: {
        [types.GET_ALL_PRODUCTS] ({ commit }) {
          shop.getProducts(products => {
            commit(types.SET_PRODUCTS, products)
          })
        }
      }
    }
  }
}
