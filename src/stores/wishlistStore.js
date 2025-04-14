import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useWishlistStore = defineStore('wishlist', () => {
  const wishlistItems = ref([])
  
  // Initialize from localStorage
  const initWishlist = () => {
    const savedWishlist = localStorage.getItem('sandbad-wishlist')
    if (savedWishlist) {
      try {
        wishlistItems.value = JSON.parse(savedWishlist)
      } catch (e) {
        console.error('Failed to parse wishlist from localStorage', e)
        wishlistItems.value = []
      }
    }
  }
  
  // Save to localStorage
  const saveWishlist = () => {
    localStorage.setItem('sandbad-wishlist', JSON.stringify(wishlistItems.value))
  }
  
  // Add item to wishlist
  const addToWishlist = (item) => {
    const existingItem = wishlistItems.value.find(i => i.id === item.id)
    if (!existingItem) {
      wishlistItems.value.push({
        id: item.id,
        name: item.name,
        price: item.price,
        image_url: item.image_url,
        category: item.category
      })
      saveWishlist()
    }
  }
  
  // Remove item from wishlist
  const removeFromWishlist = (itemId) => {
    wishlistItems.value = wishlistItems.value.filter(item => item.id !== itemId)
    saveWishlist()
  }
  
  // Check if item is in wishlist
  const isInWishlist = (itemId) => {
    return !!wishlistItems.value.find(item => item.id === itemId)
  }
  
  // Clear wishlist
  const clearWishlist = () => {
    wishlistItems.value = []
    saveWishlist()
  }
  
  // Computed property
  const wishlistCount = computed(() => {
    return wishlistItems.value.length
  })
  
  // Initialize
  initWishlist()
  
  return {
    wishlistItems,
    wishlistCount,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist
  }
})