<template>
  <div class="bg-background-light min-h-screen public-page-pattern">
    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
        <div class="flex flex-col items-center gap-4">
             <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
             <p class="text-gray-500">Loading tour details...</p>
        </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center">
         <div class="text-center text-red-500">
            <span class="material-symbols-outlined text-4xl mb-2">error</span>
            <p class="text-xl">{{ error }}</p>
            <button @click="fetchTourDetails" class="mt-4 px-4 py-2 bg-primary text-white rounded-lg">Try Again</button>
            <router-link to="/packages" class="block mt-4 text-gray-500 hover:underline">Back to Packages</router-link>
        </div>
    </div>

    <div v-else-if="tour">
        <!-- Hero Section -->
        <div class="relative w-full h-[500px] lg:h-[600px] flex flex-col justify-end pb-12 group">
             <!-- Background Image -->
            <div class="absolute inset-0 z-0">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 z-10"></div>
                <img :src="tour.image || defaultImage" :alt="tour.title" class="w-full h-full object-cover object-center" />
            </div>
             <!-- Content Container -->
            <div class="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
                <!-- Breadcrumbs -->
                <nav class="flex mb-6 text-white/80 text-sm font-medium">
                    <router-link to="/" class="hover:text-primary transition-colors">Home</router-link>
                    <span class="mx-2">/</span>
                    <router-link to="/packages" class="hover:text-primary transition-colors">Tours</router-link>
                    <span class="mx-2">/</span>
                    <span class="text-white">{{ tour.title }}</span>
                </nav>
                <div class="max-w-3xl">
                    <div class="flex items-center gap-2 mb-3">
                        <span v-if="tour.isBestSeller" class="bg-primary text-[#111718] text-xs font-bold px-2 py-1 rounded">BEST SELLER</span>
                        <div class="flex items-center text-yellow-400 text-sm">
                            <span class="material-symbols-outlined text-[18px] fill-1">star</span>
                            <span class="text-white ml-1 font-semibold">4.9 (124 Reviews)</span>
                        </div>
                    </div>
                    <h1 class="text-white text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-4 shadow-sm">
                        {{ tour.title }}
                    </h1>
                    <div class="flex flex-wrap gap-4 text-white/90 text-sm md:text-base font-medium">
                        <div class="flex items-center gap-1.5">
                            <span class="material-symbols-outlined">schedule</span>
                            <span>{{ tour.duration }}</span>
                        </div>
                        <div class="w-1.5 h-1.5 rounded-full bg-white/50 my-auto hidden sm:block"></div>
                        <div class="flex items-center gap-1.5">
                            <span class="material-symbols-outlined">location_on</span>
                            <span>Sri Lanka</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Page Layout -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="flex flex-col lg:flex-row gap-12">
                <!-- Left Column -->
                <div class="w-full lg:w-2/3 space-y-12">
                    <!-- Gallery Section -->
                    <section v-if="tour.gallery && tour.gallery.length > 0">
                        <h2 class="text-2xl font-bold text-[#111418] mb-4 flex items-center gap-2">
                             <span class="material-symbols-outlined text-primary">photo_library</span>
                             Tour Gallery
                        </h2>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div v-for="(img, idx) in visibleGallery" :key="idx" 
                                 @click="openLightbox(idx)"
                                 class="rounded-xl overflow-hidden h-48 group cursor-pointer shadow-sm hover:shadow-md transition-all relative">
                                <img :src="img" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Tour Gallery Image">
                                
                                <!-- View All Overlay -->
                                <div v-if="idx === 5 && tour.gallery.length > 6" class="absolute inset-0 bg-black/60 flex items-center justify-center group-hover:bg-black/70 transition-colors z-10">
                                    <div class="text-center">
                                        <span class="material-symbols-outlined text-white text-3xl mb-1">grid_view</span>
                                        <p class="text-white font-bold text-lg">View All</p>
                                        <p class="text-white/80 text-sm">+{{ tour.gallery.length - 6 }} photos</p>
                                    </div>
                                </div>
                                <div v-else class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10"></div>
                            </div>
                        </div>
                    </section>
                    
                    <hr v-if="tour.gallery && tour.gallery.length > 0" class="border-gray-100" />

                     <!-- Overview Section -->
                    <section>
                        <h2 class="text-2xl font-bold text-[#111418] mb-4 flex items-center gap-2">
                             <span class="material-symbols-outlined text-primary">description</span>
                             Tour Overview
                        </h2>
                        <p class="text-[#617589] leading-relaxed text-lg">
                            {{ tour.description }}
                        </p>
                    </section>

                    <hr class="border-gray-100" />

                    <!-- Route Section -->
                    <section v-if="tour.route">
                        <h2 class="text-2xl font-bold text-[#111418] mb-4 flex items-center gap-2">
                             <span class="material-symbols-outlined text-primary">alt_route</span>
                             Tour Route
                        </h2>
                        <div class="bg-primary/5 p-5 rounded-xl border border-primary/10">
                            <p class="text-[#111618] text-lg font-medium leading-relaxed font-mono">
                                {{ tour.route }}
                            </p>
                        </div>
                    </section>

                    <hr class="border-gray-100" />

                    <!-- Itinerary -->
                    <section>
                         <div class="flex items-center justify-between mb-8">
                            <h2 class="text-2xl font-bold text-[#111418] flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary">map</span>
                                Day by Day Itinerary
                            </h2>
                        </div>
                          <div class="space-y-4 md:space-y-6">
                             <!-- Itinerary Loops -->
                             <div v-for="(day, index) in tour.itinerary || defaultItinerary" :key="index" class="relative">
                                  <details class="group bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 open:shadow-lg" :open="index === 0">
                                       <summary class="flex items-center justify-between p-4 md:p-6 cursor-pointer list-none bg-white hover:bg-gray-50">
                                            <div class="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
                                                <span class="bg-primary text-white text-[10px] md:text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wider w-fit shadow-sm shadow-primary/20">
                                                    Day {{ index + 1 }}
                                                </span>
                                                <h3 class="text-base md:text-xl font-black text-[#111418] leading-tight">{{ day.title }}</h3>
                                            </div>
                                            <div class="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 group-open:bg-primary/10 group-open:text-primary transition-colors">
                                                <span class="material-symbols-outlined text-gray-500 group-open:text-primary group-open:rotate-180 transition-transform text-xl">expand_more</span>
                                            </div>
                                       </summary>
                                       <div class="p-4 md:p-6 pt-0 border-t border-gray-100">
                                            <p class="mt-4 text-[#617589] text-sm md:text-base leading-relaxed font-medium">
                                                {{ day.description }}
                                            </p>
                                       </div>
                                  </details>
                             </div>
                         </div>
                    </section>

                    <hr class="border-gray-100" />
                    
                    <!-- What's Included -->
                    <section>
                        <h2 class="text-2xl font-bold text-[#111418] mb-6 flex items-center gap-2">
                             <span class="material-symbols-outlined text-primary">fact_check</span>
                             What's Included
                        </h2>
                        <div class="grid md:grid-cols-2 gap-8">
                             <!-- Inclusions -->
                            <div class="bg-green-50/50 p-6 rounded-2xl border border-green-100">
                                <h3 class="text-lg font-bold text-[#111418] mb-4 flex items-center gap-2">
                                    <span class="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
                                        <span class="material-symbols-outlined text-sm font-bold">check</span>
                                    </span>
                                    Inclusions
                                </h3>
                                <ul class="space-y-3">
                                    <li class="flex items-start gap-3 text-[#617589] text-sm">
                                        <span class="material-symbols-outlined text-green-500 text-xl shrink-0">check_circle</span>
                                        <span>Accommodation in 4-star hotels</span>
                                    </li>
                                     <li class="flex items-start gap-3 text-[#617589] text-sm">
                                        <span class="material-symbols-outlined text-green-500 text-xl shrink-0">check_circle</span>
                                        <span>Daily Breakfast & Dinner</span>
                                    </li>
                                     <li class="flex items-start gap-3 text-[#617589] text-sm">
                                        <span class="material-symbols-outlined text-green-500 text-xl shrink-0">check_circle</span>
                                        <span>Transport in AC Luxury Vehicle</span>
                                    </li>
                                </ul>
                            </div>
                            <!-- Exclusions -->
                             <div class="bg-red-50/50 p-6 rounded-2xl border border-red-100">
                                <h3 class="text-lg font-bold text-[#111418] mb-4 flex items-center gap-2">
                                    <span class="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600">
                                        <span class="material-symbols-outlined text-sm font-bold">close</span>
                                    </span>
                                    Exclusions
                                </h3>
                                <ul class="space-y-3">
                                    <li class="flex items-start gap-3 text-[#617589] text-sm">
                                        <span class="material-symbols-outlined text-red-400 text-xl shrink-0">cancel</span>
                                        <span>International Airfares</span>
                                    </li>
                                     <li class="flex items-start gap-3 text-[#617589] text-sm">
                                        <span class="material-symbols-outlined text-red-400 text-xl shrink-0">cancel</span>
                                        <span>Lunch throughout the tour</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>

                <!-- Right Column -->
                <div class="w-full lg:w-1/3">
                    <div class="sticky top-24">
                        <div class="bg-white rounded-2xl md:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                             <div class="bg-[#111718] p-5 md:p-8 text-white text-center relative overflow-hidden">
                                <div class="absolute inset-0 bg-primary/10 opacity-20 pointer-events-none"></div>
                                <p class="text-[10px] md:text-sm text-gray-400 font-black uppercase tracking-widest mb-1 relative z-10">Starting from</p>
                                <div class="flex items-center justify-center gap-1 relative z-10">
                                    <span class="text-3xl md:text-5xl font-black">{{ tour.price }}</span>
                                    <span class="text-xs md:text-sm text-gray-400 font-medium">/ per person</span>
                                </div>
                             </div>
                             
                             <div class="p-4 md:p-8">
                                 <!-- Booking Form -->
                                 <form class="space-y-4 md:space-y-6" @submit.prevent="handleBooking">
                                     <div class="space-y-4">
                                         <div>
                                             <label class="block text-[10px] md:text-xs font-black text-[#111418] mb-1.5 uppercase tracking-wider">Full Name</label>
                                             <input v-model="bookingData.name" type="text" required placeholder="e.g. John Doe"
                                                class="w-full h-11 px-4 bg-white border border-gray-300 rounded-xl text-base text-[#111418] outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-400" />
                                         </div>
                                         <div>
                                             <label class="block text-[10px] md:text-xs font-black text-[#111418] mb-1.5 uppercase tracking-wider">Email Address</label>
                                             <input v-model="bookingData.email" type="email" required placeholder="e.g. john@example.com"
                                                class="w-full h-11 px-4 bg-white border border-gray-300 rounded-xl text-base text-[#111418] outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-400" />
                                         </div>
                                         <div>
                                             <label class="block text-[10px] md:text-xs font-black text-[#111418] mb-1.5 uppercase tracking-wider">WhatsApp / Phone</label>
                                             <input v-model="bookingData.whatsapp" type="tel" required placeholder="e.g. +94 70 557 8878"
                                                class="w-full h-11 px-4 bg-white border border-gray-300 rounded-xl text-base text-[#111418] outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-400" />
                                         </div>
                                     </div>

                                     <div class="grid grid-cols-2 gap-4">
                                         <div>
                                             <label class="block text-[10px] md:text-xs font-black text-[#111418] mb-1.5 uppercase tracking-wider">Start Date</label>
                                             <input v-model="bookingData.startDate" type="date" required 
                                                class="w-full h-11 px-3 bg-white border border-gray-300 rounded-xl text-base text-[#111418] outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                                         </div>
                                         <div>
                                             <label class="block text-[10px] md:text-xs font-black text-[#111418] mb-1.5 uppercase tracking-wider">Days</label>
                                             <input v-model="bookingData.duration" type="number" min="1" required 
                                                class="w-full h-11 px-4 bg-white border border-gray-300 rounded-xl text-base text-[#111418] outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                                         </div>
                                     </div>

                                     <div class="grid grid-cols-2 gap-4">
                                          <div>
                                             <label class="block text-[10px] md:text-xs font-black text-[#111418] mb-1.5 uppercase tracking-wider">Adults</label>
                                             <input v-model="bookingData.adults" type="number" min="1" required placeholder="2"
                                                class="w-full h-11 px-4 bg-white border border-gray-300 rounded-xl text-base text-[#111418] outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                                         </div>
                                         <div>
                                             <label class="block text-[10px] md:text-xs font-black text-[#111418] mb-1.5 uppercase tracking-wider">Kids</label>
                                             <input v-model="bookingData.kids" type="number" min="0" required placeholder="0"
                                                class="w-full h-11 px-4 bg-white border border-gray-300 rounded-xl text-base text-[#111418] outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                                         </div>
                                     </div>

                                     <div v-if="bookingData.kids > 0" class="animate-fade-in">
                                         <label class="block text-[10px] md:text-xs font-black text-[#111418] mb-1.5 uppercase tracking-wider">Kids' Ages</label>
                                         <input v-model="bookingData.kidsAges" type="text" placeholder="e.g. 5, 8, 12"
                                            class="w-full h-11 px-4 bg-white border border-gray-300 rounded-xl text-base text-[#111418] outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                                     </div>

                                     <button type="submit" :disabled="isBooking" 
                                        class="w-full bg-primary hover:bg-blue-600 text-white font-black py-4 rounded-xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2">
                                         <span v-if="isBooking">Processing...</span>
                                         <span v-else>Request Booking</span>
                                         <span v-if="!isBooking" class="material-symbols-outlined text-xl">arrow_forward</span>
                                     </button>

                                     <p class="text-center text-[10px] text-gray-400 font-medium">
                                         No credit card required. We'll contact you for confirmation.
                                     </p>
                                 </form>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
    
    <!-- Lightbox Modal -->
    <div v-if="isLightboxOpen" class="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-sm" @click.self="closeLightbox">
        <button @click="closeLightbox" class="absolute top-6 right-6 text-white/80 hover:text-white transition-colors z-[101]">
            <span class="material-symbols-outlined text-4xl">close</span>
        </button>
        
        <button @click="prevImage" class="absolute left-4 text-white/80 hover:text-white transition-colors p-4 z-[101] hidden md:block">
            <span class="material-symbols-outlined text-5xl">chevron_left</span>
        </button>
        
        <div class="relative max-w-[90vw] max-h-[85vh]">
            <img :src="tour.gallery[currentLightboxIndex]" class="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-fade-in text-white" alt="Gallery Full View">
            <div class="absolute -bottom-10 left-0 right-0 text-center text-white/80 font-medium">
                {{ currentLightboxIndex + 1 }} / {{ tour.gallery.length }}
            </div>
        </div>
        
        <button @click="nextImage" class="absolute right-4 text-white/80 hover:text-white transition-colors p-4 z-[101] hidden md:block">
            <span class="material-symbols-outlined text-5xl">chevron_right</span>
        </button>

        <!-- Mobile Nav Controls at Bottom -->
        <div class="absolute bottom-10 flex gap-12 md:hidden z-[101]">
             <button @click="prevImage" class="text-white/80 hover:text-white p-2">
                <span class="material-symbols-outlined text-4xl">chevron_left</span>
            </button>
            <button @click="nextImage" class="text-white/80 hover:text-white p-2">
                <span class="material-symbols-outlined text-4xl">chevron_right</span>
            </button>
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSEO } from '../../composables/useSEO';
import { API_BASE } from '../../services/api';

