<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { addHotel, updateHotel, getHotelById } from '../services/hotels'
import { uploadToR2 } from '../services/upload'

const router = useRouter()
const route = useRoute()

const isEditing = computed(() => !!route.params.id)
const isSubmitting = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0) // Mock for now if single file
const uploadLabel = ref('')

const hotel = ref({
    name: '',
    location: '',
    rating: 5.0,
    reviews: 0,
    description: '',
    image: '',
    tag: '',
    website: '',
    amenities: []
})

const newAmenity = ref('')

onMounted(async () => {
    if (isEditing.value) {
        try {
            const data = await getHotelById(route.params.id)
            hotel.value = { ...hotel.value, ...data }
        } catch (error) {
            console.error(error)
            alert("Failed to load hotel")
            router.push('/admin/hotels')
        }
    }
})

const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    isUploading.value = true
    uploadLabel.value = "Uploading image..."
    
    try {
        const url = await uploadToR2(file, (p) => uploadProgress.value = p)
        hotel.value.image = url
    } catch (error) {
        console.error(error)
        alert("Upload failed")
    } finally {
        isUploading.value = false
    }
}

const addAmenity = () => {
    if (newAmenity.value.trim()) {
        hotel.value.amenities.push(newAmenity.value.trim())
        newAmenity.value = ''
    }
}

const removeAmenity = (index) => {
    hotel.value.amenities.splice(index, 1)
}

