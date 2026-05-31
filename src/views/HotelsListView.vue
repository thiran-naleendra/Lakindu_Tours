<script setup>
import { ref, onMounted, computed } from 'vue'
import { getHotels, deleteHotel, addHotel } from '../services/hotels'
import { useRouter } from 'vue-router'

const router = useRouter()
const hotels = ref([])
const searchQuery = ref('')
const isLoading = ref(true)
const errorMessage = ref('')
const showDocs = ref(false)
const fileInput = ref(null)
const importLoading = ref(false)

const handleExport = () => {
    const dataStr = JSON.stringify(hotels.value, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = 'hotels_export_' + new Date().toISOString().slice(0,10) + '.json'
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
}

const triggerImport = () => {
    fileInput.value.click()
}

const handleImport = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    importLoading.value = true
    errorMessage.value = ''
    const reader = new FileReader()
    reader.onload = async (e) => {
        try {
            const importedData = JSON.parse(e.target.result)
            if (!Array.isArray(importedData)) throw new Error("File must contain an array of hotels")

            let successCount = 0
            for (const hotel of importedData) {
                // Remove ID to treat as new data
                const { id, ...hotelData } = hotel
                await addHotel(hotelData)
                successCount++
            }
            alert(`Successfully imported ${successCount} hotels.`)
            await loadHotels()
        } catch (error) {
            console.error("Import failed", error)
            errorMessage.value = "Import failed: " + error.message
        } finally {
            importLoading.value = false
            event.target.value = '' 
        }
    }
    reader.readAsText(file)
}

const jsonExample = `{
  "name": "Luxury Resort",
  "location": "Galle",
  "rating": 5,
  "description": "A beautiful beachfront resort...",
  "tag": "Recommended",
  "website": "https://example.com",
  "image": "https://...",
  "amenities": ["Pool", "Spa", "WiFi"]
}`

const loadHotels = async () => {
    isLoading.value = true
    errorMessage.value = ''
    try {
        console.log("Loading hotels...")
        hotels.value = await getHotels()
        console.log("Loaded hotels:", hotels.value)
    } catch (error) {
        console.error("Failed to load hotels", error)
        errorMessage.value = "Error loading hotels: " + (error.message || "Unknown error")
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    loadHotels()
})

const filteredHotels = computed(() => {
    if (!searchQuery.value) return hotels.value
    const lowerQuery = searchQuery.value.toLowerCase()
    return hotels.value.filter(hotel => 
        (hotel.name && hotel.name.toLowerCase().includes(lowerQuery)) || 
        (hotel.location && hotel.location.toLowerCase().includes(lowerQuery))
    )
})

const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this hotel?')) {
        try {
            await deleteHotel(id)
            hotels.value = hotels.value.filter(h => h.id !== id)
        } catch (error) {
            alert("Failed to delete hotel")
        }
    }
}
</script>

