<template>
  <div class="space-y-8">
    <!-- Header -->
    <div 
      class="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0 }"
    >
      <h1 class="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
      <p class="text-gray-600 max-w-2xl">
        Find answers to common questions about our services, products, and policies.
      </p>
    </div>

    <!-- Search -->
    <div 
      class="max-w-2xl mx-auto"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, delay: 200 }"
    >
      <div class="relative">
        <MagnifyingGlassIcon class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input 
          type="text"
          v-model="searchQuery"
          placeholder="Search FAQs..."
          class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>

    <!-- FAQ Categories -->
    <div 
      class="grid md:grid-cols-3 gap-6"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, delay: 400 }"
    >
      <button
        v-for="category in categories"
        :key="category.name"
        @click="selectedCategory = category.name"
        class="card text-center hover:shadow-lg transition-shadow"
        :class="{ 'ring-2 ring-primary': selectedCategory === category.name }"
      >
        <component :is="category.icon" class="w-8 h-8 mx-auto mb-4 text-primary" />
        <h3 class="font-semibold">{{ category.name }}</h3>
        <p class="text-sm text-gray-600">{{ category.description }}</p>
      </button>
    </div>

    <!-- FAQ List -->
    <div 
      class="max-w-3xl mx-auto space-y-4"
      v-motion
      :initial="{ opacity: 0 }"
      :enter="{ opacity: 1, delay: 600 }"
    >
      <div
        v-for="(faq, index) in filteredFaqs"
        :key="index"
        class="card cursor-pointer"
        @click="faq.isOpen = !faq.isOpen"
      >
        <div class="flex justify-between items-center">
          <h3 class="font-semibold" :class="{ 'text-primary': faq.isOpen }">
            {{ faq.question }}
          </h3>
          <ChevronDownIcon 
            class="w-5 h-5 transition-transform"
            :class="{ 'transform rotate-180': faq.isOpen }"
          />
        </div>
        <div 
          v-show="faq.isOpen"
          class="mt-4 text-gray-600"
        >
          {{ faq.answer }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ShoppingBagIcon,
  TruckIcon,
  CreditCardIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'FAQ',
  components: {
    MagnifyingGlassIcon,
    ChevronDownIcon,
    ShoppingBagIcon,
    TruckIcon,
    CreditCardIcon
  },
  setup() {
    const searchQuery = ref('')
    const selectedCategory = ref('Orders')

    const categories = [
      {
        name: 'Orders',
        icon: 'ShoppingBagIcon',
        description: 'Questions about ordering and delivery'
      },
      {
        name: 'Shipping',
        icon: 'TruckIcon',
        description: 'Delivery times and tracking'
      },
      {
        name: 'Payment',
        icon: 'CreditCardIcon',
        description: 'Payment methods and billing'
      }
    ]

    const faqs = ref([
      {
        category: 'Orders',
        question: 'How do I place an order?',
        answer: 'You can place an order by browsing our products, adding items to your cart, and proceeding to checkout. You\'ll need to create an account or sign in to complete your purchase.',
        isOpen: false
      },
      {
        category: 'Orders',
        question: 'Can I modify or cancel my order?',
        answer: 'You can modify or cancel your order within 1 hour of placing it. Please contact our customer service team for assistance.',
        isOpen: false
      },
      {
        category: 'Shipping',
        question: 'How long does shipping take?',
        answer: 'Standard shipping typically takes 2-4 business days. Express shipping is available for next-day delivery in select areas.',
        isOpen: false
      },
      {
        category: 'Shipping',
        question: 'Do you ship internationally?',
        answer: 'Currently, we only ship within the United States. We plan to expand our shipping services in the future.',
        isOpen: false
      },
      {
        category: 'Payment',
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, PayPal, and Apple Pay. All payments are processed securely.',
        isOpen: false
      },
      {
        category: 'Payment',
        question: 'Is my payment information secure?',
        answer: 'Yes, we use industry-standard encryption and security measures to protect your payment information.',
        isOpen: false
      }
    ])

    const filteredFaqs = computed(() => {
      return faqs.value.filter(faq => {
        const matchesCategory = selectedCategory.value ? faq.category === selectedCategory.value : true
        const matchesSearch = searchQuery.value
          ? faq.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
          : true
        return matchesCategory && matchesSearch
      })
    })

    return {
      searchQuery,
      selectedCategory,
      categories,
      filteredFaqs
    }
  }
}
</script>