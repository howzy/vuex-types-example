import shop from '@/api/shop'

export default {
  namespace: 'cart',
  mapTypesToModule: [
    'CHECKOUT',
    'ADD_PRODUCT_TO_CART',
    'PUSH_PRODUCT_TO_CART',
    'INCREMENT_ITEM_QUANTITY',
    'SET_CART_ITEMS',
    'SET_CHECKOUT_STATUS'
  ],
  mapDefinitionToModule({ types }) {
    return {
      state: {
        items: [],
        checkoutStatus: null
      },

      getters: {
        cartProducts: (state, getters, rootState) => {
          return state.items.map(({ id, quantity }) => {
            const product = rootState.products.all.find(product => product.id === id)
            return {
              title: product.title,
              price: product.price,
              quantity
            }
          })
        },

        cartTotalPrice: (state, getters) => {
          return getters.cartProducts.reduce((total, product) => {
            return total + product.price * product.quantity
          }, 0)
        }
      },

      mutations: {
        [types.PUSH_PRODUCT_TO_CART] (state, { id }) {
          state.items.push({
            id,
            quantity: 1
          })
        },

        [types.INCREMENT_ITEM_QUANTITY] (state, { id }) {
          const cartItem = state.items.find(item => item.id === id)
          cartItem.quantity++
        },

        [types.SET_CART_ITEMS] (state, { items }) {
          state.items = items
        },

        [types.SET_CHECKOUT_STATUS] (state, status) {
          state.checkoutStatus = status
        }
      },

      actions: {
        [types.CHECKOUT] ({ commit, state }, products) {
          const savedCartItems = [...state.items]
          commit(types.SET_CHECKOUT_STATUS, null)
          // empty cart
          commit(types.SET_CART_ITEMS, { items: [] })
          shop.buyProducts(
            products,
            () => commit(types.SET_CHECKOUT_STATUS, 'successful'),
            () => {
              commit(types.SET_CHECKOUT_STATUS, 'failed')
              // rollback to the cart saved before sending the request
              commit(types.SET_CART_ITEMS, { items: savedCartItems })
            }
          )
        },

        [types.ADD_PRODUCT_TO_CART] ({ commit, state }, product) {
          commit(types.SET_CHECKOUT_STATUS, null)
          if (product.inventory > 0) {
            const cartItem = state.items.find(item => item.id === product.id)
            if (!cartItem) {
              commit(types.PUSH_PRODUCT_TO_CART, { id: product.id })
            } else {
              commit(types.INCREMENT_ITEM_QUANTITY, cartItem)
            }
            // remove 1 item from stock
            commit('products/DECREMENT_PRODUCT_INVENTORY', { id: product.id }, { root: true })
          }
        }
      }
    }
  }
}
