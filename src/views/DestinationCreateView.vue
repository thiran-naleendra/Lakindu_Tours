<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { addDestination, updateDestination, getDestinationById } from '../services/destinations'
import { uploadToR2 } from '../services/upload'

const router = useRouter()
const route = useRoute()
const isEditing = computed(() => !!route.params.id)
const currentStep = ref(1)
const isSubmitting = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const uploadLabel = ref('Uploading...')

// Form Data State
const destination = ref({
  name: '',
  slug: '',
  description: '',
  region: '',
  country: 'Sri Lanka',
  status: 'Draft',
  image: '',
  gallery: [],
  excursions: [] // Array of { title, description, link, image }
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

watch(() => destination.value.name, (newName) => {
    if (!isEditing.value && newName) {
         destination.value.slug = generateSlug(newName)
    }
})

onMounted(async () => {
  if (isEditing.value) {
    try {
        const fetchedDest = await getDestinationById(route.params.id)
        destination.value = { 
            ...destination.value, 
            ...fetchedDest,
            gallery: fetchedDest.gallery || [],
            excursions: fetchedDest.excursions || [] 
        }
    } catch (error) {
        console.error("Failed to load destination", error)
        alert("Failed to load destination details")
        router.push('/admin/destinations')
    }
  }
})

// Step 1: Basic Info
const basicInfoValid = computed(() => {
  return destination.value.name && destination.value.region
})

// Image Handling (Cover)
const handleCoverUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  try {
    isUploading.value = true
    uploadLabel.value = 'Uploading Cover Image...'
    const url = await uploadToR2(file, (p) => uploadProgress.value = p)
    destination.value.image = url
  } catch (error) {
    console.error("Cover upload failed", error)
    alert("Failed to upload image")
  } finally {
    isUploading.value = false
  }
}

// Regions Logic
import { getRegions, addRegion, deleteRegion } from '../services/settings'
const availableRegions = ref([])
const isAddingRegion = ref(false)
const newRegionName = ref('')

onMounted(async () => {
    try {
        availableRegions.value = await getRegions()
    } catch (e) {
        console.error("Failed to load regions", e)
    }
})

const handleAddRegion = async () => {
    if (!newRegionName.value.trim()) return
    try {
        await addRegion(newRegionName.value.trim())
        availableRegions.value = await getRegions()
        destination.value.region = newRegionName.value.trim()
        isAddingRegion.value = false
        newRegionName.value = ''
    } catch (e) {
        alert("Failed to add region")
    }
}

const handleDeleteRegion = async () => {
    if (!destination.value.region) return
    if (confirm(`Are you sure you want to delete "${destination.value.region}" from the region list?`)) {
        try {
            await deleteRegion(destination.value.region)
            availableRegions.value = await getRegions()
            destination.value.region = ''
        } catch (e) {
            alert("Failed to delete region")
        }
    }
}

// Step 2: Excursions Builder
const addExcursion = () => {
    destination.value.excursions.push({
        title: '',
        description: '',
        link: '',
        image: ''
    })
}

const removeExcursion = (index) => {
    destination.value.excursions.splice(index, 1)
}

const handleExcursionImageUpload = async (event, index) => {
    const file = event.target.files[0]
    if (!file) return
    
    try {
        isUploading.value = true
        uploadLabel.value = 'Uploading Excursion Image...'
        const url = await uploadToR2(file, (p) => uploadProgress.value = p)
        destination.value.excursions[index].image = url
    } catch (error) {
        console.error("Excursion image upload failed", error)
        alert("Failed to upload image")
    } finally {
        isUploading.value = false
    }
}

// Gallery Logic
const handleGalleryUpload = async (event) => {
    const files = Array.from(event.target.files)
    if (files.length === 0) return
    
    isUploading.value = true
    uploadLabel.value = `Uploading ${files.length} images to gallery...`
    
    try {
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            uploadLabel.value = `Uploading gallery image ${i + 1}/${files.length}...`
            const url = await uploadToR2(file, (p) => {
                // Approximate overall progress
                uploadProgress.value = Math.round(((i / files.length) * 100) + (p / files.length))
            })
            destination.value.gallery.push(url)
        }
        uploadProgress.value = 100
    } catch (error) {
        console.error("Gallery upload failed", error)
        alert("Failed to upload some gallery images")
    } finally {
        isUploading.value = false
        uploadProgress.value = 0
        event.target.value = '' // Clear input
    }
}

const removeGalleryImage = (index) => {
    destination.value.gallery.splice(index, 1)
}

