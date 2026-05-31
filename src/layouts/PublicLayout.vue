<template>
  <div class="flex flex-col min-h-screen font-display bg-background-light text-slate-900">
    <!-- Header -->
    <header 
      :class="[
        'fixed top-0 left-0 w-full z-50 transition-all duration-300',
        isScrolled || !isTransparentHeader ? 'bg-[#1E1E1E] shadow-lg py-2' : 'bg-transparent py-4'
      ]"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/">
              <div class="h-10 md:h-14 w-auto rounded-lg flex items-center justify-center overflow-hidden">
                <img :src="logoWhite" alt="Lakdinu Tours Logo" class="h-full w-auto object-contain" />
              </div>
            </router-link>
          </div>

          <!-- Desktop Nav -->
          <nav class="hidden md:flex gap-8">
            <router-link v-for="item in visibleNavItems" :key="item.path" :to="item.path"
              class="text-sm font-semibold text-white hover:text-accent-gold transition-colors drop-shadow-md">
              {{ item.name }}
            </router-link>
          </nav>

          <!-- Right Side Actions -->
          <div class="flex items-center gap-4">
            <router-link to="/fleet" class="hidden sm:flex">
              <button class="bg-primary hover:bg-primary-dark text-white text-sm font-semibold py-2.5 px-6 rounded-full transition-all shadow-md shadow-primary/20 hover:shadow-primary/40 cursor-pointer">
                Book Now
              </button>
            </router-link>
            <button @click="toggleMobileMenu" class="md:hidden p-2 text-white hover:text-primary transition-colors rounded-lg hover:bg-white/10 relative z-50">
              <span class="material-symbols-outlined text-3xl">{{ isMobileMenuOpen ? 'close' : 'menu' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Overlay -->
      <transition name="mobile-menu">
        <div v-if="isMobileMenuOpen" class="fixed inset-0 z-40 bg-[#1E1E1E] md:hidden flex flex-col pt-20 px-6 pb-8 overflow-y-auto">
            <nav class="flex flex-col gap-6">
                <router-link v-for="item in visibleNavItems" :key="item.path" :to="item.path" @click="toggleMobileMenu"
                    class="text-xl font-semibold text-white hover:text-primary transition-colors flex items-center gap-4 border-b border-white/10 pb-4">
                    <span class="material-symbols-outlined text-3xl text-gray-500">{{ item.icon }}</span>
                    {{ item.name }}
                </router-link>
            </nav>
            <div class="mt-auto pt-8">
                <button class="w-full bg-primary hover:bg-primary-dark text-white text-lg font-semibold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                    Book Your Trip
                    <span class="material-symbols-outlined">arrow_forward</span>
                </button>
            </div>
        </div>
      </transition>
    </header>

    <!-- Page Content -->
    <main class="flex-grow">
      <router-view />
    </main>


    <!-- Footer -->
    <!-- Footer -->
    <footer class="relative z-0">
      <!-- Footer Decoration -->
      <div class="w-full overflow-hidden leading-[0] select-none pointer-events-none relative z-10 -mb-px">
        <img :src="footerBg" class="w-full h-auto block" alt="Footer Decoration" />
      </div>

      <div class="bg-[#1E1E1E] text-white pt-2 pb-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12 pt-8">
            <div class="space-y-4">
              <div class="flex items-center gap-2">
                <div class="h-16 w-auto rounded-lg flex items-center justify-center overflow-hidden">
                  <img :src="logoWhite" alt="Lakdinu Tours Logo" class="h-full w-auto object-contain" />
                </div>
              </div>
              <p class="text-slate-400 text-sm leading-relaxed">
                Your trusted partner for exploring the pearl of the Indian Ocean. Creating memories that last a lifetime
                since 2010.
              </p>
              <div class="flex gap-4 pt-2">
                <a class="text-slate-400 hover:text-white transition-colors" href="#">
                  <span class="material-symbols-outlined">public</span>
                </a>
                <a class="text-slate-400 hover:text-white transition-colors" href="#">
                  <span class="material-symbols-outlined">share</span>
                </a>
              </div>
            </div>
            <div>
              <h4 class="font-bold text-lg mb-4">Explore</h4>
              <ul class="space-y-2 text-slate-400">
                <li><router-link class="hover:text-primary transition-colors" to="/about">About Us</router-link></li>
                <li v-if="isModuleEnabled('tours')"><router-link class="hover:text-primary transition-colors" to="/packages">Tour Packages</router-link></li>
                <li v-if="isModuleEnabled('fleet')"><router-link class="hover:text-primary transition-colors" to="/fleet">Vehicle Fleet</router-link></li>
                <li v-if="isModuleEnabled('hotels')"><router-link class="hover:text-primary transition-colors" to="/hotels">Partner Hotels</router-link></li>
                <li><router-link class="hover:text-primary transition-colors" to="/contact">Contact</router-link></li>
              </ul>
            </div>
            <div>
              <h4 class="font-bold text-lg mb-4">Contact</h4>
              <ul class="space-y-3 text-slate-400">
                <li class="flex items-start gap-3">
                  <span class="material-symbols-outlined text-primary mt-1 text-sm">location_on</span>
                  <span>No 01, Ranasingha Gama,<br />Nikapotha, Haputale, Sri Lanka</span>
                </li>
                <li class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-primary text-sm">call</span>
                  <span>+94 70 557 8878</span>
                </li>
                <li class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-primary text-sm">mail</span>
                  <span>info@srilankacardriver.com</span>
                </li>
              </ul>
            </div>

          </div>
          <div
            class="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>© 2026 Lakdinu Tours. All rights reserved.</p>
            <div class="flex gap-6">
              <a class="hover:text-white" href="#">Privacy Policy</a>
              <router-link class="hover:text-white" to="/terms">Terms of Service</router-link>
            </div>
          </div>
        </div>
      </div>
    </footer>

    <!-- Floating Social Buttons -->
    <div class="fixed bottom-6 right-6 z-40 flex flex-col gap-3 items-end">
      
      <!-- Social Icons Row -->
      <div class="flex items-center gap-3">
        <!-- Instagram -->
        <a href="https://www.instagram.com/lakdinutourssrilanka/" target="_blank" 
           class="w-12 h-12 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.948-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
        </a>

        <!-- Facebook -->
        <a href="https://www.facebook.com/profile.php?id=61581817197680" target="_blank" 
           class="w-12 h-12 bg-[#1877F2] text-white flex items-center justify-center rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.971.956-2.971 3.594v.376h3.428l-.582 3.667h-2.846l-.009 7.98h-4.838z"/></svg>
        </a>
      </div>

      <!-- WhatsApp -->
      <a href="https://wa.me/94705578878" target="_blank" 
         class="bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center gap-3 px-5 py-3.5 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
          <span class="material-symbols-outlined text-2xl group-hover:animate-bounce">chat</span>
          <div class="flex flex-col items-start leading-none">
              <span class="text-[10px] opacity-90 font-medium">Inquire Now</span>
              <span class="text-sm font-bold">Chat on WhatsApp</span>
          </div>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getModules } from '../services/modules';
import logoWhite from '@/assets/images/logo.png';
import logoColor from '@/assets/images/logo.png';
import footerBg from '@/assets/images/footer-decoration.png'; // Updated image

const route = useRoute();
const isMobileMenuOpen = ref(false);
const isScrolled = ref(false);
const enabledModuleIds = ref(new Set());

const navItems = [
  { name: 'Home', path: '/', icon: 'home' },
  { name: 'Packages', path: '/packages', icon: 'travel_explore', moduleId: 'tours' },
  { name: 'Destinations', path: '/destinations', icon: 'map', moduleId: 'destinations' },
  { name: 'Fleet', path: '/fleet', icon: 'directions_car', moduleId: 'fleet' },
  { name: 'Hotels', path: '/hotels', icon: 'hotel', moduleId: 'hotels' },
  // { name: 'Tailor Made', path: '/tailor-made', icon: 'edit_square' },
  { name: 'About', path: '/about', icon: 'info' },
  { name: 'Contact', path: '/contact', icon: 'call' }
];

const visibleNavItems = computed(() => {
    return navItems.filter(item => {
        if (!item.moduleId) return true;
        return enabledModuleIds.value.has(item.moduleId);
    })
});

const isModuleEnabled = (id) => enabledModuleIds.value.has(id);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

const isTransparentHeader = computed(() => {
  // Use route meta to determine if header should be transparent
  // Default to false (solid) for safety, enable transparency for specific pages
  return route.meta.transparentHeader === true;
});

onMounted(async () => {
  window.addEventListener('scroll', handleScroll);
  try {
      const modules = await getModules();
      modules.forEach(m => {
          if (m.enabled) enabledModuleIds.value.add(m.id);
      });
  } catch (e) {
      console.error("Failed to load modules", e);
      // Fallback: enable all critical if fail? or just let empty? 
      // Better to assume enabled if fail to avoid broken UI?
      // For now, let's just log.
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease-in-out;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
