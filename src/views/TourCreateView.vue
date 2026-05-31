<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { addTour, updateTour, getTourById } from '../services/tours'
import { uploadToR2 } from '../services/upload'
import { getRegions, addRegion } from '../services/settings'

const router = useRouter()
const route = useRoute()
const isEditing = computed(() => !!route.params.id)
const currentStep = ref(1)
const isSubmitting = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const uploadLabel = ref('Uploading...')

// Regions Logic
const availableRegions = ref([])
const isAddingRegion = ref(false)
const newRegionName = ref('')

// Form Data State
const tour = ref({
  name: '',
  slug: '',
  description: '',
  route: '', // New Route Field
  location: '',
  type: 'Day Tour', // 'Day Tour' | 'Multi-day'
  price: '',
  duration: '',
  status: 'Draft',
  images: [], // Main Gallery
  coverImage: '', // Card Cover Image (New)
  mapUrl: '', // Optional map image
  inclusions: [],
  exclusions: [],
  itinerary: [] // Array of { day: 1, title: '', description: '', images: [] }
})

const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '')             // Trim - from end of text
}

// Auto-generate slug from name if not manually edited (simple version: always updates if clean)
watch(() => tour.value.name, (newName) => {
    // Only auto-generate if we are not editing an existing tour (or decide logic)
    // Better logic: If slug is empty OR matches previous name's slug, update it.
    // For simplicity: If creating new (not editing) AND user hasn't typed in slug manually (hard to track)
    // Let's just auto-fill if slug is empty or we are in "create" mode
    if (!isEditing.value && newName) {
         tour.value.slug = generateSlug(newName)
    }
})

const handleAddRegion = async () => {
    if (!newRegionName.value.trim()) return
    try {
        await addRegion(newRegionName.value.trim())
        availableRegions.value = await getRegions()
        tour.value.location = newRegionName.value.trim()
        isAddingRegion.value = false
        newRegionName.value = ''
    } catch (e) {
        alert("Failed to add region")
    }
}

const handleDeleteRegion = async () => {
    if (!tour.value.location) return
    if (confirm(`Are you sure you want to delete "${tour.value.location}" from the region list?`)) {
        try {
            await deleteRegion(tour.value.location)
            availableRegions.value = await getRegions()
            tour.value.location = ''
        } catch (e) {
            alert("Failed to delete region")
        }
    }
}

onMounted(async () => {
    // Load Regions
    try {
        availableRegions.value = await getRegions()
    } catch (e) {
        console.error("Failed to load regions", e)
    }

    // Load Tour if Editing
    if (isEditing.value) {
        try {
            const fetchedTour = await getTourById(route.params.id)
            tour.value = { ...tour.value, ...fetchedTour }
        } catch (error) {
            console.error("Failed to load tour", error)
            alert("Failed to load tour details")
            router.push('/admin/tours')
        }
    }
})

// UI State for dynamic inputs
const newInclusion = ref('')
const newExclusion = ref('')

// Step 1: Basic Info
const basicInfoValid = computed(() => {
  return tour.value.name && tour.value.location && tour.value.price && tour.value.duration
})

// Step 2: Media
// (No strict validation for media currently, but could add if needed)

// Step 3: Details
const addInclusion = () => {
  if (newInclusion.value.trim()) {
    tour.value.inclusions.push(newInclusion.value.trim())
    newInclusion.value = ''
  }
}
const removeInclusion = (index) => {
  tour.value.inclusions.splice(index, 1)
}

const addExclusion = () => {
  if (newExclusion.value.trim()) {
    tour.value.exclusions.push(newExclusion.value.trim())
    newExclusion.value = ''
  }
}
const removeExclusion = (index) => {
  tour.value.exclusions.splice(index, 1)
}

