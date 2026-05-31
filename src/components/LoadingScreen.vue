<template>
  <transition name="fade">
    <div v-if="isLoading" class="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-4 public-page-pattern">
      <div class="relative max-w-[150px] md:max-w-[200px] w-full animate-pulse-slow">
        <img :src="logoUrl" alt="Loading..." class="w-full h-auto object-contain" />
      </div>
      <div class="mt-8 flex gap-2">
         <div class="w-3 h-3 bg-primary rounded-full animate-bounce delay-0"></div>
         <div class="w-3 h-3 bg-primary rounded-full animate-bounce delay-100"></div>
         <div class="w-3 h-3 bg-primary rounded-full animate-bounce delay-200"></div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue';
import logoUrl from '@/assets/images/logo.png';

const props = defineProps({
  isLoading: {
    type: Boolean,
    required: true
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-pulse-slow {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.3;
        transform: scale(0.95);
    }
}
</style>
