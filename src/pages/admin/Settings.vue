<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold gradient-text">Site Settings</h1>
      <div class="flex gap-2">
        <button
          @click="saveAllSettings"
          class="btn btn-primary flex items-center gap-2"
          :disabled="isSaving"
        >
          <span v-if="isSaving" class="animate-spin">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          <span>{{ isSaving ? 'Saving...' : 'Save All Settings' }}</span>
        </button>
      </div>
    </div>

    <!-- Settings Content -->
    <div 
      v-if="loading" 
      class="flex justify-center items-center py-12"
    >
      <div class="animate-spin mr-2">
        <svg class="w-8 h-8 text-primary" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <span class="text-lg">Loading settings...</span>
    </div>

    <div v-else class="space-y-8">
      <!-- Branding Section -->
      <div class="card">
        <h2 class="text-xl font-semibold mb-6">Branding</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Logo -->
          <div class="space-y-4">
            <h3 class="font-medium text-gray-700">Site Logo</h3>
            <div class="p-4 border rounded-lg flex flex-col items-center justify-center">
              <img :src="getSettingValue('site_logo')" alt="Site Logo" class="h-20 object-contain mb-4" />
              <div class="w-full">
                <input 
                  type="text" 
                  v-model="settings.site_logo.value" 
                  class="input w-full"
                  placeholder="Logo URL"
                />
                <p class="text-xs text-gray-500 mt-1">Enter the URL of your logo image</p>
              </div>
            </div>
          </div>

          <!-- Site Title -->
          <div class="space-y-4">
            <h3 class="font-medium text-gray-700">Site Title</h3>
            <div class="space-y-4">
              <input 
                type="text" 
                v-model="settings.site_title.value" 
                class="input w-full"
                placeholder="Site Title"
              />
              
              <div>
                <h4 class="text-sm font-medium text-gray-700 mb-2">RTL Default</h4>
                <label class="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    v-model="rtlDefault" 
                    class="sr-only peer"
                  >
                  <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  <span class="ml-3 text-sm font-medium text-gray-700">Default to RTL Layout</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Colors Section -->
      <div class="card">
        <h2 class="text-xl font-semibold mb-6">Colors</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Primary Color -->
          <div class="space-y-4">
            <h3 class="font-medium text-gray-700">Primary Color</h3>
            <div class="flex items-center gap-4">
              <div 
                class="w-10 h-10 rounded-full border"
                :style="{ backgroundColor: settings.primary_color.value }"
              ></div>
              <input 
                type="text" 
                v-model="settings.primary_color.value" 
                class="input flex-grow"
                placeholder="#0e7490"
              />
              <input 
                type="color" 
                v-model="settings.primary_color.value" 
                class="w-10 h-10 cursor-pointer"
              />
            </div>
          </div>

          <!-- Secondary Color -->
          <div class="space-y-4">
            <h3 class="font-medium text-gray-700">Secondary Color</h3>
            <div class="flex items-center gap-4">
              <div 
                class="w-10 h-10 rounded-full border"
                :style="{ backgroundColor: settings.secondary_color.value }"
              ></div>
              <input 
                type="text" 
                v-model="settings.secondary_color.value" 
                class="input flex-grow"
                placeholder="#3b82f6"
              />
              <input 
                type="color" 
                v-model="settings.secondary_color.value" 
                class="w-10 h-10 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Typography Section -->
      <div class="card">
        <h2 class="text-xl font-semibold mb-6">Typography</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Primary Font -->
          <div class="space-y-4">
            <h3 class="font-medium text-gray-700">Primary Font</h3>
            <select 
              v-model="settings.primary_font.value" 
              class="select w-full"
            >
              <option value="Inter, sans-serif">Inter</option>
              <option value="Roboto, sans-serif">Roboto</option>
              <option value="Poppins, sans-serif">Poppins</option>
              <option value="'Noto Sans', sans-serif">Noto Sans</option>
              <option value="'Open Sans', sans-serif">Open Sans</option>
              <option value="'Cairo', sans-serif">Cairo (Arabic Support)</option>
              <option value="'Tajawal', sans-serif">Tajawal (Arabic Support)</option>
            </select>
            <p 
              class="text-lg" 
              :style="{ fontFamily: settings.primary_font.value }"
            >
              This is how your font will look like. أهلا بالعالم
            </p>
          </div>

          <!-- Base Font Size -->
          <div class="space-y-4">
            <h3 class="font-medium text-gray-700">Base Font Size</h3>
            <select 
              v-model="settings.font_size_base.value" 
              class="select w-full"
            >
              <option value="14px">Small (14px)</option>
              <option value="16px">Medium (16px)</option>
              <option value="18px">Large (18px)</option>
            </select>
            <div class="space-y-2">
              <p 
                class="text-sm"
                :style="{ fontSize: getFontSizeVariation(0.875) }"
              >
                Small Text
              </p>
              <p 
                :style="{ fontSize: getFontSizeVariation(1) }"
              >
                Normal Text
              </p>
              <p 
                class="text-lg"
                :style="{ fontSize: getFontSizeVariation(1.125) }"
              >
                Large Text
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="card">
        <h2 class="text-xl font-semibold mb-6">Contact Information</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Email -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              v-model="settings.contact_email.value" 
              class="input w-full"
              placeholder="contact@example.com"
            />
          </div>
          
          <!-- Phone -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Phone Number</label>
            <input 
              type="text" 
              v-model="settings.contact_phone.value" 
              class="input w-full"
              placeholder="(123) 456-7890"
            />
          </div>
          
          <!-- Address -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Address</label>
            <input 
              type="text" 
              v-model="settings.contact_address.value" 
              class="input w-full"
              placeholder="123 Street, City"
            />
          </div>
        </div>
      </div>

      <!-- Preview Section -->
      <div class="card">
        <h2 class="text-xl font-semibold mb-6">Preview</h2>
        
        <div 
          class="p-6 border rounded-lg shadow-inner"
          :style="{
            fontFamily: settings.primary_font.value,
            fontSize: settings.font_size_base.value
          }"
        >
          <div class="flex items-center gap-3 mb-6">
            <img :src="getSettingValue('site_logo')" alt="Logo" class="h-10 w-auto" />
            <span class="text-xl font-bold" style="background: linear-gradient(90deg, var(--primary-color) 0%, var(--secondary-color) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
              {{ getSettingValue('site_title') }}
            </span>
          </div>
          
          <div class="space-y-4">
            <div 
              class="p-4 rounded-lg text-white"
              :style="{ backgroundColor: getSettingValue('primary_color') }"
            >
              This is styled with your primary color
            </div>
            
            <div 
              class="p-4 rounded-lg text-white"
              :style="{ backgroundColor: getSettingValue('secondary_color') }"
            >
              This is styled with your secondary color
            </div>
            
            <div class="p-4 border rounded-lg">
              <p class="font-bold">Contact Information:</p>
              <p>Email: {{ getSettingValue('contact_email') }}</p>
              <p>Phone: {{ getSettingValue('contact_phone') }}</p>
              <p>Address: {{ getSettingValue('contact_address') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { supabase, clearCache } from '../../lib/supabase'
import { useToast } from 'vue-toastification'

export default {
  name: 'AdminSettings',
  setup() {
    const toast = useToast()
    const loading = ref(true)
    const isSaving = ref(false)
    const settings = ref({})
    const rtlDefault = ref(false)

    const getSettingValue = (key) => {
      return settings.value[key]?.value || ''
    }

    const getFontSizeVariation = (factor) => {
      const baseSize = parseInt(settings.value.font_size_base?.value || '16px')
      return `${baseSize * factor}px`
    }

    // Load custom font if needed for preview
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
        const linkId = `font-${primaryFont.toLowerCase().replace(/\s+/g, '-')}`;
        
        // Check if link already exists
        if (!document.getElementById(linkId)) {
          const link = document.createElement('link');
          link.id = linkId;
          link.rel = 'stylesheet';
          link.href = fontMap[primaryFont];
          document.head.appendChild(link);
        }
      }
    }

    const fetchSettings = async () => {
      loading.value = true
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')

        if (error) throw error

        // Convert data to object with key as key
        const settingsObj = {}
        data.forEach(setting => {
          settingsObj[setting.key] = setting
        })
        settings.value = settingsObj

        // Set RTL default
        rtlDefault.value = settingsObj.rtl_default?.value === 'true'
        
        // Load custom font if selected
        if (settingsObj.primary_font?.value) {
          loadCustomFont(settingsObj.primary_font.value);
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
        toast.error('Failed to load settings')
      } finally {
        loading.value = false
      }
    }

    const saveAllSettings = async () => {
      isSaving.value = true
      try {
        // Update rtl_default setting
        settings.value.rtl_default.value = rtlDefault.value.toString()
        
        // Convert settings object to array for update
        const updatedSettings = Object.values(settings.value).map(setting => ({
          id: setting.id,
          key: setting.key,
          value: setting.value
        }))

        // Update all settings
        const { error } = await supabase
          .from('site_settings')
          .upsert(updatedSettings, { onConflict: 'id' })

        if (error) throw error

        // Clear site settings cache
        clearCache('site_settings')
        
        // Clear localStorage cache
        localStorage.removeItem('sandbad-site-settings')
        localStorage.removeItem('sandbad-settings-fetch-time')
        
        toast.success('Settings saved successfully')
        
        // Update CSS variables for instant preview
        updateCssVariables()
        
        // Reload the page after a short delay to apply all changes
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } catch (error) {
        console.error('Error saving settings:', error)
        toast.error('Failed to save settings')
      } finally {
        isSaving.value = false
      }
    }

    // Update CSS variables for instant preview
    const updateCssVariables = () => {
      document.documentElement.style.setProperty('--primary-color', getSettingValue('primary_color'))
      document.documentElement.style.setProperty('--secondary-color', getSettingValue('secondary_color'))
      document.documentElement.style.setProperty('--primary-font', getSettingValue('primary_font'))
      document.documentElement.style.setProperty('--font-size-base', getSettingValue('font_size_base'))
      
      // Load custom font if needed
      loadCustomFont(getSettingValue('primary_font'))
    }

    // Watch for changes in color and font settings to update CSS variables
    watch(() => [
      settings.value.primary_color?.value,
      settings.value.secondary_color?.value,
      settings.value.primary_font?.value
    ], () => {
      if (settings.value.primary_color && settings.value.secondary_color) {
        updateCssVariables()
      }
      
      // Load font if changed
      if (settings.value.primary_font?.value) {
        loadCustomFont(settings.value.primary_font.value)
      }
    })

    onMounted(() => {
      fetchSettings()
    })

    return {
      loading,
      isSaving,
      settings,
      rtlDefault,
      getSettingValue,
      getFontSizeVariation,
      saveAllSettings
    }
  }
}
</script>

<style>
:root {
  --primary-color: #a1cd2a;
  --secondary-color: #95c31a;
}
</style>