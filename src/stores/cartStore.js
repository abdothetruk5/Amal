import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref([])
  const isCartOpen = ref(false)
  
  // Get cart from localStorage if available
  const initCart = () => {
    const savedCart = localStorage.getItem('sandbad-cart')
    if (savedCart) {
      try {
        cartItems.value = JSON.parse(savedCart)
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e)
        cartItems.value = []
      }
    }
  }
  
  // Save cart to localStorage
  const saveCart = () => {
    localStorage.setItem('sandbad-cart', JSON.stringify(cartItems.value))
  }
  
  // Add item to cart
  const addToCart = (item) => {
    const existingItem = cartItems.value.find(cartItem => cartItem.id === item.id)
    
    if (existingItem) {
      existingItem.quantity += item.quantity
    } else {
      cartItems.value.push({...item})
    }
    
    saveCart()
  }
  
  // Remove item from cart
  const removeFromCart = (itemId) => {
    cartItems.value = cartItems.value.filter(item => item.id !== itemId)
    saveCart()
  }
  
  // Update item quantity
  const updateQuantity = (itemId, quantity) => {
    const item = cartItems.value.find(item => item.id === itemId)
    
    if (item) {
      item.quantity = quantity
      
      if (item.quantity <= 0) {
        removeFromCart(itemId)
      } else {
        saveCart()
      }
    }
  }
  
  // Clear cart
  const clearCart = () => {
    cartItems.value = []
    saveCart()
  }
  
  // Computed properties
  const totalItems = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })
  
  const totalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  })
  
  // Initialize the cart
  initCart()
  
  return {
    cartItems,
    isCartOpen,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  }
})