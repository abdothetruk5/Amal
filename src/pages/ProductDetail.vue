<template>
  <div v-if="loading" class="flex justify-center items-center min-h-[60vh]">
    <div class="spinner"></div>
  </div>
  
  <div v-else-if="error" class="flex flex-col items-center justify-center min-h-[60vh]">
    <p class="text-red-500 text-xl mb-4">{{ error }}</p>
    <router-link to="/products" class="btn btn-primary">Back to Products</router-link>
  </div>
  
  <div v-else-if="product" class="space-y-8">
    <!-- Product Hero Section with Gradient Background -->
    <section 
      class="bg-gradient-to-br from-primary/10 via-white to-secondary/10 rounded-3xl p-8 shadow-elevation-2"
      v-motion
      :initial="{ opacity: 0 }"
      :enter="{ opacity: 1 }"
    >
      <div class="grid md:grid-cols-2 gap-8 items-center">
        <div 
          class="relative overflow-hidden rounded-xl"
          v-motion
          :initial="{ opacity: 0, x: -50 }"
          :enter="{ opacity: 1, x: 0, delay: 200 }"
        >
          <img 
            :src="product.image_url" 
            :alt="product.name"
            class="w-full h-auto object-cover rounded-xl shadow-elevation-2 hover:shadow-elevation-3 transition-shadow transform hover:scale-[1.02] duration-300"
          />
          <div class="absolute top-4 right-4 flex flex-col gap-2">
            <span v-if="product.rating > 0" class="bg-yellow-400 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 shadow-elevation-1">
              <StarIcon class="w-4 h-4" />
              {{ product.rating.toFixed(1) }}
            </span>
            <span v-if="product.popularity > 1000" class="bg-purple-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 shadow-elevation-1">
              <FireIcon class="w-4 h-4" />
              Bestseller
            </span>
            <span v-if="product.stock < 10" class="bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 shadow-elevation-1">
              <ExclamationTriangleIcon class="w-4 h-4" />
              Low Stock
            </span>
          </div>
        </div>
        
        <div 
          class="space-y-6"
          v-motion
          :initial="{ opacity: 0, x: 50 }"
          :enter="{ opacity: 1, x: 0, delay: 400 }"
        >
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">{{ product.category }}</span>
              <span v-if="product.effectiveness > 90" class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Highly Effective</span>
            </div>
            <h1 class="text-3xl md:text-4xl font-bold">{{ product.name }}</h1>
            <div class="flex items-center gap-4 mt-2">
              <span class="text-2xl font-bold text-primary">${{ product.price.toFixed(2) }}</span>
              <span v-if="product.stock > 0" class="text-green-600 flex items-center gap-1">
                <CheckCircleIcon class="w-5 h-5" />
                In Stock
              </span>
              <span v-else class="text-red-500 flex items-center gap-1">
                <XCircleIcon class="w-5 h-5" />
                Out of Stock
              </span>
            </div>
          </div>
          
          <p class="text-gray-600">{{ product.description }}</p>
          
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <ShieldCheckIcon class="w-5 h-5 text-primary" />
              <span>Quality Guaranteed</span>
            </div>
            <div class="flex items-center gap-2">
              <TruckIcon class="w-5 h-5 text-primary" />
              <span>Fast Delivery</span>
            </div>
            <div class="flex items-center gap-2">
              <ArrowPathIcon class="w-5 h-5 text-primary" />
              <span>Easy Returns</span>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="flex items-center">
              <button 
                @click="decrementQuantity" 
                class="w-10 h-10 rounded-l-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                :disabled="quantity <= 1"
              >
                <MinusIcon class="w-4 h-4" />
              </button>
              <input 
                type="number" 
                v-model="quantity" 
                min="1" 
                max="99"
                class="w-14 h-10 border-t border-b border-gray-300 text-center"
              />
              <button 
                @click="incrementQuantity" 
                class="w-10 h-10 rounded-r-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
              >
                <PlusIcon class="w-4 h-4" />
              </button>
            </div>
            
            <button 
              @click="addToCart" 
              class="btn btn-primary flex-grow flex items-center justify-center gap-2 py-3"
              :disabled="product.stock <= 0"
            >
              <ShoppingCartIcon class="w-5 h-5" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Product Details Tabs -->
    <section 
      class="card"
      v-motion
      :initial="{ opacity: 0, y: 50 }"
      :enter="{ opacity: 1, y: 0, delay: 600 }"
    >
      <div class="flex border-b">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-6 py-3 font-medium transition-colors"
          :class="activeTab === tab.id ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'"
        >
          {{ tab.name }}
        </button>
      </div>
      
      <div class="py-6">
        <!-- Details Tab -->
        <div v-if="activeTab === 'details'" class="space-y-4">
          <h2 class="text-xl font-semibold">Product Details</h2>
          <p class="text-gray-600">{{ product.description }}</p>
          
          <div class="grid md:grid-cols-2 gap-6 mt-6">
            <div class="space-y-4">
              <h3 class="font-medium">Specifications</h3>
              <div class="space-y-2">
                <div class="flex justify-between py-2 border-b">
                  <span class="text-gray-600">Category</span>
                  <span class="font-medium">{{ product.category }}</span>
                </div>
                <div class="flex justify-between py-2 border-b">
                  <span class="text-gray-600">Effectiveness</span>
                  <div class="flex items-center">
                    <div class="bg-gray-200 w-32 h-2 rounded-full mr-2">
                      <div 
                        class="bg-primary h-2 rounded-full" 
                        :style="{ width: `${product.effectiveness}%` }"
                      ></div>
                    </div>
                    <span>{{ product.effectiveness }}%</span>
                  </div>
                </div>
                <div class="flex justify-between py-2 border-b">
                  <span class="text-gray-600">Stock</span>
                  <span class="font-medium">{{ product.stock }} units</span>
                </div>
                <div class="flex justify-between py-2 border-b">
                  <span class="text-gray-600">ID</span>
                  <span class="font-medium">{{ product.id.slice(0, 8).toUpperCase() }}</span>
                </div>
              </div>
            </div>
            
            <div class="space-y-4">
              <h3 class="font-medium">Key Benefits</h3>
              <ul class="space-y-2">
                <li v-for="(benefit, index) in getDummyBenefits()" :key="index" class="flex items-start gap-2">
                  <CheckCircleIcon class="w-5 h-5 text-primary mt-1" />
                  <span>{{ benefit }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Reviews Tab -->
        <div v-else-if="activeTab === 'reviews'" class="space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold">Customer Reviews</h2>
            <button class="btn btn-primary">Write a Review</button>
          </div>
          
          <div class="grid md:grid-cols-2 gap-8">
            <div class="space-y-4">
              <div class="flex items-center gap-2">
                <div class="flex">
                  <StarIcon v-for="i in 5" :key="i" class="w-5 h-5" :class="i <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'" />
                </div>
                <span class="text-lg font-medium">{{ product.rating.toFixed(1) }} out of 5</span>
              </div>
              
              <div class="space-y-2">
                <div v-for="n in 5" :key="n" class="flex items-center gap-2">
                  <span class="w-8 text-sm text-right">{{ 6-n }}</span>
                  <div class="flex items-center gap-1">
                    <StarIcon class="w-4 h-4 text-yellow-400" />
                  </div>
                  <div class="bg-gray-200 h-2 rounded-full flex-grow">
                    <div 
                      class="bg-yellow-400 h-2 rounded-full" 
                      :style="{ width: `${getRandomReviewPercentage(6-n)}%` }"
                    ></div>
                  </div>
                  <span class="text-sm text-gray-500">{{ getRandomReviewCount(6-n) }}</span>
                </div>
              </div>
            </div>
            
            <div class="space-y-6">
              <div v-for="review in getDummyReviews()" :key="review.id" class="border-b pb-4">
                <div class="flex justify-between items-start">
                  <div class="flex items-center gap-2">
                    <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                      {{ review.author.charAt(0) }}
                    </div>
                    <div>
                      <div class="font-medium">{{ review.author }}</div>
                      <div class="text-sm text-gray-500">{{ review.date }}</div>
                    </div>
                  </div>
                  <div class="flex">
                    <StarIcon v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'" />
                  </div>
                </div>
                <p class="mt-3 text-gray-600">{{ review.content }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Usage Tab -->
        <div v-else-if="activeTab === 'usage'" class="space-y-6">
          <h2 class="text-xl font-semibold">How to Use</h2>
          <div class="space-y-6">
            <div class="space-y-3">
              <h3 class="font-medium">Usage Instructions</h3>
              <p class="text-gray-600">{{ getUsageInstructions() }}</p>
            </div>
            
            <div class="space-y-3">
              <h3 class="font-medium">Recommended Dosage</h3>
              <p class="text-gray-600">{{ getDosageInstructions() }}</p>
            </div>
            
            <div class="space-y-3">
              <h3 class="font-medium">Precautions</h3>
              <ul class="space-y-2">
                <li v-for="(precaution, index) in getPrecautions()" :key="index" class="flex items-start gap-2">
                  <ExclamationCircleIcon class="w-5 h-5 text-yellow-500 mt-1" />
                  <span class="text-gray-600">{{ precaution }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Related Products -->
    <section 
      class="space-y-6"
      v-motion
      :initial="{ opacity: 0, y: 50 }"
      :enter="{ opacity: 1, y: 0, delay: 800 }"
    >
      <h2 class="text-2xl font-bold medical-text-gradient">Related Products</h2>
      
      <div class="grid md:grid-cols-4 gap-6">
        <div 
          v-for="relatedProduct in relatedProducts" 
          :key="relatedProduct.id"
          class="card hover:shadow-elevation-3 transition-all group"
        >
          <div class="relative overflow-hidden rounded-lg mb-4">
            <img 
              :src="relatedProduct.image_url" 
              :alt="relatedProduct.name"
              class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div class="absolute top-2 right-2 flex gap-2">
              <span v-if="relatedProduct.rating > 0" class="bg-yellow-400 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1">
                <StarIcon class="w-4 h-4" />
                {{ relatedProduct.rating.toFixed(1) }}
              </span>
            </div>
          </div>
          
          <h3 class="text-lg font-semibold">{{ relatedProduct.name }}</h3>
          <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ relatedProduct.description }}</p>
          
          <div class="flex items-center justify-between mt-auto">
            <span class="text-lg font-bold text-primary">${{ relatedProduct.price.toFixed(2) }}</span>
            <router-link 
              :to="`/products/${relatedProduct.id}`" 
              class="text-primary hover:underline flex items-center gap-1"
            >
              View
              <ArrowRightIcon class="w-4 h-4" />
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { supabase } from '../lib/supabase'
import { useCartStore } from '../stores/cartStore'
import {
  StarIcon,
  FireIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShieldCheckIcon,
  TruckIcon,
  ArrowPathIcon,
  MinusIcon,
  PlusIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'ProductDetail',
  components: {
    StarIcon,
    FireIcon,
    ShoppingCartIcon,
    CheckCircleIcon,
    XCircleIcon,
    ShieldCheckIcon,
    TruckIcon,
    ArrowPathIcon,
    MinusIcon,
    PlusIcon,
    ArrowRightIcon,
    ExclamationTriangleIcon,
    ExclamationCircleIcon
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const toast = useToast()
    const cartStore = useCartStore()
    
    const product = ref(null)
    const loading = ref(true)
    const error = ref(null)
    const quantity = ref(1)
    const relatedProducts = ref([])
    const activeTab = ref('details')
    
    const tabs = [
      { id: 'details', name: 'Product Details' },
      { id: 'reviews', name: 'Reviews' },
      { id: 'usage', name: 'Usage' }
    ]
    
    const fetchProduct = async () => {
      loading.value = true
      error.value = null
      
      try {
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('id', route.params.id)
          .single()
        
        if (fetchError) throw fetchError
        
        if (!data) {
          error.value = 'Product not found'
          return
        }
        
        product.value = data
        
        // Fetch related products
        await fetchRelatedProducts()
      } catch (err) {
        console.error('Error fetching product:', err)
        error.value = 'Failed to load product information'
      } finally {
        loading.value = false
      }
    }
    
    const fetchRelatedProducts = async () => {
      if (!product.value?.category) return
      
      try {
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('category', product.value.category)
          .neq('id', product.value.id)
          .limit(4)
        
        relatedProducts.value = data || []
        
        // If we don't have enough related products, fetch by popularity
        if (relatedProducts.value.length < 4) {
          const remaining = 4 - relatedProducts.value.length
          
          const { data: popularProducts } = await supabase
            .from('products')
            .select('*')
            .neq('id', product.value.id)
            .order('popularity', { ascending: false })
            .limit(remaining)
          
          if (popularProducts) {
            // Filter out any products already in relatedProducts
            const filteredPopular = popularProducts.filter(
              pop => !relatedProducts.value.some(rel => rel.id === pop.id)
            )
            
            relatedProducts.value = [...relatedProducts.value, ...filteredPopular]
          }
        }
      } catch (err) {
        console.error('Error fetching related products:', err)
      }
    }
    
    const incrementQuantity = () => {
      if (quantity.value < 99) {
        quantity.value++
      }
    }
    
    const decrementQuantity = () => {
      if (quantity.value > 1) {
        quantity.value--
      }
    }
    
    const addToCart = () => {
      if (!product.value) return
      
      cartStore.addToCart({
        id: product.value.id,
        name: product.value.name,
        price: product.value.price,
        image_url: product.value.image_url,
        quantity: quantity.value
      })
      
      toast.success(`${product.value.name} added to cart`)
    }
    
    const getDummyBenefits = () => {
      const benefits = [
        'Clinically proven formula',
        'Fast-acting relief',
        'Long-lasting effects',
        'Made with premium ingredients',
        'No harmful additives',
        'Suitable for daily use'
      ]
      
      // Return a random subset of 3-5 benefits
      const count = Math.floor(Math.random() * 3) + 3 // 3-5
      return benefits.sort(() => 0.5 - Math.random()).slice(0, count)
    }
    
    const getDummyReviews = () => {
      return [
        {
          id: 1,
          author: 'Sarah Johnson',
          rating: 5,
          date: 'May 15, 2025',
          content: 'This product exceeded my expectations. It works exactly as described and I noticed results within days. Highly recommended!'
        },
        {
          id: 2,
          author: 'Michael Chen',
          rating: 4,
          date: 'April 28, 2025',
          content: 'Very good quality and fast shipping. I would buy again, though the price is a bit high.'
        },
        {
          id: 3,
          author: 'Jessica Williams',
          rating: 5,
          date: 'April 12, 2025',
          content: 'I\'ve tried many similar products and this is by far the best. The quality is outstanding.'
        }
      ]
    }
    
    const getRandomReviewPercentage = (stars) => {
      // Higher percentages for higher ratings if the product rating is good
      if (product.value.rating > 4) {
        return stars === 5 ? Math.floor(Math.random() * 30) + 60 : // 60-90%
               stars === 4 ? Math.floor(Math.random() * 20) + 40 : // 40-60%
               stars === 3 ? Math.floor(Math.random() * 15) + 10 : // 10-25%
               stars === 2 ? Math.floor(Math.random() * 10) + 5 :  // 5-15%
                          Math.floor(Math.random() * 5) + 1        // 1-6%
      } else {
        // More balanced distribution for average rated products
        return stars === 5 ? Math.floor(Math.random() * 20) + 20 : // 20-40%
               stars === 4 ? Math.floor(Math.random() * 20) + 30 : // 30-50%
               stars === 3 ? Math.floor(Math.random() * 20) + 20 : // 20-40%
               stars === 2 ? Math.floor(Math.random() * 15) + 5 :  // 5-20%
                          Math.floor(Math.random() * 10) + 1       // 1-11%
      }
    }
    
    const getRandomReviewCount = (stars) => {
      // Generate review counts that add up to a reasonable number
      const baseCount = Math.floor(Math.random() * 10) + 1
      return stars === 5 ? baseCount * 3 :
             stars === 4 ? baseCount * 2 :
             stars === 3 ? baseCount :
             stars === 2 ? Math.max(1, Math.floor(baseCount / 2)) :
                        Math.max(1, Math.floor(baseCount / 3))
    }
    
    const getUsageInstructions = () => {
      if (product.value?.category === 'Pain Relief') {
        return 'Take 1-2 tablets every 4-6 hours as needed for pain relief. Do not exceed 6 tablets in 24 hours. Take with water or after food if stomach upset occurs.'
      } else if (product.value?.category === 'Vitamins') {
        return 'Take 1 capsule daily with a meal. Best absorbed when taken with food containing healthy fats. For maximum benefit, take consistently at the same time each day.'
      } else if (product.value?.category === 'Skincare') {
        return 'Apply a small amount to clean, dry skin. Gently massage until absorbed. Use morning and evening for best results. Avoid contact with eyes.'
      } else {
        return 'Use as directed by your healthcare professional. Read all enclosed instructions before use. Store in a cool, dry place away from direct sunlight.'
      }
    }
    
    const getDosageInstructions = () => {
      if (product.value?.category === 'Pain Relief') {
        return 'Adults and children 12 years and over: 1-2 tablets every 4-6 hours. Children under 12 years: consult a doctor. Do not take more than 6 tablets in 24 hours.'
      } else if (product.value?.category === 'Vitamins') {
        return 'Adults: 1 capsule daily with food. Not recommended for children under 18 years unless directed by a healthcare professional.'
      } else if (product.value?.category === 'Skincare') {
        return 'Apply a pea-sized amount to the affected area once or twice daily, or as directed by a dermatologist.'
      } else {
        return 'Follow recommended dosage as indicated on the packaging or as advised by your healthcare provider.'
      }
    }
    
    const getPrecautions = () => {
      const generalPrecautions = [
        'Keep out of reach of children.',
        'Consult a healthcare professional before use if you have any medical conditions.',
        'Discontinue use if adverse reactions occur.',
        'Store at room temperature in a dry place.'
      ]
      
      const specificPrecautions = {
        'Pain Relief': [
          'Do not use if you have stomach problems such as heartburn, upset stomach, or stomach pain.',
          'Do not use with other products containing the same active ingredient.',
          'Do not use for more than 10 days unless directed by a doctor.'
        ],
        'Vitamins': [
          'Do not exceed recommended dose.',
          'Not intended to diagnose, treat, cure, or prevent any disease.',
          'If you are pregnant or nursing, consult your healthcare provider before use.'
        ],
        'Skincare': [
          'For external use only.',
          'Avoid contact with eyes. If contact occurs, rinse thoroughly with water.',
          'Discontinue use if irritation or rash appears.'
        ]
      }
      
      let precautions = [...generalPrecautions]
      
      if (product.value?.category && specificPrecautions[product.value.category]) {
        precautions = [...specificPrecautions[product.value.category], ...precautions]
      }
      
      return precautions
    }
    
    onMounted(() => {
      fetchProduct()
    })
    
    return {
      product,
      loading,
      error,
      quantity,
      relatedProducts,
      activeTab,
      tabs,
      incrementQuantity,
      decrementQuantity,
      addToCart,
      getDummyBenefits,
      getDummyReviews,
      getRandomReviewPercentage,
      getRandomReviewCount,
      getUsageInstructions,
      getDosageInstructions,
      getPrecautions
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