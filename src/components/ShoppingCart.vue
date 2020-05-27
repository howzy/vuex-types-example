<template>
  <div class="cart">
    <h2>Your Cart</h2>
    <p v-show="!products.length"><i>Please add some products to cart.</i></p>
    <ul>
      <li
        v-for="product in products"
        :key="product.id">
        {{ product.title }} - {{ product.price | currency }} x {{ product.quantity }}
      </li>
    </ul>
    <p>Total: {{ total | currency }}</p>
    <p><button :disabled="!products.length" @click="checkout(products)">Checkout</button></p>
    <p v-show="checkoutStatus">Checkout {{ checkoutStatus }}.</p>
  </div>
</template>

<script>
export default {
  _mappedState: {
    cart: ['checkoutStatus']
  },
  _mappedGetters: {
    cart: {
      products: 'cartProducts',
      total: 'cartTotalPrice'
    }
  },
  _mappedActions: {
    cart({ types }) {
      return {
        checkout: types.CHECKOUT
      }
    }
  }
}
</script>
