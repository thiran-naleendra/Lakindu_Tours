<template>
  <div class="bg-background-light min-h-screen font-display pt-32 md:pt-24 public-page-pattern">
    <div class="bg-[#101922] text-white py-12 md:py-16 px-4 shadow-2xl relative overflow-hidden">
        <!-- Background decoration -->
        <div class="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
        
        <div class="max-w-4xl mx-auto text-center relative z-10 px-2">
            <h1 class="text-2xl md:text-5xl font-black tracking-tight mb-2 md:mb-3">Secure Your Ride</h1>
            <p v-if="vehicle" class="text-gray-400 text-sm md:text-lg">For <span class="text-white font-medium">{{ vehicle.name }}</span></p>
            <p v-else class="text-gray-400 text-sm md:text-lg">Complete your reservation securely</p>
            
            <div class="w-12 md:w-16 h-1 md:h-1.5 bg-primary mx-auto mt-4 md:mt-6 rounded-full opacity-80"></div>
        </div>
    </div>

    <div class="max-w-4xl mx-auto px-0 md:px-4 py-8 md:py-12">
        <div class="bg-white rounded-none md:rounded-xl shadow-sm border-x-0 md:border border-gray-100 overflow-hidden">
            <div class="grid md:grid-cols-3">
                <!-- Summary Column -->
                <div class="bg-gray-50 p-4 md:p-6 md:col-span-1 border-b md:border-b-0 md:border-r border-gray-100">
                    <h3 class="font-black text-base md:text-lg mb-4 text-[#111418] uppercase tracking-wider">Summary</h3>
                    
                    <div class="space-y-4">
                        <div v-if="vehicle" class="space-y-2">
                            <div class="aspect-video bg-gray-200 rounded-lg overflow-hidden relative group">
                                <img :src="currentImage || vehicle.image" :alt="vehicle.name" class="w-full h-full object-cover transition-all duration-300">
                            </div>
                            <!-- Gallery Thumbnails -->
                            <div v-if="vehicle.gallery && vehicle.gallery.length > 0" class="grid grid-cols-4 gap-2">
                                <button @click="currentImage = vehicle.image" 
                                    class="aspect-square rounded-md overflow-hidden border-2 transition-all"
                                    :class="currentImage === vehicle.image ? 'border-primary' : 'border-transparent hover:border-gray-300'">
                                    <img :src="vehicle.image" class="w-full h-full object-cover">
                                </button>
                                <button v-for="(img, idx) in vehicle.gallery" :key="idx" @click="currentImage = img"
                                    class="aspect-square rounded-md overflow-hidden border-2 transition-all"
                                    :class="currentImage === img ? 'border-primary' : 'border-transparent hover:border-gray-300'">
                                    <img :src="img" class="w-full h-full object-cover">
                                </button>
                            </div>
                        </div>
                        <div v-if="vehicle">
                            <h4 class="font-bold text-[#111418]">{{ vehicle.name }}</h4>
                            <p class="text-sm text-gray-500 mb-2">{{ vehicle.type }} • {{ vehicle.fuelType }}</p>
                            <p v-if="vehicle.description" class="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                                {{ vehicle.description }}
                            </p>
                        </div>
                        <div v-if="vehicle" class="border-t border-gray-200 pt-4 space-y-3">
                             <div class="flex justify-between text-sm">
                                <span class="text-gray-500">Car Type</span>
                                <span class="font-medium text-[#111418]">{{ vehicle.name }} (${{ vehicle.price }}/day)</span>
                             </div>
                             <div class="flex justify-between text-sm">
                                <span class="text-gray-500">Travel Days</span>
                                <span class="font-medium text-[#111418]">{{ days || 0 }}</span>
                             </div>
                             <div class="flex justify-between text-sm">
                                <span class="text-gray-500">Original Price</span>
                                <span class="font-medium text-[#111418]">${{ originalPriceUSD.toFixed(2) }}</span>
                             </div>
                             <div class="flex justify-between text-sm">
                                <span class="text-gray-500">10% Discount</span>
                                <span class="font-medium text-[#111418]">$0.00</span>
                             </div>
                             
                             <div class="pt-2 border-t border-dashed border-gray-200">
                                <div class="flex justify-between items-center">
                                    <span class="text-sm font-bold text-[#111418]">Total Price</span>
                                    <div class="text-right">
                                        <div class="text-lg font-black text-primary">${{ totalPriceUSD.toFixed(2) }}</div>
                                        <div class="text-[10px] md:text-xs font-bold text-gray-400 mt-1 max-w-[200px] leading-tight text-right">
                                            * Charged in LKR at Google live rate on payment date
                                        </div>
                                    </div>
                                </div>
                             </div>

                             <div class="text-[10px] text-gray-400 italic text-center pt-2">
                                (Maximum Ride: {{ maxRideKM }} km / ${{ extraKMPrice.toFixed(2) }} Per extra KM)
                             </div>
                        </div>
                    </div>
                </div>

                <!-- Form Column -->
                <div class="p-4 md:p-8 md:col-span-2">
                    <form class="space-y-5 md:space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                            <label class="block">
                                <span class="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide">Pick-up Date</span>
                                <input v-model="formData.pickupDate" type="date" placeholder="Select Date" class="mt-1.5 w-full min-w-full h-11 rounded-lg border border-gray-300 bg-white text-[#111418] shadow-sm focus:border-primary focus:ring focus:ring-primary/20 px-3 md:px-4 text-base" />
                            </label>
                            <label class="block">
                                <span class="text-xs md:text-base font-bold text-gray-700 uppercase tracking-wide">Return Date</span>
                                <input v-model="formData.returnDate" :min="formData.pickupDate" type="date" placeholder="Select Date" class="mt-1.5 w-full min-w-full h-11 rounded-lg border border-gray-300 bg-white text-[#111418] shadow-sm focus:border-primary focus:ring focus:ring-primary/20 px-3 md:px-4 text-base" />
                            </label>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                            <label class="block">
                                <span class="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide">Pick-up Location</span>
                                <input v-model="formData.pickupLocation" type="text" placeholder="Airport, Hotel, City..." class="mt-1.5 w-full h-11 rounded-lg border border-gray-300 bg-white text-[#111418] shadow-sm focus:border-primary focus:ring focus:ring-primary/20 px-3 md:px-4 text-base" />
                            </label>
                            <label class="block">
                                <span class="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide">Drop Location</span>
                                <input v-model="formData.dropLocation" type="text" placeholder="Airport, Hotel, City..." class="mt-1.5 w-full h-11 rounded-lg border border-gray-300 bg-white text-[#111418] shadow-sm focus:border-primary focus:ring focus:ring-primary/20 px-3 md:px-4 text-base" />
                            </label>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                            <label class="block">
                                <span class="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide">Passengers</span>
                                <input v-model="formData.pax" type="number" min="1" class="mt-1.5 w-full h-11 rounded-lg border border-gray-300 bg-white text-[#111418] shadow-sm focus:border-primary focus:ring focus:ring-primary/20 px-3 md:px-4 text-base" />
                            </label>
                            <label class="block">
                                <span class="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide">Luggage Count</span>
                                <input v-model="formData.luggage" type="number" min="0" class="mt-1.5 w-full h-11 rounded-lg border border-gray-300 bg-white text-[#111418] shadow-sm focus:border-primary focus:ring focus:ring-primary/20 px-3 md:px-4 text-base" />
                            </label>
                        </div>

                        <label class="flex items-center gap-3 p-4 rounded-lg border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                            <input v-model="formData.kidsSeat" type="checkbox" class="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                            <span class="text-sm font-bold text-gray-700">Need Kids Support Seat?</span>
                        </label>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                             <label class="block">
                                <span class="text-xs md:text-base font-bold text-gray-700 uppercase tracking-wide">Full Name</span>
                                <input v-model="formData.name" type="text" placeholder="e.g. John Doe" class="mt-1.5 w-full h-11 rounded-lg border border-gray-300 bg-white text-[#111418] shadow-sm focus:border-primary focus:ring focus:ring-primary/20 px-3 md:px-4 text-base" />
                            </label>
                             <label class="block">
                                <span class="text-xs md:text-base font-bold text-gray-700 uppercase tracking-wide">Email Address</span>
                                <input v-model="formData.email" type="email" placeholder="e.g. john@example.com" class="mt-1.5 w-full h-11 rounded-lg border border-gray-300 bg-white text-[#111418] shadow-sm focus:border-primary focus:ring focus:ring-primary/20 px-3 md:px-4 text-base" />
                            </label>
                        </div>

                        <label class="block">
                            <span class="text-xs md:text-base font-bold text-gray-700 uppercase tracking-wide">Special Requests</span>
                            <textarea v-model="formData.message" rows="3" class="mt-1.5 w-full rounded-lg border border-gray-300 bg-white text-[#111418] shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-3 md:p-4 text-base" placeholder="Baby seat, airport pickup details, etc."></textarea>
                        </label>

                        <div class="pt-2 md:pt-4">
                            <button @click="handleBooking" :disabled="isSubmitting" type="button" 
                                class="w-full bg-primary hover:bg-blue-600 text-white font-black py-3.5 rounded-lg shadow-xl shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                <span v-if="isSubmitting" class="material-symbols-outlined animate-spin">progress_activity</span>
                                {{ isSubmitting ? 'Sending Request...' : 'Request Booking' }}
                            </button>
                            <p class="text-center text-[10px] md:text-xs text-gray-400 mt-3 font-medium">No payment required today. We will confirm availability shortly.</p>
                            
                            <!-- Policy Section -->
                            <div class="mt-8 pt-6 border-t border-gray-100">
                                <h4 class="font-bold text-sm text-[#111418] mb-3 flex items-center gap-2">
                                    <span class="material-symbols-outlined text-amber-500">warning</span> Cancellation Policy
                                </h4>
                                <ul class="text-xs text-gray-500 space-y-1 mb-4 list-disc pl-4">
                                    <li><span class="text-green-600 font-medium">Full refund</span> if canceled 7+ days before pickup</li>
                                    <li>50% cancellation charge once the journey has started</li>
                                </ul>

                                <h4 class="font-bold text-sm text-[#111418] mb-3 flex items-center gap-2">
                                    <span class="material-symbols-outlined text-primary">payments</span> Payment Terms
                                </h4>
                                <ul class="text-xs text-gray-500 space-y-1 list-disc pl-4">
                                    <li>LKR cash — converted using today’s USD → LKR rate</li>
                                    <li>No advance payment required</li>
                                    <li>Payment in 3 stages: After pickup, Mid-tour, Final day</li>
                                </ul>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useSEO } from '../../composables/useSEO';
