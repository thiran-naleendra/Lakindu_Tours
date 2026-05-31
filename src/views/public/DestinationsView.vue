<template>
  <div class="bg-background-light min-h-screen pt-32 md:pt-24 pb-20 public-page-pattern">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Explore Sri Lanka</h1>
        <p class="text-lg text-slate-600 max-w-2xl mx-auto">
          From ancient cities to pristine beaches, discover the diverse landscapes of our island paradise.
        </p>
      </div>

      <!-- Destinations Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <router-link v-for="dest in destinations" :key="dest.id" :to="`/destinations/${dest.id}`"
          class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
          <div class="relative h-64 overflow-hidden">
             <div class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              :style="`background-image: url('${dest.image}');`">
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div class="p-6">
            <h2 class="text-2xl font-bold text-slate-900 mb-2">{{ dest.name }}</h2>
            <p class="text-slate-600 mb-4 line-clamp-3">{{ dest.description }}</p>
            <div class="flex items-center justify-between mt-auto">
                <span class="text-sm font-medium text-slate-500">{{ dest.toursCount }} Tours Available</span>
                <button class="text-primary font-bold hover:text-primary-dark transition-colors flex items-center gap-1">
                    Explore <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSEO } from '../../composables/useSEO';
import { API_BASE } from '../../services/api';

useSEO({
  title: ref('Destinations'),
  description: ref('Explore popular destinations in Sri Lanka. From ancient cities to pristine beaches, discover the diverse landscapes of our island paradise.')
});

const destinations = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {

    const response = await fetch(`${API_BASE}/api/destinations`);
    if (!response.ok) throw new Error('Failed to fetch destinations');
    destinations.value = await response.json();
  } catch (error) {
    console.error('Error loading destinations:', error);
    // Fallback or empty state
    destinations.value = [];
  } finally {
    loading.value = false;
  }
});
</script>
