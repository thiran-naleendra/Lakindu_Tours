<template>
  <div class="public-page-pattern min-h-screen">
    <!-- Hero Section -->
    <div class="@container">
      <div class="flex flex-col gap-6 bg-cover bg-center bg-no-repeat items-center justify-center pt-32 pb-8 px-8 md:p-16 lg:p-24"
        style='background-image: linear-gradient(rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.7) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCvDwvdrG_ssf8LQh9V7i2Bz4G2VqoBTq4V-Kz0bVNyIOVVq3snyk6RDbcSmmUESe9DzktblVgyWyNlBI0SH6rsfgGYKqCTt9JSfFjbE_8OuzwIFS01JwZqV9VnBqW8m5DU-0CcCLpJY5BYmpJnK7rQ4gvSj7yFouGdE_PMkKc4B5f0iaCZhUD2JTEiPVdquwuTTYq8JRk0zkCIyi7KNAUd-yZNrSAzmq5eSjOYM_x74Txcs2vn8EKAO8eM9hsT0Ze5ttPTX2xUGeM");'>
        <div class="flex flex-col gap-2 text-center max-w-[800px]">
          <h1 class="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
            Our Premium Fleet
          </h1>
          <h2 class="text-gray-200 text-sm md:text-lg font-normal leading-normal">
            Explore Sri Lanka in comfort and style. From compact sedans for city hops to luxury vans for family adventures.
          </h2>
        </div>
        <!-- Quick Search Bar -->
        <label class="flex flex-col min-w-40 h-14 w-full max-w-[480px] mt-4">
          <div class="flex w-full flex-1 items-stretch rounded-lg h-full shadow-lg">
            <div
              class="text-[#617589] flex border border-r-0 border-[#dbe0e6] bg-white items-center justify-center pl-[15px] rounded-l-lg">
              <span class="material-symbols-outlined">search</span>
            </div>
            <input v-model="searchQuery"
              class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-none text-[#111418] focus:outline-0 focus:ring-0 border-y border-[#dbe0e6] bg-white h-full placeholder:text-[#617589] px-2 text-sm font-normal leading-normal"
              placeholder="Search by model name..." />
            <div
              class="flex items-center justify-center rounded-r-lg border-l-0 border border-[#dbe0e6] bg-white pr-[7px]">
              <button
                class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal hover:bg-primary/90 transition-colors">
                <span class="truncate">Search</span>
              </button>
            </div>
          </div>
        </label>
      </div>
    </div>

    <!-- Main Content Layout -->
    <div class="layout-container flex flex-col lg:flex-row max-w-[1440px] mx-auto px-4 md:px-10 py-10 gap-8">
      <!-- Sidebar Filters -->
      <aside class="w-full lg:w-1/4 flex flex-col gap-6">
        <div class="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-sm sticky top-24">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-[#111418] text-lg font-bold">Filters</h3>
            <button @click="resetFilters" class="text-primary text-sm font-medium hover:underline">Reset All</button>
          </div>
          
          <!-- Vehicle Type Filter -->
          <div class="flex flex-col gap-3 border-b border-[#f0f2f4] pb-6 mb-6">
            <p class="text-[#111418] text-base font-bold">Vehicle Type</p>
            <div class="flex flex-col gap-2">
              <label v-for="type in vehicleTypes" :key="type.name" class="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" :value="type.name" v-model="selectedTypes"
                  class="h-5 w-5 rounded border-[#dbe0e6] border-2 bg-transparent text-primary focus:ring-0 focus:ring-offset-0 focus:border-[#dbe0e6] focus:outline-none transition-all" />
                <span class="text-[#111418] text-sm font-medium group-hover:text-primary transition-colors">{{ type.name }}</span>
                <span class="ml-auto text-xs text-gray-400">{{ type.count }}</span>
              </label>
            </div>
          </div>

          <!-- Passenger Capacity -->
          <div class="flex flex-col gap-3">
            <p class="text-[#111418] text-base font-bold">Capacity</p>
            <div class="flex flex-wrap gap-2">
              <label v-for="cap in capacityOptions" :key="cap.value" class="cursor-pointer">
                <input type="radio" :value="cap.value" v-model="selectedCapacity" class="peer sr-only" name="capacity" />
                <div class="px-3 py-1.5 rounded-full border border-[#dbe0e6] bg-white text-xs font-medium text-gray-600 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-all">
                  {{ cap.label }}
                </div>
              </label>
            </div>
          </div>
        </div>
      </aside>

      <!-- Vehicle Grid -->
      <main class="w-full lg:w-3/4 flex flex-col gap-8">
        <div class="flex items-center justify-between">
          <p class="text-[#111418] text-sm font-medium">Showing <span class="font-bold">{{ filteredVehicles.length }}</span> vehicles</p>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">Sort by:</span>
            <select v-model="sortBy" class="form-select bg-transparent border-none py-0 pl-0 pr-8 text-sm font-bold text-[#111418] focus:ring-0 cursor-pointer">
              <option value="recommended">Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div v-for="car in filteredVehicles" :key="car.id"
            class="group flex flex-col bg-white rounded-xl border border-[#e5e7eb] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div class="h-48 overflow-hidden relative bg-white">
              <img :src="car.image" :alt="car.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-[#111418]">
                {{ car.type }}
              </div>
            </div>
            
            <div class="p-4 flex flex-col flex-1 gap-3">
              <div>
                <h3 class="text-lg font-bold text-[#111418]">{{ car.name }}</h3>
                <p class="text-xs text-gray-500">{{ car.subtitle }}</p>
              </div>
              
              <div class="flex items-center justify-between py-2 border-y border-dashed border-gray-200">
                <div class="flex flex-col items-center gap-1">
                  <span class="material-symbols-outlined text-gray-400 text-[20px]">airline_seat_recline_normal</span>
                  <span class="text-xs font-medium text-gray-600">{{ car.seats }} Seats</span>
                </div>
                <div class="flex flex-col items-center gap-1">
                  <span class="material-symbols-outlined text-gray-400 text-[20px]">luggage</span>
                  <span class="text-xs font-medium text-gray-600">{{ car.luggage }} Bags</span>
                </div>
                <div class="flex flex-col items-center gap-1">
                  <span class="material-symbols-outlined text-gray-400 text-[20px]">ac_unit</span>
                  <span class="text-xs font-medium text-gray-600">A/C</span>
                </div>
                <div class="flex flex-col items-center gap-1">
                  <span class="material-symbols-outlined text-gray-400 text-[20px]">{{ car.fuelIcon || 'local_gas_station' }}</span>
                  <span class="text-xs font-medium text-gray-600">{{ car.fuelType }}</span>
                </div>
              </div>
              
              <div class="mt-auto pt-2 flex items-center justify-between">
                <div>
                   <p v-if="car.oldPrice" class="text-xs text-gray-500 line-through">${{ car.oldPrice }}</p>
                  <p class="text-xl font-bold text-primary">${{ car.price }}<span class="text-sm font-normal text-gray-500">/day</span></p>
                </div>
                <router-link :to="{ path: '/fleet-booking', query: { vehicle: car.id }}" class="px-4 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg text-sm font-bold transition-colors">
                  View Details
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- What's Included & Excluded Section -->
    <div class="max-w-[1440px] mx-auto px-4 md:px-10 py-12">
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <!-- Header with Gradient -->
        <div class="bg-gradient-to-r from-[#388e3c] to-[#d4af37] py-6 px-8 flex items-center justify-center gap-3">
          <span class="text-2xl">🚗</span>
          <h2 class="text-white text-2xl md:text-3xl font-black uppercase tracking-tight">What's Included & Excluded</h2>
        </div>
        
        <div class="p-6 md:p-10 grid md:grid-cols-2 gap-8 md:gap-12">
          <!-- Included in Price -->
          <div class="bg-gray-50 rounded-xl p-6 md:p-8">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <span class="material-symbols-outlined text-green-600 font-bold">check</span>
              </div>
              <h3 class="text-xl font-bold text-green-700">Included in Price</h3>
            </div>
            <ul class="space-y-4">
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-green-600 text-xl font-bold mt-0.5">check</span>
                <span class="text-gray-700 font-medium">Private air-conditioned vehicle</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-green-600 text-xl font-bold mt-0.5">check</span>
                <span class="text-gray-700 font-medium">Professional English-speaking driver</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-green-600 text-xl font-bold mt-0.5">check</span>
                <span class="text-gray-700 font-medium">150 km per day travel limit</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-green-600 text-xl font-bold mt-0.5">check</span>
                <span class="text-gray-700 font-medium">Parking and highway tolls</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-green-600 text-xl font-bold mt-0.5">check</span>
                <span class="text-gray-700 font-medium">No waiting charges</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-green-600 text-xl font-bold mt-0.5">check</span>
                <span class="text-gray-700 font-medium">Government taxes and insurance</span>
              </li>
            </ul>
          </div>

          <!-- Not Included -->
          <div class="bg-gray-50 rounded-xl p-6 md:p-8">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                <span class="material-symbols-outlined text-red-600 font-bold">close</span>
              </div>
              <h3 class="text-xl font-bold text-red-700">Not Included</h3>
            </div>
            <ul class="space-y-4">
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-red-600 text-xl font-bold mt-0.5">close</span>
                <span class="text-gray-700 font-medium">Entrance fees to attractions</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-red-600 text-xl font-bold mt-0.5">close</span>
                <span class="text-gray-700 font-medium">Accommodation & meals for guests</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-red-600 text-xl font-bold mt-0.5">close</span>
                <span class="text-gray-700 font-medium">Tips and personal expenses</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="material-symbols-outlined text-red-600 text-xl font-bold mt-0.5">close</span>
                <span class="text-gray-700 font-medium">Extra km beyond (Car Price/150 ) $ Per km)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Special Seasonal Offer Section -->
    <div class="bg-[#f0f9ff] py-16">
      <div class="max-w-[1440px] mx-auto px-4 md:px-10">
        <div class="flex flex-col lg:flex-row items-center gap-12">
          <!-- Image Gallery / Left Side -->
          <div class="w-full lg:w-1/2">
            <div class="relative rounded-2xl overflow-hidden shadow-2xl group">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvDwvdrG_ssf8LQh9V7i2Bz4G2VqoBTq4V-Kz0bVNyIOVVq3snyk6RDbcSmmUESe9DzktblVgyWyNlBI0SH6rsfgGYKqCTt9JSfFjbE_8OuzwIFS01JwZqV9VnBqW8m5DU-0CcCLpJY5BYmpJnK7rQ4gvSj7yFouGdE_PMkKc4B5f0iaCZhUD2JTEiPVdquwuTTYq8JRk0zkCIyi7KNAUd-yZNrSAzmq5eSjOYM_x74Txcs2vn8EKAO8eM9hsT0Ze5ttPTX2xUGeM" 
                alt="Special Offer" 
                class="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-110" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                <p class="text-white font-medium italic">📸 Click image to enlarge</p>
              </div>
            </div>
          </div>

          <!-- Offer Card / Right Side -->
          <div class="w-full lg:w-1/2">
            <div class="bg-white rounded-2xl p-8 md:p-12 border-2 border-[#22c55e] shadow-2xl relative overflow-hidden text-center flex flex-col items-center gap-6">
              <!-- Decorative background element -->
              <div class="absolute -top-10 -right-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl"></div>
              
              <div class="flex flex-col items-center gap-4">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">💥</span>
                  <h3 class="text-[#22c55e] text-2xl md:text-3xl font-black italic">Special Seasonal Offer!</h3>
                </div>
                
                <div class="flex items-center gap-3 py-4">
                  <span class="text-2xl">🚗</span>
                  <p class="text-[#15803d] text-2xl md:text-3xl font-black">A/C Car — Only <span class="bg-yellow-300 px-2 rounded">$50</span> Per Day</p>
                </div>
                
                <p class="text-gray-600 text-lg md:text-xl font-semibold">
                  Get your <span class="text-[#111418] font-black">Free Quotation</span> today!
                </p>
              </div>

              <a href="https://wa.me/94770000000" target="_blank" 
                class="flex items-center gap-3 px-8 py-4 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-full text-xl font-bold shadow-lg shadow-green-500/30 transition-all hover:scale-105 active:scale-95">
                <span class="material-symbols-outlined">call</span>
                WhatsApp Now
              </a>

              <div class="flex items-center gap-6 pt-4">
                 <a href="#" class="w-12 h-12 bg-[#1877f2] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md">
                    <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                 </a>
                 <a href="#" class="w-12 h-12 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md">
                    <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.981 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.058-1.28.073-1.689.073-4.948 0-3.259-.014-3.668-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                 </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSEO } from '../../composables/useSEO';
