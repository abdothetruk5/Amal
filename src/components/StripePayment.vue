<template>
  <div class="stripe-payment">
    <div v-if="!stripeLoaded" class="text-center py-8">
      <div class="spinner mb-4"></div>
      <p>Loading payment system...</p>
    </div>

    <div v-else-if="paymentSuccess" class="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
      <CheckCircleIcon class="w-12 h-12 mx-auto mb-4 text-green-500" />
      <h3 class="text-xl font-bold mb-2">Payment Successful!</h3>
      <p class="text-gray-600 mb-4">Your payment was processed successfully. Thank you for your order!</p>
      <p class="text-primary font-medium">Order #{{ orderNumber }}</p>
      <router-link to="/profile" class="btn btn-primary mt-6">View Your Orders</router-link>
    </div>

    <div v-else-if="paymentError" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <XCircleIcon class="w-12 h-12 mx-auto mb-4 text-red-500" />
      <h3 class="text-xl font-bold mb-2">Payment Failed</h3>
      <p class="text-gray-600 mb-4">{{ paymentError }}</p>
      <button 
        @click="resetPayment" 
        class="btn btn-primary"
      >
        Try Again
      </button>
    </div>

    <div v-else class="space-y-6">
      <!-- Payment Method Selection -->
      <div>
        <h3 class="text-lg font-medium mb-4">Payment Method</h3>
        <div class="space-y-3">
          <label class="flex items-start p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors" :class="{'border-primary bg-primary/5': paymentMethod === 'card'}">
            <input type="radio" v-model="paymentMethod" value="card" class="mr-3 mt-1" />
            <div>
              <div class="font-medium">Credit / Debit Card</div>
              <div class="text-sm text-gray-600">Pay securely with your card</div>
              <div class="flex items-center gap-2 mt-2">
                <img src="https://cdn-icons-png.flaticon.com/128/196/196578.png" alt="Visa" class="h-6" />
                <img src="https://cdn-icons-png.flaticon.com/128/196/196561.png" alt="Mastercard" class="h-6" />
                <img src="https://cdn-icons-png.flaticon.com/128/196/196539.png" alt="American Express" class="h-6" />
                <img src="https://cdn-icons-png.flaticon.com/128/196/196548.png" alt="Discover" class="h-6" />
              </div>
            </div>
          </label>

          <label class="flex items-start p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors" :class="{'border-primary bg-primary/5': paymentMethod === 'paypal'}">
            <input type="radio" v-model="paymentMethod" value="paypal" class="mr-3 mt-1" />
            <div>
              <div class="font-medium">PayPal</div>
              <div class="text-sm text-gray-600">You will be redirected to PayPal to complete payment</div>
              <div class="mt-2">
                <img src="https://cdn-icons-png.flaticon.com/128/196/196565.png" alt="PayPal" class="h-6" />
              </div>
            </div>
          </label>
        </div>
      </div>

      <!-- Credit Card Input Form -->
      <div v-if="paymentMethod === 'card'" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
          <input 
            v-model="cardholderName"
            type="text" 
            class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="John Smith"
          />
        </div>

        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Card Information</label>
          
          <!-- Card number input -->
          <div 
            id="card-element" 
            class="p-3 bg-white border border-gray-200 rounded-lg"
          ></div>

          <!-- Show any errors -->
          <div 
            v-if="cardError" 
            class="text-red-500 text-sm mt-1"
          >
            {{ cardError }}
          </div>
        </div>
      </div>
      
      <!-- PayPal Method (Simplified) -->
      <div v-else-if="paymentMethod === 'paypal'" class="bg-gray-50 p-4 rounded-lg text-center">
        <p class="text-gray-600 mb-4">You'll be redirected to PayPal to complete your payment when you click the button below.</p>
        <img src="https://cdn-icons-png.flaticon.com/128/196/196565.png" alt="PayPal" class="h-10 mx-auto" />
      </div>

      <!-- Billing Address (Simplified) -->
      <div>
        <h3 class="text-lg font-medium mb-4">Billing Address</h3>
        <div class="flex items-center mb-4">
          <input 
            type="checkbox" 
            id="same-address" 
            v-model="sameAsShipping"
            class="mr-2"
          />
          <label for="same-address">Same as shipping address</label>
        </div>

        <div v-if="!sameAsShipping" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input type="text" class="input" v-model="billingAddress.firstName" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input type="text" class="input" v-model="billingAddress.lastName" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input type="text" class="input" v-model="billingAddress.address" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input type="text" class="input" v-model="billingAddress.city" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input type="text" class="input" v-model="billingAddress.state" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
              <input type="text" class="input" v-model="billingAddress.zip" />
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Button -->
      <div class="mt-6">
        <button 
          @click="processPayment"
          class="w-full btn btn-primary flex items-center justify-center gap-2 py-3"
          :disabled="isProcessing || !isFormValid"
        >
          <div v-if="isProcessing" class="spinner w-5 h-5 border-white"></div>
          <LockClosedIcon v-else class="w-5 h-5" />
          <span>{{ isProcessing ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}` }}</span>
        </button>
      </div>

      <!-- Secure Payment Notice -->
      <div class="text-center text-gray-600 text-sm">
        <div class="flex items-center justify-center gap-1">
          <LockClosedIcon class="w-4 h-4" />
          <span>Secure payment provided by Stripe</span>
        </div>
        <p>Your payment information is encrypted and secure</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { loadStripe } from '@stripe/stripe-js'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { supabase } from '../lib/supabase'
import { CheckCircleIcon, XCircleIcon, LockClosedIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'StripePayment',
  components: {
    CheckCircleIcon,
    XCircleIcon,
    LockClosedIcon
  },
  props: {
    totalAmount: {
      type: Number,
      required: true
    },
    shippingAddress: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const router = useRouter()
    const toast = useToast()
    const cartStore = useCartStore()
    
    // State variables
    const stripeLoaded = ref(false)
    const stripe = ref(null)
    const elements = ref(null)
    const card = ref(null)
    const cardError = ref('')
    const paymentMethod = ref('card')
    const cardholderName = ref('')
    const isProcessing = ref(false)
    const paymentSuccess = ref(false)
    const paymentError = ref('')
    const orderNumber = ref('')
    const sameAsShipping = ref(true)
    
    const billingAddress = ref({
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zip: ''
    })

    // Initialize Stripe
    onMounted(async () => {
      try {
        // In a production app, this would be your Stripe publishable key
        const stripePublishableKey = 'pk_test_51PGb2sC2TFWIUdZPwVLCWb0sPpv4w7P2KQW6lCIy8eCyvn4tiQSVXnnBHLJiV5JmL9Hm5u6ZjyMUf8oWxNICaqms00UwDZMCIG';
        
        stripe.value = await loadStripe(stripePublishableKey)
        
        if (stripe.value) {
          elements.value = stripe.value.elements()
          
          // Create card element
          card.value = elements.value.create('card', {
            style: {
              base: {
                iconColor: '#D35400',
                color: '#333',
                fontWeight: '500',
                fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
                fontSize: '16px',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                iconColor: '#ef4444',
                color: '#ef4444',
              }
            }
          })
          
          // Mount card element to DOM
          card.value.mount('#card-element')
          
          // Listen for card errors
          card.value.on('change', (event) => {
            cardError.value = event.error ? event.error.message : ''
          })
          
          stripeLoaded.value = true
        }
      } catch (error) {
        console.error('Error loading Stripe:', error)
        cardError.value = 'Failed to load payment system. Please try again later.'
      }
    })

    // If shipping address changes, update billing address if it's the same
    watch(() => props.shippingAddress, (newAddress) => {
      if (sameAsShipping.value && newAddress) {
        billingAddress.value = {
          firstName: newAddress.firstName || '',
          lastName: newAddress.lastName || '',
          address: newAddress.address || '',
          city: newAddress.city || '',
          state: newAddress.state || '',
          zip: newAddress.zip || ''
        }
      }
    }, { deep: true })

    // Validate form before payment
    const isFormValid = computed(() => {
      if (paymentMethod.value === 'card') {
        return cardholderName.value.trim() !== ''
      }
      return true
    })

    // Process the payment
    const processPayment = async () => {
      if (!isFormValid.value) return
      
      isProcessing.value = true
      paymentError.value = ''
      
      try {
        if (paymentMethod.value === 'card') {
          // For demonstration purposes, we'll simulate a successful payment
          // In a real app, you would:
          // 1. Create a payment intent on your server
          // 2. Confirm the payment with Stripe.js
          
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 2000))
          
          // Simulate a 10% chance of payment failure for demo purposes
          const isSuccessful = Math.random() > 0.1
          
          if (isSuccessful) {
            // Simulate successful payment
            await createOrder()
            paymentSuccess.value = true
            
            // Clear cart after successful payment
            cartStore.clearCart()
            
            toast.success('Payment processed successfully!')
          } else {
            // Simulate payment error
            throw new Error('Your card was declined. Please try another payment method.')
          }
        } else if (paymentMethod.value === 'paypal') {
          // In a real app, redirect to PayPal
          toast.info('You would be redirected to PayPal to complete your payment.')
          
          // Simulate successful PayPal payment
          await new Promise(resolve => setTimeout(resolve, 2000))
          await createOrder()
          paymentSuccess.value = true
          
          // Clear cart after successful payment
          cartStore.clearCart()
        }
      } catch (error) {
        console.error('Payment error:', error)
        paymentError.value = error.message || 'An error occurred while processing your payment. Please try again.'
        toast.error(paymentError.value)
      } finally {
        isProcessing.value = false
      }
    }

    // Create an order in the database
    const createOrder = async () => {
      try {
        // Get the current user
        const user = supabase.auth.currentUser
        
        if (!user) {
          throw new Error('You must be logged in to place an order')
        }
        
        // Create a new order
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert([
            {
              user_id: user.id,
              total: props.totalAmount,
              status: 'pending'
            }
          ])
          .select()
        
        if (orderError) throw orderError
        
        // Generate a random order number for demonstration
        orderNumber.value = `ORD-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`
        
        // In a real app, you would also create order_items entries for each cart item
        // and potentially store shipping/billing information
        return orderData
      } catch (error) {
        console.error('Error creating order:', error)
        throw new Error('Failed to create your order. Please contact support.')
      }
    }

    // Reset the payment form on error
    const resetPayment = () => {
      paymentError.value = ''
      
      if (card.value) {
        card.value.clear()
      }
    }

    return {
      stripeLoaded,
      cardError,
      paymentMethod,
      cardholderName,
      isProcessing,
      paymentSuccess,
      paymentError,
      orderNumber,
      sameAsShipping,
      billingAddress,
      isFormValid,
      processPayment,
      resetPayment
    }
  }
}
</script>

<style scoped>
/* Custom spinner for loading state */
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>