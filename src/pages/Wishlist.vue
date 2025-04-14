<template>
  <div class="space-y-8">
    <h2 
      class="text-3xl font-bold medical-text-gradient"
      v-motion
      :initial="{ opacity: 0, x: -50 }"
      :enter="{ opacity: 1, x: 0 }"
    >My Wishlist</h2>
    
    <div v-if="wishlistStore.wishlistItems.length === 0" 
      class="card"
      v-motion
      :initial="{ opacity: 0, y: 50 }"
      :enter="{ opacity: 1, y: 0, delay: 200 }"
    >
      <div class="text-center text-gray-600 py-8">
        <HeartIcon class="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p class="text-xl">Your wishlist is empty</p>
        <router-link 
          to="/products" 
          class="text-primary hover:underline mt-2 inline-block"
        >
          Browse Products
        </router-link>
      </div>
    </div>
    
    <div v-else class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div 
        v-for="item in wishlistStore.wishlistItems" 
        :key="item.id"
        class="card group hover:shadow-elevation-3 transition-all duration-300 transform hover:scale-[1.02]"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, delay: 200 }"
      >
        <div class="relative">
          <img 
            :src="item.image_url" 
            :alt="item.name" 
            class="w-full h-48 object-cover rounded-lg mb-4"
          />
          <div class="absolute top-2 right-2">
            <button 
              @click="wishlistStore.removeFromWishlist(item.id)" 
              class="p-2 bg-white/80 rounded-full hover:bg-white shadow-elevation-1 text-red-500 hover:text-red-600 transition-colors"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>
          <div class="absolute bottom-2 left-2">
            <span class="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              {{ item.category }}
            </span>
          </div>
        </div>
        
        <h3 class="text-lg font-semibold mb-1">{{ item.name }}</h3>
        <p class="text-primary font-bold mb-4">${{ item.price.toFixed(2) }}</p>
        
        <div class="flex gap-2">
          <router-link 
            :to="`/products/${item.id}`" 
            class="btn btn-outline flex-1 flex items-center justify-center gap-1"
          >
            <EyeIcon class="w-4 h-4" />
            View
          </router-link>
          <button 
            @click="addToCart(item)" 
            class="btn btn-primary flex-1 flex items-center justify-center gap-1"
          >
            <ShoppingCartIcon class="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="wishlistStore.wishlistItems.length > 0" class="flex justify-end">
      <button 
        @click="wishlistStore.clearWishlist()"
        class="btn btn-outline text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300"
      >
        Clear Wishlist
      </button>
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
        :modules="[SwiperNavigation, SwiperPagination, SwiperAutoplay]"
        :slides-per-view="1"
        :space-between="20"
        :pagination="{ clickable: true }"
        :navigation="true"
        :autoplay="{ delay: 4000, disableOnInteraction: false }"
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
              <button 
                @click="toggleWishlist(product)"
                class="absolute top-2 left-2 p-2 bg-white/80 rounded-full hover:bg-white shadow-elevation-1 transition-colors"
                :class="wishlistStore.isInWishlist(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'"
              >
                <HeartIcon class="w-5 h-5" />
              </button>
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
import { useWishlistStore } from '../stores/wishlistStore'
import { useCartStore } from '../stores/cartStore'
import { supabase } from '../lib/supabase'
import { useToast } from 'vue-toastification'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation as SwiperNavigation, Pagination as SwiperPagination, Autoplay as SwiperAutoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import {
  HeartIcon,
  ShoppingCartIcon,
  EyeIcon,
  XMarkIcon,
  StarIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'Wishlist',
  components: {
    HeartIcon,
    ShoppingCartIcon,
    EyeIcon,
    XMarkIcon,
    StarIcon,
    Swiper,
    SwiperSlide
  },
  setup() {
    const wishlistStore = useWishlistStore()
    const cartStore = useCartStore()
    const toast = useToast()
    const recommendedProducts = ref([])
    
    const addToCart = (item) => {
      cartStore.addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image_url: item.image_url,
        quantity: 1
      })
      toast.success(`${item.name} added to cart`)
    }
    
    const toggleWishlist = (product) => {
      if (wishlistStore.isInWishlist(product.id)) {
        wishlistStore.removeFromWishlist(product.id)
        toast.success(`Removed from wishlist`)
      } else {
        wishlistStore.addToWishlist(product)
        toast.success(`Added to wishlist`)
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
        
        // Filter out products that are already in the wishlist
        if (wishlistStore.wishlistItems.length > 0) {
          const wishlistItemIds = wishlistStore.wishlistItems.map(item => item.id)
          recommendedProducts.value = recommendedProducts.value.filter(
            product => !wishlistItemIds.includes(product.id)
          )
        }
      } catch (error) {
        console.error('Error fetching recommended products:', error)
      }
    }
    
    onMounted(() => {
      fetchRecommendedProducts()
    })
    
    return {
      wishlistStore,
      cartStore,
      recommendedProducts,
      addToCart,
      toggleWishlist,
      SwiperNavigation,
      SwiperPagination,
      SwiperAutoplay
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