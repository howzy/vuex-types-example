<template>
  <ul>
    <p v-if="productsLoading">Loading...</p>
    <li
      v-for="product in products.data"
      :key="product.id">
      {{ product.title }} - {{ product.price | currency}}
      <br>
      <button
        :disabled="!product.inventory"
        @click="addProductToCart(product)">
        Add to cart
      </button>
    </li>
  </ul>
</template>

<script>
export default {
  _mappedState: {
    products: ['products', 'productsLoading']
  },
  _mappedActions: {
    cart({ types }) {
      return {
        addProductToCart: types.ADD_PRODUCT_TO_CART
      }
    },
    products({ types }) {
      return {
        getAllProducts: types.GET_ALL_PRODUCTS
      }
    }
  },
  created () {
    this.getAllProducts()
  }
}
</script>
