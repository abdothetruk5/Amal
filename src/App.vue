<template>
  <div :class="{'rtl': currentLocale === 'ar', 'ltr': currentLocale !== 'ar'}" class="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
    <!-- Admin Toolbar for admin users -->
    <AdminToolbar />
    
    <div class="bg-blue-600 text-white py-2 text-center">
      <div class="container mx-auto px-4 flex justify-between items-center">
        <div class="flex items-center gap-2">
          <PhoneIcon class="w-4 h-4" />
          <span class="text-sm">{{ siteSettings.contact_phone || '(123) 456-7890' }}</span>
        </div>
        <div>
          <button @click="toggleLanguage" class="text-sm bg-white/20 px-3 py-1 rounded hover:bg-white/30 transition-colors">
            {{ currentLocale === 'ar' ? 'English' : 'العربية' }}
          </button>
        </div>
      </div>
    </div>
    <Navbar />
    <main class="container mx-auto px-4 py-8 flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer />
    
    <!-- Live Chat Widget -->
    <LiveChat />
  </div>
</template>

<script>
import { ref, provide, watch, onMounted, computed } from 'vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import LiveChat from './components/LiveChat.vue'
import AdminToolbar from './components/AdminToolbar.vue'
import { PhoneIcon } from '@heroicons/vue/24/outline'
import { translations, currentLocale as defaultLocale } from './lib/translations'
import { supabase } from './lib/supabase'
import { useStorage } from '@vueuse/core'

export default {
  name: 'App',
  components: {
    Navbar,
    Footer,
    PhoneIcon,
    LiveChat,
    AdminToolbar
  },
  setup() {
    const currentLocale = ref(defaultLocale)
    const siteSettings = ref({})
    const settingsLoaded = ref(false)
    
    // Use localStorage to cache settings
    const cachedSettings = useStorage('sandbad-site-settings', null)
    const lastFetchTime = useStorage('sandbad-settings-fetch-time', 0)
    
    const toggleLanguage = () => {
      currentLocale.value = currentLocale.value === 'en' ? 'ar' : 'en'
    }
    
    // Provide locale to all components
    provide('locale', currentLocale)
    provide('t', (key) => {
      const keys = key.split('.')
      let result = translations[currentLocale.value]
      
      for (const k of keys) {
        if (result && result[k]) {
          result = result[k]
        } else {
          return key // Fallback to key if translation not found
        }
      }
      
      return result
    })
    
    // Update document direction based on locale
    watch(currentLocale, (newLocale) => {
      document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr'
    }, { immediate: true })

    // Provide site settings to all components
    provide('siteSettings', siteSettings)
    provide('settingsLoaded', settingsLoaded)

    // Determine if we should use cache or fetch fresh settings
    const shouldFetchSettings = computed(() => {
      const now = Date.now()
      const cacheAge = now - lastFetchTime.value
      // Cache for 5 minutes (300000 ms)
      return !cachedSettings.value || cacheAge > 300000
    })

    // Dynamically load font if needed
    const loadCustomFont = (fontFamily) => {
      if (!fontFamily) return
      
      // Extract the first font family from the comma-separated list
      const primaryFont = fontFamily.split(',')[0].trim().replace(/['"]/g, '');
      
      // Don't load system fonts or fonts that are likely already available
      const systemFonts = ['Inter', 'Arial', 'Helvetica', 'sans-serif'];
      if (systemFonts.includes(primaryFont)) return;
      
      // For common Google Fonts, create a link element
      const fontMap = {
        'Roboto': 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
        'Poppins': 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap',
        'Open Sans': 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap',
        'Noto Sans': 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;700&display=swap',
        'Cairo': 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap',
        'Tajawal': 'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap'
      };
      
      if (fontMap[primaryFont]) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = fontMap[primaryFont];
        document.head.appendChild(link);
      }
    }

    // Apply settings to CSS variables and HTML
    // Apply settings to CSS variables and HTML
    const applySettings = (settingsObj) => {
      document.documentElement.style.setProperty('--primary-color', settingsObj.primary_color || '#a1cd2a');
      document.documentElement.style.setProperty('--secondary-color', settingsObj.secondary_color || '#2e7d32');
      document.documentElement.style.setProperty('--primary-font', settingsObj.primary_font || 'Inter, sans-serif');
      document.documentElement.style.setProperty('--font-size-base', settingsObj.font_size_base || '16px');
      
      // Load custom font if needed
      loadCustomFont(settingsObj.primary_font);
      
      // Apply RTL default if set
      if (settingsObj.rtl_default === 'true') {
        currentLocale.value = 'ar';
      }
    }

    // Fetch site settings
    const fetchSiteSettings = async () => {
      try {
        // Use cached settings if available and not expired
        if (!shouldFetchSettings.value && cachedSettings.value) {
          siteSettings.value = cachedSettings.value;
          applySettings(siteSettings.value);
          settingsLoaded.value = true;
          return;
        }

        const { data, error } = await supabase
          .from('site_settings')
          .select('*')

        if (error) throw error

        // Convert to object for easier access
        const settingsObj = {}
        data.forEach(setting => {
          settingsObj[setting.key] = setting.value
        })
        
        // Update state and cache
        siteSettings.value = settingsObj
        cachedSettings.value = settingsObj
        lastFetchTime.value = Date.now()
        
        // Apply settings
        applySettings(settingsObj);
        settingsLoaded.value = true;
      } catch (error) {
        console.error('Error fetching site settings:', error)
        // If cache exists, use it as fallback
        if (cachedSettings.value) {
          siteSettings.value = cachedSettings.value;
          applySettings(siteSettings.value);
        }
        settingsLoaded.value = true;
      }
    }

    onMounted(() => {
      fetchSiteSettings()
    })
    
    return {
      currentLocale,
      siteSettings,
      toggleLanguage
    }
  }
}
</script>