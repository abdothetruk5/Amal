<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Admin Bar (WordPress Style) -->
    <div class="bg-primary text-white h-10 fixed inset-x-0 top-0 z-40 flex items-center px-4">
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center space-x-4">
          <router-link to="/" class="flex items-center gap-2" target="_blank">
            <HomeIcon class="w-4 h-4" />
            <span class="text-sm">Visit Site</span>
          </router-link>
          
          <div class="flex items-center gap-2 text-sm">
            <span class="hidden md:inline-block">
              Welcome, {{ userDisplayName }}
            </span>
          </div>
        </div>
        
        <div class="flex items-center space-x-4">
          <button class="relative hover:text-white/80" @click="showNotifications = !showNotifications">
            <BellIcon class="w-5 h-5" />
            <span v-if="unreadNotificationsCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {{ unreadNotificationsCount }}
            </span>
          </button>
          
          <button class="relative hover:text-white/80" @click="showMessages = !showMessages">
            <EnvelopeIcon class="w-5 h-5" />
            <span v-if="unreadMessagesCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {{ unreadMessagesCount }}
            </span>
          </button>
          
          <a href="#" class="hover:text-white/80">
            <QuestionMarkCircleIcon class="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>

    <!-- Rest of template content -->
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '../../lib/supabase'
import { useToast } from 'vue-toastification'
import {
  ShieldCheckIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  BellIcon,
  EnvelopeIcon,
  PencilSquareIcon,
  TagIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  CreditCardIcon,
  CalculatorIcon,
  PuzzlePieceIcon,
  AcademicCapIcon,
  WrenchScrewdriverIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'AdminLayout',
  components: {
    ShieldCheckIcon,
    Bars3Icon,
    XMarkIcon,
    HomeIcon,
    ShoppingBagIcon,
    UserGroupIcon,
    ClipboardDocumentListIcon,
    Cog6ToothIcon,
    ChartBarIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ArrowPathIcon,
    MagnifyingGlassIcon,
    BellIcon,
    EnvelopeIcon,
    PencilSquareIcon,
    TagIcon,
    DocumentTextIcon,
    QuestionMarkCircleIcon,
    CreditCardIcon,
    CalculatorIcon,
    PuzzlePieceIcon,
    AcademicCapIcon,
    WrenchScrewdriverIcon
  },
  setup() {
    // Setup code
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.wp-menu-item {
  @apply flex items-center gap-2 px-4 py-2 rounded-lg transition-colors;
}

.wp-menu-item.active {
  @apply bg-primary/10 text-primary;
}

.wp-menu-item:hover:not(.active) {
  @apply bg-gray-100;
}

.wp-notice {
  @apply p-4 rounded border-l-4 mb-4;
}
</style>