// Navigation
const nextStep = () => {
  if (currentStep.value < 2) currentStep.value++
}
const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

// Submission
const submitDestination = async () => {
  isSubmitting.value = true
  try {
    if (isEditing.value) {
        await updateDestination(route.params.id, destination.value)
    } else {
        await addDestination(destination.value)
    }
    router.push('/admin/destinations')
  } catch (error) {
    console.error("Save Destination failed", error)
    alert("Failed to save destination. Please check permissions.")
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
            <h1 class="text-xl font-bold text-[#111618]">{{ isEditing ? 'Edit Destination' : 'Add New Destination' }}</h1>
            <p class="text-xs text-[#617c89]">Step {{ currentStep }} of 2</p>
          </div>
        </div>
        <div class="flex gap-2">
            <button v-if="currentStep > 1" @click="prevStep" class="px-4 py-2 text-sm font-bold text-[#617c89] hover:bg-gray-100 rounded-lg transition-colors">
                Back
            </button>
            <button v-if="currentStep < 2" @click="nextStep" :disabled="!basicInfoValid" 
                class="px-6 py-2 bg-primary hover:bg-sky-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                Next Step
            </button>
            <button v-if="currentStep === 2" @click="submitDestination" :disabled="isSubmitting"
                class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg shadow-lg shadow-green-600/20 transition-all flex items-center gap-2">
                <span v-if="isSubmitting" class="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update Destination' : 'Create Destination') }}
            </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto p-4 md:p-8">
      
      <!-- Progress Bar -->
      <div class="mb-8 flex gap-2">
           <div v-for="step in 2" :key="step" 
                :class="['h-1.5 flex-1 rounded-full transition-colors', step <= currentStep ? 'bg-primary' : 'bg-gray-200']">
           </div>
      </div>

      <!-- Step 1: Basic Information -->
      <div v-show="currentStep === 1" class="flex flex-col gap-6 animate-fade-in">
        <div class="bg-white p-6 rounded-xl border border-[#dbe2e6] shadow-sm">
            <h2 class="text-lg font-bold text-[#111618] mb-4">Destination Details</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-[#111618] mb-1.5">Destination Name</label>
                    <input v-model="destination.name" type="text" class="w-full bg-background-light border border-[#dbe2e6] rounded-lg px-4 py-3 text-[#111618] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder="e.g. Ella">
                </div>
                <div class="md:col-span-2">
                    <label class="block text-base font-medium text-[#111618] mb-1.5">URL Slug (SEO)</label>
                    <div class="flex gap-2">
                         <input v-model="destination.slug" type="text" class="flex-1 bg-background-light border border-[#dbe2e6] rounded-lg px-4 py-3 text-[#111618] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-mono text-base" placeholder="e.g. ella-sri-lanka">
                         <button @click="destination.slug = generateSlug(destination.name)" class="px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-primary transition-colors text-base font-bold">
                             Generate
                         </button>
                    </div>
                </div>
                <div class="md:col-span-2">
                    <label class="block text-base font-medium text-[#111618] mb-1.5">Description</label>
                    <textarea v-model="destination.description" rows="4" class="w-full bg-background-light border border-[#dbe2e6] rounded-lg px-4 py-3 text-[#111618] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder="Brief description of the destination..."></textarea>
                </div>
                <div>
                    <label class="block text-base font-medium text-[#111618] mb-1.5">Region/Province</label>
                    <div class="flex gap-2" v-if="!isAddingRegion">
                        <select v-model="destination.region" class="w-full bg-background-light border border-[#dbe2e6] rounded-lg px-4 py-3 text-[#111618] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all">
                            <option value="" disabled>Select a region</option>
                            <option v-for="r in availableRegions" :key="r" :value="r">{{ r }}</option>
                        </select>
                        <button @click="isAddingRegion = true" class="px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-primary transition-colors" title="Add New Region">
                             <span class="material-symbols-outlined">add</span>
                        </button>
                        <button v-if="destination.region" @click="handleDeleteRegion" class="px-3 bg-red-50 hover:bg-red-100 rounded-lg text-red-500 transition-colors" title="Delete Selected Region">
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
                     <label class="block text-base font-medium text-[#111618] mb-1.5">Status</label>
                     <select v-model="destination.status" class="w-full bg-background-light border border-[#dbe2e6] rounded-lg px-4 py-3 text-[#111618] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all">
                         <option>Draft</option>
                         <option>Active</option>
                         <option>Archived</option>
                     </select>
                </div>
                <!-- Cover Image -->
                <div class="md:col-span-2">
                    <label class="block text-base font-medium text-[#111618] mb-1.5">Cover Image</label>
                    <div class="flex items-start gap-4">
                        <div class="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden border border-[#dbe2e6] shrink-0">
                             <img v-if="destination.image" :src="destination.image" class="w-full h-full object-cover">
                             <div v-else class="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                        </div>
                        <div class="flex-1">
                             <input type="file" accept="image/*" @change="handleCoverUpload" class="block w-full text-base text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-base file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"/>
                             <p class="text-xs text-[#617c89] mt-2">Recommended: 1200x800px JPG/PNG</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <!-- Step 2: Excursions & Gallery -->
      <div v-show="currentStep === 2" class="flex flex-col gap-6 animate-fade-in">
        <div class="bg-white p-6 rounded-xl border border-[#dbe2e6] shadow-sm">
            <div class="flex items-center justify-between mb-6">
                <div>
                     <h2 class="text-lg font-bold text-[#111618]">Excursions & Attractions</h2>
                     <p class="text-base text-[#617c89]">Add key places to visit in this destination.</p>
                </div>
                <button @click="addExcursion" class="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-base font-bold transition-colors">
                    <span class="material-symbols-outlined text-[18px]">add_circle</span> Add Excursion
                </button>
            </div>

            <div v-if="destination.excursions.length === 0" class="text-center py-12 text-[#617c89]">
                <span class="material-symbols-outlined text-4xl mb-2 opacity-50">landscape</span>
                <p>No excursions added yet.</p>
            </div>

            <div class="flex flex-col gap-6">
                <div v-for="(item, idx) in destination.excursions" :key="idx" class="p-4 rounded-xl border border-[#dbe2e6] bg-background-light/50 relative group">
                    <button @click="removeExcursion(idx)" class="absolute top-4 right-4 w-7 h-7 bg-red-100 hover:bg-red-200 text-red-500 rounded-full flex items-center justify-center transition-colors">
                        <span class="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                         <div class="md:col-span-2">
                             <label class="block text-xs font-bold text-[#617c89] mb-1">Title</label>
                             <input v-model="item.title" type="text" class="w-full bg-white border border-[#dbe2e6] rounded-lg px-3 py-2 text-base focus:outline-none focus:border-primary" placeholder="e.g. Nine Arches Bridge">
                         </div>
                         <div class="md:col-span-2">
                             <label class="block text-xs font-bold text-[#617c89] mb-1">Description</label>
                             <textarea v-model="item.description" rows="2" class="w-full bg-white border border-[#dbe2e6] rounded-lg px-3 py-2 text-base focus:outline-none focus:border-primary" placeholder="Short description..."></textarea>
                         </div>
                         <div>
                             <label class="block text-xs font-bold text-[#617c89] mb-1">Google Maps Link</label>
                             <input v-model="item.link" type="text" class="w-full bg-white border border-[#dbe2e6] rounded-lg px-3 py-2 text-base focus:outline-none focus:border-primary" placeholder="https://goo.gl/maps/...">
                         </div>
                         <div>
                             <label class="block text-xs font-bold text-[#617c89] mb-1">Image</label>
                             <div class="flex items-center gap-2">
                                 <div class="w-10 h-10 bg-gray-100 rounded overflow-hidden shrink-0">
                                     <img v-if="item.image" :src="item.image" class="w-full h-full object-cover">
                                 </div>
                                 <input type="file" accept="image/*" @change="(e) => handleExcursionImageUpload(e, idx)" class="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Gallery Section -->
        <div class="bg-white p-6 rounded-xl border border-[#dbe2e6] shadow-sm">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-bold text-[#111618]">Travel Snapshots (Gallery)</h2>
                <label class="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-sm font-bold transition-colors cursor-pointer">
                    <span class="material-symbols-outlined text-[18px] align-middle mr-1">add_a_photo</span> Add Images
                    <input type="file" multiple accept="image/*" @change="handleGalleryUpload" class="hidden">
                </label>
            </div>
            
            <div v-if="destination.gallery && destination.gallery.length === 0" class="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl text-[#617c89]">
                <span class="material-symbols-outlined text-4xl mb-2 opacity-50">collections</span>
                <p>No gallery images added.</p>
            </div>

            <div v-else-if="destination.gallery" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <div v-for="(img, idx) in destination.gallery" :key="idx" class="relative group aspect-square rounded-lg overflow-hidden border border-[#dbe2e6]">
                    <img :src="img" class="w-full h-full object-cover">
                    <button @click="removeGalleryImage(idx)" class="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        <span class="material-symbols-outlined text-[16px]">close</span>
                    </button>
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
</style>
