<template>
  <div class="space-y-8">
    <!-- Header -->
    <div 
      class="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0 }"
    >
      <div class="flex flex-col md:flex-row items-center gap-6">
        <div class="relative">
          <div class="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
            <img v-if="profileData.avatar_url" :src="profileData.avatar_url" alt="Profile" class="w-full h-full object-cover">
            <span v-else>{{ profileInitials }}</span>
          </div>
          <button 
            @click="isAvatarModalOpen = true"
            class="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-elevation-1 hover:shadow-elevation-2 transition-all"
          >
            <PencilIcon class="w-4 h-4 text-primary" />
          </button>
        </div>
        <div>
          <h1 class="text-3xl font-bold">{{ profileData.full_name || 'My Profile' }}</h1>
          <p class="text-gray-600">{{ user?.email }}</p>
          <div class="flex items-center gap-2 mt-2">
            <span 
              v-if="profileData.role === 'admin'" 
              class="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full font-medium"
            >
              Administrator
            </span>
            <span 
              class="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium"
            >
              Member since {{ formatDate(user?.created_at) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Information -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Personal Information -->
      <div 
        class="md:col-span-2 card shadow-elevation-2"
        v-motion
        :initial="{ opacity: 0, x: -50 }"
        :enter="{ opacity: 1, x: 0, delay: 200 }"
      >
        <h2 class="text-xl font-semibold mb-6 flex items-center justify-between">
          <span>Personal Information</span>
          <button 
            @click="isEditing = !isEditing" 
            class="text-sm text-primary flex items-center gap-1 hover:underline"
          >
            <PencilIcon class="w-4 h-4" v-if="!isEditing" />
            <span v-if="!isEditing">Edit</span>
            <span v-else>Cancel</span>
          </button>
        </h2>

        <form @submit.prevent="updateProfile" class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                v-model="form.full_name" 
                class="input w-full" 
                :disabled="!isEditing"
                :class="{'bg-gray-50': !isEditing}"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                v-model="form.email" 
                class="input w-full bg-gray-50" 
                disabled
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea 
              v-model="form.bio" 
              rows="3" 
              class="input w-full" 
              :disabled="!isEditing"
              :class="{'bg-gray-50': !isEditing}"
              placeholder="Tell us a bit about yourself..."
            ></textarea>
          </div>

          <div class="flex justify-end" v-if="isEditing">
            <button 
              type="submit" 
              class="btn btn-primary shadow-elevation-1 hover:shadow-elevation-2"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting" class="flex items-center gap-2">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
              <span v-else>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Account Settings & Stats -->
      <div class="space-y-6">
        <!-- Account Settings -->
        <div 
          class="card shadow-elevation-2"
          v-motion
          :initial="{ opacity: 0, x: 50 }"
          :enter="{ opacity: 1, x: 0, delay: 400 }"
        >
          <h2 class="text-xl font-semibold mb-6">Account Settings</h2>
          
          <div class="space-y-4">
            <div>
              <button 
                @click="isPasswordModalOpen = true" 
                class="w-full py-3 border rounded-lg flex items-center justify-between px-4 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center gap-3">
                  <KeyIcon class="w-5 h-5 text-gray-500" />
                  <span>Change Password</span>
                </div>
                <ChevronRightIcon class="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div>
              <button 
                @click="toggleDarkMode" 
                class="w-full py-3 border rounded-lg flex items-center justify-between px-4 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center gap-3">
                  <MoonIcon class="w-5 h-5 text-gray-500" />
                  <span>Dark Mode</span>
                </div>
                <div class="relative">
                  <div class="w-10 h-6 bg-gray-200 rounded-full shadow-inner"></div>
                  <div 
                    class="absolute left-0 top-0 bg-primary w-6 h-6 rounded-full shadow transform transition-transform"
                    :class="{'translate-x-4': darkMode}"
                  ></div>
                </div>
              </button>
            </div>
            
            <div>
              <button 
                @click="handleLogout" 
                class="w-full py-3 border border-red-300 text-red-500 rounded-lg flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
              >
                <ArrowRightOnRectangleIcon class="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Account Stats -->
        <div 
          class="card shadow-elevation-2"
          v-motion
          :initial="{ opacity: 0, x: 50 }"
          :enter="{ opacity: 1, x: 0, delay: 600 }"
        >
          <h2 class="text-xl font-semibold mb-4">Account Stats</h2>
          
          <div class="space-y-3">
            <div class="flex justify-between items-center py-2 border-b">
              <span class="text-gray-600">Orders</span>
              <span class="font-semibold">{{ stats.orders }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b">
              <span class="text-gray-600">Spent</span>
              <span class="font-semibold">${{ stats.spent.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-gray-600">Reviews</span>
              <span class="font-semibold">{{ stats.reviews }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Orders -->
    <div 
      class="card shadow-elevation-2"
      v-motion
      :initial="{ opacity: 0, y: 50 }"
      :enter="{ opacity: 1, y: 0, delay: 800 }"
    >
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold">Recent Orders</h2>
        <router-link to="/orders" class="text-primary hover:underline text-sm">View All</router-link>
      </div>

      <div v-if="recentOrders.length > 0" class="space-y-4">
        <div 
          v-for="order in recentOrders" 
          :key="order.id"
          class="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div>
            <p class="font-medium">Order #{{ order.id.slice(0, 8).toUpperCase() }}</p>
            <p class="text-sm text-gray-600">{{ formatDate(order.created_at) }}</p>
          </div>
          <div class="flex items-center gap-4 mt-2 md:mt-0">
            <span class="text-lg font-semibold">${{ order.total.toFixed(2) }}</span>
            <span 
              class="px-3 py-1 rounded-full text-sm font-medium"
              :class="getStatusClass(order.status)"
            >
              {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
            </span>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-6 text-gray-500">
        <ShoppingBagIcon class="w-12 h-12 mx-auto text-gray-300 mb-2" />
        <p>You haven't placed any orders yet.</p>
        <router-link to="/products" class="text-primary hover:underline mt-2 inline-block">
          Browse Products
        </router-link>
      </div>
    </div>

    <!-- Change Avatar Modal -->
    <TransitionRoot appear :show="isAvatarModalOpen" as="template">
      <Dialog as="div" @close="isAvatarModalOpen = false" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <DialogTitle class="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Change Profile Picture
                </DialogTitle>

                <div class="space-y-4">
                  <div class="flex justify-center">
                    <div class="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                      <img v-if="avatarPreview" :src="avatarPreview" alt="Preview" class="w-full h-full object-cover">
                      <span v-else>{{ profileInitials }}</span>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Avatar URL</label>
                    <input 
                      type="url" 
                      v-model="form.avatar_url" 
                      class="input w-full"
                      placeholder="https://example.com/avatar.jpg"
                    />
                    <p class="text-xs text-gray-500">Enter a valid image URL</p>
                  </div>

                  <div class="flex justify-end gap-3 mt-4">
                    <button
                      @click="isAvatarModalOpen = false"
                      class="btn btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      @click="updateAvatar"
                      class="btn btn-primary shadow-elevation-1 hover:shadow-elevation-2"
                      :disabled="isSubmitting"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Change Password Modal -->
    <TransitionRoot appear :show="isPasswordModalOpen" as="template">
      <Dialog as="div" @close="isPasswordModalOpen = false" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <DialogTitle class="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Change Password
                </DialogTitle>

                <form @submit.prevent="updatePassword" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input 
                      type="password" 
                      v-model="passwordForm.current"
                      class="input w-full" 
                      required
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input 
                      type="password" 
                      v-model="passwordForm.new"
                      class="input w-full" 
                      required
                      minlength="6"
                    />
                    <p class="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      v-model="passwordForm.confirm"
                      class="input w-full" 
                      required
                    />
                  </div>

                  <div v-if="passwordError" class="text-red-500 text-sm">
                    {{ passwordError }}
                  </div>

                  <div class="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      @click="isPasswordModalOpen = false"
                      class="btn btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      class="btn btn-primary shadow-elevation-1 hover:shadow-elevation-2"
                      :disabled="isSubmittingPassword"
                    >
                      <span v-if="isSubmittingPassword" class="flex items-center gap-2">
                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </span>
                      <span v-else>Update Password</span>
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { useToast } from 'vue-toastification'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import {
  PencilIcon,
  KeyIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
  ShoppingBagIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'Profile',
  components: {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionRoot,
    TransitionChild,
    PencilIcon,
    KeyIcon,
    MoonIcon,
    ArrowRightOnRectangleIcon,
    ShoppingBagIcon,
    ChevronRightIcon
  },
  setup() {
    const router = useRouter()
    const toast = useToast()
    
    const user = computed(() => supabase.auth.currentUser)
    const isEditing = ref(false)
    const isSubmitting = ref(false)
    const isSubmittingPassword = ref(false)
    const isAvatarModalOpen = ref(false)
    const isPasswordModalOpen = ref(false)
    const darkMode = ref(false)
    const passwordError = ref('')
    const avatarPreview = ref('')
    
    const profileData = ref({
      id: '',
      email: '',
      full_name: '',
      avatar_url: '',
      bio: '',
      role: 'user'
    })
    
    const form = ref({
      full_name: '',
      email: '',
      avatar_url: '',
      bio: ''
    })
    
    const passwordForm = ref({
      current: '',
      new: '',
      confirm: ''
    })
    
    const recentOrders = ref([])
    
    const stats = ref({
      orders: 0,
      spent: 0,
      reviews: 0
    })
    
    const profileInitials = computed(() => {
      if (profileData.value.full_name) {
        return profileData.value.full_name
          .split(' ')
          .map(name => name[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      }
      return user.value?.email?.slice(0, 2).toUpperCase() || '👤'
    })
    
    // Watch for avatar URL changes to preview
    watch(() => form.value.avatar_url, (newVal) => {
      avatarPreview.value = newVal
    })
    
    const fetchProfileData = async () => {
      if (!user.value) return
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.value.id)
          .single()
        
        if (error) throw error
        
        profileData.value = {
          ...data,
          bio: data.bio || ''
        }
        
        // Initialize the form
        form.value = {
          full_name: profileData.value.full_name || '',
          email: user.value.email,
          avatar_url: profileData.value.avatar_url || '',
          bio: profileData.value.bio || ''
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast.error('Error loading profile data')
      }
    }
    
    const fetchRecentOrders = async () => {
      if (!user.value) return
      
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.value.id)
          .order('created_at', { ascending: false })
          .limit(3)
        
        if (error) throw error
        
        recentOrders.value = data || []
        
        // Calculate stats
        if (data) {
          stats.value.orders = data.length
          stats.value.spent = data.reduce((sum, order) => sum + order.total, 0)
          
          // Mock reviews for now - could be replaced with actual review count
          stats.value.reviews = Math.floor(Math.random() * 5)
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    }
    
    const updateProfile = async () => {
      isSubmitting.value = true
      
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: form.value.full_name,
            bio: form.value.bio
          })
          .eq('id', user.value.id)
        
        if (error) throw error
        
        await fetchProfileData()
        isEditing.value = false
        toast.success('Profile updated successfully')
      } catch (error) {
        console.error('Error updating profile:', error)
        toast.error('Error updating profile')
      } finally {
        isSubmitting.value = false
      }
    }
    
    const updateAvatar = async () => {
      isSubmitting.value = true
      
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            avatar_url: form.value.avatar_url
          })
          .eq('id', user.value.id)
        
        if (error) throw error
        
        await fetchProfileData()
        isAvatarModalOpen.value = false
        toast.success('Profile picture updated')
      } catch (error) {
        console.error('Error updating avatar:', error)
        toast.error('Error updating profile picture')
      } finally {
        isSubmitting.value = false
      }
    }
    
    const updatePassword = async () => {
      passwordError.value = ''
      
      if (passwordForm.value.new !== passwordForm.value.confirm) {
        passwordError.value = 'New passwords do not match'
        return
      }
      
      if (passwordForm.value.new.length < 6) {
        passwordError.value = 'Password must be at least 6 characters'
        return
      }
      
      isSubmittingPassword.value = true
      
      try {
        const { error } = await supabase.auth.updateUser({
          password: passwordForm.value.new
        })
        
        if (error) throw error
        
        isPasswordModalOpen.value = false
        passwordForm.value = { current: '', new: '', confirm: '' }
        toast.success('Password updated successfully')
      } catch (error) {
        console.error('Error updating password:', error)
        passwordError.value = 'Error updating password. Please try again.'
      } finally {
        isSubmittingPassword.value = false
      }
    }
    
    const handleLogout = async () => {
      try {
        await supabase.auth.signOut()
        toast.success('Logged out successfully')
        router.push('/')
      } catch (error) {
        toast.error('Error logging out')
      }
    }
    
    const toggleDarkMode = () => {
      darkMode.value = !darkMode.value
      toast.info(`Dark mode ${darkMode.value ? 'enabled' : 'disabled'}`)
      // This would typically update a state or localStorage setting
    }
    
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
    
    const getStatusClass = (status) => {
      return {
        'pending': 'bg-yellow-100 text-yellow-800',
        'processing': 'bg-blue-100 text-blue-800',
        'completed': 'bg-green-100 text-green-800',
        'cancelled': 'bg-red-100 text-red-800'
      }[status]
    }
    
    onMounted(() => {
      fetchProfileData()
      fetchRecentOrders()
    })
    
    return {
      user,
      profileData,
      form,
      isEditing,
      isSubmitting,
      recentOrders,
      stats,
      profileInitials,
      isAvatarModalOpen,
      isPasswordModalOpen,
      passwordForm,
      passwordError,
      isSubmittingPassword,
      darkMode,
      avatarPreview,
      updateProfile,
      updateAvatar,
      updatePassword,
      handleLogout,
      toggleDarkMode,
      formatDate,
      getStatusClass
    }
  }
}
</script>