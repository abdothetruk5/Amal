<template>
  <div class="space-y-8">
    <!-- Header -->
    <div 
      class="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0 }"
    >
      <h1 class="text-4xl font-bold mb-4">Our Locations</h1>
      <p class="text-gray-600 max-w-2xl">
        Find a Amal Pharmacy near you. Visit us today and experience exceptional pharmaceutical care and service.
      </p>
    </div>

    <!-- Map Section -->
    <div 
      class="card"
      v-motion
      :initial="{ opacity: 0, y: 30 }"
      :enter="{ opacity: 1, y: 0, delay: 200 }"
    >
      <div class="aspect-w-16 aspect-h-9 mb-6 rounded-lg overflow-hidden shadow-elevation-1">
        <!-- This is just a placeholder image for a map. In a real app, integrate Google Maps or similar -->
        <img 
          src="https://maps.googleapis.com/maps/api/staticmap?center=40.7128,-74.0060&zoom=12&size=800x400&markers=color:orange%7Clabel:S%7C40.7128,-74.0060&markers=color:orange%7Clabel:S%7C40.7328,-74.0260&markers=color:orange%7Clabel:S%7C40.6928,-73.9860&key=AIzaSyBDaeWicvigtP9xPv919E-RNoxfvC-Hqik" 
          alt="Pharmacy Locations Map" 
          class="w-full h-full object-cover"
        />
      </div>
      <p class="text-center text-gray-500 italic text-sm">Interactive map showing all our pharmacy locations. Visit any of our branches for quality healthcare products.</p>
    </div>

    <!-- Location Listings -->
    <div 
      class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      v-motion
      :initial="{ opacity: 0, y: 30 }"
      :enter="{ opacity: 1, y: 0, delay: 300 }"
    >
      <div 
        v-for="(location, index) in locations" 
        :key="index"
        class="card hover:shadow-elevation-3 transition-all duration-300"
      >
        <div class="p-4 bg-primary/5 rounded-lg mb-4 inline-block">
          <MapPinIcon class="w-8 h-8 text-primary" />
        </div>
        <h3 class="text-xl font-semibold mb-2">{{ location.name }}</h3>
        <div class="space-y-3">
          <p class="text-gray-600">{{ location.address }}</p>
          <p class="flex items-center gap-2 text-gray-600">
            <PhoneIcon class="w-4 h-4 text-primary" />
            <a :href="`tel:${location.phone}`" class="hover:text-primary">{{ location.phone }}</a>
          </p>
          <p class="flex items-center gap-2 text-gray-600">
            <ClockIcon class="w-4 h-4 text-primary" />
            {{ location.hours }}
          </p>
          
          <div class="pt-4 flex justify-between">
            <a 
              :href="location.directions" 
              target="_blank" 
              class="text-primary flex items-center gap-1 hover:underline"
            >
              <ArrowTopRightOnSquareIcon class="w-4 h-4" />
              Get Directions
            </a>
            
            <a 
              href="#"
              class="text-primary flex items-center gap-1 hover:underline"
            >
              <IdentificationIcon class="w-4 h-4" />
              View Details
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Find a Location Section -->
    <div 
      class="card"
      v-motion
      :initial="{ opacity: 0, y: 30 }"
      :enter="{ opacity: 1, y: 0, delay: 400 }"
    >
      <h2 class="text-2xl font-bold mb-6">Find a Location Near You</h2>
      <div class="grid md:grid-cols-3 gap-6">
        <div class="md:col-span-2">
          <div class="flex flex-col md:flex-row gap-4 mb-6">
            <div class="flex-grow">
              <label class="block text-sm font-medium text-gray-700 mb-1">Zip Code or City</label>
              <input 
                type="text"
                class="input"
                placeholder="Enter zip code or city name"
              />
            </div>
            <div class="md:w-1/3">
              <label class="block text-sm font-medium text-gray-700 mb-1">Distance</label>
              <select class="select">
                <option>5 miles</option>
                <option>10 miles</option>
                <option>15 miles</option>
                <option>25 miles</option>
                <option>50 miles</option>
              </select>
            </div>
          </div>
          <button class="btn btn-primary w-full md:w-auto">Search Locations</button>
        </div>
        <div class="space-y-4">
          <h3 class="font-medium">Pharmacy Services</h3>
          <ul class="space-y-2">
            <li class="flex items-start gap-2">
              <CheckCircleIcon class="w-5 h-5 text-primary mt-1" />
              <span>Prescription Fulfillment</span>
            </li>
            <li class="flex items-start gap-2">
              <CheckCircleIcon class="w-5 h-5 text-primary mt-1" />
              <span>Medication Consultations</span>
            </li>
            <li class="flex items-start gap-2">
              <CheckCircleIcon class="w-5 h-5 text-primary mt-1" />
              <span>Immunizations</span>
            </li>
            <li class="flex items-start gap-2">
              <CheckCircleIcon class="w-5 h-5 text-primary mt-1" />
              <span>Health Screenings</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Delivery Areas -->
    <div 
      class="card bg-gradient-to-r from-primary/5 to-secondary/5"
      v-motion
      :initial="{ opacity: 0, y: 30 }"
      :enter="{ opacity: 1, y: 0, delay: 500 }"
    >
      <h2 class="text-2xl font-bold mb-6">Delivery Areas</h2>
      <p class="mb-6">We offer fast and reliable home delivery of medications and healthcare products to the following areas:</p>
      
      <div class="grid md:grid-cols-3 gap-4">
        <div 
          v-for="(area, index) in deliveryAreas" 
          :key="index" 
          class="bg-white p-4 rounded-lg shadow-elevation-1"
        >
          <h3 class="font-medium mb-2">{{ area.name }}</h3>
          <p class="text-sm text-gray-600 mb-2">{{ area.description }}</p>
          <div class="text-xs font-medium bg-primary/10 text-primary rounded-full px-2 py-1 inline-block">
            {{ area.deliveryTime }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { 
  MapPinIcon, 
  PhoneIcon, 
  ClockIcon, 
  ArrowTopRightOnSquareIcon, 
  IdentificationIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'Location',
  components: {
    MapPinIcon,
    PhoneIcon,
    ClockIcon,
    ArrowTopRightOnSquareIcon,
    IdentificationIcon,
    CheckCircleIcon
  },
  setup() {
    const locations = ref([
      {
        name: 'Amal Main Branch',
        address: '123 Health Street, Medical District, New York, NY 10001',
        phone: '(212) 555-7890',
        hours: 'Mon-Fri: 8am-9pm, Sat-Sun: 9am-6pm',
        directions: 'https://maps.google.com/?q=123+Health+Street,+New+York',
        services: ['Prescription Pickup', 'Health Consultations', 'Vaccines']
      },
      {
        name: 'Amal Downtown',
        address: '456 Wellness Avenue, Downtown, New York, NY 10002',
        phone: '(212) 555-1234',
        hours: 'Mon-Fri: 7am-10pm, Sat-Sun: 8am-8pm',
        directions: 'https://maps.google.com/?q=456+Wellness+Avenue,+New+York',
        services: ['24/7 Pharmacy', 'Drive-thru Service', 'Health Screenings']
      },
      {
        name: 'Amal Uptown',
        address: '789 Medicine Boulevard, Uptown, New York, NY 10003',
        phone: '(212) 555-5678',
        hours: 'Mon-Sun: 9am-7pm',
        directions: 'https://maps.google.com/?q=789+Medicine+Boulevard,+New+York',
        services: ['Specialty Medications', 'Compounding', 'Health Clinics']
      },
      {
        name: 'Amal East Side',
        address: '321 Care Lane, East Side, New York, NY 10004',
        phone: '(212) 555-9012',
        hours: 'Mon-Fri: 8am-8pm, Sat: 9am-5pm, Sun: Closed',
        directions: 'https://maps.google.com/?q=321+Care+Lane,+New+York',
        services: ['Medication Reviews', 'Diabetes Care', 'Home Delivery']
      },
      {
        name: 'Amal West Side',
        address: '654 Remedy Road, West Side, New York, NY 10005',
        phone: '(212) 555-3456',
        hours: 'Mon-Sat: 8am-9pm, Sun: 10am-6pm',
        directions: 'https://maps.google.com/?q=654+Remedy+Road,+New+York',
        services: ['Immunizations', 'Pet Medications', 'Health Supplies']
      },
      {
        name: 'Amal Midtown',
        address: '987 Healing Street, Midtown, New York, NY 10006',
        phone: '(212) 555-7890',
        hours: 'Open 24/7',
        directions: 'https://maps.google.com/?q=987+Healing+Street,+New+York',
        services: ['Emergency Prescriptions', 'Overnight Service', 'Medical Equipment']
      }
    ])

    const deliveryAreas = ref([
      {
        name: 'Manhattan',
        description: 'All neighborhoods in Manhattan',
        deliveryTime: 'Same-day delivery'
      },
      {
        name: 'Brooklyn',
        description: 'Most neighborhoods in Brooklyn',
        deliveryTime: 'Next-day delivery'
      },
      {
        name: 'Queens',
        description: 'Select areas in Queens',
        deliveryTime: '1-2 days delivery'
      },
      {
        name: 'Bronx',
        description: 'South Bronx areas',
        deliveryTime: '1-2 days delivery'
      },
      {
        name: 'Staten Island',
        description: 'North Shore neighborhoods',
        deliveryTime: '2-3 days delivery'
      },
      {
        name: 'Jersey City',
        description: 'Downtown and Newport areas',
        deliveryTime: 'Next-day delivery'
      },
      {
        name: 'Hoboken',
        description: 'All of Hoboken',
        deliveryTime: 'Next-day delivery'
      },
      {
        name: 'Long Island',
        description: 'Select areas near NYC',
        deliveryTime: '2-3 days delivery'
      },
      {
        name: 'Other Areas',
        description: 'Contact us for availability',
        deliveryTime: 'Varies by location'
      }
    ])

    return {
      locations,
      deliveryAreas
    }
  }
}
</script>

<style scoped>
.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
}
.aspect-h-9 {
  height: 0;
}
.aspect-w-16 img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>