<template>
  <div class="space-y-8">
    <h2 
      class="text-3xl font-bold medical-text-gradient"
      v-motion
      :initial="{ opacity: 0, x: -50 }"
      :enter="{ opacity: 1, x: 0 }"
    >Shopping Cart</h2>
    
    <div v-if="cartStore.cartItems.length === 0" 
      class="card"
      v-motion
      :initial="{ opacity: 0, y: 50 }"
      :enter="{ opacity: 1, y: 0, delay: 200 }"
    >
      <div class="text-center text-gray-600 py-8">
        <ShoppingBagIcon class="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p class="text-xl">Your cart is empty</p>
        <router-link 
          to="/products" 
          class="text-primary hover:underline mt-2 inline-block"
        >
          Browse Products
        </router-link>
      </div>
    </div>
    
    <div v-else class="grid md:grid-cols-3 gap-8">
      <!-- Cart Items List -->
      <div 
        class="md:col-span-2 space-y-6"
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :enter="{ opacity: 1, y: 0, delay: 200 }"
      >
        <div class="card space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-semibold">Your Items ({{ cartStore.totalItems }})</h3>
            <button 
              @click="cartStore.clearCart" 
              class="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1"
            >
              <TrashIcon class="w-4 h-4" />
              Clear Cart
            </button>
          </div>
          
          <div class="divide-y">
            <div 
              v-for="item in cartStore.cartItems" 
              :key="item.id"
              class="py-4 flex flex-col sm:flex-row gap-4"
            >
              <div class="flex-shrink-0">
                <img 
                  :src="item.image_url" 
                  :alt="item.name" 
                  class="w-24 h-24 object-cover rounded-lg"
                />
              </div>
              
              <div class="flex-grow">
                <div class="flex justify-between">
                  <router-link :to="`/products/${item.id}`" class="text-lg font-medium hover:text-primary">
                    {{ item.name }}
                  </router-link>
                  <span class="font-semibold">${{ (item.price * item.quantity).toFixed(2) }}</span>
                </div>
                
                <div class="text-sm text-gray-500 mb-3">${{ item.price.toFixed(2) }} each</div>
                
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <button 
                      @click="updateItemQuantity(item.id, item.quantity - 1)" 
                      class="w-8 h-8 rounded-l-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                    >
                      <MinusIcon class="w-4 h-4" />
                    </button>
                    <input 
                      type="number" 
                      v-model="item.quantity" 
                      min="1" 
                      max="99"
                      class="w-12 h-8 border-t border-b border-gray-300 text-center"
                      @change="updateItemQuantity(item.id, parseInt(item.quantity))"
                    />
                    <button 
                      @click="updateItemQuantity(item.id, item.quantity + 1)" 
                      class="w-8 h-8 rounded-r-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                    >
                      <PlusIcon class="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button 
                    @click="cartStore.removeFromCart(item.id)" 
                    class="text-sm text-gray-500 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card">
          <h3 class="text-xl font-semibold mb-6">Estimate Shipping</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select class="select">
                <option>United States</option>
                <option>Canada</option>
                <option>United Kingdom</option>
              </select>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code</label>
                <input type="text" class="input" placeholder="Enter ZIP code" />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Shipping Method</label>
                <select class="select">
                  <option>Standard Shipping ($5.99)</option>
                  <option>Express Shipping ($12.99)</option>
                  <option>Next Day Delivery ($24.99)</option>
                </select>
              </div>
            </div>
            
            <button class="btn btn-primary w-full">Calculate Shipping</button>
          </div>
        </div>
      </div>
      
      <!-- Order Summary -->
      <div 
        class="space-y-6"
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :enter="{ opacity: 1, y: 0, delay: 400 }"
      >
        <div class="card space-y-6 bg-gradient-to-br from-primary/5 to-secondary/5">
          <h3 class="text-xl font-semibold">Order Summary</h3>
          
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">Subtotal ({{ cartStore.totalItems }} items)</span>
              <span class="font-medium">${{ cartStore.totalPrice.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Shipping</span>
              <span class="font-medium">{{ shipping > 0 ? `$${shipping.toFixed(2)}` : 'Calculated at checkout' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Tax</span>
              <span class="font-medium">{{ tax > 0 ? `$${tax.toFixed(2)}` : 'Calculated at checkout' }}</span>
            </div>
            <div class="flex justify-between border-t pt-3">
              <span class="font-semibold">Total</span>
              <span class="font-bold text-primary text-xl">${{ (cartStore.totalPrice + shipping + tax).toFixed(2) }}</span>
            </div>
          </div>
          
          <button class="btn btn-primary w-full flex items-center justify-center gap-2 py-3">
            <CreditCardIcon class="w-5 h-5" />
            Checkout
          </button>
          
          <div class="flex items-center justify-center gap-2 text-gray-600 text-sm">
            <LockClosedIcon class="w-4 h-4" />
            <span>Secure Checkout</span>
          </div>
          
          <div class="flex items-center justify-center gap-3 pt-3">
            <img src="https://cdn-icons-png.flaticon.com/128/196/196578.png" alt="Visa" class="h-8" />
            <img src="https://cdn-icons-png.flaticon.com/128/196/196561.png" alt="Mastercard" class="h-8" />
            <img src="https://cdn-icons-png.flaticon.com/128/196/196565.png" alt="PayPal" class="h-8" />
            <img src="https://cdn-icons-png.flaticon.com/128/196/196539.png" alt="American Express" class="h-8" />
          </div>
        </div>
        
        <div class="card">
          <h3 class="text-xl font-semibold mb-4">Have a Coupon?</h3>
          
          <div class="flex gap-2">
            <input type="text" class="input flex-grow" placeholder="Enter coupon code" />
            <button class="btn btn-primary">Apply</button>
          </div>
        </div>
        
        <div class="space-y-4">
          <div class="flex items-center gap-3 text-sm text-gray-600">
            <TruckIcon class="w-5 h-5 text-primary" />
            <span>Free shipping on orders over $50</span>
          </div>
          <div class="flex items-center gap-3 text-sm text-gray-600">
            <ArrowPathIcon class="w-5 h-5 text-primary" />
            <span>Easy 30-day returns</span>
          </div>
          <div class="flex items-center gap-3 text-sm text-gray-600">
            <ShieldCheckIcon class="w-5 h-5 text-primary" />
            <span>Secure payment processing</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Recommended Products -->
    <div 
      class="space-y-6 pt-6"
      v-motion
      :initial="{ opacity: 0, y: 50 }"
      :enter="{ opacity: 1, y: 0, delay: 600 }"
      v-if="recommendedProducts.length > 0"
    >
      <h3 class="text-2xl font-bold medical-text-gradient">Recommended for You</h3>
      
      <swiper
        :modules="[SwiperNavigation, SwiperPagination]"
        :slides-per-view="1"
        :space-between="20"
        :pagination="{ clickable: true }"
        :navigation="true"
        :breakpoints="{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 }
        }"
        class="product-swiper"
      >
        <swiper-slide v-for="product in recommendedProducts" :key="product.id">
          <div class="card h-full flex flex-col hover:shadow-elevation-3 transition-all duration-300 transform hover:scale-105">
            <div class="relative overflow-hidden rounded-lg mb-4">
              <img 
                :src="product.image_url" 
                :alt="product.name"
                class="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
              />
              <div class="absolute top-2 right-2">
                <span v-if="product.rating" class="bg-yellow-400 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1">
                  <StarIcon class="w-4 h-4" />
                  {{ product.rating }}
                </span>
              </div>
            </div>
            <h3 class="text-lg font-semibold mb-2">{{ product.name }}</h3>
            <p class="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">{{ product.description }}</p>
            <div class="flex items-center justify-between mt-auto">
              <span class="text-xl font-bold text-primary">${{ product.price }}</span>
              <router-link 
                :to="`/products/${product.id}`" 
                class="btn btn-primary shadow-elevation-1 hover:shadow-elevation-2"
              >
                View
              </router-link>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useCartStore } from '../stores/cartStore'
import { supabase } from '../lib/supabase'
import { useToast } from 'vue-toastification'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation as SwiperNavigation, Pagination as SwiperPagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import {
  ShoppingBagIcon,
  CreditCardIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  LockClosedIcon,
  TruckIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  StarIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'Cart',
  components: {
    ShoppingBagIcon,
    CreditCardIcon,
    TrashIcon,
    PlusIcon,
    MinusIcon,
    LockClosedIcon,
    TruckIcon,
    ArrowPathIcon,
    ShieldCheckIcon,
    StarIcon,
    Swiper,
    SwiperSlide
  },
  setup() {
    const cartStore = useCartStore()
    const toast = useToast()
    const recommendedProducts = ref([])
    const shipping = ref(0)
    const tax = ref(0)
    
    const updateItemQuantity = (itemId, quantity) => {
      if (quantity <= 0) {
        // Show confirmation before removing
        if (confirm('Remove this item from your cart?')) {
          cartStore.removeFromCart(itemId)
        }
      } else {
        cartStore.updateQuantity(itemId, quantity)
      }
    }
    
    const fetchRecommendedProducts = async () => {
      try {
        const { data } = await supabase
          .from('products')
          .select('*')
          .order('popularity', { ascending: false })
          .limit(8)
        
        recommendedProducts.value = data || []
        
        // Filter out products that are already in the cart
        if (cartStore.cartItems.length > 0) {
          const cartItemIds = cartStore.cartItems.map(item => item.id)
          recommendedProducts.value = recommendedProducts.value.filter(
            product => !cartItemIds.includes(product.id)
          )
        }
      } catch (error) {
        console.error('Error fetching recommended products:', error)
      }
    }
    
    onMounted(() => {
      fetchRecommendedProducts()
      
      // Calculate shipping based on cart total
      if (cartStore.totalPrice > 50) {
        shipping.value = 0 // Free shipping
      } else {
        shipping.value = 5.99
      }
      
      // Calculate tax (simplified example, typically done server-side)
      tax.value = cartStore.totalPrice * 0.07 // Example 7% tax rate
    })
    
    return {
      cartStore,
      recommendedProducts,
      updateItemQuantity,
      shipping,
      tax,
      SwiperNavigation,
      SwiperPagination
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>