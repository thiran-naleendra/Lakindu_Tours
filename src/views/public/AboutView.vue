<template>
  <div class="public-page-pattern">
    <!-- Hero Section -->
    <div class="relative w-full h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style="background-image: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(16, 25, 34, 0.6) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuAP0JtjhhhNQRU-VHPel_XFLd1CTyD2vshoQaMK2JbBzHzQYVy0-_xXKVZ955gyeuTFp0zL1eR4aC7gpRX8PElH-tU8IqzRhTbEwTthUhsur4QwHzJ5rrR5FWLK-YKvCfrAfXLyZu8dfGWAPuYOvt0V-9m0foSWTtEktaK7_iXdC_Fw4T0oCztYgmM9yqAoBjw7xaKFkAXV0vhJsNZ3J7iAdAaCI41otIbR6AZEiyUVxkKEH1hDuLv_6H9-5C02TMnESvxZ3V9eZ_k');">
      </div>
      
      <!-- Content -->
      <div class="relative z-10 w-full max-w-7xl mx-auto px-4 pt-32 md:pt-0 flex flex-col items-center text-center">
        <h1 class="text-3xl md:text-6xl font-black text-white leading-tight tracking-tight mb-4 drop-shadow-lg">
          Passionate About Sri Lanka, <br /><span class="text-accent-gold">Dedicated to You</span>
        </h1>
        <p class="text-lg md:text-xl text-slate-100 max-w-2xl mb-10 drop-shadow-md">
          We are a team of explorers, storytellers, and logistics experts committed to showing you the authentic soul of our island home.
        </p>
        
        <div class="flex flex-wrap gap-4 justify-center">
          <router-link to="/packages"
            class="flex items-center justify-center rounded-lg h-12 px-8 bg-primary text-white text-base font-bold hover:bg-blue-600 transition-colors">
            View Our Packages
          </router-link>
          <button
            class="flex items-center justify-center rounded-lg h-12 px-8 bg-white/20 backdrop-blur-sm text-white border border-white/40 text-base font-bold hover:bg-white/30 transition-colors">
            Meet The Team
          </button>
        </div>
      </div>
    </div>

    <!-- Who We Are Section -->
    <div class="w-full bg-white py-16">
      <div class="px-4 md:px-10 lg:px-40 flex justify-center">
        <div class="w-full max-w-[1280px] flex flex-col md:flex-row gap-12 items-center">
          <div class="w-full md:w-1/2 aspect-video md:aspect-auto md:h-[400px] rounded-xl overflow-hidden shadow-lg bg-cover bg-center"
            style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCxuJL3HQ7moGnWz0_VMPcD2VlzqkH9QtXr-Oi3DPLlALse22k8k6V8-CadcJbK3hwXvBi5ssl0uDPOBwLiTg8L3jS5OcAyX4o9gOc1PfUmzXnRuFK5d0o5SD0ajqcOQvh2A-bhtKLfhlairOxX5pi81B1H7Xkw6tgA5TJqRMCIrDnS15UNMDRbU1xxO47CR-xeV2LR1NsCoF4_TwuYCxjMONYoBBzqBDCbzvPmter8Adc8MGsF978vJcRstmnhJZSiRKm6HUF_S3o');">
          </div>
          <div class="w-full md:w-1/2 flex flex-col gap-6">
            <div class="flex flex-col gap-3">
              <span class="text-primary font-bold text-sm tracking-wider uppercase">Our Story</span>
              <h2 class="text-[#111418] text-3xl md:text-4xl font-black leading-tight">
                From Humble Beginnings to Island Leaders
              </h2>
              <p class="text-[#617589] text-base leading-relaxed">
                Founded in 2010, Sri Lanka Travels started with a single van and a shared passion for revealing the hidden gems of our island. What began as a small family operation has grown into one of the country's leading inbound travel agencies.
              </p>
              <p class="text-[#617589] text-base leading-relaxed">
                Today, we are known for our logistical precision, deep cultural roots, and an unwavering commitment to hospitality. We don't just book hotels; we craft narratives that allow you to step into the history and vibrant life of Sri Lanka.
              </p>
            </div>
            <div class="flex gap-8 border-t border-[#f0f2f4] pt-6 mt-2">
              <div>
                <h3 class="text-3xl font-bold text-[#111418]">12+</h3>
                <p class="text-sm text-[#617589]">Years Experience</p>
              </div>
              <div>
                <h3 class="text-3xl font-bold text-[#111418]">5k+</h3>
                <p class="text-sm text-[#617589]">Happy Travelers</p>
              </div>
              <div>
                <h3 class="text-3xl font-bold text-[#111418]">50+</h3>
                <p class="text-sm text-[#617589]">Local Partners</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Vision & Mission Section -->
    <div class="w-full bg-background-light py-16">
      <div class="px-4 md:px-10 lg:px-40 flex justify-center">
        <div class="w-full max-w-[1280px] flex flex-col gap-10">
          <div class="text-center max-w-2xl mx-auto">
            <h2 class="text-[#111418] text-3xl md:text-4xl font-black leading-tight mb-4">
              Driven by Values
            </h2>
            <p class="text-[#617589] text-base">
              Our core beliefs shape every itinerary we design and every interaction we have with our guests and local communities.
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Vision Card -->
            <div class="flex flex-col gap-4 rounded-xl border border-[#dbe0e6] bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div class="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span class="material-symbols-outlined text-3xl">visibility</span>
              </div>
              <div>
                <h3 class="text-[#111418] text-xl font-bold mb-2">Our Vision</h3>
                <p class="text-[#617589] text-sm leading-relaxed">
                  To be the most trusted and sustainable travel partner in South Asia, setting the benchmark for authentic cultural exchange.
                </p>
              </div>
            </div>
            <!-- Mission Card -->
            <div class="flex flex-col gap-4 rounded-xl border border-[#dbe0e6] bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div class="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span class="material-symbols-outlined text-3xl">flag</span>
              </div>
              <div>
                <h3 class="text-[#111418] text-xl font-bold mb-2">Our Mission</h3>
                <p class="text-[#617589] text-sm leading-relaxed">
                  Creating personalized journeys that leave a lasting positive impact on our guests and the local communities we visit.
                </p>
              </div>
            </div>
            <!-- Values Card -->
            <div class="flex flex-col gap-4 rounded-xl border border-[#dbe0e6] bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div class="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span class="material-symbols-outlined text-3xl">favorite</span>
              </div>
              <div>
                <h3 class="text-[#111418] text-xl font-bold mb-2">Our Values</h3>
                <p class="text-[#617589] text-sm leading-relaxed">
                  Integrity in our dealings, warmth in our hospitality, and an unwavering commitment to eco-friendly travel practices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CEO Spotlight -->
    <div class="w-full bg-white py-16 border-y border-[#f0f2f4]">
      <div class="px-4 md:px-10 lg:px-40 flex justify-center">
        <div class="w-full max-w-[960px]">
          <div class="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
            <div class="w-40 h-40 md:w-56 md:h-56 shrink-0 rounded-full bg-cover bg-center border-4 border-white shadow-xl"
              style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBOluQIgFDz5lVRMtirB8ci0FEslRp8jM4GxReSovEu4-jDcnb3k-le-G7UeEp19AFS8iYvfYlv-4mpMlIRZzAGqRIdOlb8zZNlovIfXfOQpwpJnkEgEeI11ZLeP4N9kWsFuggwoWWx1jZePSP9zfkvJ3NfOwtHKnn42UU5hsiOXxftfA2PGz3dxWq2afsJtbcoKSCcuIgX6KlUW18E-3tZ1tovaJ89EDLF3_IZ5adRo4JerDPYxi833o8usJnHm7MJ_cit9ByNnXc');">
            </div>
            <div class="flex flex-col text-center md:text-left">
              <h2 class="text-[#111418] text-2xl md:text-3xl font-bold leading-tight mb-4">
                A Message from Our Founder
              </h2>
              <blockquote class="text-[#111418] text-lg md:text-xl font-medium leading-relaxed italic mb-6 relative">
                <span class="text-primary text-4xl absolute -top-4 -left-4 opacity-30">"</span>
                Travel is more than just moving from A to B; it's about connection. We strive to connect every guest with the deep history, nature, and soul of Sri Lanka.
              </blockquote>
              <div>
                <p class="text-[#111418] font-bold text-lg">Dilshan Perera</p>
                <p class="text-primary text-sm font-medium">Founder & CEO</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Meet Our Team -->
    <div class="w-full bg-white py-16">
        <div class="px-4 md:px-10 lg:px-40 flex justify-center">
            <div class="w-full max-w-[1280px] flex flex-col gap-10">
                <div class="text-center">
                    <h2 class="text-[#111418] text-3xl md:text-4xl font-black leading-tight mb-2">
                        Meet Our Team</h2>
                    <p class="text-[#617589] max-w-2xl mx-auto">The friendly faces behind your
                        unforgettable experiences.</p>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <!-- Team members here (static list for brevity, same as HTML) -->
                    <div class="group flex flex-col gap-3">
                        <div class="aspect-[3/4] w-full rounded-xl bg-gray-200 overflow-hidden relative">
                            <div class="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBhfn4ZaY9a6nja3JpfWOkfVdB8WXK7bWC1Msq-YTNqNXXQKbWL9mQg_z7Z85JrZP6TxGASYMSQECZdk7IJS8EOjj9Mp3tJTs9gJfOEk6qXTYR_xJY-x0BOkeVnkRaopvQr6PUJUNXjYfz9OxtZfM3P0j5PrtMTZg_zxNBh28KAj63cCuz7v3rl-bBKrmkm4uZ72UsZWISamI8RT7buVXEEe3GsblaPH_WArjUTvUdtXJMoru9KHeAx9Mkt18DMD-bgeoeQT5fAAW4');">
                            </div>
                        </div>
                        <div>
                            <h3 class="text-lg font-bold text-[#111418]">Sarah Jayasuriya</h3>
                            <p class="text-sm text-primary font-medium">Operations Manager</p>
                        </div>
                    </div>
                     <div class="group flex flex-col gap-3">
                        <div class="aspect-[3/4] w-full rounded-xl bg-gray-200 overflow-hidden relative">
                            <div class="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBMVeCjSAmtOhtjLE4xdJM2t_buKtqSglGcHsQhdXOVcxSGsANcoM6avJWbs1qj1-qVbURl0mE_F8XvZShMw7SOkxTnd_46z-btX0oEO9Uj1_K9qsb6cv5_djWb_oJVc5WFIQcxKjzRvqfqbQaQLfUDPhn19vc4Cpvi41lDLSRxr1BlUGcyO-wsgT7vD1SXYqfsF3ATYr5EproT6k3QrVsSE4CppropmEVOJlI8L39d_DI39AIMRDUTCRRBNGUUr9LfM8_LQTXB724');">
                            </div>
                        </div>
                        <div>
                            <h3 class="text-lg font-bold text-[#111418]">Nuwan Silva</h3>
                            <p class="text-sm text-primary font-medium">Senior Tour Guide</p>
                        </div>
                    </div>
                     <div class="group flex flex-col gap-3">
                        <div class="aspect-[3/4] w-full rounded-xl bg-gray-200 overflow-hidden relative">
                            <div class="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuD-eszLWJ2CIooTyqWesGS5-5jHNmz1q1MW76NYDY-GC5GOdrfF0K87VGI-B38uuU2mHbqPBDFaaQigqVTcWI3GU7nFNuc9QKy89wnzYXEPs15yUWD4XI4Dg88FFtKin2JqaZ1MuRnfHzqlt6wXOozM012Wxk0Ts9SZcYgqa5xlDV6o2_Hx_-HU6Pgk5wdZdIhds_2qQn_WJgFGe-nFKVfJWvTRA9jkp69liCZ0SHj8ceXDgvIMry2GI_v86KD0P2DrZwJaNEjr09c');">
                            </div>
                        </div>
                        <div>
                            <h3 class="text-lg font-bold text-[#111418]">Chamari Perera</h3>
                            <p class="text-sm text-primary font-medium">Travel Consultant</p>
                        </div>
                    </div>
                     <div class="group flex flex-col gap-3">
                        <div class="aspect-[3/4] w-full rounded-xl bg-gray-200 overflow-hidden relative">
                            <div class="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuD_fHt_0Buz0lJuYTelZaJX6LRyJiT7cOHOFPQRQIlLXeTLgg9X5xZOAui2aqxn2djOEl__ZftLBfbzeYvmXvLFIkhZ8kJ5ouoGbTGSgNC5xLDPQYgGTHI8lgqV_dOQPT1r8Fy72usbuzsC1yhWtInzW1dtkaBKb5O4sMCuKrmfSbNOmG_xqw6VTWgp_4iIK5AtzEN6wxgqJM2Pn6C67gM212gb71Rzjfuz7x4_srIsSaMGyt3z91ivuy2cS35xY_WcGcUHCz9ZDx4');">
                            </div>
                        </div>
                        <div>
                            <h3 class="text-lg font-bold text-[#111418]">Raj Mendis</h3>
                            <p class="text-sm text-primary font-medium">Transport Coordinator</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSEO } from '../../composables/useSEO';

useSEO({
    title: ref('About Us'),
    description: ref('Passionate About Sri Lanka, Dedicated to You. Meet the team of explorers and experts behind Lakdinu Tours.')
});
</script>
