<template>
  <div>
    <!-- Floating Chat Button -->
    <button 
      @click="toggleChat"
      class="fixed bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-elevation-3 hover:shadow-elevation-2 transition-all flex items-center justify-center"
      :class="{ 'rotate-45': isChatOpen }"
    >
      <ChatBubbleOvalLeftEllipsisIcon v-if="!isChatOpen" class="w-6 h-6" />
      <XMarkIcon v-else class="w-6 h-6" />
      <span v-if="unreadMessages > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {{ unreadMessages }}
      </span>
    </button>

    <!-- Chat Window -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-90"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-90"
    >
      <div 
        v-if="isChatOpen" 
        class="fixed bottom-24 right-6 z-50 w-80 md:w-96 h-[500px] bg-white rounded-lg shadow-elevation-3 flex flex-col"
      >
        <!-- Chat Header -->
        <div class="bg-primary text-white p-4 rounded-t-lg flex items-center justify-between">
          <div class="flex items-center">
            <div class="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center mr-3">
              <HeartIcon class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-medium">Amal Support</h3>
              <div class="flex items-center text-xs">
                <div class="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                <span>Online</span>
              </div>
            </div>
          </div>
          <button @click="toggleChat" class="text-white hover:text-white/80">
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <!-- Chat Messages -->
        <div 
          ref="messagesContainer"
          class="flex-grow p-4 overflow-y-auto"
          style="background-image: url('https://pattern.monster/static/ae6ebff8b3d911e11db4398ba52f8ced/piledup.svg'); background-size: 300px; background-color: #95c31b;"
        >
          <div v-for="(message, index) in messages" :key="index" class="mb-4">
            <div 
              v-if="message.type === 'system'" 
              class="text-center my-4"
            >
              <span class="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                {{ message.text }}
              </span>
            </div>
            <div 
              v-else
              :class="[
                'max-w-[80%] p-3 rounded-lg shadow-sm', 
                message.isUser ? 'ml-auto bg-primary text-white rounded-br-none' : 'mr-auto bg-white rounded-bl-none',
              ]"
            >
              <p :class="message.isUser ? 'text-white' : 'text-gray-800'">{{ message.text }}</p>
              <p :class="[
                'text-[10px] mt-1 text-right', 
                message.isUser ? 'text-white/70' : 'text-gray-500'
              ]">
                {{ message.time }}
              </p>
            </div>
          </div>

          <div v-if="isTyping" class="flex items-center gap-1 text-gray-500 text-sm">
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
          </div>
        </div>

        <!-- Quick Replies -->
        <div v-if="showQuickReplies" class="px-4 py-2 bg-gray-50 border-t border-b">
          <div class="text-sm font-medium text-gray-700 mb-2">Quick Replies</div>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="(reply, index) in quickReplies" 
              :key="index"
              @click="sendQuickReply(reply)"
              class="bg-white border px-3 py-1 rounded-full text-sm hover:bg-primary hover:text-white hover:border-primary transition-colors"
            >
              {{ reply }}
            </button>
          </div>
        </div>

        <!-- Chat Input -->
        <div class="p-4 border-t">
          <form @submit.prevent="sendMessage" class="flex gap-2">
            <input 
              v-model="newMessage" 
              type="text" 
              placeholder="Type your message..."
              class="flex-grow px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-primary/20"
              :disabled="isTyping"
            />
            <button 
              type="submit"
              class="bg-primary text-white p-2 rounded-full disabled:opacity-50"
              :disabled="!newMessage.trim() || isTyping"
            >
              <PaperAirplaneIcon class="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted, watch, nextTick } from 'vue'
import { 
  ChatBubbleOvalLeftEllipsisIcon, 
  XMarkIcon, 
  PaperAirplaneIcon, 
  HeartIcon 
} from '@heroicons/vue/24/outline'

