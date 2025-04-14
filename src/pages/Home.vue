<template>
  <div class="space-y-16">
    <!-- Hero Section with Enhanced Gradient -->
    <section 
      class="relative overflow-hidden medical-hero-gradient py-20 px-4 rounded-3xl shadow-elevation-2"
      v-motion
      :initial="{ opacity: 0 }"
      :enter="{ opacity: 1 }"
    >
      <div class="container mx-auto">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div 
            class="space-y-8"
            v-motion
            :initial="{ opacity: 0, x: -50 }"
            :enter="{ opacity: 1, x: 0, delay: 200 }"
          >
            <h1 class="text-5xl lg:text-6xl font-bold leading-tight">
              {{ $t('hero.title') }} <span class="medical-text-gradient">{{ currentLocale === 'ar' ? 'امل' : 'Amal' }}</span>
            </h1>
            <p class="text-xl text-gray-600">
              {{ $t('hero.subtitle') }}
            </p>
            <div class="flex flex-wrap gap-4">
              <router-link 
                to="/products" 
                class="btn btn-primary flex items-center gap-2 shadow-elevation-2 hover:shadow-elevation-3 transform hover:scale-105 transition-all"
              >
                <ShoppingBagIcon class="w-5 h-5" />
                {{ $t('hero.browseProducts') }}
              </router-link>
              <router-link 
                to="/contact" 
                class="btn bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white flex items-center gap-2 shadow-elevation-1 hover:shadow-elevation-2 transform hover:scale-105 transition-all"
              >
                <PhoneIcon class="w-5 h-5" />
                {{ $t('hero.contactUs') }}
              </router-link>
            </div>
          </div>
          <div 
            class="relative"
            v-motion
            :initial="{ opacity: 0, x: 50 }"
            :enter="{ opacity: 1, x: 0, delay: 400 }"
          >
            <img 
              src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=800"
              alt="Pharmacy showcase"
              class="rounded-2xl shadow-elevation-3"
            />
            <div class="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-elevation-2">
              <div class="flex items-center gap-3">
                <UserGroupIcon class="w-8 h-8 text-primary" />
                <div>
                  <p class="text-2xl font-bold text-primary">10,000+</p>
                  <p class="text-gray-600">{{ $t('hero.happyCustomers') }}</p>
                </div>
              </div>
            </div>
            <!-- Floating Pill Elements (Decorative) -->
            <div class="absolute -top-8 -left-8 bg-white p-3 rounded-full shadow-elevation-2 animate-float">
              <HeartIcon class="w-6 h-6 text-red-500" />
            </div>
            <div class="absolute top-1/3 -right-4 bg-white p-3 rounded-full shadow-elevation-2 animate-float" style="animation-delay: 1s;">
              <BeakerIcon class="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Background decorative elements -->
      <div class="absolute -bottom-16 -left-16 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
      <div class="absolute -top-16 -right-16 w-32 h-32 bg-secondary/5 rounded-full blur-2xl pointer-events-none"></div>
    </section>

    <!-- Trust Badges Section -->
    <section 
      class="container mx-auto px-4"
      v-motion
      :initial="{ opacity: 0, y: 30 }"
      :enter="{ opacity: 1, y: 0 }"
    >
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div class="flex flex-col items-center text-center">
          <div class="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <MagnifyingGlassCircleIcon class="w-8 h-8 text-primary" />
          </div>
          <h3 class="text-lg font-semibold mb-2">Authentic Products</h3>
          <p class="text-gray-600 text-sm">100% genuine medicines and healthcare products</p>
        </div>
        
        <div class="flex flex-col items-center text-center">
          <div class="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <TruckIcon class="w-8 h-8 text-primary" />
          </div>
          <h3 class="text-lg font-semibold mb-2">Express Delivery</h3>
          <p class="text-gray-600 text-sm">Fast doorstep delivery across the country</p>
        </div>
        
        <div class="flex flex-col items-center text-center">
          <div class="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <ShieldCheckIcon class="w-8 h-8 text-primary" />
          </div>
          <h3 class="text-lg font-semibold mb-2">Quality Guaranteed</h3>
          <p class="text-gray-600 text-sm">Products sourced from certified manufacturers</p>
        </div>
        
        <div class="flex flex-col items-center text-center">
          <div class="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <ChatBubbleBottomCenterTextIcon class="w-8 h-8 text-primary" />
          </div>
          <h3 class="text-lg font-semibold mb-2">24/7 Support</h3>
          <p class="text-gray-600 text-sm">Professional assistance whenever you need it</p>
        </div>
      </div>
    </section>

    <!-- Featured Products Slideshow -->
    <section class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 
          class="text-3xl font-bold mb-4 medical-text-gradient"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0 }"
        >
          {{ $t('product.featuredProducts') }}
        </h2>
        <p 
          class="text-gray-600 max-w-2xl mx-auto"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, delay: 200 }"
        >
          {{ $t('product.exploreProducts') }}
        </p>
      </div>

      <!-- Swiper Slideshow -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, delay: 300 }"
      >
        <swiper
          :modules="[SwiperNavigation, SwiperPagination, SwiperAutoplay]"
          :slides-per-view="1"
          :space-between="20"
          :pagination="{ clickable: true }"
          :navigation="true"
          :autoplay="{ delay: 5000, disableOnInteraction: false }"
          :breakpoints="{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 }
          }"
          class="product-swiper"
        >
          <swiper-slide v-for="product in featuredProducts" :key="product.id">
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
                <div class="absolute top-2 left-2">
                  <ProductWishlistButton :product="product" />
                </div>
              </div>
              <h3 class="text-lg font-semibold mb-2">{{ product.name }}</h3>
              <p class="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">{{ product.description }}</p>
              <div class="flex items-center justify-between mt-auto">
                <span class="text-xl font-bold text-primary">${{ product.price }}</span>
                <button 
                  @click="addToCart(product)" 
                  class="btn btn-primary shadow-elevation-1 hover:shadow-elevation-2"
                >
                  {{ $t('buttons.addToCart') }}
                </button>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </section>

    <!-- Features -->
    <section class="container mx-auto px-4">
      <div class="grid md:grid-cols-3 gap-8">
        <div 
          class="card group medical-card-gradient shadow-elevation-2 hover:shadow-elevation-3 transform hover:scale-[1.02] transition-all"
          v-motion
          :initial="{ opacity: 0, y: 50 }"
          :enter="{ opacity: 1, y: 0 }"
        >
          <TruckIcon 
            class="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform duration-300"
          />
          <h3 class="text-xl font-semibold mb-3">{{ $t('features.fastDelivery.title') }}</h3>
          <p class="text-gray-600">{{ $t('features.fastDelivery.description') }}</p>
        </div>
        <div 
          class="card group medical-card-gradient shadow-elevation-2 hover:shadow-elevation-3 transform hover:scale-[1.02] transition-all"
          v-motion
          :initial="{ opacity: 0, y: 50 }"
          :enter="{ opacity: 1, y: 0, delay: 200 }"
        >
          <ShieldCheckIcon 
            class="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform duration-300"
          />
          <h3 class="text-xl font-semibold mb-3">{{ $t('features.qualityAssured.title') }}</h3>
          <p class="text-gray-600">{{ $t('features.qualityAssured.description') }}</p>
        </div>
        <div 
          class="card group medical-card-gradient shadow-elevation-2 hover:shadow-elevation-3 transform hover:scale-[1.02] transition-all"
          v-motion
          :initial="{ opacity: 0, y: 50 }"
          :enter="{ opacity: 1, y: 0, delay: 400 }"
        >
          <HeartIcon 
            class="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform duration-300"
          />
          <h3 class="text-xl font-semibold mb-3">{{ $t('features.expertCare.title') }}</h3>
          <p class="text-gray-600">{{ $t('features.expertCare.description') }}</p>
        </div>
      </div>
    </section>

    <!-- Special Offers Banner -->
    <section 
      class="container mx-auto px-4"
      v-motion
      :initial="{ opacity: 0 }"
      :enter="{ opacity: 1 }"
    >
      <div class="bg-gradient-to-r from-primary to-secondary rounded-2xl overflow-hidden shadow-elevation-3">
        <div class="grid md:grid-cols-2 items-center">
          <div class="text-white p-8 md:p-12">
            <h2 class="text-3xl font-bold mb-4">Special Offers</h2>
            <p class="text-white/90 text-lg mb-6">Get up to 30% off on selected health products this week. Limited time offer!</p>
            <router-link to="/products" class="btn bg-white text-primary hover:bg-white/90 shadow-elevation-2">
              Shop Now
            </router-link>
          </div>
          <div class="relative h-64 md:h-auto hidden md:block">
            <img 
              src="https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&q=80&w=800&h=600" 
              alt="Special offers" 
              class="w-full h-full object-cover opacity-80 mix-blend-overlay"
            />
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-white text-center">
                <p class="text-4xl font-bold">30% OFF</p>
                <p>Limited Time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Categories Slideshow -->
    <section class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 
          class="text-3xl font-bold mb-4 medical-text-gradient"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0 }"
        >
          {{ currentLocale === 'ar' ? 'تصفح حسب القسم' : 'Browse by Category' }}
        </h2>
      </div>

      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, delay: 300 }"
      >
        <swiper
          :modules="[SwiperNavigation, SwiperPagination, SwiperAutoplay]"
          :slides-per-view="2"
          :space-between="20"
          :pagination="{ clickable: true }"
          :navigation="true"
          :autoplay="{ delay: 4000, disableOnInteraction: false }"
          :breakpoints="{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 }
          }"
        >
          <swiper-slide v-for="(category, index) in categoryImages" :key="index">
            <router-link 
              :to="`/products?category=${category.name}`" 
              class="card text-center group cursor-pointer hover:border-primary border-2 border-transparent shadow-elevation-1 hover:shadow-elevation-2 transition-all transform hover:scale-105"
            >
              <img 
                :src="category.image" 
                :alt="category.name"
                class="w-24 h-24 object-cover rounded-full mx-auto mb-4 border-4 border-primary/10"
              />
              <h3 class="font-medium">{{ category.name }}</h3>
            </router-link>
          </swiper-slide>
        </swiper>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section 
      class="container mx-auto px-4"
      v-motion
      :initial="{ opacity: 0, y: 30 }"
      :enter="{ opacity: 1, y: 0 }"
    >
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold mb-4 medical-text-gradient">What Our Customers Say</h2>
        <p class="text-gray-600 max-w-2xl mx-auto">
          Hear from our satisfied customers about their experiences with Amal Pharmacy.
        </p>
      </div>
      
      <div class="grid md:grid-cols-3 gap-8">
        <div 
          v-for="(testimonial, index) in testimonials" 
          :key="index"
          class="card gradient-card-hover transform hover:scale-105 transition-all relative"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, delay: index * 200 }"
        >
          <!-- Quotation mark -->
          <div class="absolute -top-4 -left-4 text-4xl text-primary/20">"</div>
          
          <div class="flex items-center gap-4 mb-4">
            <img 
              :src="testimonial.avatar" 
              :alt="testimonial.name"
              class="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <h3 class="font-semibold">{{ testimonial.name }}</h3>
              <div class="flex">
                <StarIcon v-for="i in 5" :key="i" class="w-4 h-4 text-yellow-400" />
              </div>
            </div>
          </div>
          
          <p class="text-gray-600 italic">{{ testimonial.text }}</p>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section 
      class="container mx-auto px-4"
      v-motion
      :initial="{ opacity: 0, y: 50 }"
      :enter="{ opacity: 1, y: 0 }"
    >
      <div class="medical-accent-gradient rounded-2xl p-12 text-white text-center shadow-elevation-2">
        <h2 class="text-3xl font-bold mb-4">{{ $t('newsletter.title') }}</h2>
        <p class="mb-8 max-w-2xl mx-auto">{{ $t('newsletter.subtitle') }}</p>
        <form @submit.prevent="subscribeNewsletter" class="max-w-md mx-auto flex gap-4">
          <input 
            type="email" 
            v-model="email"
            :placeholder="$t('newsletter.placeholder')"
            class="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
            required
          >
          <button type="submit" class="btn bg-white text-primary hover:bg-gray-100 shadow-elevation-1 hover:shadow-elevation-2 transform hover:scale-105 transition-all">
            {{ $t('buttons.subscribe') }}
          </button>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted, inject } from 'vue'
