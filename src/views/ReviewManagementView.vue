<script setup>
import { ref, onMounted, computed } from 'vue'
import { getReviews, updateReviewStatus, deleteReview as deleteReviewService } from '../services/reviews'

const stats = ref([
  { label: 'Total Reviews', value: '0', icon: 'skillet', color: 'text-[#617c89]' },
  { label: 'Avg. Rating', value: '0.0', icon: 'star', color: 'text-primary' },
  { label: 'Pending', value: '0', icon: 'pending_actions', color: 'text-amber-500' },
  { label: 'Approved', value: '0', icon: 'check_circle', color: 'text-green-500' }
])

const reviews = ref([])
const filter = ref('All') // 'All' or 'Pending'

onMounted(async () => {
  await loadReviews()
})

const loadReviews = async () => {
    try {
        const fetchedReviews = await getReviews()
        reviews.value = fetchedReviews.map(r => ({
            id: r.id,
            author: r.name || 'Anonymous',
            initial: (r.name || 'A').charAt(0).toUpperCase(),
            tour: r.tourName || r.tour || 'General',
            bookingReference: r.bookingReference || 'N/A',
            time: r.createdAt ? new Date(r.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown', // Handle Firestore timestamp
            rating: r.rating || 0,
            text: r.message || '',
            images: r.images || [],
            status: r.status || 'Pending'
        }))
        calculateStats()
    } catch (error) {
        console.error("Failed to load reviews", error)
    }
}

const calculateStats = () => {
    const total = reviews.value.length
    const pending = reviews.value.filter(r => r.status === 'Pending').length
    const approved = reviews.value.filter(r => r.status === 'Approved').length
    const avg = total > 0 ? (reviews.value.reduce((acc, r) => acc + Number(r.rating), 0) / total).toFixed(1) : '0.0'
    
    stats.value[0].value = total.toString()
    stats.value[1].value = avg
    stats.value[2].value = pending.toString()
    stats.value[3].value = approved.toString()
}

const filteredReviews = computed(() => {
    if (filter.value === 'Pending') {
        return reviews.value.filter(r => r.status === 'Pending')
    }
    return reviews.value
})

const approveReview = async (id) => {
  try {
      await updateReviewStatus(id, 'Approved')
      const review = reviews.value.find(r => r.id === id)
      if (review) review.status = 'Approved'
      calculateStats()
  } catch (error) {
      console.error("Failed to approve review", error)
  }
}

const hideReview = async (id) => {
    if (!confirm("Are you sure you want to delete this review?")) return
    try {
        await deleteReviewService(id)
        reviews.value = reviews.value.filter(r => r.id !== id)
        calculateStats()
    } catch (error) {
        console.error("Failed to delete review", error)
    }
}
</script>

<template>
  <div class="p-4 md:p-8 lg:px-12 bg-background-light">
    <div class="mx-auto flex flex-col gap-6 pb-12">
      <!-- Page Heading -->
      <div class="flex flex-col gap-1">
        <h1 class="text-[#111618] text-3xl md:text-4xl font-extrabold tracking-tight">Reviews Management</h1>
        <p class="text-[#617c89] text-base font-normal">Monitor and moderate customer feedback for your tours.</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div v-for="stat in stats" :key="stat.label"
          class="rounded-xl p-6 bg-white border border-[#dbe2e6] shadow-sm flex flex-col gap-2">
          <div :class="['flex items-center gap-2', stat.color]">
            <span class="material-symbols-outlined text-[20px]">{{ stat.icon }}</span>
            <span class="text-xs font-bold uppercase tracking-wider">{{ stat.label }}</span>
          </div>
          <span class="text-3xl font-bold">{{ stat.value }}</span>
        </div>
      </div>

      <!-- Reviews List -->
      <div class="bg-white rounded-xl border border-[#dbe2e6] shadow-sm overflow-hidden text-sm">
        <div class="p-4 border-b border-[#dbe2e6] flex items-center justify-between">
          <h3 class="font-bold">Recent Reviews</h3>
          <div class="flex gap-2 text-xs">
            <button @click="filter = 'Pending'" :class="['px-3 py-1.5 rounded-lg border transition-all font-medium', filter === 'Pending' ? 'bg-primary text-white border-primary' : 'bg-background-light border-transparent hover:border-[#dbe2e6]']">Pending</button>
            <button @click="filter = 'All'" :class="['px-3 py-1.5 rounded-lg border transition-all font-medium', filter === 'All' ? 'bg-primary text-white border-primary' : 'bg-background-light border-transparent hover:border-[#dbe2e6]']">All Reviews</button>
          </div>
        </div>
        <div class="divide-y divide-[#dbe2e6]">
          <div v-if="filteredReviews.length === 0" class="p-8 text-center text-gray-500">
              No reviews found.
          </div>
          <div v-for="review in filteredReviews" :key="review.id" class="group p-4 transition-all hover:bg-gray-50 border-b border-gray-100 last:border-0">
            <div class="flex flex-col sm:flex-row gap-4">
              <!-- Avatar -->
              <div class="flex-shrink-0">
                <div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  {{ review.initial }}
                </div>
              </div>
              
              <!-- Content -->
              <div class="flex-1 min-w-0">
                <!-- Header: Name, Tour, Rating -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div class="flex flex-wrap items-center gap-2">
                    <h4 class="font-bold text-gray-900 text-sm">{{ review.author }}</h4>
                    <span v-if="review.bookingReference !== 'N/A'" class="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 uppercase tracking-wide">{{ review.bookingReference }}</span>
                    <span class="text-xs text-gray-400">•</span>
                    <span class="text-xs text-primary font-medium truncate max-w-[150px] md:max-w-[250px]">{{ review.tour }}</span>
                  </div>
                  
                  <div class="flex items-center gap-3">
                    <div class="flex text-amber-400">
                        <span v-for="i in 5" :key="i" :class="['material-symbols-outlined text-[16px]', i <= review.rating ? 'filled' : 'text-gray-200']">star</span>
                    </div>
                    <span class="text-[10px] text-gray-400">{{ review.time }}</span>
                  </div>
                </div>

                <!-- Text -->
                <p class="text-gray-600 text-sm leading-snug mb-3">
                    {{ review.text }}
                </p>

                <!-- Images & Actions Row -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <!-- Images -->
                    <div class="flex gap-2 min-h-[40px]">
                        <a v-for="(img, idx) in review.images" :key="idx" :href="img" target="_blank" class="block w-10 h-10 rounded-lg overflow-hidden border border-gray-200 hover:opacity-80 transition relative">
                            <img :src="img" class="w-full h-full object-cover">
                        </a>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center gap-2">
                        <template v-if="review.status === 'Pending'">
                            <button @click="hideReview(review.id)" class="px-3 py-1.5 text-red-500 hover:bg-red-50 rounded text-xs font-bold transition-colors">
                                Decline
                            </button>
                            <button @click="approveReview(review.id)" class="px-3 py-1.5 bg-green-500 text-white hover:bg-green-600 rounded text-xs font-bold transition-colors shadow-sm">
                                Approve
                            </button>
                        </template>
                        <template v-else>
                            <span class="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100 flex items-center gap-1">
                                <span class="material-symbols-outlined text-[12px]">verified</span> Approved
                            </span>
                            <button @click="hideReview(review.id)" class="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors" title="Delete">
                                <span class="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                        </template>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="p-4 bg-gray-50 flex items-center justify-center">
          <!-- Pagination Could go here -->
        </div>
      </div>
    </div>
  </div>
</template>
