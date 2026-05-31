<template>
  <div class="public-page-pattern">
    <!-- Hero Section -->
    <div class="relative w-full h-[600px] lg:h-screen flex items-center justify-center overflow-hidden">
      <!-- Background Video -->
      <video
        autoplay
        muted
        loop
        playsinline
        class="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="https://luminoustravelsandtours.com/assets/Srilanka.mp4" type="video/mp4" />
      </video>
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 z-[1] bg-gradient-to-b from-black/20 via-black/40 to-[#101922] opacity-80"></div>
      
      <!-- Content -->
      <div :class="{'opacity-0 translate-y-8': !contentVisible, 'opacity-100 translate-y-0': contentVisible}"
           class="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center text-center transition-all duration-1000 ease-in-out">
        <h1 class="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-4 drop-shadow-lg min-h-[3em]">
          {{ typeText1 }}<br />
          <span class="text-accent-gold">{{ typeText2 }}</span><span class="animate-pulse">|</span>
        </h1>
        <p :class="{'opacity-100': descriptionVisible, 'opacity-0': !descriptionVisible}" class="text-lg md:text-xl text-slate-100 max-w-2xl mb-10 drop-shadow-md transition-opacity duration-1000">
          Your journey to paradise begins here. Experience ancient ruins, pristine beaches, and lush jungles with our
          expert guidance.
        </p>
      </div>
    </div>

    <!-- Why Choose Us -->
    <section class="py-10 md:py-20 bg-primary/5 border-y border-slate-200">
      <div data-aos="fade-up" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Choose Lakdinu Tours</h2>
          <p class="text-slate-600 max-w-2xl mx-auto">We don't just plan trips; we curate
            unforgettable experiences tailored to your desires with the warmth of Sri Lankan hospitality.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            class="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-primary hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
            <div
              class="size-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
              <span class="material-symbols-outlined text-[32px]">payments</span>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">No Advance Payment Needed</h3>
            <p class="text-slate-600 leading-relaxed">Book your tour with confidence. No advance
              payment needed, simply pay on arrival.</p>
          </div>
          <div
            class="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-accent-teal hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
            <div
              class="size-14 bg-accent-teal/10 rounded-xl flex items-center justify-center text-accent-teal mb-6 group-hover:bg-accent-teal group-hover:text-white transition-colors">
              <span class="material-symbols-outlined text-[32px]">credit_card</span>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">Card Payment Accepted</h3>
            <p class="text-slate-600 leading-relaxed">We accept Visa, Mastercard, and other major
              credit and debit cards for your convenience.</p>
          </div>
          <div
            class="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-accent-gold hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
            <div
              class="size-14 bg-accent-gold/10 rounded-xl flex items-center justify-center text-accent-gold mb-6 group-hover:bg-accent-gold group-hover:text-white transition-colors">
              <span class="material-symbols-outlined text-[32px]">translate</span>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">Multi-language Drivers</h3>
            <p class="text-slate-600 leading-relaxed">Our friendly, experienced drivers speak
              multiple languages to ensure smooth communication.</p>
          </div>
          <div
            class="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-primary hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
            <div
              class="size-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
              <span class="material-symbols-outlined text-[32px]">support_agent</span>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">24/7 Online Support</h3>
            <p class="text-slate-600 leading-relaxed">Travel with peace of mind knowing our
              dedicated support team is just a call away, 24/7.</p>
          </div>
          <div
            class="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-accent-teal hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
            <div
              class="size-14 bg-accent-teal/10 rounded-xl flex items-center justify-center text-accent-teal mb-6 group-hover:bg-accent-teal group-hover:text-white transition-colors">
              <span class="material-symbols-outlined text-[32px]">location_on</span>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">GPS Enabled Vehicles</h3>
            <p class="text-slate-600 leading-relaxed">Safety first. All our vehicles are equipped
              with modern GPS tracking systems for your security.</p>
          </div>
          <div
            class="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-accent-gold hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
            <div
              class="size-14 bg-accent-gold/10 rounded-xl flex items-center justify-center text-accent-gold mb-6 group-hover:bg-accent-gold group-hover:text-white transition-colors">
              <span class="material-symbols-outlined text-[32px]">savings</span>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">Best Prices Guaranteed</h3>
            <p class="text-slate-600 leading-relaxed">We work directly with hotels and service
              providers to ensure you get the best rates without hidden fees.</p>
          </div>
        </div>

      </div>
    </section>




    <!-- Fleet Promo (Moved) -->
    <section class="py-10 md:py-20 public-page-pattern overflow-hidden">
      <div data-aos="fade-up" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <div class="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold mb-4">Our Premium
            Fleet</div>
          <h2 class="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Travel in Comfort &amp; Style
          </h2>
          <p class="text-lg text-slate-600 max-w-2xl mx-auto">Choose from our wide range of
            well-maintained vehicles for any occasion. All rentals come with experienced, English-speaking drivers.</p>
        </div>
        <div v-if="loadingFleet" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="car in popularVehicles" :key="car.id"
            class="group bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col">
            <div class="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-5">
              <img :alt="car.name"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                :src="car.image" />
              <div
                class="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-900 flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">ac_unit</span> A/C
              </div>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-2">{{ car.name }}</h3>
            <div class="flex items-center gap-4 text-slate-500 text-sm mb-6">
              <div class="flex items-center gap-1">
                <span class="material-symbols-outlined text-lg">person</span>
                <span>{{ car.seats }} Passengers</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="material-symbols-outlined text-lg">luggage</span>
                <span>{{ car.luggage }} Bags</span>
              </div>
            </div>
            
            <div class="mb-4">
                <p v-if="car.oldPrice" class="text-xs text-gray-500 line-through">${{ car.oldPrice }}</p>
                <p class="text-xl font-bold text-primary">${{ car.price }} <span class="text-sm font-normal text-gray-500">/day</span></p>
            </div>
            <div class="mt-auto">
              <router-link :to="{ path: '/fleet-booking', query: { vehicle: car.id }}"
                class="w-full py-3 rounded-xl bg-white border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2">
                Rent Now
                <span class="material-symbols-outlined text-sm">arrow_forward</span>
              </router-link>
            </div>
          </div>
        </div>
        
        <div class="mt-12 text-center">
             <router-link to="/fleet" class="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                View Full Fleet <span class="material-symbols-outlined">arrow_forward</span>
             </router-link>
        </div>

      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-12 bg-slate-50">
      <div data-aos="fade-up" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div data-aos="zoom-in" data-aos-delay="100"
            class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center transform transition hover:-translate-y-1">
            <h3 class="text-4xl font-black text-primary mb-1 flex justify-center items-center">
              <vue3autocounter ref='counter' :startAmount='0' :endAmount='12' :duration='3' prefix='' suffix='+' separator='' decimalSeparator='.' :autoinit='true' />
            </h3>
            <p class="text-sm font-bold text-slate-600 uppercase tracking-widest">Years Experience</p>
          </div>
          <div data-aos="zoom-in" data-aos-delay="200"
            class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center transform transition hover:-translate-y-1">
            <h3 class="text-4xl font-black text-primary mb-1 flex justify-center items-center">
              <vue3autocounter ref='counter' :startAmount='0' :endAmount='5000' :duration='3' prefix='' suffix='+' separator=',' decimalSeparator='.' :autoinit='true' />
            </h3>
            <p class="text-sm font-bold text-slate-600 uppercase tracking-widest">Happy Travelers</p>
          </div>
          <div data-aos="zoom-in" data-aos-delay="300"
            class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center transform transition hover:-translate-y-1">
            <h3 class="text-4xl font-black text-primary mb-1 flex justify-center items-center">
               <vue3autocounter ref='counter' :startAmount='0' :endAmount='50' :duration='3' prefix='' suffix='+' separator='' decimalSeparator='.' :autoinit='true' />
            </h3>
            <p class="text-sm font-bold text-slate-600 uppercase tracking-widest">Local Partners</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tailor Made Promo -->
    <!-- <section class="py-20 relative overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAUv4TkXYmWo9QOLlD2OhFX1bxvlI1ML7wOSfDpZLdGxennn3wrL7_hVBnJf65R11YvpsiPTe-iA34fCiF6TDv096YUR0PgGuVEhrSMmbCcgUW7eCgAQVHecnN2vtSVhF34wBpQhMWiR4MlmoUTWpgeOq9QtuTLriyqw4DLR4xq596--vHaC-5atVMm_Lw0obqE6xGuM7Fu9cCOTVNMIFwNDwv52NfAcbRQ7MtPO8SHCb9o8APsX678MOcSq2TsbYza7SHQdQ8B4E" 
             class="w-full h-full object-cover" alt="Tailor Made Background" />
        <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col justify-center h-full min-h-[400px]">
        <div class="max-w-2xl text-white">
          <div class="inline-block px-4 py-1.5 bg-accent-gold/20 text-accent-gold border border-accent-gold/50 rounded-full text-sm font-bold mb-6 backdrop-blur-sm">
            Customize Your Trip
          </div>
          <h2 class="text-4xl md:text-5xl font-black mb-6 leading-tight">
            Design Your Perfect <br/><span class="text-accent-gold">Sri Lankan Journey</span>
          </h2>
          <p class="text-lg text-gray-200 mb-8 leading-relaxed">
            Don't fit into a box? Create an itinerary that is uniquely yours. Tell us your interests, pace, and style, and our experts will craft a personalized adventure just for you.
          </p>
          <div class="flex flex-wrap gap-4">
            <router-link to="/tailor-made" class="bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-8 rounded-xl shadow-lg transition-all transform hover:scale-105 flex items-center gap-2">
              <span class="material-symbols-outlined">edit_square</span>
              Create My Itinerary
            </router-link>
            <router-link to="/contact" class="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold py-3.5 px-8 rounded-xl border border-white/20 transition-all flex items-center gap-2">
              <span class="material-symbols-outlined">support_agent</span>
              Talk to an Expert
            </router-link>
          </div>
        </div>
      </div>
    </section> -->

    <!-- Popular Packages -->
    <section class="py-10 md:py-20 public-page-pattern">
      <div data-aos="fade-up" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-end mb-12">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Our Popular Packages</h2>
            <p class="text-slate-600">Handpicked destinations for every type of traveler</p>
          </div>
          <router-link class="hidden sm:flex items-center text-primary font-bold hover:text-primary-dark transition-colors gap-1"
            to="/packages">
            View all tours <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </router-link>
        </div>

        <div v-if="loadingTours" class="text-center py-12">
          <p class="text-slate-500">Loading packages...</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="tour in popularTours" :key="tour.id"
            class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
            <div class="relative h-48 overflow-hidden">
              <div class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                :style="`background-image: url('${tour.image || 'https://via.placeholder.com/400x300'}');`">
              </div>
              <div class="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                <span class="material-symbols-outlined text-sm text-accent-gold">star</span> {{ tour.rating || '4.9' }}
              </div>
            </div>
            <div class="p-5 flex flex-col flex-1">
              <h3 class="text-lg font-bold text-slate-900 mb-1">{{ tour.title }}</h3>
              <div class="flex items-center gap-2 text-slate-500 text-sm mb-4">
                <span class="material-symbols-outlined text-[16px]">schedule</span> {{ tour.duration || 'Flexible' }}
                <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                <span>{{ tour.type || 'Cultural' }}</span>
              </div>
              <p class="text-sm text-slate-600 mb-4 line-clamp-2">{{ tour.shortDescription || tour.description }}</p>
              
              <div class="mb-4">
                  <span class="text-xs text-slate-500 block">Starting from</span>
                  <span class="text-lg font-bold text-slate-900">{{ tour.price }} <span class="text-sm font-normal text-slate-500 hover:text-primary">/ pp</span></span>
              </div>
              <router-link :to="`/tours/${tour.id}`"
                class="w-full mt-auto py-3 rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2">
                View Details
                <span class="material-symbols-outlined text-sm">arrow_forward</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Destinations Section (New) -->
    <section class="py-10 md:py-20 public-page-pattern">
      <div data-aos="fade-up" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-end mb-12">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Popular Destinations</h2>
            <p class="text-slate-600">Explore the must-visit places in Sri Lanka</p>
          </div>
          <router-link class="hidden sm:flex items-center text-primary font-bold hover:text-primary-dark transition-colors gap-1"
            to="/destinations">
            View all destinations <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </router-link>
        </div>

        <div class="relative w-full overflow-hidden group/marquee">
          <!-- Mobile Scrollable / Desktop Marquee -->
          <div class="flex gap-6 overflow-x-auto pb-4 md:pb-0 md:overflow-x-hidden snap-x snap-mandatory md:snap-none no-scrollbar md:animate-marquee w-full md:w-max group-hover/marquee:pause">
            <!-- Original List -->
            <router-link v-for="dest in popularDestinations" :key="'orig-'+dest.id" :to="`/destinations/${dest.id}`"
              class="relative rounded-2xl overflow-hidden aspect-[4/5] w-[280px] shrink-0 snap-center group cursor-pointer shadow-md hover:shadow-xl transition-all duration-300">
              <div class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                :style="`background-image: url('${dest.image}');`">
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 transition-opacity"></div>
              <div class="absolute bottom-0 left-0 p-6 w-full flex flex-col gap-2">
                <div>
                  <h3 class="text-white font-bold text-xl mb-1">{{ dest.name }}</h3>
                  <p class="text-slate-200 text-sm line-clamp-2 leading-relaxed">{{ dest.description }}</p>
                </div>
                <div>
                  <button class="bg-primary/20 hover:bg-primary text-white text-xs font-bold py-2.5 px-4 rounded-lg backdrop-blur-sm border border-white/20 transition-colors flex items-center gap-2 w-fit">
                    Explore <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </router-link>

            <!-- Duplicated List for Infinite Scroll (Hidden on Mobile) -->
            <router-link v-for="dest in popularDestinations" :key="'dup-'+dest.id" :to="`/destinations/${dest.id}`"
              class="hidden md:flex relative rounded-2xl overflow-hidden aspect-[4/5] w-[280px] shrink-0 group cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 flex-col">
              <div class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                :style="`background-image: url('${dest.image}');`">
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 transition-opacity"></div>
              <div class="absolute bottom-0 left-0 p-6 w-full flex flex-col gap-2">
                <div>
                  <h3 class="text-white font-bold text-xl mb-1">{{ dest.name }}</h3>
                  <p class="text-slate-200 text-sm line-clamp-2 leading-relaxed">{{ dest.description }}</p>
                </div>
                <div>
                  <button class="bg-primary/20 hover:bg-primary text-white text-xs font-bold py-2.5 px-4 rounded-lg backdrop-blur-sm border border-white/20 transition-colors flex items-center gap-2 w-fit">
                    Explore <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </section>


    <!-- Capturing Moments (Gallery) -->
    <section class="py-10 md:py-20 public-page-pattern">
      <div data-aos="fade-up" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Capturing Moments</h2>
          <p class="text-slate-600">Glimpses of the paradise island</p>
        </div>
        <div v-if="loadingGallery" class="flex justify-center py-12">
            <span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
        </div>
        <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          <div v-for="(image, index) in galleryAssets" :key="image.id" 
               class="rounded-xl overflow-hidden relative group h-[200px] cursor-pointer"
               @click="$router.push('/gallery')">
            <div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              :style="`background-image: url('${image.url}');`">
            </div>
            
            <!-- Default Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4"
                v-if="index !== 7">
              <p class="text-white font-bold text-sm truncate">{{ image.name }}</p>
            </div>

            <!-- Last Item Overlay -->
            <div v-if="index === 7" class="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px] hover:bg-black/70 transition-colors">
                <div class="text-center text-white">
                    <span class="text-3xl font-bold block">+{{ totalGalleryCount - 8 }}</span>
                    <span class="uppercase tracking-widest text-xs font-bold">View All</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Traveler Stories -->
    <section class="py-10 md:py-20 bg-slate-900 text-white relative overflow-hidden">
      <div class="absolute top-0 right-0 w-96 h-96 bg-accent-teal/20 rounded-full blur-[100px]"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"></div>
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-5xl bg-gradient-to-r from-accent-teal/5 to-accent-gold/5 blur-3xl z-0 pointer-events-none">
      </div>
      <div data-aos="fade-up" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Traveler Stories</h2>
          <div class="w-20 h-1 bg-accent-gold mx-auto rounded-full"></div>
          <p class="mt-4 text-slate-300 max-w-xl mx-auto">Hear what our happy travelers have to say about their journey
            through Sri Lanka.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Review 1 -->
          <div
            class="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:bg-white/15 transition-colors duration-300 flex flex-col h-full">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-1 text-accent-gold">
                <span class="material-symbols-outlined text-sm">star</span>
                <span class="material-symbols-outlined text-sm">star</span>
                <span class="material-symbols-outlined text-sm">star</span>
                <span class="material-symbols-outlined text-sm">star</span>
                <span class="material-symbols-outlined text-sm">star</span>
              </div>
              <span class="text-xs text-slate-400 bg-black/20 px-2 py-1 rounded">2 days ago</span>
            </div>
            <p class="text-slate-200 mb-6 italic flex-grow">"The best tour we've ever taken! The driver was amazing and
              showed us spots we would never have found on our own. Truly magical."</p>
            <div class="flex items-center gap-4 mt-auto pt-4 border-t border-white/10">
              <div class="size-10 rounded-full bg-slate-400 overflow-hidden ring-2 ring-accent-gold/50">
                <img alt="Portrait of Sarah J." class="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqttoFxIM4Wo_SmX4NXgbo-E3yyMz4bc6rFQ4SaBMBgh5n38mBk1Q314G4YlNL8Ni4Oe3oEpwmf0XaQIQDn1hOO6Tf8kL8bq_9BxUNhcUdN4Du3odDS2h71B0vrm7CZz1fwFru0ouTSl_kUVVgwLsH134NeiAg7Mdi9zXF1G-Dzr6EDVjoq7vkBJNFeg5_Tl-2-ixd7X1Jy6dVJMQfrrMN7UcpbKWAK4X_0spxalnXcW8NjcFXYX-HOiQFglqXhPMIqJnivY4CWHc" />
              </div>
              <div>
                <p class="font-bold text-sm">Sarah Jenkins</p>
                <p class="text-xs text-slate-400">United Kingdom</p>
              </div>
            </div>
          </div>
          <!-- Review 2 -->
          <div
            class="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:bg-white/15 transition-colors duration-300 flex flex-col h-full">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-1 text-accent-gold">
                <span class="material-symbols-outlined text-sm">star</span>
                <span class="material-symbols-outlined text-sm">star</span>
                <span class="material-symbols-outlined text-sm">star</span>
                <span class="material-symbols-outlined text-sm">star</span>
                <span class="material-symbols-outlined text-sm">star</span>
              </div>
              <span class="text-xs text-slate-400 bg-black/20 px-2 py-1 rounded">1 week ago</span>
            </div>
            <p class="text-slate-200 mb-6 italic flex-grow">"Lakdinu Tours organized our honeymoon perfectly. From the
              beaches of Mirissa to the hills of Ella, everything was seamless."</p>
            <div class="flex items-center gap-4 mt-auto pt-4 border-t border-white/10">
              <div class="size-10 rounded-full bg-slate-400 overflow-hidden ring-2 ring-accent-gold/50">
                <img alt="Portrait of Michael C." class="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1RcN_DiZnCKqh_UGAhEPMTtS9CBjeyRvRT_3zV_R8sLcg-nm0X6OS9J2CM-JIivMGguQMmXgrYFk6edO9LnvQ56d4Vo28iX2VzJzTX3GvEphHcgtYVwDBmG4FOzPvsQnEwgXa9y46w81zkNqmSAcCIhUgC8OlGlOLZgh8n-xMDyXVGjawldh6ed3R-O1VfHRXcoYTkV9-b2unE6kJFRAZcQEiE5EoqH7NZ9PYTB306JBmAIGCUHSFCRn1eRrxW0H0WQZBXMWgP_g" />
              </div>
              <div>
                <p class="font-bold text-sm">Michael Chen</p>
                <p class="text-xs text-slate-400">Singapore</p>
              </div>
            </div>
          </div>
          <!-- Review 3 -->
          <div
            class="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:bg-white/15 transition-colors duration-300 flex flex-col h-full">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-1 text-accent-gold">
                <span class="material-symbols-outlined text-sm">star</span>
                <span class="material-symbols-outlined text-sm">star</span>
                <span class="material-symbols-outlined text-sm">star</span>
                <span class="material-symbols-outlined text-sm">star</span>
                <span class="material-symbols-outlined text-sm">star_half</span>
              </div>
              <span class="text-xs text-slate-400 bg-black/20 px-2 py-1 rounded">2 weeks ago</span>
            </div>
            <p class="text-slate-200 mb-6 italic flex-grow">"Great service and excellent value. The vehicle was very
              comfortable for our family of 5. Highly recommend the safari package!"</p>
            <div class="flex items-center gap-4 mt-auto pt-4 border-t border-white/10">
              <div class="size-10 rounded-full bg-slate-400 overflow-hidden ring-2 ring-accent-gold/50">
                <img alt="Portrait of Emma W." class="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHAummz8Zz4MVgJoQQbfKvQ_pGATBxCXzyCpzP9gPCS41V0697RlOtc-NP6CAza3GtDzeVumiPfrX6G5bY7_CMBnJtO61el_sUC-jPjQlVkUnSIwnrUhjxO7S6Dr2Iuc9j9iTeHjPJ0NBPiZDBxpXq2ut9i4qn9jo6eljGtuQPx6ZCTBFLQpZVrBDLwD6WgZqwXPC9Zjd1q2fe_a63PlQ5U_wOZg-W-auPKHDwvTB1TsVMfM5jUssJHzVx5yjWI9wvFoUdkGmHhO4" />
              </div>
              <div>
                <p class="font-bold text-sm">Emma Watson</p>
                <p class="text-xs text-slate-400">Australia</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>


  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSEO } from '../../composables/useSEO';
