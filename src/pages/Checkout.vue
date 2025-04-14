<template>
  <div class="space-y-8">
    <!-- Header -->
    <div 
      class="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0 }"
    >
      <h1 class="text-4xl font-bold mb-4">Checkout</h1>
      <p class="text-gray-600 max-w-2xl">
        Complete your purchase securely. Review your order and proceed to payment.
      </p>
    </div>

    <div v-if="cartStore.cartItems.length === 0" class="text-center py-12">
      <ShoppingCartIcon class="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <h2 class="text-2xl font-bold mb-2">Your cart is empty</h2>
      <p class="text-gray-600 mb-4">Add items to your cart before checking out.</p>
      <router-link to="/products" class="btn btn-primary">Browse Products</router-link>
    </div>

    <div v-else>
      <!-- Rest of the template content -->
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { useToast } from 'vue-toastification'
import { supabase } from '../lib/supabase'
import StripePayment from '../components/StripePayment.vue'
import {
  ShoppingCartIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckIcon,
  CheckCircleIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'Checkout',
  components: {
    ShoppingCartIcon,
    ArrowRightIcon,
    ArrowLeftIcon,
    CheckIcon,
    CheckCircleIcon,
    HomeIcon,
    ClipboardDocumentListIcon,
    ShieldCheckIcon,
    StripePayment
  },
  setup() {
    // Setup code
    return {
      // Return values
    }
  }
}
</script>

<style scoped>
/* Custom styles for checkout page */
.steps-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
}
</style>