<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { addVehicle, updateVehicle, getVehicleById } from '../services/fleet'
import { uploadToR2 } from '../services/upload'

const router = useRouter()
const route = useRoute()
const isEditing = computed(() => !!route.params.id)
const isSubmitting = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)

// Form Data State
const vehicle = ref({
  name: '',
  subtitle: 'Or similar',
  type: 'Sedan',
  seats: 4,
  luggage: 2,
  fuelType: 'Hybrid',
  fuelIcon: 'electric_car',
  price: 0,
  oldPrice: null,
  image: '',
  gallery: [],
  description: ''
})

const fuelIconOptions = [
  { label: 'Battery', value: 'electric_car' },
  { label: 'Gas Station', value: 'local_gas_station' },
  { label: 'Settings (Auto)', value: 'settings' },
  { label: 'WiFi', value: 'wifi' },
  { label: 'Star (VIP)', value: 'star' },
  { label: 'Speed (Turbo)', value: 'speed' }
]

const vehicleTypes = ['Sedan', 'SUV / 4x4', 'Van', 'Luxury', 'Bus']

onMounted(async () => {
  if (isEditing.value) {
    try {
        const fetchedVehicle = await getVehicleById(route.params.id)
        vehicle.value = { 
            ...vehicle.value, 
            ...fetchedVehicle 
        }
    } catch (error) {
        console.error("Failed to load vehicle", error)
        alert("Failed to load vehicle details")
        router.push('/admin/fleet')
    }
  }
})

// Image Handling
const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  try {
    isUploading.value = true
    const url = await uploadToR2(file, (p) => uploadProgress.value = p)
    vehicle.value.image = url
  } catch (error) {
    console.error("Upload failed", error)
    alert("Failed to upload image")
  } finally {
    isUploading.value = false
  }
}

const handleGalleryUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    isUploading.value = true;
    try {
        for (const file of files) {
            const url = await uploadToR2(file, (p) => uploadProgress.value = p);
            vehicle.value.gallery.push(url);
        }
    } catch (error) {
        console.error("Gallery upload failed", error);
        alert("Failed to upload some images");
    } finally {
        isUploading.value = false;
    }
}

const removeGalleryImage = (index) => {
    vehicle.value.gallery.splice(index, 1);
}

