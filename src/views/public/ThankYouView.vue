<template>
  <div class="bg-background-light min-h-screen flex items-center justify-center p-4 public-page-pattern">
    <div class="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-100">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 animate-bounce">
            <span class="material-symbols-outlined text-5xl">check_circle</span>
        </div>
        <h1 class="text-3xl font-bold text-[#111418] mb-3">Booking Received!</h1>
        <p class="text-gray-500 mb-8 leading-relaxed">
            Thank you for booking with us. We have received your request and will contact you shortly to confirm availability.
        </p>
        <router-link to="/" class="block w-full bg-primary hover:bg-blue-600 text-white font-bold py-3.5 rounded-lg transition-all shadow-md hover:shadow-lg">
            Back to Home
        </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSEO } from '../../composables/useSEO';

useSEO({
    title: ref('Booking Received'),
    description: ref('Thank you for your booking request.')
});
</script>