import { API_BASE } from '../../services/api';

const route = useRoute();
const vehicle = ref(null);
const loading = ref(true);
const currentImage = ref('');

// SEO
const seoTitle = computed(() => vehicle.value ? `Book ${vehicle.value.name}` : 'Fleet Booking');
const seoDescription = computed(() => vehicle.value ? `Secure your reservation for ${vehicle.value.name}.` : 'Secure your ride in Sri Lanka.');
const seoImage = computed(() => vehicle.value?.image || 'https://lakdinutours.com/og-image.jpg');

useSEO({
    title: seoTitle,
    description: seoDescription,
    image: seoImage
});

const isSubmitting = ref(false);

const formData = ref({
    pickupDate: '',
    returnDate: '',
    pickupLocation: '',
    dropLocation: '',
    pax: 1,
    luggage: 0,
    kidsSeat: false,
    name: '',
    email: '',
    message: ''
});

const handleBooking = async () => {
    if (!formData.value.name || !formData.value.email || !formData.value.pickupDate) {
        alert("Please fill in required fields (Name, Email, Pickup Date)");
        return;
    }

    isSubmitting.value = true;
    try {
        const payload = {
            ...formData.value,
            type: 'Fleet',
            subject: `Vehicle Booking: ${vehicle.value?.name || 'Inquiry'}`,
            vehicleId: route.query.vehicle,
            totalPrice: totalPriceUSD.value,
            duration: days.value
        };

        const response = await fetch(`${API_BASE}/api/inquiries`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Submission failed');
        
        alert("Booking request submitted! We will contact you shortly.");
        
        // Reset form
        formData.value = {
            pickupDate: '',
            returnDate: '',
            pickupLocation: '',
            dropLocation: '',
            pax: 1,
            luggage: 0,
            kidsSeat: false,
            name: '',
            email: '',
            message: ''
        };
    } catch (e) {
        console.error("Submission error:", e);
        alert("Failed to submit booking. Please try again.");
    } finally {
        isSubmitting.value = false;
    }
};

const days = computed(() => {
    if (!formData.value.pickupDate || !formData.value.returnDate) return 0;
    const start = new Date(formData.value.pickupDate);
    const end = new Date(formData.value.returnDate);
    
    // Reset hours to Ensure pure date difference
    start.setHours(0,0,0,0);
    end.setHours(0,0,0,0);

    if (end < start) return 0; // Invalid range

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays + 1; // Inclusive (Start Date + End Date)
});

const USD_TO_LKR = 300;
const originalPriceUSD = computed(() => (vehicle.value?.price || 0) * (days.value || 0));
const discountUSD = computed(() => 0); // Placeholder for 10% discount logic if needed later
const totalPriceUSD = computed(() => originalPriceUSD.value - discountUSD.value);
const totalPriceLKR = computed(() => totalPriceUSD.value * USD_TO_LKR);
const maxRideKM = computed(() => 150 * (days.value || 0));
const extraKMPrice = computed(() => (vehicle.value?.price || 0) / 150);

onMounted(async () => {
    const vehicleId = route.query.vehicle;
    if (!vehicleId) {
        // Handle error or redirect
        return;
    }


    try {
        const response = await fetch(`${API_BASE}/api/fleet/${vehicleId}`);
        if (!response.ok) throw new Error('Vehicle not found');
        vehicle.value = await response.json();
        currentImage.value = vehicle.value.image;
    } catch (e) {
        console.error("Error fetching vehicle:", e);
    } finally {
        loading.value = false;
    }
});
</script>
