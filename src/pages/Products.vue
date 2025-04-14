<template>
  <div class="space-y-8">
    <!-- Header -->
    <div 
      class="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0 }"
    >
      <h1 class="text-4xl font-bold mb-4">Our Products</h1>
      <p class="text-gray-600 max-w-2xl">
        Browse our extensive collection of high-quality healthcare products and medications.
      </p>
    </div>

    <!-- Filters and Search -->
    <div 
      class="flex flex-col md:flex-row justify-between items-start gap-4"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, delay: 200 }"
    >
      <div class="flex flex-wrap gap-4 w-full md:w-auto">
        <div class="relative flex-grow max-w-md">
          <MagnifyingGlassIcon class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            v-model="searchQuery" 
            :placeholder="translations[currentLocale].buttons.search"
            class="w-full px-10 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
          <button 
            v-if="searchQuery" 
            @click="searchQuery = ''" 
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>
        
        <select 
          v-model="sortBy"
          class="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">{{ translations[currentLocale].buttons.sortBy }}</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating_desc">Highest Rated</option>
          <option value="effectiveness_desc">Most Effective</option>
          <option value="popularity_desc">Most Popular</option>
          <option value="name_asc">Name: A-Z</option>
        </select>
      </div>

      <!-- Categories -->
      <div class="flex flex-wrap gap-2 w-full md:w-auto">
        <button 
          @click="selectedCategory = ''"
          class="px-4 py-2 rounded-full text-sm transition-colors"
          :class="selectedCategory === '' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
        >
          All
        </button>
        <button 
          v-for="category in categories"
          :key="category"
          @click="selectedCategory = category === selectedCategory ? '' : category"
          class="px-4 py-2 rounded-full text-sm transition-colors"
          :class="category === selectedCategory ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
        >
          {{ category }}
        </button>
      </div>
    </div>
    
    <!-- View Type Selector -->
    <div class="flex justify-end">
      <div class="bg-white border rounded-lg inline-flex">
        <button 
          @click="viewType = 'grid'"
          class="p-2 rounded-l-lg"
          :class="viewType === 'grid' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'"
        >
          <Squares2X2Icon class="w-5 h-5" />
        </button>
        <button 
          @click="viewType = 'list'"
          class="p-2 rounded-r-lg"
          :class="viewType === 'list' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'"
        >
          <ListBulletIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="spinner"></div>
    </div>
    
    <!-- Grid View -->
    <div 
      v-else-if="viewType === 'grid'"
      class="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
      v-motion
      :initial="{ opacity: 0 }"
      :enter="{ opacity: 1, delay: 400 }"
    >
      <div 
        v-for="(product, index) in filteredProducts" 
        :key="product.id" 
        class="card group hover:shadow-elevation-3 transition-all duration-300"
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :enter="{ opacity: 1, y: 0, delay: 100 * index }"
      >
        <div class="relative overflow-hidden rounded-lg mb-4">
          <router-link :to="`/products/${product.id}`">
            <img 
              :src="product.image_url" 
              :alt="product.name" 
              class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" 
            />
          </router-link>
          <div class="absolute top-2 right-2 flex gap-2">
            <span v-if="product.rating > 0" class="bg-yellow-400 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1">
              <StarIcon class="w-4 h-4" />
              {{ product.rating.toFixed(1) }}
            </span>
            <span v-if="product.popularity > 1000" class="bg-purple-400 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1">
              <FireIcon class="w-4 h-4" />
              Popular
            </span>
          </div>
          <div class="absolute top-2 left-2">
            <ProductWishlistButton :product="product" />
          </div>
        </div>
        <h3 class="text-xl font-semibold">
          <router-link :to="`/products/${product.id}`" class="hover:text-primary">
            {{ product.name }}
          </router-link>
        </h3>
        <p class="text-gray-600 mb-2">{{ product.category }}</p>
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-lg font-bold text-primary">${{ product.price.toFixed(2) }}</span>
            <div class="flex items-center gap-2">
              <span v-if="product.effectiveness > 0" class="text-sm text-gray-600">
                Effectiveness: {{ product.effectiveness }}%
              </span>
            </div>
          </div>
          <button 
            @click="addToCart(product)" 
            class="btn btn-primary w-full flex items-center justify-center gap-2"
            :disabled="product.stock <= 0"
          >
            <ShoppingCartIcon class="w-5 h-5" />
            {{ translations[currentLocale].buttons.addToCart }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- List View -->
    <div 
      v-else
      class="space-y-4"
      v-motion
      :initial="{ opacity: 0 }"
      :enter="{ opacity: 1, delay: 400 }"
    >
      <div 
        v-for="(product, index) in filteredProducts" 
        :key="product.id" 
        class="card hover:shadow-elevation-2 transition-all duration-300"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, delay: 50 * index }"
      >
        <div class="flex flex-col md:flex-row gap-6">
          <div class="relative w-full md:w-1/4">
            <router-link :to="`/products/${product.id}`">
              <img 
                :src="product.image_url" 
                :alt="product.name" 
                class="w-full h-48 md:h-full object-cover rounded-lg" 
              />
            </router-link>
            <div class="absolute top-2 right-2 flex gap-2">
              <span v-if="product.rating > 0" class="bg-yellow-400 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1">
                <StarIcon class="w-4 h-4" />
                {{ product.rating.toFixed(1) }}
              </span>
              <span v-if="product.popularity > 1000" class="bg-purple-400 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1">
                <FireIcon class="w-4 h-4" />
                Popular
              </span>
            </div>
            <div class="absolute top-2 left-2">
              <ProductWishlistButton :product="product" />
            </div>
          </div>
          <div class="flex-1 flex flex-col">
            <div class="flex-1">
              <div class="flex items-start justify-between mb-2">
                <h3 class="text-xl font-semibold">
                  <router-link :to="`/products/${product.id}`" class="hover:text-primary">
                    {{ product.name }}
                  </router-link>
                </h3>
                <span class="text-xl font-bold text-primary">${{ product.price.toFixed(2) }}</span>
              </div>
              <p class="text-gray-600 mb-1">Category: {{ product.category }}</p>
              <p class="text-gray-600 mb-4">{{ product.description }}</p>
              
              <div class="flex flex-wrap gap-4 mb-4">
                <div class="flex items-center gap-1">
                  <span class="text-sm font-medium">Rating:</span>
                  <div class="flex">
                    <StarIcon 
                      v-for="i in 5" 
                      :key="i"
                      class="w-4 h-4" 
                      :class="i <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'" 
                    />
                  </div>
                  <span class="text-sm text-gray-600">{{ product.rating.toFixed(1) }}</span>
                </div>
                
                <div v-if="product.effectiveness > 0" class="flex items-center gap-1">
                  <span class="text-sm font-medium">Effectiveness:</span>
                  <div class="bg-gray-200 w-32 h-2 rounded-full">
                    <div 
                      class="bg-primary h-2 rounded-full" 
                      :style="{ width: `${product.effectiveness}%` }"
                    ></div>
                  </div>
                  <span class="text-sm text-gray-600">{{ product.effectiveness }}%</span>
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-3 mt-4">
              <span 
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="{
                  'bg-green-100 text-green-800': product.stock > 10,
                  'bg-yellow-100 text-yellow-800': product.stock > 0 && product.stock <= 10,
                  'bg-red-100 text-red-800': product.stock === 0
                }"
              >
                {{ product.stock > 0 ? (product.stock <= 10 ? `Only ${product.stock} left` : 'In Stock') : 'Out of Stock' }}
              </span>
              
              <div class="flex-grow"></div>
              
              <router-link 
                :to="`/products/${product.id}`" 
                class="btn btn-outline flex items-center gap-2"
              >
                <EyeIcon class="w-5 h-5" />
                View Details
              </router-link>
              
              <button 
                @click="addToCart(product)" 
                class="btn btn-primary flex items-center gap-2"
                :disabled="product.stock <= 0"
              >
                <ShoppingCartIcon class="w-5 h-5" />
                {{ translations[currentLocale].buttons.addToCart }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div 
      v-if="filteredProducts.length === 0 && !loading"
      class="text-center py-12"
    >
      <ShoppingBagIcon class="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <h3 class="text-xl font-semibold mb-2">No Products Found</h3>
      <p class="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
      <button @click="resetFilters" class="btn btn-primary">
        Reset Filters
      </button>
    </div>
    
    <!-- Pagination -->
    <div 
      v-if="filteredProducts.length > 0" 
      class="flex justify-center items-center gap-2 mt-10"
      v-motion
      :initial="{ opacity: 0 }"
      :enter="{ opacity: 1, delay: 600 }"
    >
      <button 
        @click="currentPage = Math.max(1, currentPage - 1)"
        class="btn btn-outline p-2"
        :disabled="currentPage === 1"
      >
        <ChevronLeftIcon class="w-5 h-5" />
      </button>
      
      <div class="flex items-center gap-1">
        <button 
          v-for="page in displayedPages" 
          :key="page" 
          @click="page !== '...' ? currentPage = page : null"
          class="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          :class="page === currentPage ? 'bg-primary text-white' : page === '...' ? 'text-gray-400 cursor-default' : 'text-gray-700 hover:bg-gray-100'"
        >
          {{ page }}
        </button>
      </div>
      
      <button 
        @click="currentPage = Math.min(totalPages, currentPage + 1)"
        class="btn btn-outline p-2"
        :disabled="currentPage === totalPages"
      >
        <ChevronRightIcon class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../lib/supabase'
import { useCartStore } from '../stores/cartStore'
import { useToast } from 'vue-toastification'
import ProductWishlistButton from '../components/ProductWishlistButton.vue'
import { 
  ShoppingCartIcon, 
  StarIcon, 
  FireIcon, 
  ShoppingBagIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  Squares2X2Icon,
  ListBulletIcon,
  EyeIcon
} from '@heroicons/vue/24/outline'
import { translations, currentLocale } from '../lib/translations'

export default {
  name: 'Products',
  components: {
    ShoppingCartIcon,
    StarIcon,
    FireIcon,
    ShoppingBagIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
    Squares2X2Icon,
    ListBulletIcon,
    EyeIcon,
    ProductWishlistButton
  },
  setup() {
    const route = useRoute()
    const searchQuery = ref('')
    const sortBy = ref('')
    const selectedCategory = ref('')
    const products = ref([])
    const categories = ref([])
    const loading = ref(true)
    const viewType = ref('grid') // 'grid' or 'list'
    const itemsPerPage = 12
    const currentPage = ref(1)
    const cartStore = useCartStore()
    const toast = useToast()

    // Check for category query param
    onMounted(() => {
      if (route.query.category) {
        selectedCategory.value = route.query.category
      }
      
      if (route.query.q) {
        searchQuery.value = route.query.q
      }
      
      fetchProducts()
      fetchCategories()
    })
    
    // Reset current page when filters change
    watch([searchQuery, sortBy, selectedCategory], () => {
      currentPage.value = 1
    })

    const fetchProducts = async () => {
      loading.value = true
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
        
        if (error) throw error
        products.value = data || []
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        loading.value = false
      }
    }
    
    const fetchCategories = async () => {
      try {
        // Get unique categories from products
        const uniqueCategories = [...new Set(products.value.map(p => p.category))].filter(Boolean)
        categories.value = uniqueCategories
      } catch (error) {
        console.error('Error getting categories:', error)
      }
    }

    const addToCart = (product) => {
      if (product.stock <= 0) return
      
      cartStore.addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        quantity: 1
      })
      
      toast.success(`${product.name} added to cart`)
    }
    
    const resetFilters = () => {
      searchQuery.value = ''
      sortBy.value = ''
      selectedCategory.value = ''
    }

    // Filtered and sorted products
    const allFilteredProducts = computed(() => {
      let filtered = products.value

      // Apply category filter
      if (selectedCategory.value) {
        filtered = filtered.filter(product => 
          product.category === selectedCategory.value
        )
      }

      // Apply search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query)
        )
      }

      // Apply sorting
      if (sortBy.value) {
        const [field, direction] = sortBy.value.split('_')
        const multiplier = direction === 'asc' ? 1 : -1
        
        filtered = [...filtered].sort((a, b) => {
          if (field === 'name') {
            return a.name.localeCompare(b.name) * multiplier
          }
          return (a[field] - b[field]) * multiplier
        })
      }

      return filtered
    })
    
    // Paginated products
    const filteredProducts = computed(() => {
      const startIndex = (currentPage.value - 1) * itemsPerPage
      return allFilteredProducts.value.slice(startIndex, startIndex + itemsPerPage)
    })
    
    // Total pages for pagination
    const totalPages = computed(() => {
      return Math.max(1, Math.ceil(allFilteredProducts.value.length / itemsPerPage))
    })
    
    // Generate pagination numbers with ellipsis for large page counts
    const displayedPages = computed(() => {
      if (totalPages.value <= 7) {
        // If we have 7 or fewer pages, display all
        return [...Array(totalPages.value).keys()].map(n => n + 1)
      }
      
      // Always include first and last page
      let pages = [1]
      
      // Calculate range around current page
      const current = currentPage.value
      const total = totalPages.value
      
      if (current <= 3) {
        // Close to beginning
        pages = [...pages, 2, 3, 4, '...', total]
      } else if (current >= total - 2) {
        // Close to end
        pages = [...pages, '...', total - 3, total - 2, total - 1, total]
      } else {
        // Middle
        pages = [...pages, '...', current - 1, current, current + 1, '...', total]
      }
      
      return pages
    })

    return {
      products,
      searchQuery,
      sortBy,
      selectedCategory,
      categories,
      filteredProducts,
      translations,
      currentLocale,
      loading,
      viewType,
      currentPage,
      totalPages,
      displayedPages,
      addToCart,
      resetFilters
    }
  }
}
</script>

<style scoped>
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>