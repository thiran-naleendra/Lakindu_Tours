<script setup>
import { ref, computed, onMounted } from 'vue'
import { getDestinations, deleteDestination, addDestination } from '../services/destinations'
import { uploadToR2 } from '../services/upload'

const showDocs = ref(false)
const fileInput = ref(null)
const importLoading = ref(false)

const handleExport = () => {
    const dataStr = JSON.stringify(destinations.value, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = 'destinations_export_' + new Date().toISOString().slice(0,10) + '.json'
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
            for (const dest of importedData) {
                // Remove ID to treat as new data
                const { id, ...destData } = dest
                await addDestination(destData)
                successCount++
            }
            alert(`Successfully imported ${successCount} destinations.`)
            // Reload list
             const data = await getDestinations()
             destinations.value = data
        } catch (error) {
            console.error("Import failed", error)
            alert("Import failed: " + error.message)
        } finally {
            importLoading.value = false
            event.target.value = '' // Reset
        }
    }
    reader.readAsText(file)
}

const jsonExample = `{
  "name": "Sigiriya",
  "country": "Sri Lanka",
  "region": "Central Province",
  "description": "Ancient rock fortress...",
  "status": "Active",
  "image": "https://...",
  "excursions": [
    {
      "title": "Lion Rock Climb",
      "description": "Climb to the top...",
      "image": "...",
      "link": "https://goo.gl/maps/..."
    }
  ]
}`

const searchQuery = ref('')
const selectedStatus = ref('All')
const selectedRegion = ref('All')
const destinations = ref([])

onMounted(async () => {
    try {
        destinations.value = await getDestinations()
    } catch (error) {
        console.error("Failed to load destinations", error)
    }
})

const handleDeleteDestination = async (id) => {
  if (confirm("Are you sure you want to delete this destination?")) {
    try {
      await deleteDestination(id)
      destinations.value = destinations.value.filter(d => d.id !== id)
    } catch (error) {
       console.error("Delete failed", error)
       alert("Failed to delete destination")
    }
  }
}
// (Removed legacy modal logic)

const filteredDestinations = computed(() => {
  return destinations.value.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          dest.region.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = selectedStatus.value === 'All' || dest.status === selectedStatus.value
    const matchesRegion = selectedRegion.value === 'All' || dest.region.includes(selectedRegion.value)
    return matchesSearch && matchesStatus && matchesRegion
  })
})
</script>

<template>
  <div class="p-4 md:p-8 bg-background-light min-h-screen">
    <div class="mx-auto">
      <!-- Breadcrumbs -->
      <div class="flex items-center gap-2 mb-4 text-sm">
        <RouterLink to="/admin" class="text-slate-500 hover:text-primary transition-colors font-medium">Dashboard</RouterLink>
        <span class="text-slate-400 material-symbols-outlined text-[16px]">chevron_right</span>
        <span class="text-[#111618] font-semibold">Destinations</span>
      </div>

      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-[#111618] text-3xl font-extrabold tracking-tight mb-1">All Destinations</h1>
          <p class="text-slate-500 text-sm">Manage your travel locations and regions.</p>
        </div>

          <div class="flex gap-3">
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

            <RouterLink to="/admin/destinations/create" class="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-lg h-10 px-5 text-sm font-bold shadow-md shadow-primary/20 transition-all transform hover:scale-105 active:scale-95">
            <span class="material-symbols-outlined text-[20px]">add</span>
            <span>Add New Destination</span>
            </RouterLink>
        </div>
      </div>

       <!-- JSON Documentation Modal -->
      <div v-if="showDocs" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="showDocs = false">
          <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
              <div class="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 class="text-xl font-bold">Destination JSON Format</h3>
                  <button @click="showDocs = false" class="text-gray-500 hover:text-gray-700">
                      <span class="material-symbols-outlined">close</span>
                  </button>
              </div>
              <div class="p-6 overflow-y-auto">
                  <p class="text-sm text-gray-600 mb-4">
                      To import destinations, upload a JSON file containing a <strong>single destination object</strong> or an <strong>array of destination objects</strong>. Structure:
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

      <!-- Content Card -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col min-h-[600px]">
        <!-- Filters & Search Toolbar -->
        <div class="p-5 border-b border-gray-100 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div class="w-full lg:w-96 relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
              <span class="material-symbols-outlined text-slate-400">search</span>
            </span>
            <input v-model="searchQuery"
              class="w-full bg-slate-50 border border-gray-200 text-slate-700 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-slate-400 text-sm transition-all"
              placeholder="Search by city or province..." type="text" />
          </div>
          <div class="flex flex-wrap gap-2 items-center">
            <select v-model="selectedStatus" class="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-slate-700 focus:ring-primary outline-none">
              <option>All</option>
              <option>Active</option>
              <option>Draft</option>
            </select>
            <select v-model="selectedRegion" class="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-slate-700 focus:ring-primary outline-none">
              <option>All</option>
              <option>Southern Province</option>
              <option>Central Province</option>
              <option>North Central</option>
              <option>Uva Province</option>
            </select>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto w-full">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-gray-100">
                <th class="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 w-16">
                  <input class="rounded border-gray-300 text-primary focus:ring-primary" type="checkbox" />
                </th>
                <th class="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Destination</th>
                <th class="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Province/Country</th>
                <th class="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Tours</th>
                <th class="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                <th class="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-if="filteredDestinations.length === 0" class="text-center">
                <td colspan="6" class="py-12 text-slate-500">
                  No destinations found.
                </td>
              </tr>
              <tr v-for="dest in filteredDestinations" :key="dest.id" class="hover:bg-slate-50 group transition-colors">
                <td class="py-4 px-6 align-middle">
                  <input class="rounded border-gray-300 text-primary focus:ring-primary" type="checkbox" />
                </td>
                <td class="py-4 px-6 align-middle">
                  <div class="flex items-center gap-3">
                    <div class="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100 relative">
                      <img v-if="dest.image" :src="dest.image" class="h-full w-full object-cover" :alt="dest.name" />
                      <div v-else class="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500 text-xs text-center p-1">No Img</div>
                    </div>
                    <div>
                      <p class="font-bold text-[#111618] text-sm">{{ dest.name }}</p>
                      <p class="text-xs text-slate-500">ID: {{ dest.id }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-6 align-middle">
                  <span class="text-sm text-slate-700">{{ dest.region }}, {{ dest.country }}</span>
                </td>
                <td class="py-4 px-6 align-middle">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    {{ dest.tours }} Tours
                  </span>
                </td>
                <td class="py-4 px-6 align-middle">
                  <span :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border', 
                    dest.status === 'Active' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : 'bg-slate-100 text-slate-600 border-slate-200']">
                    <span :class="['h-1.5 w-1.5 rounded-full', dest.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400']"></span>
                    {{ dest.status }}
                  </span>
                </td>
                <td class="py-4 px-6 align-middle text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a :href="'/destinations/' + (dest.slug || dest.id)" target="_blank" class="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="View Public Page">
                        <span class="material-symbols-outlined text-[20px]">visibility</span>
                    </a>
                    <RouterLink :to="'/admin/destinations/edit/' + dest.id" class="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit">
                      <span class="material-symbols-outlined text-[20px]">edit</span>
                    </RouterLink>
                    <button @click="handleDeleteDestination(dest.id)" class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
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
