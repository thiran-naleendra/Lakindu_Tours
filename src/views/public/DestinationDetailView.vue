<template>
  <div class="bg-background-light min-h-screen public-page-pattern">
      <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
        <div class="flex flex-col items-center gap-4">
             <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
             <p class="text-gray-500">Loading destination...</p>
        </div>
    </div>

    <div v-if="destination">
        <!-- Hero Section -->
        <div class="relative w-full h-[500px] lg:h-[600px] flex flex-col justify-end pb-12 group">
             <!-- Background Image -->
            <div class="absolute inset-0 z-0">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 z-10"></div>
                <img :src="destination.image || defaultImage" :alt="destination.name" class="w-full h-full object-cover object-center" />
            </div>
             <!-- Content Container -->
            <div class="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
                <!-- Breadcrumbs -->
                <nav class="flex mb-6 text-white/80 text-sm font-medium">
                    <router-link to="/" class="hover:text-primary transition-colors">Home</router-link>
                    <span class="mx-2">/</span>
                    <router-link to="/destinations" class="hover:text-primary transition-colors">Destinations</router-link>
                    <span class="mx-2">/</span>
                    <span class="text-white">{{ destination.name }}</span>
                </nav>
                <div class="max-w-3xl">
                    <h1 class="text-white text-4xl md:text-5xl lg:text-7xl font-black leading-tight tracking-tight mb-4">
                        {{ destination.name }}
                    </h1>
                     <p class="text-white/90 text-lg md:text-xl font-medium leading-normal drop-shadow-sm max-w-2xl">
                        {{ destination.shortDescription }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Content -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <!-- Main Content -->
                <div class="lg:col-span-3 space-y-10">
                    <div>
                        <h2 class="text-2xl font-bold text-[#111418] mb-4">About {{ destination.name }}</h2>
                        <div class="prose max-w-none text-[#617589] leading-relaxed">
                            <p>{{ destination.description }}</p>
                        </div>
                    </div>

                    <!-- Travel Snapshots (Gallery) -->
                    <!-- Travel Snapshots (Gallery) -->
                    <div v-if="destination.gallery && destination.gallery.length > 0">
                        <div class="flex items-center justify-between mb-8">
                            <div>
                                <h2 class="text-2xl md:text-4xl font-black text-[#111418] tracking-tight">Travel <span class="text-primary">Snapshots</span></h2>
                                <p class="text-gray-500 mt-1 text-sm md:text-base">Glimpses of beauty from this destination</p>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                            <div 
                                v-for="(img, idx) in displayedGallery" 
                                :key="idx" 
                                @click="openLightbox(idx)"
                                class="group relative rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 aspect-square"
                                :class="{ 'hidden md:block': idx === 4 }"
                            >
                                <img 
                                    :src="img" 
                                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                    alt="Travel Snapshot"
                                >
                                <!-- Standard Overlay (Desktop idx < 4, Mobile idx < 3) -->
                                <template v-if="!isLastVisible(idx)">
                                    <div class="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500"></div>
                                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 group-hover:backdrop-blur-[2px]">
                                        <span class="material-symbols-outlined text-white text-3xl">zoom_in</span>
                                    </div>
                                </template>

                                <!-- View All Overlay -->
                                <template v-else>
                                    <div class="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors duration-500 backdrop-blur-[2px]"></div>
                                    <div class="absolute inset-0 flex flex-col items-center justify-center">
                                        <span class="text-white font-bold text-2xl md:text-3xl">+{{ destination.gallery.length - (idx + 1) }}</span>
                                        <span class="text-white/80 text-[10px] md:text-sm font-black uppercase tracking-wider mt-1">View All</span>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>

                    <!-- Lightbox Modal -->
                    <Teleport to="body">
                        <div v-if="lightboxOpen" class="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center" @click.self="closeLightbox">
                            <!-- Close Button -->
                            <button @click="closeLightbox" class="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white transition-colors z-50 p-2">
                                <span class="material-symbols-outlined text-4xl">close</span>
                            </button>

                            <!-- Navigation Buttons -->
                            <button @click.stop="prevImage" class="absolute left-4 md:left-8 text-white/50 hover:text-white transition-colors z-50 p-2 hidden md:block">
                                <span class="material-symbols-outlined text-5xl">chevron_left</span>
                            </button>
                            <button @click.stop="nextImage" class="absolute right-4 md:right-8 text-white/50 hover:text-white transition-colors z-50 p-2 hidden md:block">
                                <span class="material-symbols-outlined text-5xl">chevron_right</span>
                            </button>

                            <!-- Image Container -->
                            <div class="relative w-full h-full flex items-center justify-center p-4 md:p-20" 
                                @touchstart="handleTouchStart"
                                @touchend="handleTouchEnd"
                            >
                                <img 
                                    :src="destination.gallery[lightboxIndex]" 
                                    class="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
                                    alt="Gallery Image"
                                >
                                
                                <!-- Counter -->
                                <div class="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 font-medium text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
                                    {{ lightboxIndex + 1 }} / {{ destination.gallery.length }}
                                </div>
                            </div>
                        </div>
                    </Teleport>

                    <!-- Attractions (Mock) -->

                </div>

                <!-- Sidebar -->

            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useSEO } from '../../composables/useSEO';
