<script setup>
import { RouterView, useRouter } from 'vue-router'
import { ref } from 'vue'
import LoadingScreen from '@/components/LoadingScreen.vue'

const isLoading = ref(!window.location.pathname.startsWith('/admin'))
const router = useRouter()

router.beforeEach((to) => {
  if (!to.path.startsWith('/admin')) {
    isLoading.value = true
  }
})

router.afterEach(() => {
  // Add a small delay for smoother transition
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
})

</script>

<template>
  <LoadingScreen :is-loading="isLoading" />
  <RouterView />
</template>

<style>
/* Any global transitions or scrollbar styling can go here */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
</style>