const submitHotel = async () => {
    if (!hotel.value.name || !hotel.value.location) {
        alert("Please fill in required fields")
        return
    }
    
    isSubmitting.value = true
    try {
        if (isEditing.value) {
            await updateHotel(route.params.id, hotel.value)
        } else {
            await addHotel(hotel.value)
        }
        router.push('/admin/hotels')
    } catch (error) {
        alert("Failed to save hotel")
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
  <div class="min-h-screen bg-background-light pb-24">
      <!-- Header -->
      <div class="bg-white border-b border-[#dbe2e6] px-4 md:px-8 py-4 sticky top-0 z-20">
          <div class="max-w-4xl mx-auto flex items-center justify-between">
              <div class="flex items-center gap-4">
                  <button @click="router.back()" class="p-2 hover:bg-gray-100 rounded-lg text-[#617c89] transition-colors">
                      <span class="material-symbols-outlined">arrow_back</span>
                  </button>
                  <h1 class="text-xl font-bold text-[#111618]">{{ isEditing ? 'Edit Hotel' : 'Add New Hotel' }}</h1>
              </div>
              <button @click="submitHotel" :disabled="isSubmitting" class="bg-primary hover:bg-sky-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
                  <span v-if="isSubmitting" class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  {{ isSubmitting ? 'Saving...' : 'Save Hotel' }}
              </button>
          </div>
      </div>

      <!-- Content -->
      <div class="max-w-4xl mx-auto p-4 md:p-8">
          <div class="flex flex-col md:flex-row gap-8">
              <!-- Left Column: Image -->
              <div class="w-full md:w-1/3">
                  <div class="bg-white p-6 rounded-xl border border-[#dbe2e6] shadow-sm sticky top-24">
                      <h3 class="font-bold text-[#111618] mb-4">Hotel Image</h3>
                      <div class="relative group aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden border border-[#dbe2e6] mb-4">
                          <img v-if="hotel.image" :src="hotel.image" class="w-full h-full object-cover">
                          <div v-else class="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                             <span class="material-symbols-outlined text-4xl mb-2">image</span>
                             <span class="text-xs">No image uploaded</span>
                          </div>
                      </div>
                      <label class="block w-full text-center py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer text-sm font-bold text-[#617c89] transition-colors">
                          <span v-if="isUploading">Uploading...</span>
                          <span v-else>Upload Image</span>
                          <input type="file" class="hidden" accept="image/*" @change="handleImageUpload" :disabled="isUploading">
                      </label>
                  </div>
              </div>

              <!-- Right Column: Form -->
              <div class="w-full md:w-2/3 flex flex-col gap-6">
                  <div class="bg-white p-6 rounded-xl border border-[#dbe2e6] shadow-sm">
                      <h3 class="font-bold text-[#111618] mb-6">Hotel Details</h3>
                      
                      <div class="space-y-4">
                          <!-- Name -->
                          <div>
                              <label class="block text-sm font-bold text-[#617c89] mb-1">Hotel Name</label>
                              <input v-model="hotel.name" type="text" class="w-full bg-background-light border border-[#dbe2e6] rounded-lg px-4 py-3 text-[#111618] focus:outline-none focus:border-primary" placeholder="e.g. Shangri-La Colombo">
                          </div>
                          
                          <!-- Location -->
                          <div>
                              <label class="block text-base font-bold text-[#617c89] mb-1">Location</label>
                              <input v-model="hotel.location" type="text" class="w-full bg-background-light border border-[#dbe2e6] rounded-lg px-4 py-3 text-[#111618] focus:outline-none focus:border-primary" placeholder="e.g. Colombo">
                          </div>

                          <!-- Stats Row -->
                          <div class="grid grid-cols-2 gap-4">
                              <div>
                                  <label class="block text-base font-bold text-[#617c89] mb-1">Rating (1-5)</label>
                                  <input v-model="hotel.rating" type="number" step="0.1" min="0" max="5" class="w-full bg-background-light border border-[#dbe2e6] rounded-lg px-4 py-3 text-[#111618] focus:outline-none focus:border-primary">
                              </div>
                              <div>
                                  <label class="block text-base font-bold text-[#617c89] mb-1">Review Count</label>
                                  <input v-model="hotel.reviews" type="number" class="w-full bg-background-light border border-[#dbe2e6] rounded-lg px-4 py-3 text-[#111618] focus:outline-none focus:border-primary">
                              </div>
                          </div>

                          <!-- Tag -->
                           <div>
                              <label class="block text-base font-bold text-[#617c89] mb-1">Special Tag (Optional)</label>
                              <input v-model="hotel.tag" type="text" class="w-full bg-background-light border border-[#dbe2e6] rounded-lg px-4 py-3 text-[#111618] focus:outline-none focus:border-primary" placeholder="e.g. Honeymoon Special">
                          </div>

                          <!-- Website -->
                           <div>
                              <label class="block text-base font-bold text-[#617c89] mb-1">Website URL</label>
                              <input v-model="hotel.website" type="url" class="w-full bg-background-light border border-[#dbe2e6] rounded-lg px-4 py-3 text-[#111618] focus:outline-none focus:border-primary" placeholder="e.g. https://www.shangri-la.com/colombo">
                          </div>

                          <!-- Description -->
                           <div>
                              <label class="block text-base font-bold text-[#617c89] mb-1">Description</label>
                              <textarea v-model="hotel.description" rows="4" class="w-full bg-background-light border border-[#dbe2e6] rounded-lg px-4 py-3 text-[#111618] focus:outline-none focus:border-primary" placeholder="Brief description of the hotel..."></textarea>
                          </div>

                          <!-- Amenities -->
                          <div>
                              <label class="block text-base font-bold text-[#617c89] mb-2">Amenities</label>
                              <div class="flex gap-2 mb-3">
                                  <input v-model="newAmenity" @keyup.enter="addAmenity" type="text" class="flex-1 bg-background-light border border-[#dbe2e6] rounded-lg px-3 py-2 text-base focus:outline-none focus:border-primary" placeholder="Add amenity (e.g. Free Wifi)...">
                                  <button @click="addAmenity" class="px-3 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors font-bold text-lg">+</button>
                              </div>
                              <div class="flex flex-wrap gap-2">
                                  <span v-for="(item, idx) in hotel.amenities" :key="idx" class="px-3 py-1 bg-gray-100 text-xs font-bold text-[#617c89] rounded-full flex items-center gap-2 group">
                                      {{ item }}
                                      <button @click="removeAmenity(idx)" class="hover:text-red-500"><span class="material-symbols-outlined text-[14px]">close</span></button>
                                  </span>
                              </div>
                          </div>

                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>