<template>
  <div class="flex-1 w-full mx-auto p-4 md:p-8 pb-24 bg-background-light">
    <div class="max-w-7xl mx-auto">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
           <h1 class="text-[#111618] text-3xl md:text-4xl font-black tracking-tight">Hotels</h1>
           <p class="text-[#617c89] text-sm mt-1">Manage your partner hotels and accommodations.</p>
        </div>
        <button @click="router.push('/admin/hotels/create')" class="bg-primary hover:bg-sky-500 text-white rounded-xl px-6 py-3 font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
            <span class="material-symbols-outlined">add</span> Add New Hotel
        </button>
      </div>

       <div class="flex gap-3 justify-end mb-6">
             <button @click="showDocs = true" class="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-gray-100 hover:bg-gray-200 text-[#111618] text-sm font-bold tracking-wide transition-all shadow-sm shrink-0 border border-gray-200">
                <span class="material-symbols-outlined text-[20px]">help</span>
                <span class="hidden sm:inline">JSON Format</span>
            </button>
             <button @click="handleExport" class="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-gray-100 hover:bg-gray-200 text-[#111618] text-sm font-bold tracking-wide transition-all shadow-sm shrink-0 border border-gray-200">
                <span class="material-symbols-outlined text-[20px]">download</span>
                <span class="hidden sm:inline">Export</span>
            </button>
             <button @click="triggerImport" :disabled="importLoading" class="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-gray-100 hover:bg-gray-200 text-[#111618] text-sm font-bold tracking-wide transition-all shadow-sm shrink-0 border border-gray-200">
                <span v-if="importLoading" class="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                <span v-else class="material-symbols-outlined text-[20px]">upload</span>
                <span class="hidden sm:inline">Import</span>
            </button>
            <input type="file" ref="fileInput" @change="handleImport" accept=".json" class="hidden" />
      </div>

       <!-- JSON Documentation Modal -->
      <div v-if="showDocs" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="showDocs = false">
          <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
              <div class="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 class="text-xl font-bold">Hotel JSON Format</h3>
                  <button @click="showDocs = false" class="text-gray-500 hover:text-gray-700">
                      <span class="material-symbols-outlined">close</span>
                  </button>
              </div>
              <div class="p-6 overflow-y-auto">
                  <p class="text-sm text-gray-600 mb-4">
                      To import hotels, upload a JSON file containing an array of hotel objects. Structure:
                  </p>
                  <div class="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                      <pre class="text-xs font-mono text-gray-800">{{ jsonExample }}</pre>
                  </div>
              </div>
              <div class="p-4 border-t border-gray-100 flex justify-end">
                  <button @click="showDocs = false" class="px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm">Got it</button>
              </div>
          </div>
      </div>



      <!-- Error Message -->
      <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6">
          <strong>Error:</strong> {{ errorMessage }}
      </div>

       <!-- Search & Functionality -->
      <div class="bg-white p-4 rounded-xl shadow-sm border border-[#dbe2e6] mb-6 flex flex-col md:flex-row gap-4">
          <div class="relative flex-1">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input v-model="searchQuery" type="text" placeholder="Search hotels..." class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-[#dbe2e6] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-[#111618]">
          </div>
      </div>

      <!-- Hotels List -->
      <div class="bg-white rounded-xl shadow-sm border border-[#dbe2e6] overflow-hidden">
          <div v-if="isLoading" class="p-12 flex justify-center">
              <span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
          </div>

          <table v-else class="w-full text-left border-collapse">
              <thead class="bg-gray-50 border-b border-[#dbe2e6]">
                  <tr>
                      <th class="p-4 text-xs font-bold text-[#617c89] uppercase tracking-wider w-20">Image</th>
                      <th class="p-4 text-xs font-bold text-[#617c89] uppercase tracking-wider">Hotel Details</th>
                      <th class="p-4 text-xs font-bold text-[#617c89] uppercase tracking-wider">Location</th>
                      <th class="p-4 text-xs font-bold text-[#617c89] uppercase tracking-wider">Rating</th>
                      <th class="p-4 text-xs font-bold text-[#617c89] uppercase tracking-wider text-right">Actions</th>
                  </tr>
              </thead>
              <tbody class="divide-y divide-[#f0f3f4]">
                  <tr v-if="filteredHotels.length === 0">
                      <td colspan="5" class="p-8 text-center text-[#617c89]">No hotels found.</td>
                  </tr>
                  <tr v-for="hotel in filteredHotels" :key="hotel.id" class="hover:bg-gray-50 transition-colors group">
                      <td class="p-4">
                          <div class="w-16 h-12 rounded-lg bg-gray-100 overflow-hidden">
                              <img v-if="hotel.image" :src="hotel.image" class="w-full h-full object-cover">
                              <div v-else class="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                          </div>
                      </td>
                      <td class="p-4">
                          <p class="font-bold text-[#111618]">{{ hotel.name }}</p>
                          <span v-if="hotel.tag" class="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-[10px] uppercase font-bold rounded">{{ hotel.tag }}</span>
                      </td>
                      <td class="p-4 text-sm text-[#617c89]">{{ hotel.location }}</td>
                      <td class="p-4">
                          <div class="flex items-center gap-1 text-sm font-bold text-[#111618]">
                              <span class="material-symbols-outlined text-yellow-500 text-[18px]">star</span>
                              {{ hotel.rating }} <span class="text-xs font-normal text-[#617c89] ml-1">({{ hotel.reviews }} rev)</span>
                          </div>
                      </td>
                      <td class="p-4 text-right">
                          <div class="flex items-center justify-end gap-2">
                              <button @click="router.push(`/admin/hotels/edit/${hotel.id}`)" class="p-2 text-[#617c89] hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit">
                                  <span class="material-symbols-outlined text-[20px]">edit</span>
                              </button>
                              <button @click="handleDelete(hotel.id)" class="p-2 text-[#617c89] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                  <span class="material-symbols-outlined text-[20px]">delete</span>
                              </button>
                          </div>
                      </td>
                  </tr>
              </tbody>
          </table>
      </div>
    </div>
  </div>
</template>
