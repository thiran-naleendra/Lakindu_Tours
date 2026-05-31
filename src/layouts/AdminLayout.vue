<script setup>
import Sidebar from '../components/Sidebar.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="flex h-screen bg-[#f6f7f8] w-full font-poppins notranslate">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-full relative overflow-hidden">
      <!-- Mobile Header -->
      <header
        class="md:hidden h-16 bg-white border-b border-[#dbe2e6] flex items-center justify-between px-4 shrink-0">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">travel_explore</span>
          <span class="font-bold text-lg">Lakdinu Tours Admin</span>
        </div>
        <button class="text-[#111618]">
          <span class="material-symbols-outlined">menu</span>
        </button>
      </header>

      <!-- Page Content -->
      <div class="flex-1 overflow-y-auto">
        <RouterView />
      </div>
    </main>
  </div>
</template>