export default {
  name: 'LiveChat',
  components: {
    ChatBubbleOvalLeftEllipsisIcon,
    XMarkIcon,
    PaperAirplaneIcon,
    HeartIcon
  },
  setup() {
    const isChatOpen = ref(false)
    const newMessage = ref('')
    const messages = ref([])
    const unreadMessages = ref(0)
    const isTyping = ref(false)
    const messagesContainer = ref(null)
    const showQuickReplies = ref(true)

    const quickReplies = [
      "How can I track my order?",
      "Do you offer free shipping?",
      "What's your return policy?",
      "Are there any discounts available?"
    ]

    const toggleChat = () => {
      isChatOpen.value = !isChatOpen.value
      if (isChatOpen.value) {
        unreadMessages.value = 0
        
        // If no messages yet, add welcome message
        if (messages.value.length === 0) {
          addBotMessage("👋 Welcome to Amal Pharmacy! How can I assist you today?")
          
          // Add system message after a delay
          setTimeout(() => {
            messages.value.push({
              type: 'system',
              text: 'Support team typically replies in a few minutes'
            })
          }, 1000)
        }
      }
    }

    const formatTime = () => {
      const now = new Date()
      return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const sendMessage = () => {
      if (!newMessage.value.trim() || isTyping.value) return
      
      const message = newMessage.value
      messages.value.push({
        type: 'message',
        isUser: true,
        text: message,
        time: formatTime()
      })
      
      newMessage.value = ''
      showQuickReplies.value = false
      
      // Simulate typing indication
      isTyping.value = true
      
      // Simulate a response after 1-3 seconds
      const responseTime = Math.floor(Math.random() * 2000) + 1000
      setTimeout(() => {
        isTyping.value = false
        addBotResponse(message)
      }, responseTime)
    }

    const sendQuickReply = (reply) => {
      newMessage.value = reply
      sendMessage()
    }

    const addBotMessage = (text) => {
      messages.value.push({
        type: 'message',
        isUser: false,
        text: text,
        time: formatTime()
      })
      
      if (!isChatOpen.value) {
        unreadMessages.value++
      }
    }

    const addBotResponse = (message) => {
      let response
      
      // Simple response logic based on keywords
      const lowerMessage = message.toLowerCase()
      
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        response = "Hello there! How can I help you today?"
      }
      else if (lowerMessage.includes('track') || lowerMessage.includes('order status') || lowerMessage.includes('where is')) {
        response = "You can track your order by going to your account dashboard and clicking on the Orders section. There you'll find tracking information for all your orders."
      }
      else if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
        response = "We offer free shipping on orders over $50. Standard delivery takes 2-4 business days, and express shipping (additional $9.99) takes 1-2 business days."
      }
      else if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
        response = "Our return policy allows returns within 30 days of delivery. Unopened items can be returned for a full refund, while opened items may be eligible for a partial refund or store credit."
      }
      else if (lowerMessage.includes('discount') || lowerMessage.includes('coupon') || lowerMessage.includes('promo')) {
        response = "We regularly offer discounts to our newsletter subscribers. You can sign up at the bottom of our homepage. For new customers, you can use code WELCOME15 for 15% off your first order."
      }
      else if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
        response = "We accept all major credit cards, PayPal, and Apple Pay. All payments are securely processed through our payment partner, Stripe."
      }
      else {
        response = "Thank you for your message. One of our support representatives will get back to you shortly. Is there anything else I can help with in the meantime?"
      }

      addBotMessage(response)
    }

    // Send periodic messages to simulate proactive support
    onMounted(() => {
      // If chat isn't open after 15 seconds, send a proactive message
      setTimeout(() => {
        if (!isChatOpen.value && messages.value.length === 0) {
          addBotMessage("👋 Need help with anything? I'm here to assist!")
        }
      }, 15000)
    })

    // Scroll to bottom when messages change
    watch(messages, () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
      })
    }, { deep: true })

    return {
      isChatOpen,
      newMessage,
      messages,
      unreadMessages,
      isTyping,
      messagesContainer,
      showQuickReplies,
      quickReplies,
      toggleChat,
      sendMessage,
      sendQuickReply
    }
  }
}
</script>

<style scoped>
/* Chat animations */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.animate-bounce {
  animation: bounce 1s infinite;
}
</style>