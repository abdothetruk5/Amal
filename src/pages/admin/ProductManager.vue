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
        <h1 class="text-3xl font-bold gradient-text">Product Management</h1>
        <button 
          @click="isAddProductModalOpen = true"
          class="btn btn-primary flex items-center gap-2 mt-4 md:mt-0"
        >
          <PlusIcon class="w-5 h-5" />
          Add New Product
        </button>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div class="bg-white p-4 rounded-xl shadow-elevation-1 hover:shadow-elevation-2 transition-all">
          <h3 class="text-gray-500 text-sm">Total Products</h3>
          <p class="text-2xl font-bold">{{ productCount }}</p>
        </div>
        <div class="bg-white p-4 rounded-xl shadow-elevation-1 hover:shadow-elevation-2 transition-all">
          <h3 class="text-gray-500 text-sm">Categories</h3>
          <p class="text-2xl font-bold">{{ categoryCount }}</p>
        </div>
        <div class="bg-white p-4 rounded-xl shadow-elevation-1 hover:shadow-elevation-2 transition-all">
          <h3 class="text-gray-500 text-sm">Low Stock</h3>
          <p class="text-2xl font-bold">{{ lowStockCount }}</p>
        </div>
        <div class="bg-white p-4 rounded-xl shadow-elevation-1 hover:shadow-elevation-2 transition-all">
          <h3 class="text-gray-500 text-sm">Out of Stock</h3>
          <p class="text-2xl font-bold">{{ outOfStockCount }}</p>
        </div>
      </div>
    </div>

    <!-- Product Management Tools -->
    <div class="card">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <!-- Search -->
        <div class="relative flex-grow max-w-md">
          <MagnifyingGlassIcon class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search products..."
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
            v-model="selectedCategory"
            class="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Categories</option>
            <option 
              v-for="category in categories" 
              :key="category.id" 
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>

          <select 
            v-model="sortBy"
            class="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Sort by</option>
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
            <option value="price_asc">Price (Low to High)</option>
            <option value="price_desc">Price (High to Low)</option>
            <option value="stock_asc">Stock (Low to High)</option>
            <option value="stock_desc">Stock (High to Low)</option>
            <option value="created_at_desc">Newest</option>
            <option value="created_at_asc">Oldest</option>
          </select>
        </div>
      </div>

      <!-- Product Table -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="spinner"></div>
      </div>
      
      <div v-else-if="filteredProducts.length === 0" class="text-center py-12">
        <ShoppingBagIcon class="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 class="text-xl font-semibold mb-2">No Products Found</h3>
        <p class="text-gray-600 mb-6">Try adjusting your filters or add new products</p>
        <button @click="isAddProductModalOpen = true" class="btn btn-primary">
          Add New Product
        </button>
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-12 w-12">
                    <img :src="product.image_url" :alt="product.name" class="h-12 w-12 rounded-lg object-cover">
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 truncate max-w-[200px]" :title="product.name">{{ product.name }}</div>
                    <div class="text-sm text-gray-500 truncate max-w-[200px]" :title="product.description">{{ product.description }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ getCategoryName(product.category_id) || product.category }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${{ product.price.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': product.stock > 10,
                    'bg-yellow-100 text-yellow-800': product.stock <= 10 && product.stock > 0,
                    'bg-red-100 text-red-800': product.stock === 0
                  }"
                >
                  {{ product.stock > 0 ? product.stock : 'Out of stock' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex">
                    <StarIcon v-for="i in Math.round(product.rating)" :key="i" class="w-4 h-4 text-yellow-400" />
                    <StarIcon v-for="i in 5-Math.round(product.rating)" :key="`empty-${i}`" class="w-4 h-4 text-gray-300" />
                  </div>
                  <span class="ml-1 text-xs text-gray-500">{{ product.rating.toFixed(1) }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button 
                  @click="editProduct(product)" 
                  class="text-primary hover:text-primary/80"
                >
                  Edit
                </button>
                <button 
                  @click="confirmDeleteProduct(product)" 
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
      <div v-if="filteredProducts.length > 0" class="flex justify-center items-center gap-2 mt-8">
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

    <!-- Add/Edit Product Modal -->
    <TransitionRoot appear :show="isAddProductModalOpen" as="template">
      <Dialog as="div" @close="closeAddProductModal" class="relative z-50">
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
              <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <DialogTitle class="text-lg font-medium leading-6 text-gray-900 mb-4">
                  {{ isEditing ? 'Edit Product' : 'Add New Product' }}
                </DialogTitle>

                <form @submit.prevent="handleSubmitProduct" class="space-y-4">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        v-model="productForm.name"
                        required
                        class="input"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select v-model="productForm.category_id" required class="select">
                        <option value="">Select Category</option>
                        <option v-for="category in categories" :key="category.id" :value="category.id">
                          {{ category.name }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      v-model="productForm.description"
                      rows="3"
                      class="input"
                    ></textarea>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                      <input
                        type="number"
                        v-model="productForm.price"
                        step="0.01"
                        min="0"
                        required
                        class="input"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                      <input
                        type="number"
                        v-model="productForm.stock"
                        min="0"
                        required
                        class="input"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
                      <input
                        type="number"
                        v-model="productForm.rating"
                        min="0"
                        max="5"
                        step="0.1"
                        class="input"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Effectiveness (0-100)</label>
                      <input
                        type="number"
                        v-model="productForm.effectiveness"
                        min="0"
                        max="100"
                        class="input"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      type="url"
                      v-model="productForm.image_url"
                      class="input"
                    />
                  </div>

                  <div v-if="productForm.image_url" class="flex justify-center">
                    <img 
                      :src="productForm.image_url" 
                      alt="Product preview" 
                      class="h-40 w-auto object-cover rounded-lg border"
                      @error="handleImageError"
                    />
                  </div>

                  <div class="flex justify-end gap-4 mt-6">
                    <button
                      type="button"
                      @click="closeAddProductModal"
                      class="btn btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      class="btn btn-primary"
                      :disabled="isSubmitting"
                    >
                      {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update Product' : 'Add Product') }}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Delete Confirmation Modal -->
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
                  Are you sure you want to delete the product "{{ productToDelete?.name }}"? This action cannot be undone.
                </p>

                <div class="flex justify-end gap-4">
                  <button
                    @click="isDeleteModalOpen = false"
                    class="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    @click="deleteProduct"
                    class="btn bg-red-500 text-white hover:bg-red-600"
                    :disabled="isDeleting"
                  >
                    {{ isDeleting ? 'Deleting...' : 'Delete' }}
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
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue';
import { supabase } from '../../lib/supabase';
import { useToast } from 'vue-toastification';
import {
  PlusIcon,
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  TrashIcon,
  PencilIcon
} from '@heroicons/vue/24/outline';

export default {
  name: 'AdminProductManager',
  components: {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionRoot,
    TransitionChild,
    PlusIcon,
    ShoppingBagIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    StarIcon,
    TrashIcon,
    PencilIcon
  },
  setup() {
    const toast = useToast();
    const products = ref([]);
    const categories = ref([]);
    const loading = ref(true);
    const searchQuery = ref('');
    const selectedCategory = ref('');
    const sortBy = ref('');
    const isAddProductModalOpen = ref(false);
    const isDeleteModalOpen = ref(false);
    const isSubmitting = ref(false);
    const isDeleting = ref(false);
    const isEditing = ref(false);
    const productToDelete = ref(null);
    const currentPage = ref(1);
    const itemsPerPage = 10;
    const defaultProductForm = {
      name: '',
      category_id: '',
      description: '',
      price: 0,
      stock: 0,
      rating: 0,
      effectiveness: 0,
      popularity: 0,
      image_url: ''
    };
    const productForm = ref({ ...defaultProductForm });

    // Stats computed properties
    const productCount = computed(() => products.value.length);
    const categoryCount = computed(() => categories.value.length);
    const lowStockCount = computed(() => 
      products.value.filter(p => p.stock > 0 && p.stock <= 10).length
    );
    const outOfStockCount = computed(() => 
      products.value.filter(p => p.stock === 0).length
    );

    // All filtered products (before pagination)
    const allFilteredProducts = computed(() => {
      let filtered = [...products.value];

      // Apply category filter
      if (selectedCategory.value) {
        filtered = filtered.filter(product => 
          product.category_id === selectedCategory.value
        );
      }

      // Apply search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query)
        );
      }

      // Apply sorting
      if (sortBy.value) {
        const [field, direction] = sortBy.value.split('_');
        const multiplier = direction === 'asc' ? 1 : -1;
        
        filtered.sort((a, b) => {
          if (field === 'name') {
            return a.name.localeCompare(b.name) * multiplier;
          }
          return (a[field] - b[field]) * multiplier;
        });
      }

      return filtered;
    });
    
    // Paginated products for display
    const filteredProducts = computed(() => {
      const startIndex = (currentPage.value - 1) * itemsPerPage;
      return allFilteredProducts.value.slice(startIndex, startIndex + itemsPerPage);
    });
    
    // Total pages for pagination
    const totalPages = computed(() => {
      return Math.max(1, Math.ceil(allFilteredProducts.value.length / itemsPerPage));
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

    // Reset pagination when filters change
    watch([searchQuery, selectedCategory, sortBy], () => {
      currentPage.value = 1;
    });

    const fetchProducts = async () => {
      loading.value = true;
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');
        
        if (error) throw error;
        products.value = data || [];
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        loading.value = false;
      }
    };

    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('product_categories')
          .select('*');
        
        if (error) throw error;
        categories.value = data || [];
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };

    const getCategoryName = (categoryId) => {
      if (!categoryId) return '';
      const category = categories.value.find(c => c.id === categoryId);
      return category ? category.name : '';
    };

    const handleSubmitProduct = async () => {
      isSubmitting.value = true;

      try {
        if (isEditing.value) {
          // Update existing product
          const { error } = await supabase
            .from('products')
            .update(productForm.value)
            .eq('id', productForm.value.id);

          if (error) throw error;
          toast.success('Product updated successfully');
        } else {
          // Add new product
          const { error } = await supabase
            .from('products')
            .insert([productForm.value]);

          if (error) throw error;
          toast.success('Product added successfully');
        }

        closeAddProductModal();
        fetchProducts();
      } catch (error) {
        console.error('Error saving product:', error);
        toast.error(isEditing.value ? 'Error updating product' : 'Error adding product');
      } finally {
        isSubmitting.value = false;
      }
    };

    const editProduct = (product) => {
      isEditing.value = true;
      productForm.value = { ...product };
      isAddProductModalOpen.value = true;
    };

    const confirmDeleteProduct = (product) => {
      productToDelete.value = product;
      isDeleteModalOpen.value = true;
    };

    const deleteProduct = async () => {
      if (!productToDelete.value) return;
      
      isDeleting.value = true;
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productToDelete.value.id);

        if (error) throw error;

        toast.success('Product deleted successfully');
        fetchProducts();
        isDeleteModalOpen.value = false;
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Error deleting product');
      } finally {
        isDeleting.value = false;
      }
    };

    const closeAddProductModal = () => {
      isAddProductModalOpen.value = false;
      isEditing.value = false;
      productForm.value = { ...defaultProductForm };
      // Wait for animation to complete
      setTimeout(() => {
        productForm.value = { ...defaultProductForm };
      }, 300);
    };

    const handleImageError = (e) => {
      e.target.src = 'https://via.placeholder.com/150?text=No+Image';
    };

    onMounted(() => {
      fetchProducts();
      fetchCategories();
    });

    return {
      products,
      categories,
      loading,
      productCount,
      categoryCount,
      lowStockCount,
      outOfStockCount,
      searchQuery,
      selectedCategory,
      sortBy,
      filteredProducts,
      isAddProductModalOpen,
      isDeleteModalOpen,
      isSubmitting,
      isDeleting,
      isEditing,
      productForm,
      productToDelete,
      currentPage,
      totalPages,
      displayedPages,
      getCategoryName,
      handleSubmitProduct,
      editProduct,
      confirmDeleteProduct,
      deleteProduct,
      closeAddProductModal,
      handleImageError
    };
  }
}
</script>

<style scoped>
.gradient-text {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary;
}
</style>