import { API_BASE } from '../../services/api';

useSEO({
    title: ref('Our Premium Fleet'),
    description: ref('Explore Sri Lanka in comfort and style. Rent luxury cars, vans, and SUVs with expert drivers.')
});

const searchQuery = ref('');
const selectedTypes = ref([]);
const selectedCapacity = ref('any');
const sortBy = ref('recommended');

const vehicleTypes = ref([
  { name: 'Sedan', count: 0 },
  { name: 'SUV / 4x4', count: 0 },
  { name: 'Van', count: 0 },
  { name: 'Luxury', count: 0 },
]);

const capacityOptions = [
  { label: 'Any', value: 'any' },
  { label: '2-4', value: '2-4' },
  { label: '5-7', value: '5-7' },
  { label: '8+', value: '8+' },
];

const vehicles = ref([]);
const loading = ref(true);

const fetchFleet = async () => {
    loading.value = true;

    try {
        const response = await fetch(`${API_BASE}/api/fleet`);
        if (!response.ok) throw new Error('Failed to fetch fleet');
        const data = await response.json();
        vehicles.value = data;
        
        // Update counts
        vehicleTypes.value = vehicleTypes.value.map(type => ({
            ...type,
            count: data.filter(v => v.type === type.name).length
        }));
    } catch (error) {
        console.error('Error fetching fleet:', error);
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    fetchFleet();
});

