<template>
  <div class="plugin-system">
    <!-- Plugin Dashboard -->
    <div 
      v-if="activeView === 'dashboard'"
      class="bg-white rounded-lg shadow-sm overflow-hidden"
    >
      <div class="p-4 bg-gray-50 border-b">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-medium">Pharmacy Plugins</h2>
          <button @click="openPluginStore" class="btn btn-primary py-1 px-3">Add New</button>
        </div>
      </div>
      
      <div class="p-4">
        <div v-if="activePlugins.length === 0" class="text-center py-12 text-gray-500">
          <div class="bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <PuzzlePieceIcon class="w-8 h-8 text-gray-400" />
          </div>
          <p class="text-lg font-medium">No Active Plugins</p>
          <p class="mt-2">Add plugins to extend functionality</p>
          <button @click="openPluginStore" class="mt-4 btn btn-primary">Browse Plugins</button>
        </div>
        
        <div v-else>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="text-xs uppercase text-gray-500 bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left">Plugin</th>
                  <th class="px-4 py-3 text-left">Description</th>
                  <th class="px-4 py-3 text-left">Version</th>
                  <th class="px-4 py-3 text-left">Status</th>
                  <th class="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y">
                <tr v-for="plugin in activePlugins" :key="plugin.id" class="hover:bg-gray-50">
                  <td class="px-4 py-3">
                    <div class="flex items-center">
                      <div class="w-10 h-10 rounded bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary">
                        <component :is="plugin.icon" class="w-5 h-5" />
                      </div>
                      <div class="ml-3">
                        <p class="font-medium">{{ plugin.name }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-gray-600">{{ plugin.description }}</td>
                  <td class="px-4 py-3">{{ plugin.version }}</td>
                  <td class="px-4 py-3">
                    <span class="px-2 py-1 text-xs rounded-full" :class="plugin.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                      {{ plugin.active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex gap-2">
                      <button 
                        v-if="plugin.active" 
                        @click="deactivatePlugin(plugin.id)"
                        class="text-red-500 hover:text-red-700 text-xs"
                      >
                        Deactivate
                      </button>
                      <button 
                        v-else 
                        @click="activatePlugin(plugin.id)"
                        class="text-green-500 hover:text-green-700 text-xs"
                      >
                        Activate
                      </button>
                      <span class="text-gray-300">|</span>
                      <button 
                        @click="configurePlugin(plugin)"
                        class="text-primary hover:text-primary/80 text-xs"
                      >
                        Settings
                      </button>
                      <span class="text-gray-300">|</span>
                      <button 
                        @click="uninstallPlugin(plugin.id)"
                        class="text-red-500 hover:text-red-700 text-xs"
                      >
                        Delete
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

    <!-- Plugin Store -->
    <div v-else-if="activeView === 'store'" class="space-y-6">
      <div class="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
        <h2 class="text-lg font-medium">Plugin Store</h2>
        <button @click="activeView = 'dashboard'" class="btn btn-outline py-1 px-3">
          Back to Plugins
        </button>
      </div>
      
      <div class="flex gap-4 mb-4">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search plugins..."
          class="input flex-grow"
        />
        <select v-model="categoryFilter" class="select w-40">
          <option value="">All Categories</option>
          <option v-for="category in pluginCategories" :key="category">{{ category }}</option>
        </select>
      </div>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="plugin in filteredStorePlugins" 
          :key="plugin.id"
          class="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow overflow-hidden"
        >
          <div class="p-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary">
                <component :is="plugin.icon" class="w-5 h-5" />
              </div>
              <div>
                <h3 class="font-medium">{{ plugin.name }}</h3>
                <p class="text-xs text-gray-500">By {{ plugin.author }}</p>
              </div>
            </div>
            <div class="mt-3 text-sm text-gray-600 h-12 overflow-hidden">
              {{ plugin.description }}
            </div>
            <div class="flex justify-between items-center mt-4">
              <div class="flex items-center">
                <div class="flex">
                  <StarIcon v-for="n in 5" :key="n" class="w-4 h-4" :class="n <= plugin.rating ? 'text-yellow-400' : 'text-gray-300'" />
                </div>
                <span class="text-xs text-gray-500 ml-1">({{ plugin.downloads }})</span>
              </div>
              <div class="text-sm font-medium" :class="plugin.price > 0 ? 'text-gray-700' : 'text-green-600'">
                {{ plugin.price > 0 ? '$' + plugin.price.toFixed(2) : 'Free' }}
              </div>
            </div>
          </div>
          <div class="border-t p-3 bg-gray-50 flex justify-between">
            <button 
              @click="showPluginDetails(plugin)"
              class="text-sm text-gray-700 hover:underline"
            >
              View Details
            </button>
            <button 
              v-if="isPluginInstalled(plugin.id)"
              disabled
              class="text-sm text-gray-400 cursor-not-allowed"
            >
              Installed
            </button>
            <button 
              v-else
              @click="installPlugin(plugin)"
              class="text-sm text-primary hover:underline"
            >
              {{ plugin.price > 0 ? 'Purchase' : 'Install' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Plugin Configuration -->
    <div v-else-if="activeView === 'configure' && selectedPlugin" class="space-y-6">
      <div class="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
        <h2 class="text-lg font-medium flex items-center">
          <component :is="selectedPlugin.icon" class="w-5 h-5 mr-2 text-primary" />
          {{ selectedPlugin.name }} Settings
        </h2>
        <button @click="activeView = 'dashboard'" class="btn btn-outline py-1 px-3">
          Back to Plugins
        </button>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm p-6">
        <!-- Dynamic configuration based on plugin -->
        <template v-if="selectedPlugin.id === 'stripe-gateway'">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Stripe API Key (Test)</label>
              <input type="text" v-model="pluginConfig.stripeTestKey" class="input" placeholder="pk_test_..." />
              <p class="text-xs text-gray-500 mt-1">Your Stripe test mode publishable key</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Stripe API Key (Live)</label>
              <input type="text" v-model="pluginConfig.stripeLiveKey" class="input" placeholder="pk_live_..." />
              <p class="text-xs text-gray-500 mt-1">Your Stripe live mode publishable key</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Environment</label>
              <select v-model="pluginConfig.environment" class="select">
                <option value="test">Test Mode</option>
                <option value="live">Live Mode</option>
              </select>
              <p class="text-xs text-gray-500 mt-1">Select which environment to use</p>
            </div>
            <div class="flex items-center">
              <input type="checkbox" id="webhook" v-model="pluginConfig.webhookEnabled" class="mr-2" />
              <label for="webhook">Enable Stripe Webhooks</label>
            </div>
          </div>
        </template>
        
        <template v-else-if="selectedPlugin.id === 'seo-pack'">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Meta Title Template</label>
              <input type="text" v-model="pluginConfig.metaTitle" class="input" placeholder="%title% | %sitename%" />
              <p class="text-xs text-gray-500 mt-1">Use %title% for the page title and %sitename% for your site name</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Meta Description Template</label>
              <textarea v-model="pluginConfig.metaDescription" rows="3" class="input" placeholder="%excerpt%"></textarea>
              <p class="text-xs text-gray-500 mt-1">Use %excerpt% for the page excerpt</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Google Analytics ID</label>
              <input type="text" v-model="pluginConfig.gaId" class="input" placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX" />
            </div>
          </div>
        </template>

        <template v-else-if="selectedPlugin.id === 'live-chat'">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Chat Widget Position</label>
              <select v-model="pluginConfig.position" class="select">
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Welcome Message</label>
              <input type="text" v-model="pluginConfig.welcomeMessage" class="input" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Support Agent Name</label>
              <input type="text" v-model="pluginConfig.agentName" class="input" />
            </div>
            <div class="flex items-center">
              <input type="checkbox" id="auto-popup" v-model="pluginConfig.autoPopup" class="mr-2" />
              <label for="auto-popup">Auto-popup chat after 30 seconds</label>
            </div>
          </div>
        </template>

        <!-- Save Button -->
        <div class="mt-6">
          <button @click="savePluginSettings" class="btn btn-primary">Save Settings</button>
        </div>
      </div>
    </div>

    <!-- Plugin Details -->
    <div v-else-if="activeView === 'details' && selectedPlugin" class="space-y-6">
      <div class="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
        <h2 class="text-lg font-medium">Plugin Details</h2>
        <button @click="activeView = 'store'" class="btn btn-outline py-1 px-3">
          Back to Store
        </button>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="p-6">
          <div class="flex items-start gap-4">
            <div class="w-16 h-16 rounded bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary">
              <component :is="selectedPlugin.icon" class="w-8 h-8" />
            </div>
            <div>
              <h2 class="text-2xl font-bold">{{ selectedPlugin.name }}</h2>
              <div class="flex items-center gap-2 mt-1">
                <p class="text-sm text-gray-600">By {{ selectedPlugin.author }}</p>
                <span class="text-xs bg-gray-100 px-2 py-0.5 rounded-full">v{{ selectedPlugin.version }}</span>
                <div class="flex">
                  <StarIcon v-for="n in 5" :key="n" class="w-4 h-4" :class="n <= selectedPlugin.rating ? 'text-yellow-400' : 'text-gray-300'" />
                </div>
              </div>
            </div>
            <div class="ml-auto">
              <span class="block text-center font-medium mb-2" :class="selectedPlugin.price > 0 ? 'text-gray-900' : 'text-green-600'">
                {{ selectedPlugin.price > 0 ? '$' + selectedPlugin.price.toFixed(2) : 'Free' }}
              </span>
              <button 
                v-if="isPluginInstalled(selectedPlugin.id)"
                disabled
                class="btn bg-gray-200 text-gray-500 cursor-not-allowed w-full"
              >
                Installed
              </button>
              <button 
                v-else
                @click="installPlugin(selectedPlugin)"
                class="btn btn-primary w-full"
              >
                {{ selectedPlugin.price > 0 ? 'Purchase' : 'Install Now' }}
              </button>
            </div>
          </div>
          
          <div class="grid md:grid-cols-3 gap-6 mt-8">
            <div class="md:col-span-2 space-y-6">
              <div>
                <h3 class="text-lg font-medium mb-2">Description</h3>
                <p class="text-gray-600">{{ selectedPlugin.fullDescription || selectedPlugin.description }}</p>
              </div>
              
              <div>
                <h3 class="text-lg font-medium mb-2">Features</h3>
                <ul class="space-y-2">
                  <li v-for="(feature, index) in selectedPlugin.features" :key="index" class="flex items-start gap-2">
                    <CheckCircleIcon class="w-5 h-5 text-green-500 mt-0.5" />
                    <span>{{ feature }}</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div class="space-y-6">
              <div class="border rounded-lg p-4">
                <h3 class="font-medium mb-2">Information</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Version:</span>
                    <span>{{ selectedPlugin.version }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Last Updated:</span>
                    <span>{{ selectedPlugin.lastUpdated }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Downloads:</span>
                    <span>{{ selectedPlugin.downloads.toLocaleString() }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Requires:</span>
                    <span>PHP 7.4+, WordPress 5.8+</span>
                  </div>
                </div>
              </div>
              
              <div class="border rounded-lg p-4">
                <h3 class="font-medium mb-2">Support</h3>
                <div class="space-y-3 text-sm">
                  <a href="#" class="flex items-center gap-2 text-primary hover:underline">
                    <QuestionMarkCircleIcon class="w-4 h-4" />
                    <span>Documentation</span>
                  </a>
                  <a href="#" class="flex items-center gap-2 text-primary hover:underline">
                    <ChatBubbleOvalLeftEllipsisIcon class="w-4 h-4" />
                    <span>Support Forum</span>
                  </a>
                  <a href="#" class="flex items-center gap-2 text-primary hover:underline">
                    <EnvelopeIcon class="w-4 h-4" />
                    <span>Contact Developer</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Screenshots -->
        <div class="border-t mt-6 p-6">
          <h3 class="text-lg font-medium mb-4">Screenshots</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div v-for="i in 3" :key="i" class="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
              <div class="w-full h-full flex items-center justify-center text-gray-400">
                Plugin Screenshot {{ i }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import {
  PuzzlePieceIcon,
  StarIcon,
  CheckCircleIcon,
  CreditCardIcon,
  MegaphoneIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ChartBarIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  QuestionMarkCircleIcon,
  EnvelopeIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'PluginSystem',
  components: {
    PuzzlePieceIcon,
    StarIcon,
    CheckCircleIcon,
    CreditCardIcon,
    MegaphoneIcon,
    ChatBubbleOvalLeftEllipsisIcon,
    ChartBarIcon,
    GlobeAltIcon,
    ShieldCheckIcon,
    QuestionMarkCircleIcon,
    EnvelopeIcon
  },
  props: {
    initialView: {
      type: String,
      default: 'dashboard' // 'dashboard', 'store', 'configure', 'details'
    }
  },
  setup(props) {
    const toast = useToast()
    const activeView = ref(props.initialView)
    const selectedPlugin = ref(null)
    const searchQuery = ref('')
    const categoryFilter = ref('')
    
    // Plugin configuration
    const pluginConfig = ref({
      // Stripe Gateway
      stripeTestKey: 'pk_test_51ABC123...',
      stripeLiveKey: '',
      environment: 'test',
      webhookEnabled: false,
      
      // SEO Pack
      metaTitle: '%title% | %sitename%',
      metaDescription: '%excerpt%',
      gaId: '',
      
      // Live Chat
      position: 'bottom-right',
      welcomeMessage: 'Welcome to Amal Pharmacy! How can I help you today?',
      agentName: 'Support Agent',
      autoPopup: false
    })
    
    // Installed Plugins
    const installedPlugins = ref([
      {
        id: 'stripe-gateway',
        name: 'Stripe Payment Gateway',
        icon: 'CreditCardIcon',
        description: 'Accept credit card payments securely with Stripe',
        version: '1.2.3',
        author: 'Amal',
        active: true
      },
      {
        id: 'live-chat',
        name: 'Live Chat Support',
        icon: 'ChatBubbleOvalLeftEllipsisIcon',
        description: 'Real-time customer support chat widget',
        version: '2.0.1',
        author: 'Amal',
        active: true
      },
      {
        id: 'seo-pack',
        name: 'SEO Toolkit',
        icon: 'MegaphoneIcon',
        description: 'Optimize your pharmacy site for search engines',
        version: '3.1.0',
        author: 'SEO Experts',
        active: true
      }
    ])
    
    // Store Plugins
    const storePlugins = ref([
      {
        id: 'stripe-gateway',
        name: 'Stripe Payment Gateway',
        icon: 'CreditCardIcon',
        description: 'Accept credit card payments securely with Stripe',
        fullDescription: 'Integrate Stripe payment gateway into your pharmacy to securely accept credit and debit card payments. Supports one-time payments, subscriptions, and saved payment methods. PCI compliant and supports 3D Secure authentication.',
        version: '1.2.3',
        author: 'Amal',
        price: 0,
        rating: 5,
        downloads: 12458,
        lastUpdated: 'April 10, 2025',
        category: 'Payments',
        features: [
          'Secure credit card processing',
          'Apple Pay and Google Pay support',
          'Automatic receipt emails',
          'Detailed payment analytics',
          'Easy refund processing'
        ]
      },
      {
        id: 'live-chat',
        name: 'Live Chat Support',
        icon: 'ChatBubbleOvalLeftEllipsisIcon',
        description: 'Real-time customer support chat widget',
        fullDescription: 'Enhance customer service with a professional live chat solution. Our chat widget allows you to engage with customers in real-time, answer questions, and provide assistance. Features automatic responses, chat history, and offline messaging.',
        version: '2.0.1',
        author: 'Amal',
        price: 0,
        rating: 5,
        downloads: 9875,
        lastUpdated: 'April 5, 2025',
        category: 'Customer Support',
        features: [
          'Real-time messaging',
          'Customer support ticketing',
          'Automated responses for common questions',
          'Mobile-friendly interface',
          'Chat history and analytics'
        ]
      },
      {
        id: 'seo-pack',
        name: 'SEO Toolkit',
        icon: 'MegaphoneIcon',
        description: 'Optimize your pharmacy site for search engines',
        fullDescription: 'Improve your pharmacy website\'s visibility in search engines with our comprehensive SEO toolkit. Features include metadata optimization, XML sitemaps, social media integration, and performance analysis to help you rank higher in search results.',
        version: '3.1.0',
        author: 'SEO Experts',
        price: 49.99,
        rating: 4,
        downloads: 7532,
        lastUpdated: 'March 28, 2025',
        category: 'SEO',
        features: [
          'Automatic metadata generation',
          'XML sitemap creation',
          'Keyword analysis tools',
          'Schema markup implementation',
          'Performance tracking dashboard'
        ]
      },
      {
        id: 'analytics-pro',
        name: 'Analytics Pro',
        icon: 'ChartBarIcon',
        description: 'Advanced analytics and reporting for your pharmacy',
        fullDescription: 'Get deep insights into your pharmacy business with advanced analytics. Track sales trends, customer behavior, inventory performance, and more. Features customizable dashboards, scheduled reports, and data export capabilities.',
        version: '2.5.0',
        author: 'Data Insights',
        price: 79.99,
        rating: 4.5,
        downloads: 5287,
        lastUpdated: 'April 2, 2025',
        category: 'Analytics',
        features: [
          'Sales performance tracking',
          'Customer behavior analysis',
          'Inventory optimization suggestions',
          'Customizable reporting dashboard',
          'Automatic weekly/monthly reports'
        ]
      },
      {
        id: 'multilingual-shop',
        name: 'Multilingual Shop',
        icon: 'GlobeAltIcon',
        description: 'Add multiple languages to your pharmacy website',
        fullDescription: 'Reach international customers by translating your pharmacy website into multiple languages. Supports automatic translation with manual override options, language switcher widget, and SEO optimization for each language.',
        version: '1.8.2',
        author: 'Global Solutions',
        price: 59.99,
        rating: 4,
        downloads: 3452,
        lastUpdated: 'March 15, 2025',
        category: 'Multilingual',
        features: [
          'Support for 40+ languages',
          'Automatic content translation',
          'Language switcher widget',
          'SEO optimization for each language',
          'Translation memory to reduce costs'
        ]
      },
      {
        id: 'security-shield',
        name: 'Security Shield Pro',
        icon: 'ShieldCheckIcon',
        description: 'Enhanced security for your pharmacy website',
        fullDescription: 'Protect your pharmacy website and customer data with advanced security features. Includes firewall protection, malware scanning, login protection, and data encryption to keep your site safe from cyber threats.',
        version: '4.2.0',
        author: 'Cyber Guardians',
        price: 89.99,
        rating: 5,
        downloads: 6821,
        lastUpdated: 'April 8, 2025',
        category: 'Security',
        features: [
          'Real-time malware scanning',
          'Advanced firewall protection',
          'Brute force attack prevention',
          'Regular security audits',
          'PCI compliance tools'
        ]
      }
    ])
    
    const activePlugins = computed(() => {
      return installedPlugins.value
    })

    const pluginCategories = computed(() => {
      return [...new Set(storePlugins.value.map(p => p.category))]
    })
    
    const filteredStorePlugins = computed(() => {
      return storePlugins.value.filter(plugin => {
        // Apply search filter
        const matchesSearch = !searchQuery.value || 
          plugin.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          plugin.description.toLowerCase().includes(searchQuery.value.toLowerCase())
        
        // Apply category filter
        const matchesCategory = !categoryFilter.value || plugin.category === categoryFilter.value
        
        return matchesSearch && matchesCategory
      })
    })
    
    // Check if a plugin is installed
    const isPluginInstalled = (id) => {
      return installedPlugins.value.some(p => p.id === id)
    }
    
    // Actions
    const openPluginStore = () => {
      activeView.value = 'store'
    }
    
    const showPluginDetails = (plugin) => {
      selectedPlugin.value = plugin
      activeView.value = 'details'
    }
    
    const installPlugin = (plugin) => {
      if (isPluginInstalled(plugin.id)) {
        return
      }
      
      if (plugin.price > 0) {
        toast.info(`This would open a payment page for $${plugin.price.toFixed(2)}`)
        setTimeout(() => {
          // Simulate successful payment
          completeInstallation(plugin)
        }, 1500)
      } else {
        completeInstallation(plugin)
      }
    }
    
    const completeInstallation = (plugin) => {
      // Add to installed plugins
      installedPlugins.value.push({
        id: plugin.id,
        name: plugin.name,
        icon: plugin.icon,
        description: plugin.description,
        version: plugin.version,
        author: plugin.author,
        active: true
      })
      
      toast.success(`${plugin.name} has been installed successfully!`)
      activeView.value = 'dashboard'
    }
    
    const uninstallPlugin = (id) => {
      if (confirm('Are you sure you want to delete this plugin? This action cannot be undone.')) {
        installedPlugins.value = installedPlugins.value.filter(p => p.id !== id)
        toast.success('Plugin has been uninstalled successfully')
      }
    }
    
    const activatePlugin = (id) => {
      const index = installedPlugins.value.findIndex(p => p.id === id)
      if (index !== -1) {
        installedPlugins.value[index].active = true
        toast.success(`${installedPlugins.value[index].name} has been activated`)
      }
    }
    
    const deactivatePlugin = (id) => {
      const index = installedPlugins.value.findIndex(p => p.id === id)
      if (index !== -1) {
        installedPlugins.value[index].active = false
        toast.success(`${installedPlugins.value[index].name} has been deactivated`)
      }
    }
    
    const configurePlugin = (plugin) => {
      selectedPlugin.value = plugin
      activeView.value = 'configure'
    }
    
    const savePluginSettings = () => {
      toast.success(`Settings for ${selectedPlugin.value.name} have been saved`)
      activeView.value = 'dashboard'
    }

    return {
      activeView,
      selectedPlugin,
      searchQuery,
      categoryFilter,
      pluginConfig,
      activePlugins,
      storePlugins,
      filteredStorePlugins,
      pluginCategories,
      isPluginInstalled,
      openPluginStore,
      showPluginDetails,
      installPlugin,
      uninstallPlugin,
      activatePlugin,
      deactivatePlugin,
      configurePlugin,
      savePluginSettings
    }
  }
}
</script>

<style scoped>
.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%;
}

.aspect-w-16 > * {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>