import { API_BASE } from '../../services/api';

const route = useRoute();
const loading = ref(true);
const destination = ref(null);

// SEO
const seoTitle = computed(() => destination.value ? destination.value.name : 'Destination Details');
const seoDescription = computed(() => destination.value?.shortDescription || 'Explore this amazing destination in Sri Lanka.');
const seoImage = computed(() => destination.value?.image || 'https://lakdinutours.com/og-image.jpg');

useSEO({
    title: seoTitle,
    description: seoDescription,
    image: seoImage
});
const defaultImage = 'https://placehold.co/1200x600';

// Lightbox State
const lightboxOpen = ref(false);
const lightboxIndex = ref(0);
const touchStartX = ref(0);
const touchEndX = ref(0);

const windowWidth = ref(window.innerWidth);
const updateWidth = () => { windowWidth.value = window.innerWidth; };

// Computed Properties for Gallery
const galleryLimit = computed(() => {
    return windowWidth.value < 768 ? 4 : 5;
});

const displayedGallery = computed(() => {
    if (!destination.value?.gallery) return [];
    return destination.value.gallery.slice(0, 5); // Keep top 5, but use CSS to hide 5th on mobile
});

const isLastVisible = (idx) => {
    const limit = galleryLimit.value;
    const total = destination.value?.gallery?.length || 0;
    
    if (total <= limit) return false; // Show zoom for all if total is less than limit
    
    if (windowWidth.value < 768) {
        return idx === 3; // 4th item on mobile
    }
    return idx === 4; // 5th item on desktop
};

// Lightbox Methods
const openLightbox = (index) => {
    lightboxIndex.value = index;
    lightboxOpen.value = true;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeydown);
};

const closeLightbox = () => {
    lightboxOpen.value = false;
    document.body.style.overflow = '';
    window.removeEventListener('keydown', handleKeydown);
};

const nextImage = () => {
    if (!destination.value?.gallery) return;
    lightboxIndex.value = (lightboxIndex.value + 1) % destination.value.gallery.length;
};

const prevImage = () => {
    if (!destination.value?.gallery) return;
    lightboxIndex.value = (lightboxIndex.value - 1 + destination.value.gallery.length) % destination.value.gallery.length;
};

const handleKeydown = (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
};

// Swipe Handling
const handleTouchStart = (e) => {
    touchStartX.value = e.changedTouches[0].screenX;
};

const handleTouchEnd = (e) => {
    touchEndX.value = e.changedTouches[0].screenX;
    handleSwipe();
};

const handleSwipe = () => {
    const threshold = 50; // min distance for swipe
    if (touchEndX.value < touchStartX.value - threshold) {
        nextImage(); // Swipe Left -> Next
    }
    if (touchEndX.value > touchStartX.value + threshold) {
        prevImage(); // Swipe Right -> Prev
    }
};

const fetchDestination = async () => {
    loading.value = true;


    try {
        const response = await fetch(`${API_BASE}/api/destinations/${route.params.id}`);
        if (!response.ok) throw new Error('Failed to fetch destination');
        
        const data = await response.json();
        destination.value = data;
        
        


    } catch (error) {
        console.error('Error fetching destination:', error);
        // Handle error (redirect or show error state)
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    fetchDestination();
    window.addEventListener('resize', updateWidth);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('resize', updateWidth);
    document.body.style.overflow = '';
});
</script>
