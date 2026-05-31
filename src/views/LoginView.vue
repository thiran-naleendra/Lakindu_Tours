<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../services/auth'

const router = useRouter()
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')

const handleLogin = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    await login(email.value, password.value)
    router.push('/admin')
  } catch (err) {
    console.error(err)
    if (err.code === 'auth/invalid-credential') {
      error.value = 'Invalid email or password.'
    } else {
      error.value = 'An error occurred. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex h-screen w-full font-display bg-background-light text-[#111618] overflow-hidden">
    <!-- Left Side: Login Form -->
    <div class="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 relative z-10 bg-white">
      <div class="w-full max-w-[480px] flex flex-col gap-6">
        <!-- Brand / Logo Area -->
        <div class="flex items-center gap-2 mb-4">
          <div class="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white">
            <span class="material-symbols-outlined">flight_takeoff</span>
          </div>
          <span class="text-xl font-bold tracking-tight text-[#111618]">Lakdinu Tours Admin</span>
        </div>
        <!-- Page Heading -->
        <div class="flex flex-col gap-2">
          <h1 class="text-[#111618] tracking-tight text-[32px] font-bold leading-tight">
            Welcome Back</h1>
          <p class="text-[#617c89] text-base font-normal leading-normal">Manage tours,
            bookings, and destinations.</p>
        </div>
        <!-- Form Container -->
        <form class="flex flex-col gap-5 mt-4" @submit.prevent="handleLogin">
          <!-- Error Alert -->
          <div v-if="error" class="p-4 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3">
            <span class="material-symbols-outlined text-red-600 text-[20px] mt-0.5">error</span>
            <p class="text-sm text-red-600 font-medium">{{ error }}</p>
          </div>

          <!-- Email Field -->
          <label class="flex flex-col w-full">
            <p class="text-[#111618] text-base font-medium leading-normal pb-2">Email
              Address</p>
            <div class="relative flex items-center">
              <input
                v-model="email"
                required
                class="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111618] border border-[#dbe2e6] bg-background-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary h-14 placeholder:text-[#617c89] p-[15px] text-base font-normal leading-normal transition-all"
                placeholder="admin@agency.com" type="email" />
            </div>
          </label>
          <!-- Password Field -->
          <label class="flex flex-col w-full">
            <div class="flex justify-between items-center pb-2">
              <p class="text-[#111618] text-base font-medium leading-normal">Password</p>
            </div>
            <div class="flex w-full flex-1 items-stretch rounded-lg relative">
              <input
                v-model="password"
                required
                class="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111618] border border-[#dbe2e6] bg-background-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary h-14 placeholder:text-[#617c89] p-[15px] pr-12 text-base font-normal leading-normal transition-all"
                placeholder="Enter your password" type="password" />
            </div>
          </label>
          
          <!-- Login Button -->
          <button type="submit" :disabled="isLoading"
            class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg py-4 px-5 flex-1 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-sky-500 transition-all shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
            <span v-if="!isLoading" class="truncate">Sign In</span>
            <span v-else class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
          </button>
        </form>
        
        <!-- Footer Copyright -->
        <p class="text-[#617c89] text-xs text-center mt-8">© 2024 Lakdinu Tours. All rights reserved.</p>
      </div>
    </div>
    <!-- Right Side: Image -->
    <div class="hidden lg:flex lg:w-1/2 relative bg-gray-100 overflow-hidden">
      <!-- Overlay gradient -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10"></div>
      <!-- Image Container -->
      <div class="absolute inset-0 w-full h-full bg-center bg-cover transition-transform duration-[20s] hover:scale-105"
        data-alt="Scenic aerial view of a winding road through a desert landscape during sunset"
        style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBhBG7QSXNx52VxXY-7W7042YZ0Sycg0XSSp-HkcdpO4Tie4XB46JAN9BMvbIi55nT9jOLMWve0bQbJfYpCHe26ygKWeqGXp6s11gwrJ9Y0rd-UNtXHMCdunqGOYH2KaPluuOfth_HQzYRHzqKXaQWM4g440x0gnWFYkywcpYPhB9nuK01OBjjDWG7zWLELGnCOrKq9iOYy0l8r_x_Yxs6LQXNX6weYKDqNZpGNFP2ERJLl9Oy0t9Ub49WNTbY9X2YTsQJhi-KuoJep');">
      </div>
      <!-- Content on top of image -->
      <div class="relative z-20 flex flex-col justify-end h-full w-full p-16 text-white">
        <div class="max-w-md">
          <div class="w-12 h-12 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center mb-6 border border-white/30">
            <span class="material-symbols-outlined text-white">public</span>
          </div>
          <blockquote class="text-3xl font-bold leading-tight mb-4 tracking-tight">
            "The world is a book and those who do not travel read only one page."
          </blockquote>
          <p class="text-lg font-medium text-white/80">— Augustine of Hippo</p>
          <!-- Indicators/Decoration -->
          <div class="flex gap-2 mt-8">
            <div class="w-8 h-1 bg-white rounded-full"></div>
            <div class="w-2 h-1 bg-white/40 rounded-full"></div>
            <div class="w-2 h-1 bg-white/40 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