import { supabase } from '../lib/supabase'
import { useToast } from 'vue-toastification'
import { useCartStore } from '../stores/cartStore'
import ProductWishlistButton from '../components/ProductWishlistButton.vue'
import {
  ShoppingBagIcon,
  PhoneIcon,
  UserGroupIcon,
  TruckIcon,
  StarIcon,
  ShieldCheckIcon,
  HeartIcon,
  ChatBubbleBottomCenterTextIcon,
  MagnifyingGlassCircleIcon,
  BeakerIcon
} from '@heroicons/vue/24/outline'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation as SwiperNavigation, Pagination as SwiperPagination, Autoplay as SwiperAutoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default {
  name: 'Home',
  components: {
    ShoppingBagIcon,
    PhoneIcon,
    UserGroupIcon,
    TruckIcon,
    StarIcon,
    ShieldCheckIcon,
    HeartIcon,
    ChatBubbleBottomCenterTextIcon,
    MagnifyingGlassCircleIcon,
    BeakerIcon,
    ProductWishlistButton,
    Swiper,
    SwiperSlide
  },
  setup() {
    const toast = useToast()
    const cartStore = useCartStore()
    const email = ref('')
    const featuredProducts = ref([])
    const currentLocale = inject('locale')
    const $t = inject('t')
    
    // More detailed category images with high-quality images
    const categoryImages = [
      {
        name: 'Pain Relief',
        image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGFpbiUyMHJlbGllZnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60'
      },
      {
        name: 'Vitamins',
        image: 'https://images.unsplash.com/photo-1577613901972-9106e25d0fa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8dml0YW1pbnN8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60'
      },
      {
        name: 'First Aid',
        image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Zmlyc3QlMjBhaWR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60'
      },
      {
        name: 'Skincare',
        image: 'https://images.unsplash.com/photo-1556228578-4da87a0aacce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2tpbmNhcmV8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60'
      },
      {
        name: 'Dental Care',
        image: 'https://images.unsplash.com/photo-1588528402605-1f9d0eb7a6d6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZGVudGFsJTIwY2FyZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60'
      },
      {
        name: 'Eye Care',
        image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZXllJTIwY2FyZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60'
      },
      {
        name: 'Baby Care',
        image: 'https://images.unsplash.com/photo-1544126592-55f7a4c3b3e9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YmFieSUyMGNhcmV8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60'
      }
    ]
    
    const testimonials = [
      {
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80",
        text: "I've been using Amal Pharmacy for all my medication needs. The delivery is always on time and the service is excellent!"
      },
      {
        name: "Michael Chen",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&h=100&q=80",
        text: "As someone with chronic health issues, I appreciate how easy Amal makes it to manage my prescriptions. Their customer service is top notch!"
      },
      {
        name: "Aisha Rahman",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
        text: "The range of products is impressive and the prices are very competitive. I've recommended Amal to all my family members."
      }
    ]

    const fetchFeaturedProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('rating', { ascending: false })
          .limit(8)

        if (error) throw error
        
        if (data && data.length > 0) {
          featuredProducts.value = data
        } else {
          // If no products found, use mock data for display
          featuredProducts.value = [
            {
              id: '1',
              name: 'Premium Pain Relief',
              description: 'Fast-acting pain relief for headaches, muscle pain, and minor arthritis.',
              price: 12.99,
              rating: 4.8,
              image_url: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cGFpbiUyMHJlbGllZnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
              category: 'Pain Relief'
            },
            {
              id: '2',
              name: 'Vitamin D3 + K2 Complex',
              description: 'Essential vitamins to support bone health and immune function.',
              price: 24.95,
              rating: 4.7,
              image_url: 'https://images.unsplash.com/photo-1584308074727-e93a698bedf1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dml0YW1pbnN8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
              category: 'Vitamins'
            },
            {
              id: '3',
              name: 'Advanced First Aid Kit',
              description: 'Comprehensive kit with essential supplies for emergency situations.',
              price: 35.50,
              rating: 4.9,
              image_url: 'https://images.unsplash.com/photo-1585828292920-638a2a78cb38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Zmlyc3QlMjBhaWQlMjBraXR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
              category: 'First Aid'
            },
            {
              id: '4',
              name: 'Hyaluronic Acid Serum',
              description: 'Intensive hydration serum for all skin types. Reduces fine lines and wrinkles.',
              price: 29.99,
              rating: 4.5,
              image_url: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8c2tpbmNhcmV8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
              category: 'Skincare'
            }
          ]
        }
      } catch (error) {
        console.error('Error fetching featured products:', error)
        // Fallback to mock data if API fails
        featuredProducts.value = [
          {
            id: '1',
            name: 'Premium Pain Relief',
            description: 'Fast-acting pain relief for headaches, muscle pain, and minor arthritis.',
            price: 12.99,
            rating: 4.8,
            image_url: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cGFpbiUyMHJlbGllZnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
            category: 'Pain Relief'
          },
          {
            id: '2',
            name: 'Vitamin D3 + K2 Complex',
            description: 'Essential vitamins to support bone health and immune function.',
            price: 24.95,
            rating: 4.7,
            image_url: 'https://images.unsplash.com/photo-1584308074727-e93a698bedf1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dml0YW1pbnN8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
            category: 'Vitamins'
          },
          {
            id: '3',
            name: 'Advanced First Aid Kit',
            description: 'Comprehensive kit with essential supplies for emergency situations.',
            price: 35.50,
            rating: 4.9,
            image_url: 'https://images.unsplash.com/photo-1585828292920-638a2a78cb38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Zmlyc3QlMjBhaWQlMjBraXR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
            category: 'First Aid'
          },
          {
            id: '4',
            name: 'Hyaluronic Acid Serum',
            description: 'Intensive hydration serum for all skin types. Reduces fine lines and wrinkles.',
            price: 29.99,
            rating: 4.5,
            image_url: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8c2tpbmNhcmV8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
            category: 'Skincare'
          }
        ]
      }
    }
    
    const addToCart = (product) => {
      cartStore.addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        quantity: 1
      })
      
      toast.success(`${product.name} added to cart`)
    }

    const subscribeNewsletter = () => {
      toast.success(currentLocale.value === 'ar' ? 'شكرا لاشتراكك!' : 'Thank you for subscribing!')
      email.value = ''
    }

    onMounted(() => {
      fetchFeaturedProducts()
    })

    return {
      email,
      featuredProducts,
      categoryImages,
      testimonials,
      subscribeNewsletter,
      addToCart,
      currentLocale,
      $t,
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

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style>