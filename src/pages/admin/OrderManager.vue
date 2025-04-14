<template>
  <div class="space-y-8">
    <!-- Header with stats -->
    <div 
      class="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0 }"
    >
      <div class="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 class="text-3xl font-bold gradient-text">Order Management</h1>
        <div class="mt-4 md:mt-0 flex gap-2">
          <button class="btn btn-outline py-2 flex items-center gap-2">
            <ArrowDownTrayIcon class="w-5 h-5" />
            Export
          </button>
          <button class="btn btn-primary py-2 flex items-center gap-2">
            <PlusIcon class="w-5 h-5" />
            Create Order
          </button>
        </div>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div class="bg-white p-4 rounded-xl shadow-elevation-1 hover:shadow-elevation-2 transition-all">
          <h3 class="text-gray-500 text-sm">Total Orders</h3>
          <p class="text-2xl font-bold">{{ stats.totalOrders }}</p>
          <div class="flex items-center gap-1 text-xs text-green-600 mt-1">
            <ArrowTrendingUpIcon class="w-3 h-3" />
            <span>12% increase</span>
          </div>
        </div>
        <div class="bg-white p-4 rounded-xl shadow-elevation-1 hover:shadow-elevation-2 transition-all">
          <h3 class="text-gray-500 text-sm">Total Revenue</h3>
          <p class="text-2xl font-bold">${{ stats.totalRevenue.toFixed(2) }}</p>
          <div class="flex items-center gap-1 text-xs text-green-600 mt-1">
            <ArrowTrendingUpIcon class="w-3 h-3" />
            <span>8% increase</span>
          </div>
        </div>
        <div class="bg-white p-4 rounded-xl shadow-elevation-1 hover:shadow-elevation-2 transition-all">
          <h3 class="text-gray-500 text-sm">Pending Orders</h3>
          <p class="text-2xl font-bold text-yellow-600">{{ stats.pendingOrders }}</p>
          <div class="flex items-center gap-1 text-xs text-yellow-600 mt-1">
            <ClockIcon class="w-3 h-3" />
            <span>Require attention</span>
          </div>
        </div>
        <div class="bg-white p-4 rounded-xl shadow-elevation-1 hover:shadow-elevation-2 transition-all">
          <h3 class="text-gray-500 text-sm">Avg. Order Value</h3>
          <p class="text-2xl font-bold">${{ stats.avgOrderValue.toFixed(2) }}</p>
          <div class="flex items-center gap-1 text-xs text-green-600 mt-1">
            <ArrowTrendingUpIcon class="w-3 h-3" />
            <span>5% increase</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Management Tools -->
    <div class="card">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <!-- Search -->
        <div class="relative flex-grow max-w-md">
          <MagnifyingGlassIcon class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search orders by ID, customer..."
            class="w-full px-10 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
          <button 
            v-if="searchQuery" 
            @click="searchQuery = ''" 
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <!-- Filters -->
        <div class="flex flex-wrap gap-2 w-full md:w-auto">
          <select 
            v-model="statusFilter"
            class="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select 
            v-model="dateFilter"
            class="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>

          <select 
            v-model="sortBy"
            class="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="total_desc">Highest Amount</option>
            <option value="total_asc">Lowest Amount</option>
          </select>

          <button 
            @click="showAdvancedFilters = !showAdvancedFilters" 
            class="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2"
          >
            <FunnelIcon class="w-5 h-5" />
            <span>Advanced</span>
          </button>
        </div>
      </div>

      <!-- Advanced Filters (collapsed by default) -->
      <div v-if="showAdvancedFilters" class="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 class="font-medium mb-3">Advanced Filters</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Min Amount</label>
            <input type="number" v-model="advancedFilters.minAmount" class="input" placeholder="0" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Max Amount</label>
            <input type="number" v-model="advancedFilters.maxAmount" class="input" placeholder="1000" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input type="date" v-model="advancedFilters.fromDate" class="input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input type="date" v-model="advancedFilters.toDate" class="input" />
          </div>
        </div>
        <div class="flex justify-end mt-4">
          <button @click="applyAdvancedFilters" class="btn btn-primary py-2">Apply Filters</button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="spinner"></div>
      </div>

      <!-- Orders Table -->
      <div v-else-if="filteredOrders.length === 0" class="text-center py-12">
        <ClipboardDocumentListIcon class="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 class="text-xl font-semibold mb-2">No Orders Found</h3>
        <p class="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
        <button @click="resetFilters" class="btn btn-primary">
          Reset Filters
        </button>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <router-link :to="`/admin/orders/${order.id}`" class="font-medium text-primary hover:underline">
                  #{{ order.id.slice(0, 8).toUpperCase() }}
                </router-link>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    {{ getInitials(order.customer) }}
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">{{ order.customer }}</div>
                    <div class="text-xs text-gray-500">{{ order.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(order.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                ${{ order.total.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusClass(order.status)"
                >
                  {{ capitalizeFirstLetter(order.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button 
                  @click="viewOrder(order)" 
                  class="text-primary hover:text-primary/80"
                >
                  View
                </button>
                <button 
                  @click="showUpdateStatusModal(order)" 
                  class="text-secondary hover:text-secondary/80"
                >
                  Update
                </button>
                <button 
                  @click="showDeleteOrderModal(order)" 
                  class="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="filteredOrders.length > 0" class="flex justify-center items-center gap-2 mt-8">
        <button 
          @click="currentPage = Math.max(1, currentPage - 1)"
          class="btn btn-outline p-2"
          :disabled="currentPage === 1"
        >
          <ChevronLeftIcon class="w-5 h-5" />
        </button>
        
        <div class="flex items-center gap-1">
          <button 
            v-for="page in displayedPages" 
            :key="page" 
            @click="page !== '...' ? currentPage = page : null"
            class="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            :class="page === currentPage ? 'bg-primary text-white' : page === '...' ? 'text-gray-400 cursor-default' : 'text-gray-700 hover:bg-gray-100'"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
          class="btn btn-outline p-2"
          :disabled="currentPage === totalPages"
        >
          <ChevronRightIcon class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Status Update Modal -->
    <TransitionRoot appear :show="isUpdateStatusModalOpen" as="template">
      <Dialog as="div" @close="isUpdateStatusModalOpen = false" class="relative z-50">
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
                  Update Order Status
                </DialogTitle>

                <div v-if="selectedOrder" class="mb-4">
                  <p class="text-sm text-gray-600 mb-1">Order: #{{ selectedOrder.id.slice(0, 8).toUpperCase() }}</p>
                  <p class="text-sm text-gray-600">Current status: 
                    <span 
                      class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="getStatusClass(selectedOrder.status)"
                    >
                      {{ capitalizeFirstLetter(selectedOrder.status) }}
                    </span>
                  </p>
                </div>

                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">New Status</label>
                  <select 
                    v-model="newStatus" 
                    class="select w-full"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Add a Note (Optional)</label>
                  <textarea 
                    v-model="statusNote"
                    class="input w-full"
                    rows="3"
                    placeholder="Enter note about this status change..."
                  ></textarea>
                </div>

                <div class="flex justify-end gap-3">
                  <button
                    @click="isUpdateStatusModalOpen = false"
                    class="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    @click="updateStatus"
                    class="btn btn-primary"
                  >
                    Update Status
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Delete Order Modal -->
    <TransitionRoot appear :show="isDeleteModalOpen" as="template">
      <Dialog as="div" @close="isDeleteModalOpen = false" class="relative z-50">
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
                  Confirm Delete
                </DialogTitle>

                <p class="text-gray-600 mb-6">
                  Are you sure you want to delete order #{{ selectedOrder?.id.slice(0, 8).toUpperCase() }}? This action cannot be undone.
                </p>

                <div class="flex justify-end gap-4">
                  <button
                    @click="isDeleteModalOpen = false"
                    class="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    @click="deleteOrder"
                    class="btn bg-red-500 text-white hover:bg-red-600"
                  >
                    Delete
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue';
import { supabase } from '../../lib/supabase';
import { useToast } from 'vue-toastification';
import {
  PlusIcon,
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  ArrowTrendingUpIcon,
  ClockIcon
} from '@heroicons/vue/24/outline';

export default {
  name: 'AdminOrderManager',
  components: {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionRoot,
    TransitionChild,
    PlusIcon,
    ClipboardDocumentListIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ArrowDownTrayIcon,
    FunnelIcon,
    ArrowTrendingUpIcon,
    ClockIcon
  },
  setup() {
    const router = useRouter();
    const toast = useToast();
    
    // Orders state
    const orders = ref([]);
    const loading = ref(true);
    const searchQuery = ref('');
    const statusFilter = ref('');
    const dateFilter = ref('');
    const sortBy = ref('date_desc');
    const showAdvancedFilters = ref(false);
    const currentPage = ref(1);
    const itemsPerPage = 10;
    
    // Modals state
    const isUpdateStatusModalOpen = ref(false);
    const isDeleteModalOpen = ref(false);
    const selectedOrder = ref(null);
    const newStatus = ref('');
    const statusNote = ref('');
    
    // Advanced filters
    const advancedFilters = ref({
      minAmount: '',
      maxAmount: '',
      fromDate: '',
      toDate: ''
    });
    
    // Stats
    const stats = ref({
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      avgOrderValue: 0
    });
    
    // Sample orders data for demonstration
    const sampleOrders = [
      {
        id: 'ORD-12345678',
        customer: 'Sarah Johnson',
        email: 'sarah@example.com',
        created_at: '2025-04-10T14:30:00',
        total: 126.99,
        status: 'completed',
        items: [
          { id: 1, name: 'Premium Pain Relief', quantity: 2, price: 12.99 },
          { id: 2, name: 'Vitamin D3 Complex', quantity: 1, price: 24.95 }
        ]
      },
      {
        id: 'ORD-23456789',
        customer: 'Michael Chen',
        email: 'michael@example.com',
        created_at: '2025-04-10T10:15:00',
        total: 89.97,
        status: 'processing',
        items: [
          { id: 3, name: 'First Aid Kit', quantity: 1, price: 35.50 },
          { id: 4, name: 'Hyaluronic Acid Serum', quantity: 1, price: 29.99 }
        ]
      },
      {
        id: 'ORD-34567890',
        customer: 'Jessica Brown',
        email: 'jessica@example.com',
        created_at: '2025-04-09T16:45:00',
        total: 59.95,
        status: 'pending',
        items: [
          { id: 5, name: 'Multivitamin Complex', quantity: 3, price: 19.95 }
        ]
      },
      {
        id: 'ORD-45678901',
        customer: 'David Miller',
        email: 'david@example.com',
        created_at: '2025-04-09T12:20:00',
        total: 43.98,
        status: 'completed',
        items: [
          { id: 6, name: 'Hand Sanitizer Pack', quantity: 2, price: 8.99 },
          { id: 7, name: 'Dental Floss Pack', quantity: 3, price: 5.99 }
        ]
      },
      {
        id: 'ORD-56789012',
        customer: 'Emma Wilson',
        email: 'emma@example.com',
        created_at: '2025-04-08T09:10:00',
        total: 112.97,
        status: 'cancelled',
        items: [
          { id: 8, name: 'Omega-3 Fish Oil', quantity: 1, price: 19.99 },
          { id: 9, name: 'Digital Thermometer', quantity: 1, price: 15.75 }
        ]
      },
      {
        id: 'ORD-67890123',
        customer: 'Robert Taylor',
        email: 'robert@example.com',
        created_at: '2025-04-07T15:35:00',
        total: 154.94,
        status: 'completed',
        items: [
          { id: 10, name: 'Blood Pressure Monitor', quantity: 1, price: 49.95 },
          { id: 11, name: 'Pulse Oximeter', quantity: 1, price: 35.99 }
        ]
      },
      {
        id: 'ORD-78901234',
        customer: 'Jennifer Garcia',
        email: 'jennifer@example.com',
        created_at: '2025-04-07T11:50:00',
        total: 73.95,
        status: 'processing',
        items: [
          { id: 12, name: 'Immune Support Complex', quantity: 1, price: 27.50 },
          { id: 13, name: 'Probiotics Complex', quantity: 1, price: 26.50 }
        ]
      },
      {
        id: 'ORD-89012345',
        customer: 'William Martinez',
        email: 'william@example.com',
        created_at: '2025-04-06T09:25:00',
        total: 44.97,
        status: 'pending',
        items: [
          { id: 14, name: 'Advanced Whitening Toothpaste', quantity: 3, price: 8.95 }
        ]
      },
      {
        id: 'ORD-90123456',
        customer: 'Lisa Adams',
        email: 'lisa@example.com',
        created_at: '2025-04-05T14:15:00',
        total: 67.48,
        status: 'completed',
        items: [
          { id: 15, name: 'Sensitive Teeth Relief Gel', quantity: 2, price: 14.99 },
          { id: 16, name: 'Professional Dental Floss Pack', quantity: 3, price: 5.99 }
        ]
      },
      {
        id: 'ORD-01234567',
        customer: 'Daniel White',
        email: 'daniel@example.com',
        created_at: '2025-04-04T10:40:00',
        total: 85.49,
        status: 'cancelled',
        items: [
          { id: 17, name: 'Sun Protection SPF 50', quantity: 2, price: 18.50 },
          { id: 18, name: 'Advanced Repair Moisturizer', quantity: 1, price: 22.95 }
        ]
      }
    ];

    // All filtered orders (before pagination)
    const allFilteredOrders = computed(() => {
      let result = [...orders.value];
      
      // Apply status filter
      if (statusFilter.value) {
        result = result.filter(order => order.status === statusFilter.value);
      }
      
      // Apply search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(order => 
          order.id.toLowerCase().includes(query) ||
          order.customer.toLowerCase().includes(query) ||
          order.email.toLowerCase().includes(query)
        );
      }
      
      // Apply date filter
      if (dateFilter.value) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        const monthAgo = new Date(today);
        monthAgo.setDate(monthAgo.getDate() - 30);
        
        result = result.filter(order => {
          const orderDate = new Date(order.created_at);
          switch (dateFilter.value) {
            case 'today':
              return orderDate >= today;
            case 'yesterday':
              return orderDate >= yesterday && orderDate < today;
            case 'week':
              return orderDate >= weekAgo;
            case 'month':
              return orderDate >= monthAgo;
            default:
              return true;
          }
        });
      }
      
      // Apply advanced filters
      if (advancedFilters.value.minAmount) {
        result = result.filter(order => order.total >= parseFloat(advancedFilters.value.minAmount));
      }
      
      if (advancedFilters.value.maxAmount) {
        result = result.filter(order => order.total <= parseFloat(advancedFilters.value.maxAmount));
      }
      
      if (advancedFilters.value.fromDate) {
        const fromDate = new Date(advancedFilters.value.fromDate);
        result = result.filter(order => new Date(order.created_at) >= fromDate);
      }
      
      if (advancedFilters.value.toDate) {
        const toDate = new Date(advancedFilters.value.toDate);
        toDate.setHours(23, 59, 59, 999); // End of day
        result = result.filter(order => new Date(order.created_at) <= toDate);
      }
      
      // Apply sorting
      const [field, direction] = sortBy.value.split('_');
      result.sort((a, b) => {
        if (field === 'date') {
          return direction === 'asc'
            ? new Date(a.created_at) - new Date(b.created_at)
            : new Date(b.created_at) - new Date(a.created_at);
        } else if (field === 'total') {
          return direction === 'asc'
            ? a.total - b.total
            : b.total - a.total;
        }
        return 0;
      });
      
      return result;
    });
    
    // Paginated orders
    const filteredOrders = computed(() => {
      const startIndex = (currentPage.value - 1) * itemsPerPage;
      return allFilteredOrders.value.slice(startIndex, startIndex + itemsPerPage);
    });
    
    // Total pages for pagination
    const totalPages = computed(() => {
      return Math.max(1, Math.ceil(allFilteredOrders.value.length / itemsPerPage));
    });
    
    // Generate pagination numbers with ellipsis for large page counts
    const displayedPages = computed(() => {
      if (totalPages.value <= 7) {
        // If we have 7 or fewer pages, display all
        return [...Array(totalPages.value).keys()].map(n => n + 1);
      }
      
      // Always include first and last page
      let pages = [1];
      
      // Calculate range around current page
      const current = currentPage.value;
      const total = totalPages.value;
      
      if (current <= 3) {
        // Close to beginning
        pages = [...pages, 2, 3, 4, '...', total];
      } else if (current >= total - 2) {
        // Close to end
        pages = [...pages, '...', total - 3, total - 2, total - 1, total];
      } else {
        // Middle
        pages = [...pages, '...', current - 1, current, current + 1, '...', total];
      }
      
      return pages;
    });

    // Reset current page when filters change
    watch([searchQuery, statusFilter, dateFilter, sortBy], () => {
      currentPage.value = 1;
    });

    const fetchOrders = async () => {
      loading.value = true;
      try {
        // In a real app, fetch orders from Supabase
        // For demo purposes, we use sample orders
        orders.value = sampleOrders;
        
        // Calculate stats
        calculateStats();
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        loading.value = false;
      }
    };
    
    const calculateStats = () => {
      stats.value.totalOrders = orders.value.length;
      stats.value.totalRevenue = orders.value.reduce((sum, order) => sum + order.total, 0);
      stats.value.pendingOrders = orders.value.filter(order => order.status === 'pending').length;
      stats.value.avgOrderValue = stats.value.totalOrders > 0 
        ? stats.value.totalRevenue / stats.value.totalOrders 
        : 0;
    };

    const resetFilters = () => {
      searchQuery.value = '';
      statusFilter.value = '';
      dateFilter.value = '';
      sortBy.value = 'date_desc';
      advancedFilters.value = {
        minAmount: '',
        maxAmount: '',
        fromDate: '',
        toDate: ''
      };
      showAdvancedFilters.value = false;
      currentPage.value = 1;
    };

    const applyAdvancedFilters = () => {
      // The filters are already applied via computed properties
      // This function just exists to provide a clear action button
      toast.success('Advanced filters applied');
      currentPage.value = 1;
    };

    const getStatusClass = (status) => {
      return {
        'pending': 'bg-yellow-100 text-yellow-800',
        'processing': 'bg-blue-100 text-blue-800',
        'completed': 'bg-green-100 text-green-800',
        'cancelled': 'bg-red-100 text-red-800'
      }[status] || 'bg-gray-100 text-gray-800';
    };

    const capitalizeFirstLetter = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString();
    };

    const getInitials = (name) => {
      return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase();
    };

    const viewOrder = (order) => {
      // In a real app, navigate to order detail page
      router.push(`/admin/orders/${order.id}`);
    };

    const showUpdateStatusModal = (order) => {
      selectedOrder.value = order;
      newStatus.value = order.status;
      statusNote.value = '';
      isUpdateStatusModalOpen.value = true;
    };

    const updateStatus = () => {
      if (!selectedOrder.value || !newStatus.value) return;
      
      // In a real app, this would update the order in the database
      const index = orders.value.findIndex(o => o.id === selectedOrder.value.id);
      if (index !== -1) {
        orders.value[index].status = newStatus.value;
        
        // Recalculate stats
        calculateStats();
        
        toast.success(`Order status updated to ${capitalizeFirstLetter(newStatus.value)}`);
        isUpdateStatusModalOpen.value = false;
      }
    };

    const showDeleteOrderModal = (order) => {
      selectedOrder.value = order;
      isDeleteModalOpen.value = true;
    };

    const deleteOrder = () => {
      if (!selectedOrder.value) return;
      
      // In a real app, this would delete the order in the database
      orders.value = orders.value.filter(o => o.id !== selectedOrder.value.id);
      
      // Recalculate stats
      calculateStats();
      
      toast.success('Order deleted successfully');
      isDeleteModalOpen.value = false;
    };

    onMounted(() => {
      fetchOrders();
    });

    return {
      orders,
      loading,
      searchQuery,
      statusFilter,
      dateFilter,
      sortBy,
      showAdvancedFilters,
      advancedFilters,
      filteredOrders,
      stats,
      currentPage,
      totalPages,
      displayedPages,
      isUpdateStatusModalOpen,
      isDeleteModalOpen,
      selectedOrder,
      newStatus,
      statusNote,
      resetFilters,
      applyAdvancedFilters,
      getStatusClass,
      capitalizeFirstLetter,
      formatDate,
      getInitials,
      viewOrder,
      showUpdateStatusModal,
      updateStatus,
      showDeleteOrderModal,
      deleteOrder
    };
  }
}
</script>

<style scoped>
.gradient-text {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary;
}
</style>