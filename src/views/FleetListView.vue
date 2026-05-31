<script setup>
import { ref, computed, onMounted } from 'vue'
import { getFleet, deleteVehicle, addVehicle } from '../services/fleet'

const fileInput = ref(null)

const searchQuery = ref('')
const selectedType = ref('All')
const fleet = ref([])

onMounted(async () => {
    try {
        fleet.value = await getFleet()
    } catch (error) {
        console.error("Failed to load fleet", error)
    }
})

const handleDeleteVehicle = async (id) => {
  if (confirm("Are you sure you want to delete this vehicle?")) {
    try {
      await deleteVehicle(id)
      fleet.value = fleet.value.filter(v => v.id !== id)
    } catch (error) {
       console.error("Delete failed", error)
       alert("Failed to delete vehicle")
    }
  }
}

const filteredFleet = computed(() => {
  return fleet.value.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          (vehicle.subtitle && vehicle.subtitle.toLowerCase().includes(searchQuery.value.toLowerCase()))
    const matchesType = selectedType.value === 'All' || vehicle.type === selectedType.value
    return matchesSearch && matchesType
  })
})

const vehicleTypes = ['All', 'Sedan', 'SUV / 4x4', 'Van', 'Luxury']

const exportFleet = () => {
    const dataStr = JSON.stringify(fleet.value, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "fleet.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const triggerImport = () => {
    fileInput.value.click();
}

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const importedVehicles = JSON.parse(e.target.result);
            if (!Array.isArray(importedVehicles)) throw new Error("Invalid format: Expected an array");
            
            if (confirm(`Found ${importedVehicles.length} vehicles. Import them now?`)) {
                let successCount = 0;
                for (const v of importedVehicles) {
                    // Remove ID to create new entry
                    const { id, ...vehicleData } = v; 
                    await addVehicle(vehicleData);
                    successCount++;
                }
                alert(`Successfully imported ${successCount} vehicles!`);
                // Refresh list
                fleet.value = await getFleet();
            }
        } catch (err) {
            console.error("Import failed", err);
            alert("Failed to import: " + err.message);
        }
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
}
</script>

<template>
  <div class="p-4 md:p-8 bg-background-light min-h-screen">
    <div class="mx-auto">
      <!-- Breadcrumbs -->
      <div class="flex items-center gap-2 mb-4 text-sm">
        <RouterLink to="/admin" class="text-slate-500 hover:text-primary transition-colors font-medium">Dashboard</RouterLink>
        <span class="text-slate-400 material-symbols-outlined text-[16px]">chevron_right</span>
        <span class="text-[#111618] font-semibold">Fleet</span>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-[#111618] text-3xl font-extrabold tracking-tight mb-1">Our Fleet</h1>
          <p class="text-slate-500 text-sm">Manage your vehicles and car rental catalog.</p>
        </div>

        <div class="flex gap-3">
             <button @click="exportFleet" class="flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg h-10 px-4 text-sm font-bold transition-all">
                <span class="material-symbols-outlined text-[20px]">download</span>
                <span>Export</span>
            </button>
            <button @click="triggerImport" class="flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg h-10 px-4 text-sm font-bold transition-all">
                <span class="material-symbols-outlined text-[20px]">upload</span>
                <span>Import</span>
                <input type="file" ref="fileInput" @change="handleFileUpload" accept=".json" class="hidden" />
            </button>
            <RouterLink to="/admin/fleet/create" class="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-lg h-10 px-5 text-sm font-bold shadow-md shadow-primary/20 transition-all transform hover:scale-105 active:scale-95">
                <span class="material-symbols-outlined text-[20px]">add</span>
                <span>Add New</span>
            </RouterLink>
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
              placeholder="Search by vehicle model..." type="text" />
          </div>
          <div class="flex flex-wrap gap-2 items-center">
            <select v-model="selectedType" class="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-slate-700 focus:ring-primary outline-none">
              <option v-for="type in vehicleTypes" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto w-full">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-gray-100">
                <th class="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Vehicle</th>
                <th class="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Type</th>
                <th class="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Capacity</th>
                <th class="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Price /Day</th>
                <th class="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-if="filteredFleet.length === 0" class="text-center">
                <td colspan="5" class="py-12 text-slate-500">
                  No vehicles found.
                </td>
              </tr>
              <tr v-for="car in filteredFleet" :key="car.id" class="hover:bg-slate-50 group transition-colors">
                <td class="py-4 px-6 align-middle">
                  <div class="flex items-center gap-3">
                    <div class="h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100 relative">
                      <img v-if="car.image" :src="car.image" class="h-full w-full object-cover" :alt="car.name" />
                      <div v-else class="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500 text-[10px] text-center p-1">No Image</div>
                    </div>
                    <div>
                      <p class="font-bold text-[#111618] text-sm">{{ car.name }}</p>
                      <p class="text-xs text-slate-500">{{ car.subtitle }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-6 align-middle">
                  <span class="text-sm text-slate-700">{{ car.type }}</span>
                </td>
                <td class="py-4 px-6 align-middle">
                  <div class="flex items-center gap-4">
                    <div class="flex items-center gap-1 text-xs text-slate-600">
                      <span class="material-symbols-outlined text-[16px]">airline_seat_recline_normal</span>
                      {{ car.seats }}
                    </div>
                    <div class="flex items-center gap-1 text-xs text-slate-600">
                      <span class="material-symbols-outlined text-[16px]">luggage</span>
                      {{ car.luggage }}
                    </div>
                  </div>
                </td>
                <td class="py-4 px-6 align-middle">
                  <div class="flex flex-col">
                    <span class="font-bold text-primary text-sm font-poppins">${{ car.price }}</span>
                    <span v-if="car.oldPrice" class="text-xs text-slate-400 line-through">${{ car.oldPrice }}</span>
                  </div>
                </td>
                <td class="py-4 px-6 align-middle text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <RouterLink :to="'/admin/fleet/edit/' + car.id" class="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit">
                      <span class="material-symbols-outlined text-[20px]">edit</span>
                    </RouterLink>
                    <button @click="handleDeleteVehicle(car.id)" class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
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
  </div>
</template>
