<template>
  <div class="min-h-[80vh] flex items-center justify-center">
    <div class="w-full max-w-md">
      <div 
        class="bg-white shadow-xl rounded-2xl p-8"
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :enter="{ opacity: 1, y: 0 }"
      >
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900">
            {{ isLogin ? translations[currentLocale].auth.welcomeBack : translations[currentLocale].auth.createAccount }}
          </h2>
          <p class="text-gray-600 mt-2">
            {{ isLogin ? translations[currentLocale].auth.signInPrompt : translations[currentLocale].auth.joinPrompt }}
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              v-model="email"
              required
              class="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              :class="{ 'border-red-300': error }"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              v-model="password"
              required
              minlength="6"
              class="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              :class="{ 'border-red-300': error }"
            />
            <p class="mt-1 text-xs text-gray-500">Password must be at least 6 characters long</p>
          </div>

          <div v-if="error" class="text-red-500 text-sm space-y-2">
            <p>{{ error }}</p>
            <p v-if="isLogin && error.includes('Invalid')" class="text-gray-600 text-xs">
              {{ translations[currentLocale].auth.forgotPassword }}
              <button 
                @click="handleResetPassword" 
                class="text-primary hover:text-primary/80 underline"
                type="button"
              >
                {{ translations[currentLocale].auth.resetPassword }}
              </button>
            </p>
          </div>

          <button
            type="submit"
            class="w-full btn btn-primary py-3 flex items-center justify-center gap-2"
            :disabled="loading || !isValidForm"
          >
            <span v-if="loading" class="animate-spin">
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isLogin ? translations[currentLocale].buttons.signIn : translations[currentLocale].buttons.signUp }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <button 
            @click="toggleAuthMode"
            class="text-primary hover:text-primary/80 text-sm font-medium"
          >
            {{ isLogin ? translations[currentLocale].auth.dontHaveAccount : translations[currentLocale].auth.alreadyHaveAccount }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { useToast } from 'vue-toastification'
import { translations, currentLocale } from '../lib/translations'

export default {
  name: 'Auth',
  setup() {
    const router = useRouter()
    const toast = useToast()
    
    const email = ref('')
    const password = ref('')
    const error = ref('')
    const loading = ref(false)
    const isLogin = ref(true)

    const isValidForm = computed(() => {
      return email.value && password.value && password.value.length >= 6
    })

    const handleError = (err) => {
      console.error('Auth error:', err)
      
      // Improved error parsing to handle various Supabase error formats
      let errorMessage, errorCode
      
      // Handle object with embedded error
      if (err.error && typeof err.error === 'object') {
        errorMessage = err.error.message
        errorCode = err.error.code
      } 
      // Handle direct error properties
      else {
        errorMessage = err.message
        errorCode = err.code
      }
      
      // Handle JSON string in body
      if (err.body && typeof err.body === 'string') {
        try {
          const bodyObj = JSON.parse(err.body)
          if (!errorMessage) errorMessage = bodyObj.message
          if (!errorCode) errorCode = bodyObj.code
        } catch (e) {
          // If JSON parsing fails, use body as is
          if (!errorMessage) errorMessage = err.body
        }
      }
      
      // Handle specific error cases
      if (errorMessage?.includes('Invalid login credentials') || 
          errorCode === 'invalid_credentials') {
        return 'Invalid email or password. Please try again.'
      } 
      
      if (errorMessage?.includes('User already registered') || 
          errorCode === 'user_already_exists') {
        // Switch to login mode and inform user
        if (!isLogin.value) {
          setTimeout(() => {
            isLogin.value = true
          }, 100)
          return 'An account with this email already exists. Please sign in instead.'
        }
      }
      
      // Generic error fallback
      return errorMessage || 'An error occurred. Please try again.'
    }

    const handleResetPassword = async () => {
      if (!email.value) {
        error.value = 'Please enter your email address to reset your password.'
        return
      }

      loading.value = true
      try {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.value)
        if (resetError) throw resetError
        toast.success('Password reset instructions have been sent to your email.')
      } catch (err) {
        error.value = 'Unable to send reset instructions. Please try again.'
        toast.error(error.value)
      } finally {
        loading.value = false
      }
    }

    const toggleAuthMode = () => {
      isLogin.value = !isLogin.value
      error.value = ''
      email.value = ''
      password.value = ''
    }

    const createProfile = async (userId) => {
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ id: userId, email: email.value }])
        
        if (profileError) throw profileError
      } catch (err) {
        console.error('Error creating profile:', err)
        throw err
      }
    }

    const handleSubmit = async () => {
      if (!isValidForm.value) return

      loading.value = true
      error.value = ''

      try {
        if (isLogin.value) {
          const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value,
          })
          
          if (signInError) throw signInError

          if (data?.user) {
            toast.success('Welcome back!')
            router.push('/')
          }
        } else {
          const { data, error: signUpError } = await supabase.auth.signUp({
            email: email.value,
            password: password.value,
          })
          
          if (signUpError) throw signUpError

          if (data?.user) {
            await createProfile(data.user.id)
            toast.success('Account created successfully!')
            router.push('/')
          }
        }
      } catch (err) {
        error.value = handleError(err)
        toast.error(error.value)
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      password,
      error,
      loading,
      isLogin,
      isValidForm,
      handleSubmit,
      toggleAuthMode,
      handleResetPassword,
      translations,
      currentLocale
    }
  }
}
</script>