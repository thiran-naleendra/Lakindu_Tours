<script setup>
import { ref, computed, onMounted } from 'vue'
import { getTours, deleteTour, addTour } from '../services/tours'
import { uploadToR2 } from '../services/upload'

const showDocs = ref(false)
const fileInput = ref(null)
const importLoading = ref(false)

const handleExport = () => {
    const dataStr = JSON.stringify(tours.value, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = 'tours_export_' + new Date().toISOString().slice(0,10) + '.json'
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
    const reader = new FileReader()
    reader.onload = async (e) => {
        try {
            let importedData = JSON.parse(e.target.result)
            
            // Handle single object import by wrapping in array
            if (!Array.isArray(importedData)) {
                importedData = [importedData]
            }

            let successCount = 0
            for (const tour of importedData) {
                // Basic validation or sanitization could go here
                // Remove ID to let Firestore generate a new one, or keep it if doing a restored backup (careful with duplicates)
                // For simplicity, we treat this as creating NEW copies to avoid overwriting issues.
                const { id, ...tourData } = tour
                
                await addTour(tourData)
                successCount++
            }
            alert(`Successfully imported ${successCount} tours.`)
            await loadTours() // Reload list
        } catch (error) {
            console.error("Import failed", error)
            alert("Import failed: " + error.message)
        } finally {
            importLoading.value = false
            event.target.value = '' // Reset input
        }
    }
    reader.readAsText(file)
}

const jsonExample = `{
  "name": "Classic Sri Lanka",
  "type": "Multi-day",
  "price": "$1200",
  "duration": "10 Days",
  "location": "Colombo",
  "status": "Published",
  "description": "A comprehensive tour...",
  "images": ["url1", "url2"],
  "itinerary": [
    {
       "day": 1,
       "title": "Arrival",
       "description": "...",
       "images": ["url1"]
    }
  ],
  "inclusions": ["Transport", "Hotels"],
  "exclusions": ["Flights", "Tips"]
}`

const searchQuery = ref('')
const selectedType = ref('All Types')
const selectedStatus = ref('Any Status')
const selectedDestination = ref('All Destinations')
const tours = ref([])
// Form Data
// (Removed legacy modal state)

onMounted(async () => {
  await loadTours()
})

const loadTours = async () => {
  try {
    tours.value = await getTours()
  } catch (error) {
    console.error("Failed to load tours", error)
  }
}

const stats = computed(() => {
  const total = tours.value.length
  const active = tours.value.filter(t => t.status === 'Published').length
  const drafts = tours.value.filter(t => t.status === 'Draft').length
  return [
    { label: 'Total Tours', value: total, icon: 'inventory_2', color: 'text-[#617c89]' },
    { label: 'Active Tours', value: active, icon: 'check_circle', color: 'text-green-600', filled: true },
    { label: 'Drafts', value: drafts, icon: 'edit_document', color: 'text-amber-600', filled: true }
  ]
})

const handleDeleteTour = async (id) => {
  if (confirm("Are you sure you want to delete this tour? This action cannot be undone.")) {
    try {
      await deleteTour(id)
      // Optimistic update or reload
      tours.value = tours.value.filter(t => t.id !== id)
    } catch (error) {
       console.error("Delete failed", error)
       alert("Failed to delete tour")
    }
  }
}

const filteredTours = computed(() => {
  return tours.value.filter(tour => {
    const matchesSearch = tour.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          tour.location.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesType = selectedType.value === 'All Types' || tour.type === selectedType.value
    const matchesStatus = selectedStatus.value === 'Any Status' || tour.status === selectedStatus.value
    return matchesSearch && matchesType && matchesStatus
  })
})

const resetFilters = () => {
  searchQuery.value = ''
  selectedType.value = 'All Types'
  selectedStatus.value = 'Any Status'
  selectedDestination.value = 'All Destinations'
}
</script>

<template>
  <div class="p-4 md:p-8 bg-background-light min-h-screen">
    <div class="mx-auto flex flex-col gap-8">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex flex-col gap-1">
          <h1 class="text-[#111618] text-3xl md:text-4xl font-extrabold tracking-tight">All Tours</h1>
          <p class="text-[#617c89] text-base font-normal">Manage your tour inventory, prices, and availability.</p>
        </div>
        <div class="flex gap-3">
             <button @click="showDocs = true" class="flex items-center justify-center gap-2 rounded-lg h-12 px-4 bg-gray-100 hover:bg-gray-200 text-[#111618] text-sm font-bold tracking-wide transition-all shadow-sm shrink-0 border border-gray-200">
                <span class="material-symbols-outlined text-[20px]">help</span>
                <span class="hidden sm:inline">JSON Format</span>
            </button>
             <button @click="handleExport" class="flex items-center justify-center gap-2 rounded-lg h-12 px-4 bg-gray-100 hover:bg-gray-200 text-[#111618] text-sm font-bold tracking-wide transition-all shadow-sm shrink-0 border border-gray-200">
                <span class="material-symbols-outlined text-[20px]">download</span>
                <span class="hidden sm:inline">Export</span>
            </button>
             <button @click="triggerImport" :disabled="importLoading" class="flex items-center justify-center gap-2 rounded-lg h-12 px-4 bg-gray-100 hover:bg-gray-200 text-[#111618] text-sm font-bold tracking-wide transition-all shadow-sm shrink-0 border border-gray-200">
                <span v-if="importLoading" class="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                <span v-else class="material-symbols-outlined text-[20px]">upload</span>
                <span class="hidden sm:inline">Import</span>
            </button>
            <input type="file" ref="fileInput" @change="handleImport" accept=".json" class="hidden" />
            
            <RouterLink to="/admin/tours/create" class="flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-primary hover:bg-sky-500 text-white text-sm font-bold tracking-wide transition-all shadow-sm shrink-0">
            <span class="material-symbols-outlined text-[20px]">add</span>
            <span>Create New Tour</span>
            </RouterLink>
        </div>
      </div>

      <!-- JSON Documentation Modal -->
      <div v-if="showDocs" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="showDocs = false">
          <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
              <div class="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 class="text-xl font-bold">Tour JSON Format</h3>
                  <button @click="showDocs = false" class="text-gray-500 hover:text-gray-700">
                      <span class="material-symbols-outlined">close</span>
                  </button>
              </div>
              <div class="p-6 overflow-y-auto">
                  <p class="text-sm text-gray-600 mb-4">
                      To import tours, upload a JSON file containing an array of tour objects. Each object should follow this structure:
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

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="stat in stats" :key="stat.label"
          class="flex flex-col gap-2 rounded-xl p-6 bg-white border border-[#dbe2e6] shadow-sm">
          <div :class="['flex items-center gap-2', stat.color]">
            <span :class="['material-symbols-outlined text-[20px]', { 'filled': stat.filled }]">{{ stat.icon }}</span>
            <p class="text-sm font-medium uppercase tracking-wider">{{ stat.label }}</p>
          </div>
          <p class="text-[#111618] text-3xl font-bold">{{ stat.value }}</p>
        </div>
      </div>

      <!-- Search and Filters Toolbar -->
      <div class="bg-white p-4 rounded-xl border border-[#dbe2e6] shadow-sm flex flex-col lg:flex-row gap-4">
        <div class="flex-1 relative">
          <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#617c89]">search</span>
          <input v-model="searchQuery"
            class="w-full h-12 pl-11 pr-4 rounded-lg bg-background-light border-transparent focus:bg-white focus:border-primary focus:ring-0 text-[#111618] placeholder:text-[#617c89] transition-all"
            placeholder="Search by name, ID, or location..." type="text" />
        </div>
        <div class="flex overflow-x-auto gap-3 pb-1 lg:pb-0 hide-scrollbar">
          <select v-model="selectedType" class="h-12 rounded-lg bg-background-light border-transparent px-4 min-w-[140px] text-[#111618] text-sm font-medium focus:ring-primary">
            <option>All Types</option>
            <option>Day Tour</option>
            <option>Multi-day</option>
          </select>
          <select v-model="selectedStatus" class="h-12 rounded-lg bg-background-light border-transparent px-4 min-w-[140px] text-[#111618] text-sm font-medium focus:ring-primary">
            <option>Any Status</option>
            <option>Published</option>
            <option>Draft</option>
            <option>Archived</option>
          </select>
          <button @click="resetFilters" class="flex h-12 items-center justify-center shrink-0 px-4 text-primary text-sm font-bold hover:bg-primary/5 rounded-lg transition-colors">
            Reset
          </button>
        </div>
      </div>

      <!-- Tours Data Table -->
      <div class="bg-white rounded-xl border border-[#dbe2e6] shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[800px] text-left border-collapse">
            <thead>
              <tr class="bg-background-light border-b border-[#dbe2e6]">
                <th class="p-4 text-xs font-bold text-[#617c89] uppercase tracking-wider w-[35%]">Tour Name</th>
                <th class="p-4 text-xs font-bold text-[#617c89] uppercase tracking-wider w-[12%]">Type</th>
                <th class="p-4 text-xs font-bold text-[#617c89] uppercase tracking-wider w-[12%]">Price</th>
                <th class="p-4 text-xs font-bold text-[#617c89] uppercase tracking-wider w-[12%]">Duration</th>
                <th class="p-4 text-xs font-bold text-[#617c89] uppercase tracking-wider w-[12%]">Status</th>
                <th class="p-4 text-xs font-bold text-[#617c89] uppercase tracking-wider w-[10%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#dbe2e6]">
              <tr v-if="filteredTours.length === 0" class="text-center">
                <td colspan="6" class="py-12 text-slate-500">
                  No tours found.
                </td>
              </tr>
              <tr v-for="tour in filteredTours" :key="tour.id" class="group hover:bg-[#f8fafc] transition-colors">
                <td class="p-4">
                  <div class="flex items-center gap-4">
                     <div class="w-16 h-12 rounded-lg bg-gray-100 shrink-0 border border-[#dbe2e6] overflow-hidden relative">
                         <img v-if="tour.image || tour.coverImage || (tour.images && tour.images.length)" :src="tour.image || tour.coverImage || tour.images[0]" class="w-full h-full object-cover" :alt="tour.name">
                         <div v-else class="w-full h-full flex items-center justify-center text-xs text-gray-500 bg-gray-200">No Img</div>
                    </div>
                    <div class="flex flex-col">
                      <p class="text-[#111618] font-bold text-sm leading-tight group-hover:text-primary transition-colors cursor-pointer">
                        {{ tour.name }}
                      </p>
                      <div class="flex items-center gap-1 mt-1 text-[#617c89] text-xs">
                        <span class="material-symbols-outlined text-[14px]">location_on</span>
                        <span>{{ tour.location }}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="p-4">
                  <span :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium',
                    tour.type === 'Day Tour' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                  ]">
                    {{ tour.type }}
                  </span>
                </td>
                <td class="p-4 text-sm font-medium text-[#111618]">{{ tour.price }}</td>
                <td class="p-4 text-sm text-[#617c89]">{{ tour.duration }}</td>
                <td class="p-4">
                  <div class="flex items-center gap-2">
                    <span :class="['h-2.5 w-2.5 rounded-full', tour.status === 'Published' ? 'bg-green-500' : 'bg-amber-400']"></span>
                    <span :class="['text-sm font-medium', tour.status === 'Published' ? 'text-green-700' : 'text-amber-700']">{{ tour.status }}</span>
                  </div>
                </td>
                <td class="p-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <a v-if="tour.status === 'Published'" :href="'/tours/' + (tour.slug || tour.id)" target="_blank" class="p-2 text-[#617c89] hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="View Public Page">
                        <span class="material-symbols-outlined text-[20px]">visibility</span>
                    </a>
                    <RouterLink :to="'/admin/tours/edit/' + tour.id" class="p-2 text-[#617c89] hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit Tour">
                      <span class="material-symbols-outlined text-[20px]">edit</span>
                    </RouterLink>
                    <button @click="handleDeleteTour(tour.id)" class="p-2 text-[#617c89] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Tour">
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

    <!-- (Modal Removed) -->
  </div>
</template>

