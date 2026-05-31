<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { auth } from '../firebase/config'
import { signOut } from 'firebase/auth'
import { ref, onMounted, computed } from 'vue'
import { getUserProfile } from '../services/profile'
import { getModules } from '../services/modules'

const route = useRoute()
const router = useRouter()

const navItems = ref([
  { name: 'Dashboard', icon: 'dashboard', path: '/admin', requiredRole: null, moduleId: null },
  { name: 'Tours', icon: 'map', path: '/admin/tours', requiredRole: null, moduleId: 'tours' },
  { name: 'Destinations', icon: 'pin_drop', path: '/admin/destinations', requiredRole: null, moduleId: 'destinations' },
  { name: 'Fleet', icon: 'directions_car', path: '/admin/fleet', requiredRole: null, moduleId: null },
  { name: 'Hotels', icon: 'hotel', path: '/admin/hotels', requiredRole: null, moduleId: 'hotels' },
  { name: 'Reviews', icon: 'star', path: '/admin/reviews', requiredRole: null, moduleId: 'reviews' },
  { name: 'Messages', icon: 'chat', path: '/admin/messages', requiredRole: null, moduleId: 'messages' },
  { name: 'Tailor Made Inquiries', icon: 'mail', path: '/admin/inquiries', requiredRole: null, moduleId: 'tailor-made' },
  { name: 'Gallery', icon: 'perm_media', path: '/admin/gallery', requiredRole: null, moduleId: 'gallery' },
  { name: 'Modules', icon: 'extension', path: '/admin/modules', requiredRole: 'Super Admin', moduleId: null } // Always available to Super Admin
])

const currentUserRole = ref(null)
const activeModules = ref([])

onMounted(async () => {
    if (auth.currentUser) {
        try {
           const [profile, modules] = await Promise.all([
               getUserProfile(auth.currentUser.uid),
               getModules()
           ])
           currentUserRole.value = profile.role
           activeModules.value = modules
        } catch (e) {
            console.error("Sidebar data fetch error", e)
        }
    }
})

const filteredNavItems = computed(() => {
    return navItems.value.filter(item => {
        // 1. Role Check
        if (item.requiredRole && currentUserRole.value !== item.requiredRole) {
            return false
        }
        
        // 2. Module Enabled Check
        if (item.moduleId) {
            const moduleConfig = activeModules.value.find(m => m.id === item.moduleId)
            // If module config exists and is disabled, hide it
            if (moduleConfig && !moduleConfig.enabled) {
                return false
            }
        }

        return true
    })
})

const handleLogout = async () => {
    try {
        await signOut(auth)
        router.push('/admin/login')
    } catch (error) {
        console.error("Logout failed", error)
    }
}
</script>

<template>
  <aside
    class="w-64 h-full flex-col border-r border-[#dbe2e6] bg-white shrink-0 z-20 hidden md:flex transition-all duration-300">
    <div class="flex items-center gap-3 px-6 py-5 border-b border-[#f0f3f4]">
      <div class="flex items-center justify-center bg-primary text-white rounded-full size-10 shrink-0 shadow-sm">
        <span class="material-symbols-outlined text-[24px]">travel_explore</span>
      </div>
      <div class="flex flex-col">
        <h1 class="text-[#111618] text-base font-bold leading-normal">Lakdinu Tours Admin</h1>
        <p class="text-[#617c89] text-xs font-normal leading-normal">Sri Lanka Inbound</p>
      </div>
    </div>
    <nav class="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
      <RouterLink v-for="item in filteredNavItems" :key="item.path" :to="item.path"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group"
        :class="[
            route.path === item.path 
            ? 'bg-primary/10 text-primary' 
            : 'text-[#617c89] hover:bg-[#f0f3f4] hover:text-[#111618]'
        ]">
        <span class="material-symbols-outlined text-[24px]" :class="{ 'filled': route.path === item.path }">{{ item.icon }}</span>
        <span class="text-sm font-medium leading-normal" :class="{ 'font-bold': route.path === item.path }">{{ item.name }}</span>
      </RouterLink>
      
      <div class="h-px bg-[#dbe2e6] my-2 mx-3"></div>
      
      <RouterLink to="/admin/settings"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#617c89] hover:bg-[#f0f3f4] hover:text-[#111618] transition-colors group"
        :class="{ 'bg-primary/10 text-primary': route.path === '/admin/settings' }">
        <span class="material-symbols-outlined text-[24px]">settings</span>
        <span class="text-sm font-medium leading-normal">Settings</span>
      </RouterLink>
    </nav>
    <div class="p-4 border-t border-[#dbe2e6]">
      <button @click="handleLogout" class="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-[#617c89] hover:bg-red-50 hover:text-red-500 transition-colors group">
        <span class="material-symbols-outlined text-[24px]">logout</span>
        <span class="text-sm font-medium">Log Out</span>
      </button>
    </div>
  </aside>
</template>