import { API_BASE } from '../../services/api';
import { getGalleryAssets } from '../../services/gallery';
import Vue3autocounter from 'vue3-autocounter';

useSEO({
  title: ref('Home - Best Sri Lanka Travel Agency'),
  description: ref('Discover the best of Sri Lanka and Maldives with Lakdinu Tours. Custom tailor-made tours, luxury packages, and unforgettable experiences.')
});

const popularTours = ref([]);
const loadingTours = ref(true);

const popularDestinations = ref([]);
const popularVehicles = ref([]);
const galleryAssets = ref([]);
const loadingGallery = ref(true);
const loadingFleet = ref(true);
const totalGalleryCount = ref(24);

// Typewriter Logic
const typeText1 = ref('');
const typeText2 = ref('');
const descriptionVisible = ref(false);
const contentVisible = ref(true);

const fullText1 = "Discover the Wonder of";
const fullText2 = "Sri Lanka";

const typeWriter = async () => {
  // Wait for Loading Screen to finish (2000ms in App.vue) + buffer
  await new Promise(r => setTimeout(r, 2500));
  
  for (let i = 0; i < fullText1.length; i++) {
    typeText1.value += fullText1.charAt(i);
    await new Promise(r => setTimeout(r, 50));
  }
  for (let i = 0; i < fullText2.length; i++) {
    typeText2.value += fullText2.charAt(i);
    await new Promise(r => setTimeout(r, 100));
  }
  descriptionVisible.value = true;
  setTimeout(() => {
    contentVisible.value = false;
  }, 5000);
};

