<template>
  <div class="space-y-8">
    <!-- Header -->
    <div 
      class="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0 }"
    >
      <div class="flex flex-col md:flex-row justify-between items-center mb-4">
        <h1 class="text-3xl font-bold gradient-text">Plugins</h1>
        <div class="flex items-center gap-3 mt-4 md:mt-0">
          <button 
            @click="uploadPlugin" 
            class="btn btn-outline flex items-center gap-2"
          >
            <ArrowUpTrayIcon class="w-5 h-5" />
            Upload
          </button>
          <button 
            @click="browsePluginStore"
            class="btn btn-primary flex items-center gap-2"
          >
            <PlusIcon class="w-5 h-5" />
            Add New
          </button>
        </div>
      </div>
      <p class="text-gray-600">
        Plugins extend and expand the functionality of your pharmacy.
      </p>
    </div>
    
    <!-- Plugin System Interface -->
    <div class="card">
      <PluginSystem :initial-view="initialPluginView" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import PluginSystem from '../../components/PluginSystem.vue'
import {
  PlusIcon,
  ArrowUpTrayIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'PluginsManager',
  components: {
    PluginSystem,
    PlusIcon,
    ArrowUpTrayIcon
  },
  setup() {
    const toast = useToast()
    const initialPluginView = ref('dashboard')
    
    const uploadPlugin = () => {
      toast.info('Upload plugin functionality coming soon!')
    }
    
    const browsePluginStore = () => {
      initialPluginView.value = 'store'
    }
    
    return {
      initialPluginView,
      uploadPlugin,
      browsePluginStore
    }
  }
}
</script>

<style scoped>
.gradient-text {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary;
}
</style>