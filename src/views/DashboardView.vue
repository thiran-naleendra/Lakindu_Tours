<script setup>
import { ref, onMounted, computed } from 'vue'
import { getTours } from '../services/tours'
import { getInquiries } from '../services/inquiries'
import { getMessages } from '../services/messages'
import { getReviews } from '../services/reviews'

const tours = ref([])
const inquiries = ref([])
const messages = ref([])
const reviews = ref([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const [toursData, inquiriesData, messagesData, reviewsData] = await Promise.all([
      getTours(),
      getInquiries(),
      getMessages(),
      getReviews()
    ])
    tours.value = toursData
    inquiries.value = inquiriesData
    messages.value = messagesData
    reviews.value = reviewsData
  } catch (error) {
    console.error("Failed to load dashboard data", error)
  } finally {
    isLoading.value = false
  }
})

const metrics = computed(() => [
  { title: 'Total Active Tours', value: tours.value.filter(t => t.status === 'Published').length.toString(), change: 'Live', icon: 'map', color: 'blue' },
  { title: 'New Inquiries', value: inquiries.value.filter(i => i.status === 'New').length.toString(), change: 'Action needed', icon: 'mail', color: 'blue' },
  { title: 'Unread Messages', value: messages.value.length.toString(), change: 'Total', icon: 'chat_bubble', color: 'orange' },
  { title: 'Average Rating', value: '5.0', change: 'All time', icon: 'star', color: 'blue', suffix: '/ 5.0' }
])

const recentInquiries = computed(() => {
  return inquiries.value.slice(0, 5).map(inquiry => {
    // Handle Date (String ISO or Firestore Timestamp)
    let dateDisplay = 'Unknown'
    if (inquiry.createdAt) {
      const d = inquiry.createdAt;
      if (typeof d === 'object' && d.seconds) {
        dateDisplay = new Date(d.seconds * 1000).toLocaleDateString()
      } else {
        const dateObj = new Date(d);
        if (!isNaN(dateObj.getTime())) {
          dateDisplay = dateObj.toLocaleDateString();
        }
      }
    }

    return {
      id: inquiry.id,
      name: inquiry.customer?.name || inquiry.name || 'Unknown',
      initial: (inquiry.customer?.name || inquiry.name || 'U').charAt(0).toUpperCase(),
      destination: inquiry.tour || inquiry.subject || inquiry.type || 'General Inquiry',
      date: dateDisplay,
      status: inquiry.status || 'New',
      statusClass: inquiry.status === 'New' 
        ? 'bg-yellow-50 text-yellow-700' 
        : 'bg-green-50 text-green-700'
    }
  })
})

const recentReviews = computed(() => {
  return reviews.value.slice(0, 5).map(review => ({
    id: review.id,
    name: review.name || 'Anonymous',
    rating: review.rating || 5,
    text: review.message || 'No review text',
    time: review.createdAt ? new Date(review.createdAt.seconds * 1000).toLocaleDateString() : 'Recently'
  }))
})

// === Chart Logic ===
const inquiryStats = computed(() => {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  const currentPeriod = inquiries.value.filter(i => {
    const d = new Date(i.createdAt || now)
    return d >= thirtyDaysAgo && d <= now
  }).length

  const prevPeriod = inquiries.value.filter(i => {
    const d = new Date(i.createdAt || now)
    return d >= sixtyDaysAgo && d < thirtyDaysAgo
  }).length

  let change = 0
  if (prevPeriod > 0) {
    change = ((currentPeriod - prevPeriod) / prevPeriod) * 100
  } else if (currentPeriod > 0) {
    change = 100 // 100% growth if from 0
  }

  return {
    count: currentPeriod,
    change: change.toFixed(1) + '%',
    isPositive: change >= 0
  }
})

