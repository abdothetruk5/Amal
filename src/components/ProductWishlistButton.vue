<template>
  <button 
    @click.prevent="toggleWishlist"
    class="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white shadow-elevation-1 hover:shadow-elevation-2 transition-all"
    :class="{ 'text-red-500': isInWishlist, 'text-gray-400 hover:text-red-500': !isInWishlist }"
    :title="isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'"
  >
    <HeartIcon class="w-5 h-5" :class="{ 'fill-current': isInWishlist }" />
  </button>
</template>

<script>
import { computed } from 'vue'
import { HeartIcon } from '@heroicons/vue/24/outline'
import { useWishlistStore } from '../stores/wishlistStore'
import { useToast } from 'vue-toastification'

export default {
  name: 'ProductWishlistButton',
  components: {
    HeartIcon
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const wishlistStore = useWishlistStore()
    const toast = useToast()
    
    const isInWishlist = computed(() => {
      return wishlistStore.isInWishlist(props.product.id)
    })
    
    const toggleWishlist = () => {
      if (isInWishlist.value) {
        wishlistStore.removeFromWishlist(props.product.id)
        toast.success(`Removed from wishlist`)
      } else {
        wishlistStore.addToWishlist(props.product)
        toast.success(`Added to wishlist`)
      }
    }
    
    return {
      isInWishlist,
      toggleWishlist
    }
  }
}
</script>