// Step 4: Itinerary
const addItineraryDay = () => {
  tour.value.itinerary.push({
    day: tour.value.itinerary.length + 1,
    day: tour.value.itinerary.length + 1,
    title: '',
    description: '',
    images: [] // New images array
  })
}
const removeItineraryDay = (index) => {
  tour.value.itinerary.splice(index, 1)
  // Re-number days
  tour.value.itinerary.forEach((item, i) => {
    item.day = i + 1
  })
}

// Image Handling
const handleGalleryUpload = async (event) => {
  const files = Array.from(event.target.files)
  if (!files.length) return
  
  isUploading.value = true
  uploadLabel.value = `Uploading ${files.length} images...`
  uploadProgress.value = 0

  try {
    const uploadPromises = files.map(file => uploadToR2(file, (progress) => {
       // Simple average progress for multiple files is tricky without individual tracking
       // For now, we'll just show indeterminate or "Processing" if multiple, 
       // but lets try to approximate: even simpler, just show the last one's progress or average.
       // With Promise.all, we can't easily aggregate synchronous progress events from multiple parallel uploads.
       // VISUAL HACK: We will just set it to a "busy" state or 50% mixed.
       // BETTER: Upload sequentially or use a smarter tracker.
       // For this specific robust request, let's just let the progress bar jump.
       uploadProgress.value = progress 
    }))
    
    // Actually, let's do sequential for better progress reporting if user wants "perfect flow"
    // Parallel is faster though. Let's keep parallel but simplify progress to "Processing..." 
    // OR just pick one file's progress to animate the bar. 
    // Let's stick to parallel for speed, but update progress from any file.
    
    const urls = await Promise.all(uploadPromises)
    tour.value.images.push(...urls)
  } catch (error) {
    console.error("Gallery upload failed", error)
    alert("Failed to upload images")
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
  }
}

const removeImage = (index) => {
  tour.value.images.splice(index, 1)
}

const handleItineraryImageUpload = async (event, dayIndex) => {
  const files = Array.from(event.target.files)
  if (!files.length) return
  
  // Enforce max 6 images
  const currentCount = tour.value.itinerary[dayIndex].images ? tour.value.itinerary[dayIndex].images.length : 0
  if (currentCount + files.length > 6) {
    alert("Max 6 images allowed per day.")
    return
  }

  try {
    isUploading.value = true
    uploadLabel.value = `Uploading ${files.length} images...`
    
    const uploadPromises = files.map(file => uploadToR2(file, (p) => uploadProgress.value = p))
    const urls = await Promise.all(uploadPromises)
    
    if (!tour.value.itinerary[dayIndex].images) {
      tour.value.itinerary[dayIndex].images = []
    }
    tour.value.itinerary[dayIndex].images.push(...urls)
  } catch (error) {
    console.error("Itinerary image upload failed", error)
    alert("Failed to upload images")
  } finally {
    isUploading.value = false
  }
}

const removeItineraryImage = (dayIndex, imgIndex) => {
  tour.value.itinerary[dayIndex].images.splice(imgIndex, 1)
}

const handleCoverImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
        isUploading.value = true
        uploadLabel.value = 'Uploading Cover Image...'
        const url = await uploadToR2(file, (p) => uploadProgress.value = p)
        tour.value.coverImage = url
    } catch (error) {
        console.error("Cover image upload failed", error)
        alert("Failed to upload cover image")
    } finally {
        isUploading.value = false
    }
}

// Navigation
const nextStep = () => {
  if (currentStep.value < 4) currentStep.value++
}
const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