const chartPaths = computed(() => {
    // 4 Weekly bins for the last 30 days
    const bins = [0, 0, 0, 0]
    const now = new Date()
    
    inquiries.value.forEach(i => {
        const d = new Date(i.createdAt || now)
        const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24))
        if(diffDays < 30) {
            // Map 0-7 -> bin 3 (Week 4), 7-14 -> bin 2, etc.
            // visual: Week 1(oldest) -> Week 4(newest)
            // diffDays=0 (today) should be at end (Week 4)
            // 30 days / 7.5 = 4 bins
            const binIndex = 3 - Math.floor(diffDays / 7.5) 
            if(binIndex >= 0 && binIndex <= 3) bins[binIndex]++
        }
    })

    // Scale Y: max value -> height 50px, 0 -> 250px (SVG coords: h=300, use 50-250 range)
    const maxVal = Math.max(...bins, 1) // avoid div by 0
    const points = bins.map((val, idx) => {
        const x = idx * (1200 / 3) // 0, 400, 800, 1200
        const y = 250 - (val / maxVal * 200) // map 0->250, max->50
        return `${x},${y}`
    })

    // Create Smooth Path (Cubic Bezier or simple Line for now)
    // Using Catmull-Rom or simple L for simplicity with 4 points
    let pathD = `M${points[0]}`
    for(let i=1; i<points.length; i++) {
       // Simple straight lines for robustness, or basic curve
       pathD += ` L${points[i]}`
    }

    // Chart has width 1200, height 300
    // Fill Path: continue from stroke, go down to bottom right, bottom left, close
    const areaD = `${pathD} L1200,300 L0,300 Z`

    return { stroke: pathD, area: areaD }
})
</script>