onMounted(async () => {
  typeWriter();
  // API_BASE imported from services

  // Fetch Gallery
  try {
      const assets = await getGalleryAssets();
      galleryAssets.value = assets.slice(0, 8); // Take first 8 for the grid
  } catch (error) {
      console.error('Error loading gallery:', error);
  } finally {
      loadingGallery.value = false;
  }
  
  // Fetch Tours
  try {
    const response = await fetch(`${API_BASE}/api/tours`);
    if (!response.ok) throw new Error('Failed to fetch tours');
    const tours = await response.json();
    popularTours.value = tours.slice(0, 3);
  } catch (error) {
    console.error('Error loading tours:', error);
    popularTours.value = [];
  } finally {
    loadingTours.value = false;
  }

  // Fetch Destinations
  try {
    const response = await fetch(`${API_BASE}/api/destinations`);
    if (!response.ok) throw new Error('Failed to fetch destinations');
    const destinations = await response.json();
    // Use first 5-6 as popular, or all if few
    popularDestinations.value = destinations.slice(0, 6);
  } catch (error) {
    console.error('Error loading destinations:', error);
    // Keep hardcoded as fallback or clear
  }

  // Fetch Fleet
  try {
    const response = await fetch(`${API_BASE}/api/fleet`);
    if (!response.ok) throw new Error('Failed to fetch fleet');
    const fleet = await response.json();
    popularVehicles.value = fleet.slice(0, 3);
  } catch (error) {
    console.error('Error loading fleet:', error);
    popularVehicles.value = [];
  } finally {
    loadingFleet.value = false;
  }
});
</script>
