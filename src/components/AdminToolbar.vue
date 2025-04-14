<template>
  <div v-if="isAdmin && showToolbar" class="admin-toolbar">
    <!-- Top Admin Bar -->
    <div 
      class="fixed w-full top-0 bg-primary text-white z-50 h-8 flex items-center justify-between px-4 text-sm shadow-md"
      :class="isExpanded ? 'h-10' : 'h-8'"
    >
      <!-- Left Side -->
      <div class="flex items-center h-full">
        <div class="flex items-center mr-4 h-full">
          <button 
            @click="toggleToolbar"
            class="h-full px-3 flex items-center justify-center hover:bg-primary-800 transition-colors"
          >
            <span v-if="isExpanded">
              <ChevronUpIcon class="w-4 h-4" />
            </span>
            <span v-else>
              <ChevronDownIcon class="w-4 h-4" />
            </span>
          </button>
          <router-link 
            to="/admin"
            class="h-full flex items-center px-3 hover:bg-primary-800 transition-colors"
          >
            <ShieldCheckIcon class="w-4 h-4 mr-1" />
            Amal Dashboard
          </router-link>
        </div>
        
        <div v-if="isExpanded" class="h-full">
          <template v-for="(item, index) in adminMenuItems" :key="index">
            <div class="dropdown h-full relative" :class="{'active': openDropdowns.includes(index)}">
              <button 
                class="h-full px-3 flex items-center hover:bg-primary-800 transition-colors"
                @click="toggleDropdown(index)"
              >
                <span>{{ item.label }}</span>
                <ChevronDownIcon class="w-3 h-3 ml-1" />
              </button>
              <div 
                class="dropdown-content absolute left-0 top-full bg-white shadow-md rounded-b-lg overflow-hidden w-48 z-50"
                v-show="openDropdowns.includes(index)"
              >
                <router-link 
                  v-for="subitem in item.items" 
                  :key="subitem.path"
                  :to="subitem.path"
                  class="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                  @click="closeAllDropdowns"
                >
                  {{ subitem.label }}
                </router-link>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Right Side -->
      <div class="flex items-center h-full">
        <button 
          @click="refreshPage"
          class="h-full px-3 flex items-center hover:bg-primary-800 transition-colors"
          title="Refresh"
        >
          <ArrowPathIcon class="w-4 h-4" />
        </button>

        <a 
          href="#" 
          @click.prevent="viewSite" 
          class="h-full px-3 flex items-center hover:bg-primary-800 transition-colors"
        >
          <EyeIcon class="w-4 h-4 mr-1" />
          View Site
        </a>

        <div class="h-full relative group" v-if="isExpanded">
          <div 
            class="h-full px-3 flex items-center hover:bg-primary-800 transition-colors cursor-pointer"
          >
            <BellIcon class="w-4 h-4" />
            <div v-if="notificationCount > 0" class="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
              {{ notificationCount }}
            </div>
          </div>
          <div class="hidden group-hover:block absolute right-0 top-full bg-white shadow-md rounded-lg p-2 w-64 z-50">
            <div class="py-2 px-3 border-b">
              <div class="font-medium">Notifications</div>
            </div>
            <div class="py-2 px-3 text-sm max-h-[300px] overflow-y-auto">
              <div v-if="notifications.length === 0" class="text-gray-500 text-center py-2">
                No new notifications
              </div>
              <div 
                v-for="(notification, index) in notifications" 
                :key="index"
                class="py-2 border-b last:border-0"
              >
                <div class="font-medium">{{ notification.title }}</div>
                <div class="text-gray-600 text-xs mt-1">{{ notification.message }}</div>
                <div class="text-gray-400 text-xs mt-1">{{ notification.time }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="h-full flex items-center relative group">
          <div 
            class="h-full px-3 flex items-center hover:bg-primary-800 transition-colors cursor-pointer"
          >
            <span v-if="isExpanded" class="mr-1">{{ userEmail }}</span>
            <UserCircleIcon class="w-4 h-4" />
          </div>
          <div class="hidden group-hover:block absolute right-0 top-full bg-white shadow-md rounded-lg overflow-hidden w-48 z-50">
            <router-link 
              to="/admin/profile" 
              class="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
            >
              Profile
            </router-link>
            <a 
              href="#" 
              @click.prevent="handleLogout" 
              class="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
            >
              Logout
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Admin Toolbar Expanded Content -->
    <div 
      v-if="isExpanded"
      class="fixed w-full top-10 bg-white border-b shadow-md py-2 px-4 z-40 grid grid-cols-3 gap-4"
    >
      <!-- Left: Site Health -->
      <div>
        <h4 class="font-medium mb-2 text-sm">Site Health</h4>
        <div class="flex items-center">
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div class="bg-green-600 h-2.5 rounded-full" style="width: 85%"></div>
          </div>
          <span class="ml-2 text-sm">85%</span>
        </div>
        <div class="text-xs text-gray-600 mt-1">3 items need attention</div>
      </div>
      
      <!-- Middle: Quick Stats -->
      <div>
        <h4 class="font-medium mb-2 text-sm">Quick Stats</h4>
        <div class="grid grid-cols-3 gap-2 text-center">
          <div class="bg-gray-50 rounded p-1">
            <div class="text-lg font-bold">{{ stats.orders }}</div>
            <div class="text-xs text-gray-600">Orders</div>
          </div>
          <div class="bg-gray-50 rounded p-1">
            <div class="text-lg font-bold">{{ stats.products }}</div>
            <div class="text-xs text-gray-600">Products</div>
          </div>
          <div class="bg-gray-50 rounded p-1">
            <div class="text-lg font-bold">${{ stats.revenue }}</div>
            <div class="text-xs text-gray-600">Revenue</div>
          </div>
        </div>
      </div>
      
      <!-- Right: Quick Actions -->
      <div>
        <h4 class="font-medium mb-2 text-sm">Quick Actions</h4>
        <div class="flex gap-2">
          <router-link 
            to="/admin/products?action=new" 
            class="px-2 py-1 bg-primary text-white text-sm rounded hover:bg-primary-700 transition-colors"
          >
            Add Product
          </router-link>
          <router-link 
            to="/admin/orders" 
            class="px-2 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300 transition-colors"
          >
            View Orders
          </router-link>
          <button 
            @click="clearCache"
            class="px-2 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300 transition-colors"
          >
            Clear Cache
          </button>
        </div>
      </div>
    </div>

    <!-- Page Padding to Prevent Content from Being Hidden Under Toolbar -->
    <div 
      :style="{
        height: isExpanded ? '100px' : '32px',
        transition: 'height 0.3s ease'
      }"
    ></div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { supabase } from '../lib/supabase'
