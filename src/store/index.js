import Vue from 'vue'
import * as VuexTypes from '@/shared/vuex-types'
import cart from './modules/cart'
import products from './modules/products'

Vue.use(VuexTypes)

export default VuexTypes.createStore({
  root: {},
  modules: [
    cart,
    products
  ]
})
