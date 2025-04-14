<template>
  <div class="space-y-8">
    <!-- Header -->
    <div 
      class="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0 }"
    >
      <h1 class="text-4xl font-bold mb-4">Privacy Policy</h1>
      <p class="text-gray-600 max-w-2xl">
        At Amal Pharmacy, we are committed to protecting your personal information and your right to privacy.
      </p>
    </div>

    <!-- Privacy Policy Content -->
    <div 
      class="card"
      v-motion
      :initial="{ opacity: 0, y: 30 }"
      :enter="{ opacity: 1, y: 0, delay: 200 }"
    >
      <div class="prose prose-lg max-w-none">
        <h2>Introduction</h2>
        <p>This Privacy Policy describes how Amal Pharmacy collects, uses, and shares your personal information when you use our website, mobile application, or visit our physical stores. By using our services, you agree to the terms of this Privacy Policy.</p>

        <h2>Information We Collect</h2>
        <p>We collect several types of information from and about users of our services:</p>

        <h3>Personal Information</h3>
        <ul>
          <li><strong>Contact Information:</strong> Name, email address, postal address, phone number.</li>
          <li><strong>Account Information:</strong> Login credentials, account preferences.</li>
          <li><strong>Health Information:</strong> Prescription details, medication history, allergies.</li>
          <li><strong>Payment Information:</strong> Credit card details, billing information.</li>
          <li><strong>Identity Verification:</strong> Date of birth, insurance information.</li>
        </ul>

        <h3>Non-Personal Information</h3>
        <ul>
          <li><strong>Usage Data:</strong> How you interact with our services, such as pages visited, time spent on pages, etc.</li>
          <li><strong>Device Information:</strong> Browser type, IP address, device type, operating system.</li>
          <li><strong>Cookies and Similar Technologies:</strong> Data collected through cookies, web beacons, pixels, and similar technologies.</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>We use your information for various purposes, including:</p>
        <ul>
          <li>Fulfilling prescription orders and providing healthcare services</li>
          <li>Managing your account and providing customer support</li>
          <li>Processing payments and maintaining records</li>
          <li>Communicating with you about your orders, health information, and our services</li>
          <li>Improving our website, products, and services</li>
          <li>Marketing and advertising our products and services</li>
          <li>Compliance with legal obligations and industry regulations</li>
        </ul>

        <h2>How We Share Your Information</h2>
        <p>We may share your information with:</p>
        <ul>
          <li><strong>Healthcare Providers:</strong> Doctors, hospitals, and insurance companies as needed for your care.</li>
          <li><strong>Service Providers:</strong> Companies that help us operate our business, such as payment processors, delivery services, and IT providers.</li>
          <li><strong>Legal Authorities:</strong> When required by law, court order, or regulatory obligation.</li>
          <li><strong>Business Partners:</strong> With your consent, we may share information with trusted partners.</li>
          <li><strong>Corporate Transactions:</strong> In connection with a merger, acquisition, or sale of assets.</li>
        </ul>

        <h2>Security of Your Information</h2>
        <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.</p>

        <h2>Your Privacy Rights</h2>
        <p>Depending on your location, you may have the following rights:</p>
        <ul>
          <li>Access and obtain a copy of your personal information</li>
          <li>Correct inaccurate or incomplete information</li>
          <li>Request deletion of your personal information</li>
          <li>Restrict or object to processing of your data</li>
          <li>Data portability</li>
          <li>Withdraw consent at any time</li>
        </ul>

        <h2>Children's Privacy</h2>
        <p>Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe we have collected information from your child, please contact us immediately.</p>

        <h2>Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last updated" date, and the updated version will be effective as soon as it is accessible. We encourage you to review this Privacy Policy frequently to stay informed about how we are protecting your information.</p>

        <h2>Contact Us</h2>
        <p>If you have any questions about this Privacy Policy or our privacy practices, please contact us at:</p>
        <p>
          Amal Pharmacy<br />
          123 Health Street<br />
          Medical District<br />
          Email: privacy@sandbad.com<br />
          Phone: (123) 456-7890
        </p>

        <p class="text-sm text-gray-500 mt-8">Last updated: January 1, 2025</p>
      </div>
    </div>

    <!-- Privacy FAQ -->
    <div 
      class="card"
      v-motion
      :initial="{ opacity: 0, y: 30 }"
      :enter="{ opacity: 1, y: 0, delay: 300 }"
    >
      <h2 class="text-2xl font-bold mb-6">Frequently Asked Privacy Questions</h2>
      
      <div class="space-y-4">
        <div
          v-for="(faq, index) in privacyFaqs"
          :key="index"
          class="border-b pb-4 last:border-0 last:pb-0"
        >
          <button
            @click="faq.isOpen = !faq.isOpen"
            class="w-full flex justify-between items-center py-2 text-left font-medium hover:text-primary transition-colors"
          >
            {{ faq.question }}
            <ChevronDownIcon 
              class="w-5 h-5 transition-transform"
              :class="{ 'transform rotate-180': faq.isOpen }"
            />
          </button>
          <div 
            v-show="faq.isOpen"
            class="mt-2 text-gray-600"
          >
            {{ faq.answer }}
          </div>
        </div>
      </div>
    </div>

    <!-- Cookie Preferences -->
    <div 
      class="card"
      v-motion
      :initial="{ opacity: 0, y: 30 }"
      :enter="{ opacity: 1, y: 0, delay: 400 }"
    >
      <h2 class="text-2xl font-bold mb-6">Cookie Preferences</h2>
      <p class="mb-6">You can adjust your cookie preferences below. These settings allow you to control the types of cookies we use on our website.</p>
      
      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 class="font-medium">Essential Cookies</h3>
            <p class="text-sm text-gray-600">Required for the website to function properly.</p>
          </div>
          <div class="relative">
            <div class="w-12 h-6 bg-gray-200 rounded-full shadow-inner"></div>
            <div 
              class="absolute left-0 top-0 bg-primary w-6 h-6 rounded-full shadow transform translate-x-6"
            ></div>
          </div>
        </div>
        
        <div class="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 class="font-medium">Analytics Cookies</h3>
            <p class="text-sm text-gray-600">Help us improve our website by collecting anonymous usage data.</p>
          </div>
          <div class="relative">
            <input type="checkbox" id="analytics-cookies" class="sr-only peer">
            <div class="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-6 peer-checked:bg-primary after:content-[''] after:absolute after:top-0 after:left-0 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all"></div>
          </div>
        </div>
        
        <div class="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 class="font-medium">Marketing Cookies</h3>
            <p class="text-sm text-gray-600">Used to deliver relevant advertisements and track marketing campaigns.</p>
          </div>
          <div class="relative">
            <input type="checkbox" id="marketing-cookies" class="sr-only peer">
            <div class="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-6 peer-checked:bg-primary after:content-[''] after:absolute after:top-0 after:left-0 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all"></div>
          </div>
        </div>
      </div>
      
      <div class="mt-6">
        <button class="btn btn-primary">Save Preferences</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'Privacy',
  components: {
    ChevronDownIcon
  },
  setup() {
    const privacyFaqs = ref([
      {
        question: "How do you protect my personal health information?",
        answer: "We comply with all applicable healthcare privacy laws, including HIPAA. We use industry-standard security measures, encryption, access controls, and regular security assessments to protect your personal health information.",
        isOpen: false
      },
      {
        question: "Do you share my information with third parties?",
        answer: "We only share your information with third parties as described in our Privacy Policy. This includes healthcare providers involved in your care, service providers that help us operate our business, and when required by law.",
        isOpen: false
      },
      {
        question: "How long do you keep my data?",
        answer: "We retain your personal information for as long as necessary to provide you with our services, comply with legal obligations, resolve disputes, and enforce our policies. For prescription records, we maintain them in accordance with pharmacy regulations, typically for 7-10 years depending on the jurisdiction.",
        isOpen: false
      },
      {
        question: "Can I request to delete my data?",
        answer: "Yes, you can request deletion of your personal data, subject to certain limitations. We may need to retain some information for legal, regulatory, or business purposes. To request deletion, please contact our privacy team at privacy@sandbad.com.",
        isOpen: false
      },
      {
        question: "How do I update my personal information?",
        answer: "You can update your personal information by logging into your account and editing your profile, contacting our customer service team, or visiting one of our physical locations with proper identification.",
        isOpen: false
      }
    ])

    return {
      privacyFaqs
    }
  }
}
</script>

<style>
.prose {
  @apply text-gray-800;
}

.prose h2 {
  @apply text-2xl font-bold mt-8 mb-4;
}

.prose h3 {
  @apply text-xl font-semibold mt-6 mb-3;
}

.prose p {
  @apply mb-4;
}

.prose ul {
  @apply mb-4 pl-6 list-disc;
}

.prose li {
  @apply mb-2;
}
</style>