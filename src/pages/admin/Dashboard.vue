<template>
  <div class="space-y-8">
    <!-- Header with greeting and time -->
    <div 
      class="flex flex-col md:flex-row justify-between items-start md:items-center"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0 }"
    >
      <div>
        <h1 class="text-3xl font-bold gradient-text">Welcome to Dashboard</h1>
        <p class="text-gray-600">{{ currentDateTimeFormatted }}</p>
      </div>
      <div class="flex items-center gap-3 mt-4 md:mt-0">
        <button 
          @click="refreshDashboardData" 
          class="btn btn-outline flex items-center gap-2 py-2"
        >
          <ArrowPathIcon class="w-4 h-4" />
          Refresh Data
        </button>
        <button 
          @click="showAddNewModal = true" 
          class="btn btn-primary flex items-center gap-2 py-2"
        >
          <PlusIcon class="w-4 h-4" />
          Add New
        </button>
      </div>
    </div>

    <!-- Quick Actions Panel (WordPress Style) -->
    <div 
      class="bg-white rounded-lg border shadow-sm overflow-hidden"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, delay: 100 }"
    >
      <div class="p-4 bg-gray-50 border-b">
        <h2 class="text-lg font-medium">Quick Actions</h2>
      </div>
      <div class="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <router-link to="/admin/products" class="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <ShoppingBagIcon class="w-8 h-8 text-primary mb-2" />
          <span class="text-sm font-medium">Add Product</span>
        </router-link>
        <router-link to="/admin/orders" class="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <ClipboardDocumentListIcon class="w-8 h-8 text-primary mb-2" />
          <span class="text-sm font-medium">View Orders</span>
        </router-link>
        <router-link to="/admin/customers" class="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <UserGroupIcon class="w-8 h-8 text-primary mb-2" />
          <span class="text-sm font-medium">Manage Users</span>
        </router-link>
        <router-link to="/admin/settings" class="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <Cog6ToothIcon class="w-8 h-8 text-primary mb-2" />
          <span class="text-sm font-medium">Site Settings</span>
        </router-link>
      </div>
    </div>

    <!-- Stats Overview (Cards) -->
    <div 
      class="grid md:grid-cols-4 gap-6"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, delay: 200 }"
    >
      <div 
        v-for="(stat, index) in stats" 
        :key="index"
        class="card gradient-card-hover transform hover:scale-105 transition-all duration-300"
      >
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-xl font-bold">{{ stat.value }}</h3>
            <p class="text-gray-600">{{ stat.label }}</p>
          </div>
          <component 
            :is="stat.icon" 
            class="w-10 h-10 text-primary/70"
          />
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span 
            :class="stat.trend > 0 ? 'text-green-500' : 'text-red-500'"
            class="font-medium flex items-center"
          >
            <ArrowTrendingUpIcon v-if="stat.trend > 0" class="w-4 h-4 mr-1" />
            <ArrowTrendingDownIcon v-else class="w-4 h-4 mr-1" />
            {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
          </span>
          <span class="text-gray-600 ml-2">vs. last month</span>
        </div>
      </div>
    </div>

    <!-- Main Dashboard Sections -->
    <div class="grid md:grid-cols-3 gap-8">
      <!-- Activity Feed -->
      <div 
        class="md:col-span-1 card overflow-hidden flex flex-col"
        v-motion
        :initial="{ opacity: 0, x: -50 }"
        :enter="{ opacity: 1, x: 0, delay: 300 }"
      >
        <div class="p-6 border-b">
          <h2 class="text-xl font-semibold flex items-center">
            <BoltIcon class="w-5 h-5 mr-2 text-primary" />
            Recent Activity
          </h2>
        </div>
        <div class="p-6 space-y-4 flex-grow overflow-auto" style="max-height: 400px">
          <div v-for="(activity, index) in recentActivity" :key="index" class="flex items-start gap-3">
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center text-white"
              :class="getActivityIconBackground(activity.type)"
            >
              <component :is="getActivityIcon(activity.type)" class="w-4 h-4" />
            </div>
            <div>
              <p class="font-medium">{{ activity.title }}</p>
              <p class="text-sm text-gray-600">{{ activity.description }}</p>
              <p class="text-xs text-gray-500">{{ activity.time }}</p>
            </div>
          </div>
        </div>
        <div class="p-4 bg-gray-50 border-t">
          <router-link to="/admin/activity" class="text-sm text-primary hover:underline">View all activity</router-link>
        </div>
      </div>

      <!-- Right Sections Container -->
      <div class="md:col-span-2 space-y-8">
        <!-- Charts Section -->
        <div 
          class="card"
          v-motion
          :initial="{ opacity: 0, x: 50 }"
          :enter="{ opacity: 1, x: 0, delay: 300 }"
        >
          <h2 class="text-xl font-semibold mb-6 flex items-center">
            <ChartBarIcon class="w-5 h-5 mr-2 text-primary" />
            Sales Overview
          </h2>
          <div class="h-64">
            <LineChart :data="salesChartData" :options="chartOptions" />
          </div>
        </div>

        <!-- Recent Orders with Status -->
        <div 
          class="card"
          v-motion
          :initial="{ opacity: 0, y: 50 }"
          :enter="{ opacity: 1, y: 0, delay: 400 }"
        >
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold flex items-center">
              <ClipboardDocumentListIcon class="w-5 h-5 mr-2 text-primary" />
              Recent Orders
            </h2>
            <div class="flex items-center gap-2">
              <select 
                v-model="orderFilter" 
                class="text-sm border rounded-md px-2 py-1"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <router-link to="/admin/orders" class="text-primary hover:underline text-sm">View all</router-link>
            </div>
          </div>

          <div v-if="recentOrders.length === 0" class="text-center py-6 text-gray-500">
            <ClipboardDocumentListIcon class="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p>No orders found</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th class="px-4 py-3 text-left">Order</th>
                  <th class="px-4 py-3 text-left">Customer</th>
                  <th class="px-4 py-3 text-left">Date</th>
                  <th class="px-4 py-3 text-left">Amount</th>
                  <th class="px-4 py-3 text-left">Status</th>
                  <th class="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50">
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span class="font-medium">#{{ order.id.slice(0, 8).toUpperCase() }}</span>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium">
                        {{ getInitials(order.customer) }}
                      </div>
                      <span class="ml-2">{{ order.customer }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-gray-500">
                    {{ formatDate(order.created_at) }}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap font-medium">
                    ${{ order.total.toFixed(2) }}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span 
                      class="px-2 py-1 rounded-full text-xs"
                      :class="getStatusClass(order.status)"
                    >
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div class="flex space-x-2">
                      <button 
                        @click="viewOrder(order)"
                        class="text-primary hover:text-primary/80"
                      >
                        View
                      </button>
                      <span class="text-gray-300">|</span>
                      <button 
                        @click="updateOrderStatus(order)"
                        class="text-primary hover:text-primary/80"
                      >
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- WordPress Style Bottom Row -->
    <div class="grid md:grid-cols-3 gap-8">
      <!-- Top Products -->
      <div 
        class="card"
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :enter="{ opacity: 1, y: 0, delay: 500 }"
      >
        <h2 class="text-xl font-semibold mb-4 flex items-center">
          <FireIcon class="w-5 h-5 mr-2 text-primary" />
          Top Selling Products
        </h2>
        <div class="space-y-4">
          <div 
            v-for="(product, index) in topProducts" 
            :key="product.id"
            class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
          >
            <span class="text-lg font-bold text-gray-300 w-6">{{ index + 1 }}</span>
            <img 
              :src="product.image_url" 
              :alt="product.name"
              class="w-10 h-10 rounded-lg object-cover"
              @error="handleImageError"
            />
            <div class="flex-grow">
              <p class="font-medium truncate" :title="product.name">{{ product.name }}</p>
              <div class="flex items-center">
                <span class="text-sm text-gray-500 mr-2">${{ product.price }}</span>
                <div class="flex">
                  <StarIcon v-for="i in Math.round(product.rating)" :key="i" class="w-3 h-3 text-yellow-400" />
                </div>
              </div>
            </div>
            <span class="font-medium text-green-600">{{ product.sales }} sales</span>
          </div>
        </div>
      </div>

      <!-- Draft Posts / Quick Draft -->
      <div 
        class="card"
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :enter="{ opacity: 1, y: 0, delay: 600 }"
      >
        <h2 class="text-xl font-semibold mb-4 flex items-center">
          <DocumentTextIcon class="w-5 h-5 mr-2 text-primary" />
          Quick Draft
        </h2>
        <form @submit.prevent="saveDraft" class="space-y-4">
          <div>
            <input 
              type="text"
              v-model="draftTitle"
              placeholder="Post title"
              class="input w-full"
            />
          </div>
          <div>
            <textarea
              v-model="draftContent"
              rows="4"
              placeholder="What's on your mind?"
              class="input w-full"
            ></textarea>
          </div>
          <button 
            type="submit"
            class="btn btn-primary w-full"
            :disabled="!draftTitle || !draftContent"
          >
            Save Draft
          </button>
        </form>
        
        <div class="border-t mt-4 pt-4">
          <h3 class="font-medium text-sm mb-2">Your Recent Drafts</h3>
          <div v-if="recentDrafts.length === 0" class="text-gray-500 text-sm">
            No recent drafts.
          </div>
          <ul v-else class="space-y-2">
            <li v-for="draft in recentDrafts" :key="draft.id" class="flex justify-between text-sm">
              <a href="#" class="text-primary hover:underline truncate max-w-[200px]" :title="draft.title">{{ draft.title }}</a>
              <span class="text-gray-500">{{ formatDate(draft.date) }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- WordPress News / System Info -->
      <div 
        class="card"
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :enter="{ opacity: 1, y: 0, delay: 700 }"
      >
        <h2 class="text-xl font-semibold mb-4 flex items-center">
          <InformationCircleIcon class="w-5 h-5 mr-2 text-primary" />
          System Information
        </h2>
        <div class="space-y-4">
          <div class="flex justify-between">
            <span class="text-gray-600">PHP Version</span>
            <span>8.1.0</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Database Size</span>
            <span>156 MB</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Storage Usage</span>
            <div class="flex items-center">
              <div class="bg-gray-200 w-24 h-2 rounded-full mr-2">
                <div class="bg-primary h-2 rounded-full" style="width: 35%"></div>
              </div>
              <span>35%</span>
            </div>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Uptime</span>
            <span>99.9%</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Last Backup</span>
            <span>4 hours ago</span>
          </div>
        </div>
        <div class="border-t mt-4 pt-4">
          <button class="btn btn-outline w-full">Run System Check</button>
        </div>
      </div>
    </div>

    <!-- Add New Modal -->
    <TransitionRoot appear :show="showAddNewModal" as="template">
      <Dialog as="div" @close="showAddNewModal = false" class="relative z-50">
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
                <DialogTitle class="text-lg font-medium leading-6 text-gray-900 mb-4 flex items-center">
                  <PlusIcon class="w-5 h-5 mr-2 text-primary" />
                  Quick Add New
                </DialogTitle>

                <div class="grid grid-cols-2 gap-4">
                  <button 
                    @click="quickAdd('product')"
                    class="p-4 border rounded-lg text-center hover:bg-gray-50"
                  >
                    <ShoppingBagIcon class="w-8 h-8 mx-auto text-primary mb-2" />
                    <span class="font-medium">Product</span>
                  </button>
                  
                  <button 
                    @click="quickAdd('category')"
                    class="p-4 border rounded-lg text-center hover:bg-gray-50"
                  >
                    <TagIcon class="w-8 h-8 mx-auto text-primary mb-2" />
                    <span class="font-medium">Category</span>
                  </button>
                  
                  <button 
                    @click="quickAdd('post')"
                    class="p-4 border rounded-lg text-center hover:bg-gray-50"
                  >
                    <DocumentTextIcon class="w-8 h-8 mx-auto text-primary mb-2" />
                    <span class="font-medium">Post</span>
                  </button>
                  
                  <button 
                    @click="quickAdd('user')"
                    class="p-4 border rounded-lg text-center hover:bg-gray-50"
                  >
                    <UserPlusIcon class="w-8 h-8 mx-auto text-primary mb-2" />
                    <span class="font-medium">User</span>
                  </button>
                </div>

                <div class="mt-6 flex justify-end">
                  <button
                    @click="showAddNewModal = false"
                    class="btn btn-outline"
                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script>
import { ref, computed, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { supabase } from '../../lib/supabase'
import { useToast } from 'vue-toastification'
import {
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  FireIcon,
  PlusIcon,
  StarIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  TagIcon,
  UserPlusIcon,
  BoltIcon,
  PencilSquareIcon
} from '@heroicons/vue/24/outline'
import { Line as LineChart, Bar as BarChart, Doughnut as DoughnutChart, Pie as PieChart } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement)

export default {
  name: 'AdminDashboard',
  components: {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionRoot,
    TransitionChild,
    CurrencyDollarIcon,
    ShoppingBagIcon,
    UserGroupIcon,
    ChartBarIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    ClipboardDocumentListIcon,
    Cog6ToothIcon,
    CheckCircleIcon,
    ArrowPathIcon,
    FireIcon,
    PlusIcon,
    StarIcon,
    DocumentTextIcon,
    InformationCircleIcon,
    TagIcon,
    UserPlusIcon,
    BoltIcon,
    PencilSquareIcon,
    LineChart,
    BarChart,
    DoughnutChart,
    PieChart
  },
  setup() {
    const router = useRouter()
    const toast = useToast()
    const userEmail = computed(() => supabase.auth.currentUser?.email || 'Admin')
    const categories = ref([])
    const recentOrders = ref([])
    const lowStockProducts = ref([])
    const popularProducts = ref([])
    const totalRevenue = ref(0)
    const totalOrders = ref(0)
    const totalCustomers = ref(0)
    const totalProducts = ref(0)
    const showAddNewModal = ref(false)
    const currentDateTime = ref(new Date())
    const orderFilter = ref('all')
    const isLoading = ref(false)

    // Draft functionality
    const draftTitle = ref('')
    const draftContent = ref('')
    const recentDrafts = ref([
      { id: 1, title: 'Summer Sale Campaign', date: '2025-04-01T10:30:00' },
      { id: 2, title: 'New Product Launch - Probiotics', date: '2025-03-28T15:45:00' }
    ])

    // Update current time
    setInterval(() => {
      currentDateTime.value = new Date()
    }, 60000) // Update every minute

    const currentDateTimeFormatted = computed(() => {
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
      return currentDateTime.value.toLocaleDateString('en-US', options)
    })

    // Recent activity feed
    const recentActivity = ref([
      { 
        type: 'order', 
        title: 'New Order Received', 
        description: 'Order #12345 for $126.50', 
        time: '10 minutes ago' 
      },
      { 
        type: 'product', 
        title: 'Product Stock Low', 
        description: 'Vitamin C with Zinc is running low (5 remaining)', 
        time: '45 minutes ago' 
      },
      { 
        type: 'user', 
        title: 'New User Registration', 
        description: 'sarah.smith@example.com created an account', 
        time: '2 hours ago' 
      },
      { 
        type: 'system', 
        title: 'System Update Completed', 
        description: 'System updated to version 2.5.3', 
        time: '3 hours ago' 
      },
      { 
        type: 'review', 
        title: 'New Product Review', 
        description: '5-star review for "Advanced Pain Relief Gel"', 
        time: '5 hours ago' 
      }
    ])

    // Top products
    const topProducts = ref([
      { 
        id: 1, 
        name: 'Premium Pain Relief Tablets', 
        price: '12.99', 
        image_url: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=150&h=150', 
        rating: 4.8,
        sales: 523
      },
      { 
        id: 2, 
        name: 'Vitamin D3 + K2 Complex', 
        price: '24.95', 
        image_url: 'https://images.unsplash.com/photo-1584308074727-e93a698bedf1?auto=format&fit=crop&w=150&h=150',
        rating: 4.7,
        sales: 417
      },
      { 
        id: 3, 
        name: 'Omega-3 Fish Oil', 
        price: '19.99', 
        image_url: 'https://images.unsplash.com/photo-1577613901972-9106e25d0fa9?auto=format&fit=crop&w=150&h=150',
        rating: 4.7,
        sales: 389
      },
      { 
        id: 4, 
        name: 'Multivitamin Daily Complex', 
        price: '19.95', 
        image_url: 'https://images.unsplash.com/photo-1577613901972-9106e25d0fa9?auto=format&fit=crop&w=150&h=150',
        rating: 4.9,
        sales: 372
      },
      { 
        id: 5, 
        name: 'Advanced First Aid Kit', 
        price: '35.50', 
        image_url: 'https://images.unsplash.com/photo-1585828292920-638a2a78cb38?auto=format&fit=crop&w=150&h=150',
        rating: 4.9,
        sales: 318
      }
    ])

    // Chart data
    const salesChartData = ref({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Sales 2025',
          borderColor: 'rgba(211, 84, 0, 1)',
          backgroundColor: 'rgba(211, 84, 0, 0.1)',
          data: [5500, 6200, 7800, 8500, 9200, 10500, 11800, 13200, 14500, 15800, 17200, 19500],
          tension: 0.4,
          fill: true
        }
      ]
    })

    // Chart options
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }

    const stats = computed(() => [
      {
        label: 'Total Revenue',
        value: `$${totalRevenue.value.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
        icon: 'CurrencyDollarIcon',
        trend: 12.5
      },
      {
        label: 'Total Orders',
        value: totalOrders.value.toLocaleString('en-US'),
        icon: 'ShoppingBagIcon',
        trend: 8.2
      },
      {
        label: 'Total Customers',
        value: totalCustomers.value.toLocaleString('en-US'),
        icon: 'UserGroupIcon',
        trend: 15.3
      },
      {
        label: 'Total Products',
        value: totalProducts.value.toLocaleString('en-US'),
        icon: 'ChartBarIcon',
        trend: 5.7
      }
    ])

    // Sample orders for the demo
    const sampleOrders = [
      { 
        id: 'ORD-12345678', 
        customer: 'Sarah Johnson', 
        created_at: '2025-04-11T10:30:00', 
        total: 126.50, 
        status: 'completed',
        email: 'sarah.j@example.com'
      },
      { 
        id: 'ORD-23456789', 
        customer: 'Michael Chen', 
        created_at: '2025-04-11T09:15:00', 
        total: 89.99, 
        status: 'processing',
        email: 'mchen@example.com'
      },
      { 
        id: 'ORD-34567890', 
        customer: 'Emma Wilson', 
        created_at: '2025-04-10T16:45:00', 
        total: 210.25, 
        status: 'pending',
        email: 'ewilson@example.com'
      },
      { 
        id: 'ORD-45678901', 
        customer: 'David Miller', 
        created_at: '2025-04-10T14:20:00', 
        total: 45.75, 
        status: 'completed',
        email: 'dmiller@example.com'
      },
      { 
        id: 'ORD-56789012', 
        customer: 'Jessica Brown', 
        created_at: '2025-04-09T11:10:00', 
        total: 65.40, 
        status: 'cancelled',
        email: 'jbrown@example.com'
      }
    ]

    // Initialize orders with sample data
    recentOrders.value = sampleOrders

    const getStatusClass = (status) => {
      return {
        'pending': 'bg-yellow-100 text-yellow-800',
        'processing': 'bg-blue-100 text-blue-800',
        'completed': 'bg-green-100 text-green-800',
        'cancelled': 'bg-red-100 text-red-800'
      }[status] || 'bg-gray-100 text-gray-800'
    }

    const filteredOrders = computed(() => {
      if (orderFilter.value === 'all') {
        return recentOrders.value
      }
      return recentOrders.value.filter(order => order.status === orderFilter.value)
    })

    const formatDate = (date) => {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const getInitials = (name) => {
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    }

    const getActivityIcon = (type) => {
      const icons = {
        'order': 'ShoppingBagIcon',
        'product': 'ArchiveBoxIcon',
        'user': 'UserIcon',
        'system': 'Cog6ToothIcon',
        'review': 'StarIcon'
      }
      return icons[type] || 'BoltIcon'
    }

    const getActivityIconBackground = (type) => {
      const backgrounds = {
        'order': 'bg-blue-500',
        'product': 'bg-primary',
        'user': 'bg-green-500',
        'system': 'bg-purple-500',
        'review': 'bg-yellow-500'
      }
      return backgrounds[type] || 'bg-gray-500'
    }

    const fetchDashboardData = async () => {
      isLoading.value = true
      try {
        await Promise.all([
          fetchCategories(),
          fetchStats()
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Error loading dashboard data');
      } finally {
        isLoading.value = false
      }
    }

    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*');
      
      if (error) throw error;
      categories.value = data || [];
    }

    const fetchStats = async () => {
      try {
        // Calculate total revenue
        const { data: revenue } = await supabase
          .from('orders')
          .select('total')
          .eq('status', 'completed');
        
        totalRevenue.value = revenue?.reduce((sum, order) => sum + order.total, 0) || 0;

        // Count total orders
        const { count: orderCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact' });
        
        totalOrders.value = orderCount || 0;

        // Count total customers
        const { count: customerCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact' });
        
        totalCustomers.value = customerCount || 0;

        // Count total products
        const { count: productCount } = await supabase
          .from('products')
          .select('*', { count: 'exact' });
        
        totalProducts.value = productCount || 0;
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }

    const saveDraft = () => {
      if (draftTitle.value && draftContent.value) {
        // In a real app, you would save this to your database
        const newDraft = {
          id: Date.now(),
          title: draftTitle.value,
          date: new Date().toISOString()
        }
        
        recentDrafts.value = [newDraft, ...recentDrafts.value].slice(0, 3)
        
        // Clear form
        draftTitle.value = ''
        draftContent.value = ''
        
        toast.success('Draft saved successfully!')
      }
    }

    const refreshDashboardData = async () => {
      isLoading.value = true
      toast.info('Refreshing dashboard data...')
      await fetchDashboardData()
      isLoading.value = false
      toast.success('Dashboard data refreshed!')
    }

    const quickAdd = (type) => {
      // In a real app, you would redirect to the appropriate page or show a specific modal
      showAddNewModal.value = false
      
      const routes = {
        'product': '/admin/products',
        'category': '/admin/products?showCategoryModal=true',
        'post': '/admin/posts/new',
        'user': '/admin/customers/new'
      }
      
      if (routes[type]) {
        router.push(routes[type])
      } else {
        toast.info(`Quick add for ${type} coming soon!`)
      }
    }

    const viewOrder = (order) => {
      // In a real app, you would navigate to the order details page
      toast.info(`Viewing order ${order.id.slice(0, 8).toUpperCase()}`)
    }

    const updateOrderStatus = (order) => {
      // In a real app, you would show a status update modal
      toast.info(`Update status for order ${order.id.slice(0, 8).toUpperCase()}`)
    }

    const handleImageError = (e) => {
      e.target.src = 'https://via.placeholder.com/150?text=No+Image';
    }

    onMounted(() => {
      fetchDashboardData();
    })

    return {
      userEmail,
      stats,
      recentOrders,
      filteredOrders,
      categories,
      getStatusClass,
      formatDate,
      getCategoryName: () => '',
      handleImageError,
      salesChartData,
      chartOptions,
      currentDateTimeFormatted,
      recentActivity,
      getActivityIcon,
      getActivityIconBackground,
      topProducts,
      getInitials,
      draftTitle,
      draftContent,
      recentDrafts,
      saveDraft,
      showAddNewModal,
      orderFilter,
      isLoading,
      refreshDashboardData,
      quickAdd,
      viewOrder,
      updateOrderStatus
    }
  }
}
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(90deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* WordPress-style dashicons */
.wp-icon {
  @apply p-2 rounded-full;
}

.wp-gradient-bg {
  @apply bg-gradient-to-r from-primary/10 via-white to-secondary/10;
}
</style>