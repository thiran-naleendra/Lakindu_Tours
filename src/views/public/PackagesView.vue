<template>
  <div class="public-page-pattern min-h-screen flex flex-col">
    <!-- Hero Section -->
    <div class="w-full">
      <div class="relative w-full min-h-[480px] flex flex-col items-center justify-center text-center pt-32 pb-8 px-8 md:p-8 gap-6 bg-cover bg-center"
        style="background-image: linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuAwnj8QNdE3dHYb3Tem6685yqEmilcSZV7JcBjGbERdwk5d0tpCQnpfFheJXa9zsuLbXu8TWQxvGdfX_PNJK4eXMYLOHWDojA-VBqea3Egx1jDIiLuB1RJIfHxukd-ka75EfYKv1wAKXNp4VHmDEoe1XpzJZbBkHQWaZ8p9GZJUmm2vdmxkkpqmkX61nTe9Yum4Pw9nrlRLurZx-Gv7sh8DKEWMQyGo2pgox4fZcFB8Fm6kgUSp8Qk_ermMxvTJdOfiW65WoTz_gFQ');">
        <div class="flex flex-col gap-3 max-w-[800px]">
          <h1 class="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight drop-shadow-md">
            Experience the Pearl of the Indian Ocean
          </h1>
          <h2 class="text-white/90 text-lg md:text-xl font-medium leading-normal drop-shadow-sm">
            Curated journeys designed to show you the real Sri Lanka. From misty mountains to pristine beaches.
          </h2>
        </div>
      </div>
    </div>

    <!-- Section Header -->
    <div class="flex justify-center w-full px-4 md:px-10 pt-8 pb-4">
      <div class="w-full max-w-[1280px]">
        <h2 class="text-[#111418] text-3xl font-bold leading-tight tracking-tight">Our Curated Tour Packages</h2>
        <p class="text-[#617589] mt-2 text-base">Select from our most popular itineraries or customize your own journey.</p>
      </div>
    </div>

    <!-- Tour Packages Grid -->
    <div class="flex justify-center w-full px-4 md:px-10 pb-12 flex-1">
      <div class="w-full max-w-[1280px]">
        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div v-for="n in 3" :key="n" class="animate-pulse flex flex-col rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden h-[450px]">
                <div class="h-56 bg-slate-200 w-full"></div>
                <div class="p-5 flex flex-col gap-4">
                    <div class="h-6 bg-slate-200 w-3/4 rounded"></div>
                    <div class="h-4 bg-slate-200 w-1/2 rounded"></div>
                    <div class="h-16 bg-slate-200 w-full rounded"></div>
                </div>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12 text-red-500">
            <p>{{ error }}</p>
            <button @click="fetchTours" class="mt-4 text-primary hover:underline">Try Again</button>
        </div>

        <!-- Empty State -->
        <div v-else-if="tours.length === 0" class="text-center py-12 text-gray-500">
            <p>No tours available at the moment.</p>
        </div>

        <!-- Tours Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <div v-for="tour in tours" :key="tour.id"
            class="group flex flex-col rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
            
            <div class="h-56 w-full bg-cover bg-center relative group-hover:scale-105 transition-transform duration-500"
              :style="{ backgroundImage: `url('${tour.image || defaultImage}')` }">
              <div v-if="tour.isBestSeller" class="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded text-xs font-bold text-primary uppercase tracking-wider backdrop-blur-sm">
                Best Seller
              </div>
            </div>

            <div class="p-5 flex flex-col gap-4 flex-1">
                <h3 class="text-xl font-bold text-[#111418] group-hover:text-primary transition-colors">
                  {{ tour.title }}
                </h3>
              </div>
              
              <div class="p-5 pt-0 flex flex-col gap-4">
                <div class="flex items-center gap-4 text-sm text-[#617589] border-b border-gray-100 pb-3">
                  <span class="flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-lg">calendar_month</span>
                    {{ tour.duration || 'Flexible' }}
                  </span>
                </div>
                
                <p class="text-[#617589] text-sm leading-relaxed line-clamp-2">
                  {{ tour.brief || '' }}
                </p>
                
                <div class="mt-auto pt-2 flex items-center justify-between">
                  <div class="flex flex-col">
                    <span class="text-xs text-[#617589]">Starting from</span>
                    <span class="text-lg font-bold text-[#111418]">{{ tour.price }} <span class="text-sm font-normal text-gray-500">/ pp</span></span>
                  </div>
                  <router-link :to="{ name: 'tour-detail-public', params: { id: tour.id }}"
                    class="rounded-lg bg-primary/10 text-primary px-4 py-2 text-sm font-bold hover:bg-primary hover:text-white transition-all">
                    View Details
                  </router-link>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="flex justify-center w-full px-4 md:px-10 py-12 bg-white mt-auto">
      <div class="w-full max-w-[1280px]">
        <div class="flex flex-col gap-10">
          <div class="flex flex-col gap-4 max-w-[720px]">
            <h2 class="text-[#111418] tracking-light text-3xl font-bold leading-tight">
              Why Travel With Us?
            </h2>
            <p class="text-[#617589] text-base font-normal">We offer more than just a ride; we offer an experience tailored to your needs.</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="flex flex-1 gap-4 rounded-xl border border-[#dbe0e6] bg-white p-6 flex-col shadow-sm hover:shadow-md transition-shadow">
              <div class="text-primary">
                <span class="material-symbols-outlined text-[32px]">directions_car</span>
              </div>
              <div class="flex flex-col gap-1">
                <h3 class="text-[#111418] text-lg font-bold leading-tight">Private Chauffeurs</h3>
                <p class="text-[#617589] text-sm font-normal leading-normal">Expert local drivers who know every corner of the island and prioritize your safety.</p>
              </div>
            </div>
            <div class="flex flex-1 gap-4 rounded-xl border border-[#dbe0e6] bg-white p-6 flex-col shadow-sm hover:shadow-md transition-shadow">
              <div class="text-primary">
                <span class="material-symbols-outlined text-[32px]">support_agent</span>
              </div>
              <div class="flex flex-col gap-1">
                <h3 class="text-[#111418] text-lg font-bold leading-tight">24/7 Support</h3>
                <p class="text-[#617589] text-sm font-normal leading-normal">Always available to assist you throughout your journey, from landing to departure.</p>
              </div>
            </div>
            <div class="flex flex-1 gap-4 rounded-xl border border-[#dbe0e6] bg-white p-6 flex-col shadow-sm hover:shadow-md transition-shadow">
              <div class="text-primary">
                <span class="material-symbols-outlined text-[32px]">diamond</span>
              </div>
              <div class="flex flex-col gap-1">
                <h3 class="text-[#111418] text-lg font-bold leading-tight">Luxury Fleet</h3>
                <p class="text-[#617589] text-sm font-normal leading-normal">Travel in comfort with our modern range of sedans, SUVs, and luxury vans.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const tours = ref([]);
const loading = ref(true);
const error = ref(null);
const defaultImage = 'https://placehold.co/600x400';

import { useSEO } from '../../composables/useSEO';
import { API_BASE } from '../../services/api';

useSEO({
    title: ref('Tour Packages'),
    description: ref('Select from our most popular itineraries or customize your own journey. Experience the Pearl of the Indian Ocean with Lakdinu Tours.')
});

const fetchTours = async () => {
  loading.value = true;
  error.value = null;


  try {
    const response = await fetch(`${API_BASE}/api/tours`);
    if (!response.ok) {
        throw new Error('Failed to fetch tours');
    }
    const fetchedTours = await response.json();
    
    // Sort by duration (shortest to longest)
    tours.value = fetchedTours.sort((a, b) => {
        const duraA = parseInt(a.duration) || 0;
        const duraB = parseInt(b.duration) || 0;
        return duraA - duraB;
    });
  } catch (err) {
    console.error("Error fetching tours:", err);
    error.value = "Failed to load tours. Please try again later.";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchTours();
});
</script>
