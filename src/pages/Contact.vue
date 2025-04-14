<template>
  <div class="space-y-8">
    <!-- Header -->
    <div 
      class="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0 }"
    >
      <h1 class="text-4xl font-bold mb-4">Contact Us</h1>
      <p class="text-gray-600 max-w-2xl">
        Have questions? We're here to help. Reach out to our team through any of the channels below.
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-8">
      <!-- Contact Form -->
      <div 
        class="card"
        v-motion
        :initial="{ opacity: 0, x: -50 }"
        :enter="{ opacity: 1, x: 0, delay: 200 }"
      >
        <h2 class="text-2xl font-bold mb-6">Send us a Message</h2>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              v-model="form.name"
              required
              class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              v-model="form.email"
              required
              class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              v-model="form.subject"
              required
              class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              v-model="form.message"
              required
              rows="4"
              class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20"
            ></textarea>
          </div>
          <button type="submit" class="btn btn-primary w-full">Send Message</button>
        </form>
      </div>

      <!-- Contact Information -->
      <div 
        class="space-y-6"
        v-motion
        :initial="{ opacity: 0, x: 50 }"
        :enter="{ opacity: 1, x: 0, delay: 400 }"
      >
        <div class="card">
          <h2 class="text-2xl font-bold mb-6">Contact Information</h2>
          <div class="space-y-4">
            <div class="flex items-center gap-4">
              <div class="bg-primary/10 p-3 rounded-full">
                <PhoneIcon class="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 class="font-semibold">Phone</h3>
                <p class="text-gray-600">+1 (234) 567-8900</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="bg-primary/10 p-3 rounded-full">
                <EnvelopeIcon class="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 class="font-semibold">Email</h3>
                <p class="text-gray-600">contact@sandbad.com</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="bg-primary/10 p-3 rounded-full">
                <MapPinIcon class="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 class="font-semibold">Address</h3>
                <p class="text-gray-600">123 Health Street, Medical District</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <h2 class="text-2xl font-bold mb-6">Business Hours</h2>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Monday - Friday</span>
              <span class="font-semibold">9:00 AM - 8:00 PM</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Saturday</span>
              <span class="font-semibold">10:00 AM - 6:00 PM</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Sunday</span>
              <span class="font-semibold">Closed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'Contact',
  components: {
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon
  },
  setup() {
    const toast = useToast()
    const form = ref({
      name: '',
      email: '',
      subject: '',
      message: ''
    })

    const handleSubmit = () => {
      toast.success('Message sent successfully! We will get back to you soon.')
      form.value = {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
    }

    return {
      form,
      handleSubmit
    }
  }
}
</script>