// Submission
const submitTour = async () => {
  isSubmitting.value = true
  try {
    if (isEditing.value) {
        await updateTour(route.params.id, tour.value)
    } else {
        await addTour(tour.value)
    }
    router.push('/admin/tours')
  } catch (error) {
    console.error("Save Tour failed", error)
    alert("Failed to save tour. Please check permissions.")
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
            <h1 class="text-xl font-bold text-[#111618]">{{ isEditing ? 'Edit Tour' : 'Create New Tour' }}</h1>
            <p class="text-xs text-[#617c89]">Step {{ currentStep }} of 4</p>
          </div>
        </div>
        <div class="flex gap-2">
            <button v-if="currentStep > 1" @click="prevStep" class="px-4 py-2 text-sm font-bold text-[#617c89] hover:bg-gray-100 rounded-lg transition-colors">
                Back
            </button>
            <a v-if="isEditing && tour.status === 'Published'" :href="'/tours/' + route.params.id" target="_blank" 
                class="px-4 py-2 flex items-center gap-2 text-sm font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors">
                <span class="material-symbols-outlined text-[18px]">visibility</span> View Public
            </a>
            <button v-if="currentStep < 4" @click="nextStep" :disabled="!basicInfoValid && currentStep === 1" 
                class="px-6 py-2 bg-primary hover:bg-sky-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                Next Step
            </button>
            <button v-if="currentStep === 4" @click="submitTour" :disabled="isSubmitting"
                class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg shadow-lg shadow-green-600/20 transition-all flex items-center gap-2">
                <span v-if="isSubmitting" class="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update Tour' : 'Publish Tour') }}
            </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto p-4 md:p-8">
      
      <!-- Progress Bar -->
      <div class="mb-8 flex gap-2">
           <div v-for="step in 4" :key="step" 
                :class="['h-1.5 flex-1 rounded-full transition-colors', step <= currentStep ? 'bg-primary' : 'bg-gray-200']">
           </div>
      </div>

      <!-- Step 1: Basic Information -->
      <div v-show="currentStep === 1" class="flex flex-col gap-6 animate-fade-in">
        <div class="bg-white p-6 rounded-xl border border-[#dbe2e6] shadow-sm">
            <h2 class="text-lg font-bold text-[#111618] mb-4">Basic Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="md:col-span-2">
                    <label class="block text-base font-medium text-[#111618] mb-1.5">Tour Name</label>
                    <input v-model="tour.name" type="text" class="w-full bg-background-light border border-[#dbe2e6] rounded-lg px-4 py-3 text-[#111618] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder="e.g. Authentic Sri Lanka Experience">
                </div>
                <div class="md:col-span-2">
                    <label class="block text-base font-medium text-[#111618] mb-1.5">URL Slug (SEO)</label>
                    <div class="flex gap-2">
                         <input v-model="tour.slug" type="text" class="flex-1 bg-background-light border border-[#dbe2e6] rounded-lg px-4 py-3 text-[#111618] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-mono text-base" placeholder="e.g. authentic-sri-lanka-experience">
                         <button @click="tour.slug = generateSlug(tour.name)" class="px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-primary transition-colors text-base font-bold">
                             Generate
                         </button>
                    </div>
                </div>
                <div class="md:col-span-2">
                    <label class="block text-base font-medium text-[#111618] mb-1.5">Description</label>
                    <textarea v-model="tour.description" rows="4" class="w-full bg-background-light border border-[#dbe2e6] rounded-lg px-4 py-3 text-[#111618] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder="Describe the tour highlights..."></textarea>
                </div>
                <div class="md:col-span-2">
                    <label class="block text-base font-medium text-[#111618] mb-1.5">Tour Route</label>
                    <textarea v-model="tour.route" rows="2" class="w-full bg-background-light border border-[#dbe2e6] rounded-lg px-4 py-3 text-[#111618] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder="e.g. Colombo -> Kandy -> Nuwara Eliya -> Ella -> Mirissa -> Colombo"></textarea>
                </div>
                <div>
                    <label class="block text-base font-medium text-[#111618] mb-1.5">Location/Region</label>
                    <div class="flex gap-2" v-if="!isAddingRegion">
                        <select v-model="tour.location" class="w-full bg-background-light border border-[#dbe2e6] rounded-lg px-4 py-3 text-[#111618] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all">
                            <option value="" disabled>Select a region</option>
                            <option v-for="r in availableRegions" :key="r" :value="r">{{ r }}</option>
                        </select>
                        <button @click="isAddingRegion = true" class="px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-primary transition-colors" title="Add New Region">
                             <span class="material-symbols-outlined">add</span>
                        </button>
                        <button v-if="tour.location" @click="handleDeleteRegion" class="px-3 bg-red-50 hover:bg-red-100 rounded-lg text-red-500 transition-colors" title="Delete Selected Region">
                             <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                     <div class="flex gap-2" v-else>
                        <input v-model="newRegionName" @keyup.enter="handleAddRegion" type="text" class="w-full bg-background-light border border-[#dbe2e6] rounded-lg px-4 py-3 text-[#111618] focus:outline-none focus:border-primary" placeholder="Enter new region name" autoFocus>
                        <button @click="handleAddRegion" class="px-3 bg-primary text-white hover:bg-sky-500 rounded-lg transition-colors">Save</button>
                        <button @click="isAddingRegion = false" class="px-3 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
                    </div>
                </div>
                <div>
                     <label class="block text-base font-medium text-[#111618] mb-1.5">Tour Type</label>
                     <select v-model="tour.type" class="w-full bg-background-light border border-[#dbe2e6] rounded-lg px-4 py-3 text-[#111618] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all">
                         <option>Day Tour</option>
                         <option>Multi-day</option>
                     </select>
                </div>
                <div>
                    <label class="block text-base font-medium text-[#111618] mb-1.5">Price (USD)</label>
                    <input v-model="tour.price" type="text" class="w-full bg-background-light border border-[#dbe2e6] rounded-lg px-4 py-3 text-[#111618] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder="e.g. 150.00">
                </div>
                <div>
                    <label class="block text-base font-medium text-[#111618] mb-1.5">Duration</label>
                    <input v-model="tour.duration" type="text" class="w-full bg-background-light border border-[#dbe2e6] rounded-lg px-4 py-3 text-[#111618] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder="e.g. 3 Days">
                </div>
                 <div>
                     <label class="block text-base font-medium text-[#111618] mb-1.5">Status</label>
                     <select v-model="tour.status" class="w-full bg-background-light border border-[#dbe2e6] rounded-lg px-4 py-3 text-[#111618] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all">
                         <option>Draft</option>
                         <option>Published</option>
                         <option>Archived</option>
                     </select>
                </div>
            </div>
        </div>
      </div>

      <!-- Step 2: Media & Visuals -->
      <div v-show="currentStep === 2" class="flex flex-col gap-6 animate-fade-in">
        <div class="bg-white p-6 rounded-xl border border-[#dbe2e6] shadow-sm">
             <h2 class="text-lg font-bold text-[#111618] mb-4">Tour Media</h2>
             
             <!-- Cover Image Section -->
             <div class="mb-8">
                 <label class="block text-base font-bold text-[#111618] mb-2">Cover Image (Card Display)</label>
                 <div class="flex items-start gap-4">
                     <div v-if="tour.coverImage" class="relative group w-40 h-28 rounded-lg overflow-hidden bg-gray-100 border border-[#dbe2e6]">
                         <img :src="tour.coverImage" class="w-full h-full object-cover">
                         <button @click="tour.coverImage = ''" class="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-sm">
                             <span class="material-symbols-outlined text-[14px]">close</span>
                         </button>
                     </div>
                     <div v-else class="w-40 h-28 border-2 border-dashed border-[#dbe2e6] rounded-lg flex flex-col items-center justify-center hover:bg-gray-50 transition-colors relative cursor-pointer">
                         <input type="file" accept="image/*" @change="handleCoverImageUpload" class="absolute inset-0 opacity-0 cursor-pointer" />
                         <span class="material-symbols-outlined text-2xl text-[#617c89] mb-1">image</span>
                         <p class="text-[10px] font-bold text-[#617c89]">Upload Cover</p>
                     </div>
                     <div class="flex-1">
                         <p class="text-base text-[#617c89]">This image will be displayed on the tour card in the listing. Use a high-quality landscape image (approx 800x600).</p>
                     </div>
                 </div>
             </div>

             <h2 class="text-lg font-bold text-[#111618] mb-4">Gallery Images</h2>
             <div class="flex flex-col gap-4">
                 <div class="border-2 border-dashed border-[#dbe2e6] rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors relative cursor-pointer">
                     <input type="file" multiple accept="image/*" @change="handleGalleryUpload" class="absolute inset-0 opacity-0 cursor-pointer" />
                     <span class="material-symbols-outlined text-4xl text-[#617c89] mb-2">cloud_upload</span>
                     <p class="text-base font-bold text-[#111618]">Click to upload images</p>
                     <p class="text-xs text-[#617c89]">PNG, JPG up to 5MB</p>
                 </div>
                 
                 <div v-if="tour.images.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                     <div v-for="(img, idx) in tour.images" :key="idx" class="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                         <img :src="img" class="w-full h-full object-cover" />
                         <button @click="removeImage(idx)" class="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-sm">
                             <span class="material-symbols-outlined text-[14px]">close</span>
                         </button>
                     </div>
                 </div>
             </div>
        </div>
      </div>

      <!-- Step 3: Details (Inclusions/Exclusions) -->
      <div v-show="currentStep === 3" class="flex flex-col gap-6 animate-fade-in">
        <div class="bg-white p-6 rounded-xl border border-[#dbe2e6] shadow-sm">
            <h2 class="text-lg font-bold text-[#111618] mb-4">Inclusions & Exclusions</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Inclusions -->
                <div>
                     <label class="block text-base font-bold text-green-600 mb-2">What's Included</label>
                     <div class="flex gap-2 mb-3">
                         <input v-model="newInclusion" @keyup.enter="addInclusion" type="text" class="flex-1 bg-background-light border border-[#dbe2e6] rounded-lg px-3 py-2 text-base focus:outline-none focus:border-primary" placeholder="Add custom item...">
                         <button @click="addInclusion" class="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                             <span class="material-symbols-outlined text-[20px]">add</span>
                         </button>
                     </div>
                     <ul class="space-y-2">
                         <li v-for="(item, idx) in tour.inclusions" :key="idx" class="flex items-center justify-between p-2 bg-green-50/50 rounded-lg text-base text-[#111618] border border-green-100">
                             <span class="flex items-center gap-2"><span class="material-symbols-outlined text-green-500 text-[18px]">check</span> {{ item }}</span>
                             <button @click="removeInclusion(idx)" class="text-gray-400 hover:text-red-500"><span class="material-symbols-outlined text-[18px]">close</span></button>
                         </li>
                     </ul>
                </div>

                <!-- Exclusions -->
                <div>
                     <label class="block text-base font-bold text-red-600 mb-2">What's Excluded</label>
                     <div class="flex gap-2 mb-3">
                         <input v-model="newExclusion" @keyup.enter="addExclusion" type="text" class="flex-1 bg-background-light border border-[#dbe2e6] rounded-lg px-3 py-2 text-base focus:outline-none focus:border-primary" placeholder="Add custom item...">
                         <button @click="addExclusion" class="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                             <span class="material-symbols-outlined text-[20px]">add</span>
                         </button>
                     </div>
                     <ul class="space-y-2">
                         <li v-for="(item, idx) in tour.exclusions" :key="idx" class="flex items-center justify-between p-2 bg-red-50/50 rounded-lg text-base text-[#111618] border border-red-100">
                             <span class="flex items-center gap-2"><span class="material-symbols-outlined text-red-500 text-[18px]">block</span> {{ item }}</span>
                             <button @click="removeExclusion(idx)" class="text-gray-400 hover:text-red-500"><span class="material-symbols-outlined text-[18px]">close</span></button>
                         </li>
                     </ul>
                </div>
            </div>
        </div>
      </div>

       <!-- Step 4: Itinerary Builder -->
      <div v-show="currentStep === 4" class="flex flex-col gap-6 animate-fade-in">
        <div class="bg-white p-6 rounded-xl border border-[#dbe2e6] shadow-sm">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-lg font-bold text-[#111618]">Itinerary Timeline</h2>
                <button @click="addItineraryDay" class="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-base font-bold transition-colors">
                    <span class="material-symbols-outlined text-[18px]">add_circle</span> Add Day
                </button>
            </div>

            <div v-if="tour.itinerary.length === 0" class="text-center py-12 text-[#617c89]">
                <span class="material-symbols-outlined text-4xl mb-2 opacity-50">route</span>
                <p>Start building your tour itinerary by adding the first day.</p>
            </div>

            <div class="flex flex-col gap-4">
                <div v-for="(day, idx) in tour.itinerary" :key="idx" class="flex gap-4 p-4 rounded-xl border border-[#dbe2e6] bg-background-light/50">
                    <div class="flex flex-col items-center gap-2 pt-2">
                        <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">
                            {{ day.day }}
                        </div>
                        <div class="w-0.5 flex-1 bg-gray-200"></div>
                    </div>
                    <div class="flex-1 flex flex-col gap-4">
                        <div class="flex justify-between items-start">
                             <input v-model="day.title" type="text" class="flex-1 bg-white border border-[#dbe2e6] rounded-lg px-3 py-2 text-base font-bold focus:outline-none focus:border-primary" placeholder="Day Title (e.g. Arrival in Kandy)">
                             <button @click="removeItineraryDay(idx)" class="ml-4 text-red-500 hover:text-red-700 p-2"><span class="material-symbols-outlined text-[20px]">delete</span></button>
                        </div>
                        <textarea v-model="day.description" rows="3" class="w-full bg-white border border-[#dbe2e6] rounded-lg px-3 py-2 text-base focus:outline-none focus:border-primary" placeholder="Describe the activities for this day..."></textarea>
                        
                        <!-- Itinerary Images -->
                        <div class="flex flex-col gap-2">
                           <div class="flex items-center justify-between">
                             <label class="text-xs font-bold text-[#617c89]">Day Photos (Max 6)</label>
                             <label class="cursor-pointer text-xs text-primary font-bold hover:underline flex items-center gap-1">
                                <span class="material-symbols-outlined text-[16px]">add_a_photo</span> Add Photos
                                <input type="file" multiple accept="image/*" @change="(e) => handleItineraryImageUpload(e, idx)" class="hidden">
                             </label>
                           </div>
                           <div v-if="day.images && day.images.length > 0" class="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                              <div v-for="(img, imgIdx) in day.images" :key="imgIdx" class="relative group w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-[#dbe2e6]">
                                 <img :src="img" class="w-full h-full object-cover">
                                 <button @click="removeItineraryImage(idx, imgIdx)" class="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-sm">
                                    <span class="material-symbols-outlined text-[12px]">close</span>
                                 </button>
                              </div>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

    </div>

    <!-- Upload Progress Overlay -->
    <div v-if="isUploading" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div class="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl flex flex-col items-center gap-4 text-center border border-[#dbe2e6]">
            <div class="relative size-16">
                 <svg class="size-full rotate-[-90deg]" viewBox="0 0 36 36">
                    <path class="text-gray-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3"></path>
                    <path class="text-primary transition-all duration-300 ease-out" :stroke-dasharray="`${uploadProgress}, 100`" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3"></path>
                 </svg>
                 <div class="absolute inset-0 flex items-center justify-center font-bold text-sm text-[#111618]">{{ uploadProgress }}%</div>
            </div>
            <div>
                <h3 class="font-bold text-lg text-[#111618]">Uploading...</h3>
                <p class="text-sm text-[#617c89]">{{ uploadLabel }}</p>
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
/* Hide scrollbar for gallery previews */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
