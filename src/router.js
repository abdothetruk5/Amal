import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from './lib/supabase'

// Import routes - Use dynamic imports for code splitting and lazy loading
const Home = () => import('./pages/Home.vue')
const Products = () => import('./pages/Products.vue')
const ProductDetail = () => import('./pages/ProductDetail.vue')
const Cart = () => import('./pages/Cart.vue')
const Checkout = () => import('./pages/Checkout.vue')
const Auth = () => import('./pages/Auth.vue')
const Contact = () => import('./pages/Contact.vue')
const FAQ = () => import('./pages/FAQ.vue')
const About = () => import('./pages/About.vue')
const Location = () => import('./pages/Location.vue')
const Privacy = () => import('./pages/Privacy.vue')
const Profile = () => import('./pages/Profile.vue')
const Wishlist = () => import('./pages/Wishlist.vue')
const AdminLayout = () => import('./pages/admin/Layout.vue')
const AdminDashboard = () => import('./pages/admin/Dashboard.vue')
const AdminSettings = () => import('./pages/admin/Settings.vue')
const AdminProductManager = () => import('./pages/admin/ProductManager.vue')
const AdminOrderManager = () => import('./pages/admin/OrderManager.vue')
const AdminPluginsManager = () => import('./pages/admin/PluginsManager.vue')

const routes = [
  { path: '/', component: Home },
  { path: '/products', component: Products },
  { path: '/products/:id', component: ProductDetail },
  { path: '/cart', component: Cart },
  { path: '/checkout', component: Checkout },
  { path: '/auth', component: Auth },
  { path: '/contact', component: Contact },
  { path: '/faq', component: FAQ },
  { path: '/about', component: About },
  { path: '/location', component: Location },
  { path: '/privacy', component: Privacy },
  { path: '/wishlist', component: Wishlist },
  { 
    path: '/profile', 
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '', component: AdminDashboard },
      { path: 'settings', component: AdminSettings },
      { path: 'products', component: AdminProductManager },
      { path: 'orders', component: AdminOrderManager },
      { path: 'plugins', component: AdminPluginsManager }
    ]
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guard for protected routes
router.beforeEach(async (to, from, next) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!user) {
      next('/auth')
      return
    }

    // Check for admin role if required
    if (to.matched.some(record => record.meta.requiresAdmin)) {
      if (!user.id) {
        next('/')
        return
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || profile.role !== 'admin') {
        next('/')
        return
      }
    }
  }

  next()
})