<template>
  <div class="p-4 md:p-8 bg-[#f6f7f8]">
    <div class="mx-auto flex flex-col gap-6">
      <!-- Quick Actions Row -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 class="text-lg font-bold text-[#111618]">Overview</h3>
          <p class="text-sm text-[#617c89]">Welcome back, here's what's happening today.</p>
        </div>
        <div class="flex gap-3">
          <RouterLink to="/admin/destinations" class="flex items-center gap-2 px-4 py-2 bg-white border border-[#dbe2e6] rounded-lg text-sm font-bold text-[#111618] hover:bg-gray-50 transition-colors">
            <span class="material-symbols-outlined text-[20px]">add_location_alt</span>
            Add Destination
          </RouterLink>
          <RouterLink to="/admin/tours" class="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 transition-all">
            <span class="material-symbols-outlined text-[20px]">add</span>
            Create Tour
          </RouterLink>
        </div>
      </div>

      <!-- Metric Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="metric in metrics" :key="metric.title"
          class="flex flex-col gap-3 rounded-xl p-5 bg-white border border-[#dbe2e6] shadow-sm hover:shadow-md transition-shadow">
          <div class="flex justify-between items-start">
            <div class="bg-blue-50 p-2.5 rounded-lg">
              <span class="material-symbols-outlined text-primary text-[24px]">{{ metric.icon }}</span>
            </div>
            <span :class="[
              'flex items-center text-xs font-bold px-2 py-1 rounded-full',
              metric.color === 'orange' ? 'text-orange-600 bg-orange-50' : 'text-green-600 bg-green-50'
            ]">
              {{ metric.change }}
            </span>
          </div>
          <div>
            <p class="text-[#617c89] text-sm font-medium">{{ metric.title }}</p>
            <p class="text-[#111618] text-2xl font-extrabold mt-1">
              {{ metric.value }}
              <span v-if="metric.suffix" class="text-base text-[#617c89] font-normal">{{ metric.suffix }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Chart Section -->
      <div class="rounded-xl border border-[#dbe2e6] bg-white p-6 shadow-sm">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
          <div>
            <h3 class="text-[#111618] text-lg font-bold">Inquiry Trends</h3>
            <div class="flex items-baseline gap-2 mt-1">
              <p class="text-2xl font-bold text-[#111618]">{{ inquiryStats.count }}</p>
              <p class="text-sm text-[#617c89]">Inquiries last 30 days</p>
              <span :class="['text-xs font-bold px-2 py-0.5 rounded ml-2', inquiryStats.isPositive ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50']">
                {{ inquiryStats.isPositive ? '+' : '' }}{{ inquiryStats.change }}
              </span>
            </div>
          </div>
          <select class="bg-[#f0f3f4] border-none text-sm font-medium rounded-lg px-3 py-2 text-[#111618] focus:ring-1 focus:ring-primary outline-none">
            <option>Last 30 Days</option>
            <!-- Filtering logic for other options not implemented yet -->
          </select>
        </div>
        <!-- Chart Area (Dynamic) -->
        <div class="w-full h-64 relative">
          <svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1200 300">
            <defs>
              <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="#13a4ec" stop-opacity="0.2" />
                <stop offset="100%" stop-color="#13a4ec" stop-opacity="0" />
              </linearGradient>
            </defs>
            <line stroke="#e5e7eb" stroke-dasharray="4 4" stroke-width="1" x1="0" x2="1200" y1="225" y2="225" />
            <line stroke="#e5e7eb" stroke-dasharray="4 4" stroke-width="1" x1="0" x2="1200" y1="150" y2="150" />
            <line stroke="#e5e7eb" stroke-dasharray="4 4" stroke-width="1" x1="0" x2="1200" y1="75" y2="75" />
            <path :d="chartPaths.area" fill="url(#chartGradient)" />
            <path :d="chartPaths.stroke" fill="none" stroke="#13a4ec" stroke-linecap="round" stroke-width="3" vector-effect="non-scaling-stroke" />
          </svg>
        </div>
        <div class="flex justify-between mt-4 text-xs font-medium text-[#617c89] px-2">
          <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span>
        </div>
      </div>

      <!-- Bottom Split Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Inquiries Table -->
        <div class="lg:col-span-2 rounded-xl border border-[#dbe2e6] bg-white shadow-sm flex flex-col">
          <div class="flex items-center justify-between p-6 border-b border-[#f0f3f4]">
            <h3 class="text-[#111618] text-lg font-bold">Recent Inquiries</h3>
            <RouterLink to="/admin/inquiries" class="text-sm font-bold text-primary hover:text-primary/80">View all</RouterLink>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#f8fafc] border-b border-[#f0f3f4]">
                  <th class="py-3 px-6 text-xs font-bold uppercase text-[#617c89]">Client</th>
                  <th class="py-3 px-6 text-xs font-bold uppercase text-[#617c89]">Destination</th>
                  <th class="py-3 px-6 text-xs font-bold uppercase text-[#617c89]">Date</th>
                  <th class="py-3 px-6 text-xs font-bold uppercase text-[#617c89]">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#f0f3f4]">
                <tr v-for="inquiry in recentInquiries" :key="inquiry.id" class="group hover:bg-[#f8fafc] transition-colors">
                  <td class="py-4 px-6">
                    <div class="flex items-center gap-3">
                      <div v-if="inquiry.avatar" class="bg-center bg-cover rounded-full size-8" :style="{ backgroundImage: `url(${inquiry.avatar})` }"></div>
                      <div v-else class="bg-gray-100 rounded-full size-8 flex items-center justify-center text-xs font-bold text-[#617c89]">
                        {{ inquiry.initial }}
                      </div>
                      <span class="text-sm font-bold text-[#111618]">{{ inquiry.name }}</span>
                    </div>
                  </td>
                  <td class="py-4 px-6 text-sm text-[#111618]">{{ inquiry.destination }}</td>
                  <td class="py-4 px-6 text-sm text-[#617c89]">{{ inquiry.date }}</td>
                  <td class="py-4 px-6">
                    <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold', inquiry.statusClass]">
                      {{ inquiry.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Latest Reviews -->
        <div class="rounded-xl border border-[#dbe2e6] bg-white shadow-sm flex flex-col h-full">
          <div class="flex items-center justify-between p-6 border-b border-[#f0f3f4]">
            <h3 class="text-[#111618] text-lg font-bold">Latest Reviews</h3>
            <RouterLink to="/admin/reviews" class="text-sm font-bold text-primary hover:text-primary/80">All reviews</RouterLink>
          </div>
          <div class="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
            <div v-for="review in recentReviews" :key="review.id" class="flex flex-col gap-3">
              <div class="flex justify-between items-start">
                <div class="flex items-center gap-2">
                  <div class="flex text-amber-400">
                    <span v-for="i in 5" :key="i" :class="['material-symbols-outlined text-[16px]', i <= review.rating ? 'filled' : '']">star</span>
                  </div>
                  <span class="text-sm font-bold text-[#111618]">{{ review.name }}</span>
                </div>
                <span class="text-xs text-[#617c89]">{{ review.time }}</span>
              </div>
              <p class="text-sm text-[#617c89] line-clamp-2">"{{ review.text }}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