const route = useRoute();
const router = useRouter();
const tour = ref(null);
const loading = ref(true);
const error = ref(null);
const isBooking = ref(false);

// SEO
const seoTitle = computed(() => tour.value ? tour.value.title : 'Tour Details');
const seoDescription = computed(() => tour.value?.shortDescription || tour.value?.description?.slice(0, 160) || 'Discover this amazing tour in Sri Lanka.');
const seoImage = computed(() => tour.value?.image || 'https://lakdinutours.com/og-image.jpg');

useSEO({
    title: seoTitle,
    description: seoDescription,
    image: seoImage
});

const bookingData = ref({
    name: '',
    email: '',
    whatsapp: '',
    startDate: '',
    duration: 1,
    adults: 2,
    kids: 0,
    kidsAges: ''
});
const defaultImage = 'https://placehold.co/1200x600';

const defaultItinerary = [
    { title: 'Arrival', description: 'Welcome to Sri Lanka. Transfer to your hotel and relax.' },
    { title: 'Exploration', description: 'Explore the local sights and sounds.' },
    { title: 'Departure', description: 'Transfer to airport for departure.' }
];

// Gallery Logic
const isLightboxOpen = ref(false);
const currentLightboxIndex = ref(0);

const visibleGallery = computed(() => {
    if (!tour.value || !tour.value.gallery) return [];
    return tour.value.gallery.slice(0, 6);
});

