<template>
  <div class="bg-background-light min-h-screen pt-32 md:pt-24 pb-12 public-page-pattern">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-3xl md:text-4xl font-extrabold text-[#111418] mb-4">Tailor-Made Journey</h1>
        <p class="text-gray-600 max-w-2xl mx-auto">
          Design your perfect Sri Lankan adventure. Tell us your preferences, and our travel experts will craft a personalized itinerary just for you.
        </p>
      </div>

      <div class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <form @submit.prevent="handleSubmit" class="p-6 md:p-10 space-y-10">
          
          <!-- Section 1: Tour Details -->
          <section>
            <h2 class="text-xl font-bold text-[#111418] mb-6 border-b border-gray-100 pb-2 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">calendar_month</span>
              Tour Details
            </h2>
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Arrival Date & Time</label>
                <input v-model="form.arrival" type="datetime-local" class="w-full h-11 px-4 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/50 text-base" required />
              </div>
              <div>
                <label class="block text-base font-semibold text-gray-700 mb-2">Departure Date & Time</label>
                <input v-model="form.departure" type="datetime-local" class="w-full h-11 px-4 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/50 text-base" required />
              </div>
              
              <div>
                <label class="block text-base font-semibold text-gray-700 mb-2">Adults (12+ yrs)</label>
                <input v-model.number="form.adults" type="number" min="1" class="w-full h-11 px-4 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/50 text-base" required />
              </div>
              <div>
                <label class="block text-base font-semibold text-gray-700 mb-2">Children (Under 12)</label>
                <input v-model.number="form.children" type="number" min="0" class="w-full h-11 px-4 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/50 text-base" />
              </div>

              <!-- Child Ages Logic -->
              <div v-if="form.children > 0" class="md:col-span-2 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <label class="block text-base font-semibold text-gray-700 mb-3">Ages of Children</label>
                <div class="flex flex-wrap gap-3">
                  <div v-for="(age, index) in form.childAges" :key="index" class="w-24">
                     <input v-model="form.childAges[index]" type="number" min="0" max="12" placeholder="Age" class="w-full h-10 text-center rounded bg-white border border-gray-200 text-base" required />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Section 2: Accommodation -->
          <section>
            <h2 class="text-xl font-bold text-[#111418] mb-6 border-b border-gray-100 pb-2 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">hotel</span>
              Accommodation
            </h2>
            <div class="space-y-6">
              <!-- Room Types -->
               <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div v-for="type in roomTypes" :key="type.key" class="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                    <label class="block text-xs font-bold text-gray-500 mb-1 uppercase">{{ type.label }}</label>
                    <input v-model.number="form.rooms[type.key]" type="number" min="0" class="w-full h-10 text-center bg-transparent border-b border-gray-300 focus:border-primary outline-none font-bold text-lg" />
                  </div>
               </div>
               <div class="text-right text-base text-gray-500">
                 Total Rooms Required: <span class="font-bold text-primary">{{ totalRooms }}</span>
               </div>

               <!-- Preferences -->
               <div class="grid md:grid-cols-2 gap-6">
                 <div>
                    <label class="block text-base font-semibold text-gray-700 mb-2">Hotel Category</label>
                    <select v-model="form.hotelStar" class="w-full h-11 px-4 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/50 text-base">
                      <option>3 Star</option>
                      <option>4 Star</option>
                      <option>5 Star</option>
                      <option>Boutique/Luxury</option>
                      <option>Mix of All</option>
                    </select>
                 </div>
                 <div>
                    <label class="block text-base font-semibold text-gray-700 mb-2">Meal Plan</label>
                    <select v-model="form.mealPlan" class="w-full h-11 px-4 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/50 text-base">
                      <option>Bed & Breakfast</option>
                      <option>Half Board (Breakfast & Dinner)</option>
                      <option>Full Board (All Meals)</option>
                    </select>
                 </div>
               </div>
            </div>
          </section>

          <!-- Section 3: Interests -->
          <section>
            <h2 class="text-xl font-bold text-[#111418] mb-6 border-b border-gray-100 pb-2 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">interests</span>
              Interests & Pace
            </h2>
            <p class="text-base text-gray-500 mb-6">Adjust the sliders to show us what you love.</p>
            
            <div class="space-y-6">
               <div v-for="(interest, key) in form.interests" :key="key">
                 <div class="flex justify-between mb-1">
                   <label class="text-base font-bold capitalize text-gray-700">{{ key }}</label>
                   <span class="text-base text-primary font-bold">{{ interest }}%</span>
                 </div>
                 <input type="range" v-model.number="form.interests[key]" min="0" max="100" step="10" 
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary">
               </div>
            </div>
          </section>

          <!-- Section 4: Personal Info -->
          <section>
            <h2 class="text-xl font-bold text-[#111418] mb-6 border-b border-gray-100 pb-2 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">person</span>
              Your Details
            </h2>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                 <label class="block text-base font-semibold text-gray-700 mb-2">Full Name</label>
                 <input v-model="form.name" type="text" class="w-full h-11 px-4 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/50 text-base" required placeholder="John Doe" />
              </div>
              <div>
                 <label class="block text-base font-semibold text-gray-700 mb-2">Email Address</label>
                 <input v-model="form.email" type="email" class="w-full h-11 px-4 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/50 text-base" required placeholder="john@example.com" />
              </div>
              <div>
                 <label class="block text-base font-semibold text-gray-700 mb-2">Phone / WhatsApp</label>
                 <input v-model="form.phone" type="tel" class="w-full h-11 px-4 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/50 text-base" required placeholder="+1 234 567 890" />
              </div>
               <div>
                 <label class="block text-base font-semibold text-gray-700 mb-2">Country / Nationality</label>
                 <input v-model="form.country" type="text" class="w-full h-11 px-4 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/50 text-base" placeholder="United Kingdom" />
              </div>
            </div>

            <div class="mt-6">
               <label class="block text-base font-semibold text-gray-700 mb-2">Any Other Requirements?</label>
               <textarea v-model="form.message" rows="4" class="w-full p-4 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-primary/50 text-base" placeholder="Specific places you want to visit, dietary requirements, innovative ideas..."></textarea>
            </div>
          </section>

          <!-- Submit -->
          <div class="pt-6">
            <button type="submit" :disabled="isSubmitting" class="w-full bg-primary hover:bg-blue-600 text-white font-bold text-lg py-4 rounded-xl shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="isSubmitting">Sending Request...</span>
              <span v-else>Send My Tailor-Made Request</span>
              <span v-if="!isSubmitting" class="material-symbols-outlined">send</span>
            </button>
            <p class="text-center text-xs text-gray-500 mt-4">We respect your privacy. All details are kept strict confidence.</p>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useSEO } from '../../composables/useSEO';