const filteredVehicles = computed(() => {
  let result = vehicles.value;

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(v => v.name.toLowerCase().includes(query) || v.subtitle.toLowerCase().includes(query));
  }

  // Type filter
  if (selectedTypes.value.length > 0) {
    result = result.filter(v => selectedTypes.value.includes(v.type) || (selectedTypes.value.includes('SUV / 4x4') && v.type === 'SUV / 4x4'));
  }

  // Capacity Filter
  if (selectedCapacity.value !== 'any') {
    if (selectedCapacity.value === '2-4') {
        result = result.filter(v => v.seats >= 2 && v.seats <= 4);
    } else if (selectedCapacity.value === '5-7') {
        result = result.filter(v => v.seats >= 5 && v.seats <= 7);
    } else if (selectedCapacity.value === '8+') {
        result = result.filter(v => v.seats >= 8);
    }
  }

  // Sort
  if (sortBy.value === 'price_asc') {
    result = result.sort((a, b) => a.price - b.price);
  } else if (sortBy.value === 'price_desc') {
    result = result.sort((a, b) => b.price - a.price);
  }

  return result;
});

const resetFilters = () => {
    selectedTypes.value = [];
    selectedCapacity.value = 'any';
    searchQuery.value = '';
    sortBy.value = 'recommended';
};
</script>