// Submission
const submitVehicle = async () => {
  isSubmitting.value = true
  try {
    // Basic validation
    if (!vehicle.value.name || !vehicle.value.price || !vehicle.value.image) {
      alert("Please fill in all required fields (Name, Price, Image)")
      return
    }

    if (isEditing.value) {
        await updateVehicle(route.params.id, vehicle.value)
    } else {
        await addVehicle(vehicle.value)
    }
    router.push('/admin/fleet')
  } catch (error) {
    console.error("Save failed", error)
    alert("Failed to save vehicle.")
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-background-light pb-24">
    <!-- Header -->
    <div class="bg-white border-b border-[#dbe2e6] px-4 md:px-8 py-4 sticky top-0 z-20">
      <div class="max-w-5xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button @click="router.back()" class="p-2 hover:bg-gray-100 rounded-lg text-[#617c89] transition-colors">
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 class="text-xl font-bold text-[#111618]">{{ isEditing ? 'Edit Vehicle' : 'Add New Vehicle' }}</h1>
            <p class="text-xs text-[#617c89]">Fleet Management</p>
          </div>
        </div>
        <div class="flex gap-2">
            <button @click="submitVehicle" :disabled="isSubmitting"
                class="px-6 py-2 bg-primary hover:bg-sky-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
                <span v-if="isSubmitting" class="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update Vehicle' : 'Create Vehicle') }}
            </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto p-4 md:p-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <!-- Left: Image Upload -->
        <div class="md:col-span-1">
          <div class="bg-white p-6 rounded-xl border border-[#dbe2e6] shadow-sm sticky top-24">
            <h2 class="text-sm font-bold text-[#111618] mb-4">Vehicle Image</h2>
            <div class="aspect-[4/3] bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 overflow-hidden relative group">
              <img v-if="vehicle.image" :src="vehicle.image" class="w-full h-full object-cover">
              <div v-else class="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                <span class="material-symbols-outlined text-4xl mb-2">image</span>
                <span class="text-xs">No Image Selected</span>
              </div>
              <label class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <input type="file" accept="image/*" @change="handleImageUpload" class="hidden">
                <span class="bg-white text-black px-4 py-2 rounded-full text-xs font-bold">Change Image</span>
              </label>
            </div>
            <p class="text-[10px] text-gray-500 mt-2 text-center uppercase tracking-wider font-bold">Recommended: 800x600px PNG (Transparent background preferred)</p>
            
            <!-- Upload Progress -->
            <div v-if="isUploading" class="mt-4">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-bold text-primary">Uploading...</span>
                <span class="text-xs font-bold text-primary">{{ uploadProgress }}%</span>
              </div>
              <div class="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-primary transition-all duration-300" :style="{ width: uploadProgress + '%' }"></div>
              </div>
            </div>
          </div>

          <!-- Gallery -->
          <div class="bg-white p-6 rounded-xl border border-[#dbe2e6] shadow-sm mt-6">
            <h2 class="text-sm font-bold text-[#111618] mb-4">Gallery Images</h2>
            
            <div class="grid grid-cols-3 gap-2">
                <div v-for="(img, idx) in vehicle.gallery" :key="idx" class="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img :src="img" class="w-full h-full object-cover" />
                    <button @click="removeGalleryImage(idx)" class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span class="material-symbols-outlined text-xs">close</span>
                    </button>
                </div>
                
                <!-- Add Button -->
                <label class="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <span class="material-symbols-outlined text-gray-400">add_photo_alternate</span>
                    <span class="text-[10px] text-gray-500 mt-1">Add Images</span>
                    <input type="file" multiple accept="image/*" @change="handleGalleryUpload" class="hidden" />
                </label>
            </div>
          </div>
        </div>

        <!-- Right: Details Form -->
        <div class="md:col-span-2 space-y-6">
          <!-- Basic Info -->
          <div class="bg-white p-6 rounded-xl border border-[#dbe2e6] shadow-sm">
            <h2 class="text-sm font-bold text-[#111618] mb-4 uppercase tracking-widest">General Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-xs font-bold text-[#617c89] mb-1.5 uppercase">Model Name *</label>
                <input v-model="vehicle.name" type="text" class="w-full bg-background-light border border-[#dbe2e6] rounded-lg px-4 py-2.5 text-base focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="e.g. Toyota Axio">
              </div>
              <div class="md:col-span-2">
                <label class="block text-xs font-bold text-[#617c89] mb-1.5 uppercase">Subtitle / Note</label>
                <input v-model="vehicle.subtitle" type="text" class="w-full bg-background-light border border-[#dbe2e6] rounded-lg px-4 py-2.5 text-base focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="e.g. Or similar">
              </div>
              <div>
                <label class="block text-xs font-bold text-[#617c89] mb-1.5 uppercase">Vehicle Type</label>
                <select v-model="vehicle.type" class="w-full bg-background-light border border-[#dbe2e6] rounded-lg px-4 py-2.5 text-base focus:ring-1 focus:ring-primary outline-none transition-all">
                  <option v-for="t in vehicleTypes" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-[#617c89] mb-1.5 uppercase">Price per Day ($) *</label>
                <input v-model.number="vehicle.price" type="number" class="w-full bg-background-light border border-[#dbe2e6] rounded-lg px-4 py-2.5 text-base focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="0.00">
              </div>
              <div>
                <label class="block text-xs font-bold text-[#617c89] mb-1.5 uppercase">Old Price (Optional)</label>
                <input v-model.number="vehicle.oldPrice" type="number" class="w-full bg-background-light border border-[#dbe2e6] rounded-lg px-4 py-2.5 text-base focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="0.00">
              </div>
            </div>
          </div>

          <!-- Specifications -->
          <div class="bg-white p-6 rounded-xl border border-[#dbe2e6] shadow-sm">
            <h2 class="text-base font-bold text-[#111618] mb-4 uppercase tracking-widest">Specifications</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label class="block text-xs font-bold text-[#617c89] mb-1.5 uppercase">Seats</label>
                <input v-model.number="vehicle.seats" type="number" class="w-full bg-background-light border border-[#dbe2e6] rounded-lg px-4 py-2.5 text-base focus:ring-1 focus:ring-primary outline-none transition-all">
              </div>
              <div>
                <label class="block text-xs font-bold text-[#617c89] mb-1.5 uppercase">Luggage</label>
                <input v-model.number="vehicle.luggage" type="number" class="w-full bg-background-light border border-[#dbe2e6] rounded-lg px-4 py-2.5 text-base focus:ring-1 focus:ring-primary outline-none transition-all">
              </div>
              <div>
                <label class="block text-xs font-bold text-[#617c89] mb-1.5 uppercase">Fuel Type</label>
                <input v-model="vehicle.fuelType" type="text" class="w-full bg-background-light border border-[#dbe2e6] rounded-lg px-4 py-2.5 text-base focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="e.g. Hybrid">
              </div>
              <div>
                <label class="block text-xs font-bold text-[#617c89] mb-1.5 uppercase">Icon</label>
                <select v-model="vehicle.fuelIcon" class="w-full bg-background-light border border-[#dbe2e6] rounded-lg px-4 py-2.5 text-base focus:ring-1 focus:ring-primary outline-none transition-all">
                  <option v-for="opt in fuelIconOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="bg-white p-6 rounded-xl border border-[#dbe2e6] shadow-sm">
            <h2 class="text-base font-bold text-[#111618] mb-4 uppercase tracking-widest">Additional Details</h2>
            <textarea v-model="vehicle.description" rows="4" class="w-full bg-background-light border border-[#dbe2e6] rounded-lg px-4 py-2.5 text-base focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Optional description for the fleet-booking page..."></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
