<script setup>
import { ref, onMounted } from 'vue'
import { getGalleryAssets, addGalleryAsset, deleteGalleryAsset } from '../services/gallery'
import { uploadToR2 } from '../services/upload'

const assets = ref([])
const isLoading = ref(true)
const isUploading = ref(false)
const fileInput = ref(null)

onMounted(async () => {
    loadAssets()
})

const loadAssets = async () => {
    isLoading.value = true
    try {
        assets.value = await getGalleryAssets()
    } catch (e) {
        console.error("Failed to load assets", e)
    } finally {
        isLoading.value = false
    }
}

const triggerUpload = () => {
    fileInput.value.click()
}

const handleUpload = async (event) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    isUploading.value = true
    let successCount = 0
    let failCount = 0

    try {
        // Convert FileList to Array
        const fileArray = Array.from(files)

        for (const file of fileArray) {
            try {
                // 1. Upload to R2
                const publicUrl = await uploadToR2(file)
                
                // 2. Save to Firestore
                const assetData = {
                    url: publicUrl,
                    name: file.name,
                    type: file.type,
                    size: file.size
                }
                await addGalleryAsset(assetData)
                successCount++
            } catch (innerError) {
                console.error(`Failed to upload ${file.name}:`, innerError)
                failCount++
            }
        }
        
        // 3. Reload
        await loadAssets()

        if (failCount > 0) {
            alert(`Upload complete. Success: ${successCount}, Failed: ${failCount}`)
        }
    } catch (e) {
        alert("Upload process failed: " + e.message)
    } finally {
        isUploading.value = false
        event.target.value = '' // Reset input
    }
}

const deleteAsset = async (id) => {
    if (!confirm('Are you sure you want to delete this image?')) return
    
    try {
        await deleteGalleryAsset(id)
        assets.value = assets.value.filter(a => a.id !== id)
    } catch (e) {
        alert("Delete failed")
    }
}

const copyUrl = (url) => {
    navigator.clipboard.writeText(url)
    // Optional: Show toast
    alert("URL copied found to clipboard!")
}
</script>

<template>
  <div class="flex-1 flex flex-col h-full overflow-hidden bg-background-light relative">
    <main class="flex-1 overflow-y-auto p-6 md:p-10 pb-32">
      <div class="mx-auto flex flex-col gap-8">
        <!-- Breadcrumbs -->
        <nav class="flex flex-wrap gap-2 items-center text-sm">
          <RouterLink to="/admin" class="text-[#617c89] hover:text-primary transition-colors font-medium">Home</RouterLink>
          <span class="text-[#617c89]/50 font-medium">/</span>
          <span class="text-[#111618] font-medium">Gallery</span>
        </nav>

        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 class="text-[#111618] text-3xl md:text-4xl font-black tracking-tight">Gallery Assets</h1>
              <p class="text-[#617c89] text-base font-normal mt-2">
                Centralize your images here. Upload once and copy URL to use anywhere.
              </p>
            </div>
            <button @click="triggerUpload" :disabled="isUploading" 
                class="flex items-center gap-2 bg-primary hover:bg-sky-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed">
                <span class="material-symbols-outlined">{{ isUploading ? 'cloud_upload' : 'add_photo_alternate' }}</span>
                {{ isUploading ? 'Uploading...' : 'Upload Images' }}
            </button>
            <input type="file" ref="fileInput" @change="handleUpload" accept="image/*" multiple class="hidden" />
        </div>

        <!-- content -->
        <div v-if="isLoading" class="flex justify-center py-20">
            <span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
        </div>

        <div v-else-if="assets.length === 0" class="flex flex-col items-center justify-center py-20 text-[#617c89]">
            <span class="material-symbols-outlined text-6xl mb-4">perm_media</span>
            <p class="text-xl font-medium">No images found</p>
            <p class="mt-2">Upload your first image to get started</p>
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div v-for="asset in assets" :key="asset.id" class="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                <img :src="asset.url" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                
                <!-- Overlay -->
                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
                    <button @click="copyUrl(asset.url)" class="bg-white text-black px-4 py-2 rounded-lg font-bold text-sm transform hover:scale-105 transition flex items-center gap-2">
                        <span class="material-symbols-outlined text-sm">link</span> Copy URL
                    </button>
                     <button @click="deleteAsset(asset.id)" class="text-white hover:text-red-400 transition transform hover:scale-110">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                    <span class="text-xs text-white/70 truncate w-full text-center px-2">{{ asset.name }}</span>
                </div>
            </div>
        </div>
      </div>
    </main>
  </div>
</template>
