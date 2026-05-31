<script setup>
import { ref, onMounted } from 'vue'
import { getModules, saveModules as saveModulesService } from '../services/modules'

const modules = ref([])
const hasChanges = ref(false)
const isLoading = ref(true)

onMounted(async () => {
    try {
        modules.value = await getModules()
    } catch (e) {
        console.error("Failed to load modules", e)
    } finally {
        isLoading.value = false
    }
})

const toggleModule = (module) => {
  module.enabled = !module.enabled
  module.status = module.enabled ? 'Active' : 'Inactive'
  hasChanges.value = true
}

const saveChanges = async () => {
    try {
        await saveModulesService(modules.value)
        hasChanges.value = false
        alert('Changes saved successfully!')
    } catch (e) {
        alert("Failed to save changes")
    }
}

const resetChanges = async () => {
    isLoading.value = true
    try {
        modules.value = await getModules()
        hasChanges.value = false
    } catch (e) {
        console.error("Reset failed", e)
    } finally {
        isLoading.value = false
    }
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
          <RouterLink to="/admin/settings" class="text-[#617c89] hover:text-primary transition-colors font-medium">Settings</RouterLink>
          <span class="text-[#617c89]/50 font-medium">/</span>
          <span class="text-[#111618] font-medium">Module Manager</span>
        </nav>

        <!-- Page Heading -->
        <div class="flex flex-col gap-2">
          <h1 class="text-[#111618] text-3xl md:text-4xl font-black tracking-tight">Module Manager</h1>
          <p class="text-[#617c89] text-base font-normal max-w-2xl">
            Enable or disable system modules to customize your agency's available features. Disabling a module will hide it from the user interface and navigation.
          </p>
        </div>

        <!-- Status Summary -->
        <div class="flex gap-4">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
            <span class="w-2 h-2 rounded-full bg-green-500"></span>
            {{ modules.filter(m => m.enabled).length }} Active Modules
          </div>
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-200 text-gray-600 text-sm font-semibold">
            <span class="w-2 h-2 rounded-full bg-gray-400"></span>
            {{ modules.filter(m => !m.enabled).length }} Inactive
          </div>
        </div>

        <!-- Modules Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div v-for="module in modules" :key="module.id"
            :class="[
              'group flex flex-col p-6 bg-white rounded-xl border border-[#dbe2e6] shadow-sm hover:shadow-md transition-all duration-300',
              !module.enabled ? 'opacity-70 grayscale-[0.5] hover:opacity-100 hover:grayscale-0' : ''
            ]">
            <div class="flex items-start justify-between mb-4">
              <div :class="[
                'size-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform',
                module.enabled ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'
              ]">
                <span class="material-symbols-outlined text-2xl">{{ module.icon }}</span>
              </div>
              <span :class="[
                'px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide',
                module.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              ]">
                {{ module.status }}
              </span>
            </div>
            <h3 class="text-lg font-bold text-[#111618] mb-2">{{ module.name }}</h3>
            <p class="text-sm text-[#617c89] mb-6 flex-1 leading-relaxed">{{ module.description }}</p>
            <div class="flex items-center justify-between pt-4 border-t border-[#f0f3f4]">
              <span class="text-sm font-semibold text-[#111618]">Enable Module</span>
              <button @click="toggleModule(module)"
                :class="[
                  'relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none p-0.5 transition-colors',
                  module.enabled ? 'bg-primary justify-end' : 'bg-gray-200 justify-start'
                ]">
                <div class="h-full w-[27px] rounded-full bg-white shadow-sm"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Save Bar -->
      <transition enter-active-class="transition duration-300 ease-out" enter-from-class="translate-y-20 opacity-0" enter-to-class="translate-y-0 opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-20 opacity-0">
        <div v-if="hasChanges" class="fixed bottom-8 inset-x-0 mx-auto max-w-[900px] px-4 z-50">
          <div class="bg-gray-900 text-white p-4 rounded-xl shadow-2xl flex items-center justify-between gap-4 border border-white/10">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-primary">info</span>
              <p class="text-sm font-medium">You have unsaved changes in module configuration.</p>
            </div>
            <div class="flex items-center gap-3">
              <button @click="resetChanges" class="px-4 py-2 text-sm font-bold opacity-70 hover:opacity-100 transition-opacity">Reset</button>
              <button @click="saveChanges" class="px-6 py-2 text-sm font-bold bg-primary hover:bg-sky-500 text-white rounded-lg transition-all shadow-lg shadow-primary/30">Save Changes</button>
            </div>
          </div>
        </div>
      </transition>
    </main>
  </div>
</template>
