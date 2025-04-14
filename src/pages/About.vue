<template>
  <div class="space-y-16">
    <!-- Hero Section -->
    <section 
      class="relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-secondary/5 rounded-3xl py-20 px-4"
      v-motion
      :initial="{ opacity: 0 }"
      :enter="{ opacity: 1 }"
    >
      <div class="container mx-auto">
        <div class="max-w-3xl mx-auto text-center">
          <h1 
            class="text-4xl md:text-5xl font-bold mb-6"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, delay: 200 }"
          >
            About <span class="text-primary">Amal Pharmacy</span>
          </h1>
          <p 
            class="text-xl text-gray-600"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, delay: 400 }"
          >
            Your trusted partner in health and wellness since 2024. We're committed to providing quality healthcare products and exceptional service to our community.
          </p>
        </div>
      </div>
    </section>

    <!-- Mission & Vision -->
    <section class="container mx-auto px-4">
      <div class="grid md:grid-cols-2 gap-8">
        <div 
          class="card"
          v-motion
          :initial="{ opacity: 0, x: -50 }"
          :enter="{ opacity: 1, x: 0 }"
        >
          <HeartIcon class="w-12 h-12 text-primary mb-6" />
          <h2 class="text-2xl font-bold mb-4">Our Mission</h2>
          <p class="text-gray-600">
            To provide accessible, high-quality healthcare products and professional pharmacy services that improve the health and wellness of our community.
          </p>
        </div>
        <div 
          class="card"
          v-motion
          :initial="{ opacity: 0, x: 50 }"
          :enter="{ opacity: 1, x: 0 }"
        >
          <EyeIcon class="w-12 h-12 text-primary mb-6" />
          <h2 class="text-2xl font-bold mb-4">Our Vision</h2>
          <p class="text-gray-600">
            To be the leading online pharmacy, recognized for our commitment to excellence, innovation in healthcare delivery, and outstanding customer service.
          </p>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="container mx-auto px-4">
      <h2 
        class="text-3xl font-bold text-center mb-12"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0 }"
      >
        Our Core Values
      </h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div 
          v-for="(value, index) in values"
          :key="index"
          class="card text-center"
          v-motion
          :initial="{ opacity: 0, y: 50 }"
          :enter="{ opacity: 1, y: 0, delay: 200 * index }"
        >
          <component :is="value.icon" class="w-12 h-12 text-primary mx-auto mb-6" />
          <h3 class="text-xl font-bold mb-4">{{ value.title }}</h3>
          <p class="text-gray-600">{{ value.description }}</p>
        </div>
      </div>
    </section>

    <!-- Team -->
    <section class="container mx-auto px-4">
      <h2 
        class="text-3xl font-bold text-center mb-12"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0 }"
      >
        Our Leadership Team
      </h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div 
          v-for="(member, index) in team"
          :key="index"
          class="card text-center"
          v-motion
          :initial="{ opacity: 0, y: 50 }"
          :enter="{ opacity: 1, y: 0, delay: 200 * index }"
        >
          <img 
            :src="member.image" 
            :alt="member.name"
            class="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
          />
          <h3 class="text-xl font-bold mb-2">{{ member.name }}</h3>
          <p class="text-primary font-medium mb-4">{{ member.position }}</p>
          <p class="text-gray-600">{{ member.bio }}</p>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section 
      class="bg-gradient-to-r from-primary to-secondary text-white py-16 rounded-3xl"
      v-motion
      :initial="{ opacity: 0 }"
      :enter="{ opacity: 1 }"
    >
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-4 gap-8 text-center">
          <div 
            v-for="(stat, index) in stats"
            :key="index"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, delay: 100 * index }"
          >
            <div class="text-4xl font-bold mb-2">{{ stat.value }}</div>
            <div class="text-white/80">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import {
  HeartIcon,
  EyeIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'About',
  components: {
    HeartIcon,
    EyeIcon,
    ShieldCheckIcon,
    UserGroupIcon,
    SparklesIcon
  },
  setup() {
    const values = [
      {
        icon: 'ShieldCheckIcon',
        title: 'Quality',
        description: 'We maintain the highest standards in product quality and service delivery.'
      },
      {
        icon: 'UserGroupIcon',
        title: 'Customer Focus',
        description: "Our customers' health and satisfaction are at the heart of everything we do."
      },
      {
        icon: 'SparklesIcon',
        title: 'Innovation',
        description: 'We continuously improve our services to meet evolving healthcare needs.'
      }
    ]

    const team = [
      {
        name: 'Dr. Sarah Johnson',
        position:  'Chief Executive Officer',
        bio: '20+ years of experience in healthcare management and pharmacy operations.',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200'
      },
      {
        name: 'Dr. Michael Chen',
        position: 'Chief Pharmacist',
        bio: 'Specialized in clinical pharmacy with a focus on patient care and medication safety.',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200'
      },
      {
        name: 'Emily Rodriguez',
        position: 'Operations Director',
        bio: 'Expert in supply chain management and digital healthcare solutions.',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200'
      }
    ]

    const stats = [
      { value: '10K+', label: 'Happy Customers' },
      { value: '1000+', label: 'Products' },
      { value: '99%', label: 'Satisfaction Rate' },
      { value: '24/7', label: 'Support' }
    ]

    return {
      values,
      team,
      stats
    }
  }
}
</script>