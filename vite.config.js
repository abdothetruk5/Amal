import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    hmr: true,
  },
  build: {
    // Generate sourcemaps for better debugging
    sourcemap: process.env.NODE_ENV !== 'production',
    // Optimize bundling
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', '@vueuse/core', '@vueuse/motion'],
          ui: ['@headlessui/vue', '@heroicons/vue'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
    // Minimize chunk size
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      '@vueuse/core',
      '@vueuse/motion',
      '@headlessui/vue',
      '@heroicons/vue',
      '@supabase/supabase-js',
      'vue-toastification',
      'swiper',
      'vue-chartjs',
      'chart.js'
    ]
  }
})