import { API_BASE } from '../../services/api';

useSEO({
    title: ref('Tailor-Made Journey'),
    description: ref('Design your perfect Sri Lankan adventure. Tell us your preferences, and our travel experts will craft a personalized itinerary.')
});

const router = useRouter();
const isSubmitting = ref(false);

const roomTypes = [
  { key: 'single', label: 'Single' },
  { key: 'double', label: 'Double' },
  { key: 'twin', label: 'Twin' },
  { key: 'triple', label: 'Triple' },
  { key: 'family', label: 'Family' },
];

const form = reactive({
  // Tour Details
  arrival: '',
  departure: '',
  adults: 2,
  children: 0,
  childAges: [],

  // Accommodation
  rooms: {
    single: 0,
    double: 1,
    twin: 0,
    triple: 0,
    family: 0
  },
  hotelStar: '4 Star',
  mealPlan: 'Half Board (Breakfast & Dinner)',

  // Interests (0-100)
  interests: {
    culture: 50,
    nature: 50,
    wildlife: 50,
    beach: 50,
    adventure: 20
  },

  // Personal Info
  name: '',
  email: '',
  phone: '',
  country: '',
  message: ''
});

// Watch children count to update ages array
watch(() => form.children, (newVal) => {
  if (newVal > form.childAges.length) {
    // Add items
    const diff = newVal - form.childAges.length;
    for (let i = 0; i < diff; i++)   form.childAges.push(null);
  } else if (newVal < form.childAges.length) {
    // Remove items
    form.childAges.length = newVal;
  }
});

const totalRooms = computed(() => {
  return (form.rooms.single || 0) + (form.rooms.double || 0) + (form.rooms.twin || 0) + (form.rooms.triple || 0) + (form.rooms.family || 0);
});

const handleSubmit = async () => {
    isSubmitting.value = true;


    try {
        const payload = {
            type: "Tailor Made",
            ...form,
             // Flatten interests and rooms for better reading in simple email views if needed, 
             // but keeping structure is fine for backend
            messageSummary: `Tailor Made Request by ${form.name}. ${form.adults} Adults, ${form.children} Kids. Total Rooms: ${totalRooms.value}.`
        };

        const response = await fetch(`${API_BASE}/api/inquiries`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Submission failed");

        router.push('/thank-you');

    } catch (e) {
        console.error("Submission error", e);
        alert("Failed to submit request. Please try again or contact us directly on WhatsApp.");
    } finally {
        isSubmitting.value = false;
    }
};
</script>
