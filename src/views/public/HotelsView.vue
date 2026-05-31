<template>
  <div class="min-h-screen pt-32 pb-20 bg-background-light public-page-pattern">
    <!-- Hero Section -->
    <section class="relative py-12 md:py-20 overflow-hidden bg-slate-900">
      <div class="absolute inset-0 opacity-40">
        <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" alt="Hotels Background" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900"></div>
      </div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h1 class="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Our Partner <span class="text-primary">Hotels</span></h1>
        <p class="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Experience the finest hospitality Sri Lanka has to offer. We've handpicked the best hotels and resorts for your perfect stay.
        </p>
      </div>
    </section>

    <!-- Filters & Search -->
    <section class="py-10 sticky top-20 z-30 bg-background-light/80 backdrop-blur-md border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
          <!-- Search -->
          <div class="relative w-full md:w-96">
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search hotel or location..." 
              class="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-slate-900"
            />
          </div>

          <!-- Quick Filters -->
          <div class="flex flex-wrap gap-3 items-center">
            <button 
              v-for="rating in [5, 4, 3]" 
              :key="rating"
              @click="toggleRatingFilter(rating)"
              :class="[
                'px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border',
                selectedRating === rating 
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-white border-slate-200 text-slate-600 hover:border-primary'
              ]"
            >
              <span class="material-symbols-outlined text-sm leading-none text-yellow-500">star</span>
              {{ rating }} Stars
            </button>
            
            <select 
              v-model="sortBy" 
              class="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="recommended">Recommended</option>
              <option value="rating-high">Highest Rated</option>
              <option value="reviews-most">Most Reviewed</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- Hotels Grid -->
    <section class="py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="loading" class="flex flex-col items-center justify-center py-20">
          <div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p class="mt-4 text-slate-500 font-bold">Discovering beautiful stays...</p>
        </div>

        <div v-else-if="filteredHotels.length === 0" class="text-center py-20">
          <div class="mb-6">
            <span class="material-symbols-outlined text-6xl text-slate-300">hotel_class</span>
          </div>
          <h3 class="text-2xl font-bold text-slate-900 mb-2">No hotels found</h3>
          <p class="text-slate-500">Try adjusting your filters or search keywords.</p>
          <button @click="resetFilters" class="mt-6 text-primary font-bold hover:underline">Clear all filters</button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="hotel in filteredHotels" 
            :key="hotel.id" 
            class="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col"
          >
            <!-- Image Area -->
            <div class="relative h-64 overflow-hidden">
              <img 
                :src="hotel.image || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'" 
                :alt="hotel.name" 
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div v-if="hotel.tag" class="absolute top-4 left-4 bg-primary/95 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-sm shadow-xl">
                {{ hotel.tag }}
              </div>
              
              <div class="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div class="bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg flex items-center gap-1.5 border border-white/20">
                  <span class="material-symbols-outlined text-yellow-500 text-sm">star</span>
                  <span class="text-white text-sm font-bold">{{ hotel.rating }}</span>
                  <span class="text-white/60 text-xs">({{ hotel.reviews }} reviews)</span>
                </div>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6 flex-1 flex flex-col">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-xl font-black text-slate-900 leading-tight group-hover:text-primary transition-colors">
                  {{ hotel.name }}
                </h3>
              </div>
              
              <div class="flex items-center gap-1 text-slate-500 text-sm mb-4">
                <span class="material-symbols-outlined text-[18px]">location_on</span>
                {{ hotel.location }}
              </div>

              <p class="text-slate-600 text-sm line-clamp-2 mb-6 leading-relaxed flex-1">
                {{ hotel.description }}
              </p>

              <!-- Amenities -->
              <div class="flex flex-wrap gap-2 mb-8">
                <span 
                  v-for="(amenity, idx) in (hotel.amenities || []).slice(0, 3)" 
                  :key="idx"
                  class="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider rounded-lg"
                >
                  {{ amenity }}
                </span>
                <span v-if="(hotel.amenities || []).length > 3" class="text-xs text-slate-400 self-center">
                  +{{ hotel.amenities.length - 3 }} more
                </span>
              </div>

              <!-- Action Area -->
              <div class="flex items-center gap-3 pt-6 border-t border-slate-100">
                <a 
                  v-if="hotel.website" 
                  :href="hotel.website" 
                  target="_blank"
                  class="flex-1 text-center py-3 bg-slate-900 hover:bg-black text-white rounded-2xl text-sm font-bold transition-all"
                >
                  Visit Website
                </a>
                <router-link 
                  :to="{ path: '/contact', query: { subject: 'Hotel Booking: ' + hotel.name }}"
                  class="flex-1 text-center py-3 bg-primary hover:bg-primary-dark text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40"
                >
                  Inquire Now
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Section -->
    <section class="py-20 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 text-primary">
              <span class="material-symbols-outlined text-3xl">verified_user</span>
            </div>
            <h4 class="text-lg font-black text-slate-900 mb-3">Vetted Properties</h4>
            <p class="text-slate-500 text-sm leading-relaxed">Every partner hotel is personally visited and verified by our team to ensure it meets our quality standards.</p>
          </div>
          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 text-primary">
              <span class="material-symbols-outlined text-3xl">sell</span>
            </div>
            <h4 class="text-lg font-black text-slate-900 mb-3">Best Rate Guarantee</h4>
            <p class="text-slate-500 text-sm leading-relaxed">Book through us and enjoy exclusive rates and benefits you won't find on other booking platforms.</p>
          </div>
          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 text-primary">
              <span class="material-symbols-outlined text-3xl">support_agent</span>
            </div>
            <h4 class="text-lg font-black text-slate-900 mb-3">24/7 Concierge</h4>
            <p class="text-slate-500 text-sm leading-relaxed">Our team is always available to handle your requests, from room upgrades to special dining arrangements.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSEO } from '../../composables/useSEO';
import { API_BASE } from '../../services/api';

useSEO({
    title: ref('Partner Hotels'),
    description: ref('Experience the finest hospitality Sri Lanka has to offer. Handpicked hotels and resorts for your perfect stay.')
});

const hotels = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const selectedRating = ref(null);
const sortBy = ref('recommended');

const fetchHotels = async () => {
    loading.value = true;

    try {
        const response = await fetch(`${API_BASE}/api/hotels`);
        if (!response.ok) throw new Error('Failed to fetch hotels');
        const data = await response.json();
        hotels.value = data;
    } catch (error) {
        console.error('Error fetching hotels:', error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchHotels();
});

const toggleRatingFilter = (rating) => {
    if (selectedRating.value === rating) {
        selectedRating.value = null;
    } else {
        selectedRating.value = rating;
    }
};

const resetFilters = () => {
    searchQuery.value = '';
    selectedRating.value = null;
    sortBy.value = 'recommended';
};

const filteredHotels = computed(() => {
    let result = [...hotels.value];

    // Search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(h => 
            h.name.toLowerCase().includes(query) || 
            h.location.toLowerCase().includes(query)
        );
    }

    // Rating filter
    if (selectedRating.value) {
        result = result.filter(h => Math.floor(h.rating) === selectedRating.value);
    }

    // Sorting
    if (sortBy.value === 'rating-high') {
        result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy.value === 'reviews-most') {
        result.sort((a, b) => b.reviews - a.reviews);
    }

    return result;
});
</script>

<style scoped>
.font-black {
  font-weight: 900;
}
</style>