import { clearAllCache } from '../lib/supabase'
import {
  ShieldCheckIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  EyeIcon,
  UserCircleIcon,
  BellIcon
} from '@heroicons/vue/24/solid'

export default {
  name: 'AdminToolbar',
  components: {
    ShieldCheckIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    ArrowPathIcon,
    EyeIcon,
    UserCircleIcon,
    BellIcon
  },
  props: {
    showOnFrontend: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const router = useRouter()
    const toast = useToast()
    
    const isAdmin = ref(false)
    const showToolbar = ref(true)
    const isExpanded = ref(false)
    const openDropdowns = ref([])
    const userEmail = computed(() => supabase.auth.currentUser?.email || 'Admin')
    const notificationCount = ref(3)
    
    // Stats for quick view
    const stats = ref({
      orders: 157,
      products: 432,
      revenue: '12.5K'
    })
    
    // Admin menu structure
    const adminMenuItems = [
      {
        label: 'Dashboard',
        items: [
          { label: 'Home', path: '/admin' },
          { label: 'Updates', path: '/admin/updates' }
        ]
      },
      {
        label: 'Products',
        items: [
          { label: 'All Products', path: '/admin/products' },
          { label: 'Add New', path: '/admin/products?action=new' },
          { label: 'Categories', path: '/admin/products/categories' }
        ]
      },
      {
        label: 'Orders',
        items: [
          { label: 'All Orders', path: '/admin/orders' },
          { label: 'Pending', path: '/admin/orders?status=pending' },
          { label: 'Processing', path: '/admin/orders?status=processing' }
        ]
      },
      {
        label: 'Customers',
        items: [
          { label: 'All Customers', path: '/admin/customers' },
          { label: 'Add New', path: '/admin/customers?action=new' }
        ]
      },
      {
        label: 'Settings',
        items: [
          { label: 'General', path: '/admin/settings' },
          { label: 'Plugins', path: '/admin/plugins' },
          { label: 'Appearance', path: '/admin/appearance' }
        ]
      }
    ]
    
    // Sample notifications
    const notifications = [
      { 
        title: 'New Order Received', 
        message: 'Order #12345 has been placed',
        time: '10 minutes ago'
      },
      { 
        title: 'Low Stock Alert', 
        message: 'Vitamin D3 is running low (5 remaining)',
        time: '45 minutes ago'
      },
      { 
        title: 'New Review', 
        message: 'A new 5-star review has been submitted',
        time: '2 hours ago'
      }
    ]
    
    // Toggle toolbar expanded state
    const toggleToolbar = () => {
      isExpanded.value = !isExpanded.value
      closeAllDropdowns()
      
      // Store preference in localStorage
      localStorage.setItem('admin-toolbar-expanded', isExpanded.value.toString())
    }
    
    // Toggle dropdown menu
    const toggleDropdown = (index) => {
      if (openDropdowns.value.includes(index)) {
        openDropdowns.value = openDropdowns.value.filter(i => i !== index)
      } else {
        closeAllDropdowns()
        openDropdowns.value.push(index)
      }
    }
    
    // Close all dropdown menus
    const closeAllDropdowns = () => {
      openDropdowns.value = []
    }
    
    // View the frontend site
    const viewSite = () => {
      router.push('/')
    }
    
    // Refresh the current page
    const refreshPage = () => {
      window.location.reload()
    }
    
    // Clear cache
    const clearCache = () => {
      clearAllCache()
      toast.success('Cache cleared successfully')
    }
    
    // Logout
    const handleLogout = async () => {
      try {
        await supabase.auth.signOut()
        toast.success('Logged out successfully')
        router.push('/auth')
      } catch (error) {
        toast.error('Error logging out')
      }
    }
    
    // Check if user is admin
    const checkAdminStatus = async () => {
      const user = supabase.auth.currentUser
      
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

          if (error) throw error
          isAdmin.value = data?.role === 'admin'
          
          // Hide toolbar on frontend if not enabled
          if (!props.showOnFrontend && !window.location.pathname.startsWith('/admin')) {
            showToolbar.value = false
          }
        } catch (error) {
          console.error('Error checking admin status:', error)
          isAdmin.value = false
        }
      } else {
        isAdmin.value = false
      }
    }

    // Click outside handler to close dropdowns
    const handleClickOutside = (event) => {
      const dropdown = document.querySelector('.dropdown.active')
      if (dropdown && !dropdown.contains(event.target)) {
        closeAllDropdowns()
      }
    }
    
    onMounted(() => {
      checkAdminStatus()
      document.addEventListener('click', handleClickOutside)
      
      // Restore saved toolbar state
      const savedState = localStorage.getItem('admin-toolbar-expanded')
      if (savedState) {
        isExpanded.value = savedState === 'true'
      }
    })
    
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      isAdmin,
      showToolbar,
      isExpanded,
      openDropdowns,
      userEmail,
      adminMenuItems,
      notificationCount,
      notifications,
      stats,
      toggleToolbar,
      toggleDropdown,
      closeAllDropdowns,
      viewSite,
      refreshPage,
      clearCache,
      handleLogout
    }
  }
}
</script>

<style scoped>
.admin-toolbar {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
}

.dropdown.active {
  background-color: rgba(0, 0, 0, 0.2);
}

.bg-primary-800 {
  background-color: rgba(0, 0, 0, 0.2);
}

/* Animation for toolbars */
.toolbar-enter-active,
.toolbar-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.toolbar-enter-from,
.toolbar-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>