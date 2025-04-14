import { createApp } from 'vue'
import { MotionPlugin } from '@vueuse/motion'
import Toast from 'vue-toastification'
import { createPinia } from 'pinia'
import 'vue-toastification/dist/index.css'
import './style.css'
import App from './App.vue'
import { router } from './router'
import { registerBuiltInPlugins } from './lib/plugins'

// Measure app start time for performance
const startTime = performance.now()

const app = createApp(App)
const pinia = createPinia()

const toastOptions = {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: 'button',
  icon: true,
  rtl: false
}

app.use(router)
app.use(MotionPlugin)
app.use(pinia)
app.use(Toast, toastOptions)

// Initialize plugin system
registerBuiltInPlugins()
// Removed registerExamplePlugins() to prevent duplicate registration

// Mount the app
app.mount('#app')

// Log performance metrics
window.addEventListener('load', () => {
  setTimeout(() => {
    const endTime = performance.now()
    console.log(`App startup time: ${(endTime - startTime).toFixed(2)}ms`)
    
    // Report performance metrics
    if ('performance' in window && 'getEntriesByType' in window.performance) {
      const paintMetrics = performance.getEntriesByType('paint')
      const navigationTiming = performance.getEntriesByType('navigation')[0]
      
      if (paintMetrics.length) {
        paintMetrics.forEach(metric => {
          console.log(`${metric.name}: ${metric.startTime.toFixed(2)}ms`)
        })
      }
      
      if (navigationTiming) {
        console.log(`DOM Content Loaded: ${navigationTiming.domContentLoadedEventEnd.toFixed(2)}ms`)
        console.log(`Load: ${navigationTiming.loadEventEnd.toFixed(2)}ms`)
      }
    }
  }, 0)
})