const openLightbox = (index) => {
    currentLightboxIndex.value = index;
    isLightboxOpen.value = true;
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
};

const closeLightbox = () => {
    isLightboxOpen.value = false;
    document.body.style.overflow = '';
};

const nextImage = () => {
    if(tour.value && tour.value.gallery) {
         currentLightboxIndex.value = (currentLightboxIndex.value + 1) % tour.value.gallery.length;
    }
};

const prevImage = () => {
    if(tour.value && tour.value.gallery) {
         currentLightboxIndex.value = (currentLightboxIndex.value - 1 + tour.value.gallery.length) % tour.value.gallery.length;
    }
};

// Keyboard navigation
const handleKeydown = (e) => {
    if (!isLightboxOpen.value) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
};

window.addEventListener('keydown', handleKeydown);

const fetchTourDetails = async () => {
    loading.value = true;
    error.value = null;

    const id = route.params.id;

    try {
        const response = await fetch(`${API_BASE}/api/tours/${id}`);
        if (!response.ok) throw new Error("Failed to fetch tour details");
        tour.value = await response.json();
    } catch (err) {
        console.error(err);
        error.value = "Failed to load tour details.";
    } finally {
        loading.value = false;
    }
};

const handleBooking = async () => {
    isBooking.value = true;

    try {
        const payload = {
            name: bookingData.value.name, 
            email: bookingData.value.email,
            message: `New Tour Inquiry:
- Tour: ${tour.value.title}
- WhatsApp: ${bookingData.value.whatsapp}
- Start Date: ${bookingData.value.startDate}
- Duration: ${bookingData.value.duration} Days
- Adults: ${bookingData.value.adults}
- Kids: ${bookingData.value.kids} (Ages: ${bookingData.value.kidsAges || 'N/A'})`,
            tourId: tour.value.id,
            ...bookingData.value
        };

        const response = await fetch(`${API_BASE}/api/inquiries`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Booking failed");
        
        router.push('/thank-you');
    } catch (e) {
        console.error("Booking Error:", e);
        alert("Sorry, there was an error processing your request. Please try again or contact us directly.");
    } finally {
        isBooking.value = false;
    }
};

onMounted(() => {
    fetchTourDetails();
});
</script>

<style scoped>
/* Timeline styles removed */
</style>
