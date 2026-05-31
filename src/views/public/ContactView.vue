<template>
  <div class="bg-background-light public-page-pattern">
    <!-- Hero Section -->
    <div class="relative">
      <div class="flex min-h-[320px] md:min-h-[400px] flex-col gap-6 bg-cover bg-center bg-no-repeat items-center justify-center pt-32 pb-4 px-4 md:p-16 relative"
        style="background-image: linear-gradient(rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBHO6EMwY3ZGJcWoMRtuviXXTLQ1YbYnYCqT2on8MrN-JJwd4vGbt8Qnl8YXsa-xk_xXdOi6vyC8aRXVwHX5d10DcuKwv0j6QK4pLeMwQvE3Ek0oxXsxeRYJFaY2wrnYDtQ1S7qTGJQeNDDUOjDxD6hxOI0_3IqfNDN8DkY3Dn0R7GOpToQv_Ak-toVo-VjtpJ9NO97zoetgmzubg3q0SYLQW8AYjf_tb1I_A6KAM9vtHESp3AIwQv3DtmHpIiMd4m5571XEHkOSEU');">
        <div class="flex flex-col gap-2 text-center max-w-[720px] relative z-10">
          <h1 class="text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl lg:text-6xl">
            Get in Touch
          </h1>
          <h2 class="text-white/90 text-sm font-medium leading-normal md:text-lg">
            Plan your dream Sri Lankan adventure with us today. We are here to help you create unforgettable memories.
          </h2>
        </div>
      </div>
    </div>

    <!-- Main Content Container -->
    <div class="layout-container flex grow flex-col py-10 md:py-16 px-4 md:px-10 lg:px-40">
      <div class="layout-content-container mx-auto w-full max-w-[1200px] flex-1">
        <!-- Split Layout: Form & Info -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <!-- Left Column: Contact Form -->
          <div class="lg:col-span-7 flex flex-col gap-8">
            <div>
              <h3 class="text-[#111418] text-2xl md:text-3xl font-bold leading-tight tracking-[-0.015em] mb-2">
                Send us a Message
              </h3>
              <p class="text-slate-500 text-base">Fill out the form below and our team will get back to you within 24 hours.</p>
            </div>
            <form @submit.prevent="submitForm" class="flex flex-col gap-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label class="flex flex-col gap-2">
                  <span class="text-[#111418] text-sm font-semibold leading-normal">Full Name</span>
                  <input v-model="formData.name" required
                    class="form-input flex w-full rounded-lg border border-[#dbe0e6] bg-white focus:border-primary focus:ring-primary h-12 px-4 text-base placeholder:text-[#617589]"
                    placeholder="e.g. John Doe" type="text" />
                </label>
                <label class="flex flex-col gap-2">
                  <span class="text-[#111418] text-sm font-semibold leading-normal">Email Address</span>
                  <input v-model="formData.email" required
                    class="form-input flex w-full rounded-lg border border-[#dbe0e6] bg-white focus:border-primary focus:ring-primary h-12 px-4 text-base placeholder:text-[#617589]"
                    placeholder="e.g. john@example.com" type="email" />
                </label>
              </div>
              <label class="flex flex-col gap-2">
                <span class="text-[#111418] text-sm font-semibold leading-normal">Subject</span>
                <div class="relative">
                  <select v-model="formData.subject"
                    class="form-select flex w-full rounded-lg border border-[#dbe0e6] bg-white focus:border-primary focus:ring-primary h-12 px-4 text-base text-[#111418] appearance-none pr-10">
                    <option disabled value="">Select a topic</option>
                    <option>Tour Packages</option>
                    <option>Fleet Rental</option>
                    <option>General Inquiry</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <span class="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
              </label>
              <label class="flex flex-col gap-2">
                <span class="text-[#111418] text-sm font-semibold leading-normal">Message</span>
                <textarea v-model="formData.message" required
                  class="form-textarea flex w-full resize-none rounded-lg border border-[#dbe0e6] bg-white focus:border-primary focus:ring-primary min-h-[140px] p-4 text-base placeholder:text-[#617589]"
                  placeholder="Tell us about your travel plans..."></textarea>
              </label>
              <button
                :disabled="isSubmitting"
                class="mt-2 flex w-full md:w-auto items-center justify-center rounded-lg bg-primary px-8 py-3 text-base font-bold text-white shadow-sm hover:bg-primary/90 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70 disabled:cursor-not-allowed"
                type="submit">
                {{ isSubmitting ? 'Sending...' : 'Send Message' }}
              </button>
            </form>
          </div>

          <!-- Right Column: Contact Info -->
          <div class="lg:col-span-5 flex flex-col gap-10 lg:pl-8 lg:border-l border-slate-200">
            <div>
              <h3 class="text-[#111418] text-2xl font-bold leading-tight tracking-[-0.015em] mb-6">
                Contact Information
              </h3>
              <div class="flex flex-col gap-8">
                <!-- Address -->
                <div class="flex gap-4 items-start">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span class="material-symbols-outlined">location_on</span>
                  </div>
                  <div class="flex flex-col">
                    <h4 class="text-base font-bold text-[#111418]">Our Office</h4>
                    <p class="text-slate-500 mt-1 leading-relaxed">
                      No 01, Ranasingha Gama,<br />
                      Nikapotha, Haputale, Sri Lanka
                    </p>
                  </div>
                </div>
                <!-- Phone -->
                <div class="flex gap-4 items-start">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span class="material-symbols-outlined">call</span>
                  </div>
                  <div class="flex flex-col">
                    <h4 class="text-base font-bold text-[#111418]">Phone</h4>
                    <a class="text-slate-500 mt-1 hover:text-primary transition-colors"
                      href="tel:+94705578878">+94 70 557 8878</a>
                  </div>
                </div>
                <!-- Email -->
                <div class="flex gap-4 items-start">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span class="material-symbols-outlined">mail</span>
                  </div>
                  <div class="flex flex-col">
                    <h4 class="text-base font-bold text-[#111418]">Email</h4>
                    <a class="text-slate-500 mt-1 hover:text-primary transition-colors"
                      href="mailto:info@srilankacardriver.com">info@srilankacardriver.com</a>
                  </div>
                </div>
              </div>
            </div>
            <!-- Social Media -->
            <div>
              <h4 class="text-sm font-bold uppercase tracking-wider text-[#111418] mb-4">Follow Us</h4>
              <div class="flex gap-3">
                <a class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-primary hover:text-white transition-all"
                  href="#">
                  <!-- Facebook SVG -->
                  <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                  </svg>
                </a>
                <a class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-primary hover:text-white transition-all"
                  href="#">
                  <!-- Instagram SVG -->
                  <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Map Section -->
        <div class="mt-16 md:mt-24">
             <div class="overflow-hidden rounded-2xl border border-[#dbe0e6] bg-slate-50 shadow-sm">
                <div class="relative w-full h-[400px] bg-cover bg-center" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBDXY792fV9XC6CfUY3t5hZdyP3AiWFTnrZ0nh0OACN-wsmA-xtxYT6OAuxpoHcdV6wLIIsIJBaUaWAzoVt219LjE1MfUW_oDvIZ1gODLjPwV1tkB9QV1IZEoFkk9CmlNebsJoB41s75wkdPDK-XNgE8DhM8SiJWbG8reWswd8B5hb2SrYn5_TP7ua1IYamXgueax0-0tQ-KPPXJA9lA0gS-l8nUrqIvaRtdn877dkWA0uHfuqLPpp5EZ0Z5dGOKdNZEqoZ7ivvC8k');">
                     <div class="absolute inset-0 bg-slate-200/50 backdrop-blur-[1px] flex items-center justify-center">
                        <div class="bg-white p-4 rounded-xl shadow-lg text-center max-w-sm mx-4">
                            <div class="text-primary mb-2">
                                <span class="material-symbols-outlined text-4xl">location_on</span>
                            </div>
                            <h3 class="font-bold text-lg">Visit Our Headquarters</h3>
                            <p class="text-slate-500 text-sm mt-1 mb-4">Click to open in Google Maps</p>
                            <button class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold w-full cursor-pointer">Open Map</button>
                        </div>
                     </div>
                     <!-- Map Iframe placeholder -->
                     <iframe allowfullscreen="" class="absolute inset-0 w-full h-full border-0 opacity-0 hover:opacity-100 transition-opacity duration-300" loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63371.8039217646!2d79.82118602685764!3d6.921838637775586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1715424000000!5m2!1sen!2sus"
                        title="Google Map of Colombo">
                    </iframe>
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSEO } from '../../composables/useSEO';
import { API_BASE } from '../../services/api';

useSEO({
    title: ref('Contact Us'),
    description: ref('Get in touch with Lakdinu Tours to plan your dream Sri Lankan adventure. We are here to help you create unforgettable memories.')
});

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const isSubmitting = ref(false);

const submitForm = async () => {


    try {
        isSubmitting.value = true;
        const response = await fetch(`${API_BASE}/api/inquiries`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData.value)
        });

        if (response.ok) {
            alert("Thank you! Your inquiry has been sent. We will contact you shortly.");
            formData.value = { name: '', email: '', subject: '', message: '' }; // Reset form
        } else {
            alert("Error sending inquiry. Please try again.");
        }
    } catch (error) {
        console.error(error);
        alert("Network error. Please check your connection.");
    } finally {
        isSubmitting.value = false;
    }
};
</script>
