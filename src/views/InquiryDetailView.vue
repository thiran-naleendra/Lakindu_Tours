<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { getInquiryById, updateInquiryStatus } from '../services/inquiries'

const route = useRoute()
const inquiryId = route.params.id
const inquiry = ref({})
const isLoading = ref(true)
const replyMessage = ref('')
const isSending = ref(false)

onMounted(async () => {
  try {
    console.log("Fetching inquiry:", inquiryId)
    const fetchedInquiry = await getInquiryById(inquiryId)
    console.log("Fetched data:", fetchedInquiry)
    
    if (fetchedInquiry) {
      // Handle Date (String ISO or Firestore Timestamp)
      let dateDisplay = 'Unknown'
      if (fetchedInquiry.createdAt) {
          const d = fetchedInquiry.createdAt;
          // Check for Firestore Timestamp object (seconds/nanoseconds)
          if (typeof d === 'object' && d.seconds) {
              dateDisplay = new Date(d.seconds * 1000).toLocaleString()
          } else {
              // Standard ISO String
              const dateObj = new Date(d);
              if (!isNaN(dateObj.getTime())) {
                  dateDisplay = dateObj.toLocaleString();
              }
          }
      }

      // map worker data (flattened root + details map) to UI structure
      const details = fetchedInquiry.details || {};
      
      inquiry.value = {
        id: fetchedInquiry.id,
        customer: { 
            name: fetchedInquiry.customer?.name || fetchedInquiry.name || 'Unknown', 
            email: fetchedInquiry.customer?.email || fetchedInquiry.email || 'No Email', 
            phone: fetchedInquiry.customer?.phone || fetchedInquiry.phone || 'No Phone',
            nationality: fetchedInquiry.customer?.nationality || details.country || 'N/A'
        },
        tour: fetchedInquiry.tour || (fetchedInquiry.type === 'Tailor Made' ? 'Tailor Made Request' : (fetchedInquiry.subject || 'General Inquiry')),
        subject: fetchedInquiry.subject || (fetchedInquiry.message ? fetchedInquiry.message.substring(0, 50) + '...' : 'Inquiry Details'),
        message: fetchedInquiry.message || 'No message content.',
        date: dateDisplay,
        status: fetchedInquiry.status || 'New',
        
        // Map details to UI sections
        tourDetails: fetchedInquiry.tourDetails || {
            arrivalDate: details.arrival || details.pickupDate ? new Date(details.arrival || details.pickupDate).toLocaleDateString() : 'N/A',
            arrivalTime: details.arrival ? new Date(details.arrival).toLocaleTimeString() : '',
            departureDate: details.departure || details.returnDate ? new Date(details.departure || details.returnDate).toLocaleDateString() : 'N/A',
            departureTime: details.departure ? new Date(details.departure).toLocaleTimeString() : '',
            duration: (details.arrival && details.departure) || (details.pickupDate && details.returnDate)
                ? Math.ceil((new Date(details.departure || details.returnDate) - new Date(details.arrival || details.pickupDate)) / (1000 * 60 * 60 * 24)) 
                : 0,
            adults: details.adults || details.pax || 0,
            children: details.children || 0,
            childAges: Array.isArray(details.childAges) ? details.childAges : []
        },
        fleetDetails: fetchedInquiry.fleetDetails || (fetchedInquiry.type === 'Fleet' ? {
            pickupDate: details.pickupDate,
            returnDate: details.returnDate,
            pickupLocation: details.pickupLocation,
            dropLocation: details.dropLocation,
            vehicleId: details.vehicleId,
            luggage: details.luggage,
            kidsSeat: details.kidsSeat,
            pax: details.pax
        } : null),
        accommodation: fetchedInquiry.accommodation || {
            rooms: typeof details.rooms === 'object' ? details.rooms : {},
            starRating: details.hotelStar ? [details.hotelStar] : [],
            mealPlan: details.mealPlan ? [details.mealPlan] : []
        },
        interests: fetchedInquiry.interests || (typeof details.interests === 'object' ? details.interests : null)
      }
    } else {
        console.warn("Inquiry not found for ID:", inquiryId)
        // Set error or handle not found
    }
  } catch (error) {
    console.error("Failed to fetch inquiry details", error)
  } finally {
    isLoading.value = false
  }
})

const handleReply = async () => {
    isSending.value = true
    try {
        // In a real app, this would send an email via backend
        console.log("Sending reply:", replyMessage.value)
        
        // Update status to Replied
        await updateInquiryStatus(inquiryId, 'Replied')
        inquiry.value.status = 'Replied'
        replyMessage.value = ''
        alert("Reply sent successfully (Simulated)")
    } catch (error) {
        console.error("Failed to send reply", error)
    } finally {
        isSending.value = false
    }
}
</script>

<template>
  <div class="p-4 md:p-8 bg-background-light">
    <div v-if="isLoading" class="flex justify-center p-12">
        <span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
    </div>
    <div v-else class="mx-auto flex flex-col gap-6">
      <div class="flex items-center gap-2 text-sm mb-2">
        <RouterLink to="/admin/inquiries" class="text-slate-500 hover:text-primary transition-colors">Inquiries</RouterLink>
        <span class="material-symbols-outlined text-[16px] text-slate-400">chevron_right</span>
        <span class="font-medium">Inquiry Details</span>
      </div>

      <div class="bg-white rounded-xl border border-[#dbe2e6] shadow-sm overflow-hidden">
        <div class="p-6 border-b border-[#dbe2e6] flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold">{{ inquiry.subject }}</h1>
            <p class="text-sm text-[#617c89] mt-1">{{ inquiry.tour }}</p>
          </div>
          <span :class="['px-3 py-1 rounded-full text-xs font-bold uppercase', inquiry.status === 'New' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700']">{{ inquiry.status }}</span>
        </div>
        
        <div class="p-6 flex flex-col gap-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p class="text-xs font-bold text-[#617c89] uppercase tracking-wider mb-2">Customer</p>
              <p class="font-bold">{{ inquiry.customer?.name }}</p>
              <p class="text-sm text-[#617c89]">{{ inquiry.customer?.email }}</p>
              <p class="text-sm text-[#617c89]">{{ inquiry.customer?.phone }}</p>
              <p class="text-sm text-[#617c89]">{{ inquiry.customer?.nationality }}</p>
            </div>
            <div>
              <p class="text-xs font-bold text-[#617c89] uppercase tracking-wider mb-2">Date Received</p>
              <p class="text-sm">{{ inquiry.date }}</p>
            </div>
          </div>

          <!-- Fleet Specific Section -->
          <div v-if="inquiry.fleetDetails" class="p-6 bg-blue-50 border border-blue-100 rounded-xl">
             <h3 class="font-bold text-blue-900 mb-4 flex items-center gap-2">
                 <span class="material-symbols-outlined">directions_car</span> Vehicle Booking Details
             </h3>
             <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <div>
                    <p class="text-[10px] font-bold text-blue-800/50 uppercase tracking-widest mb-1">Pick-up</p>
                    <p class="text-sm font-bold">{{ inquiry.fleetDetails.pickupLocation }}</p>
                    <p class="text-xs text-blue-700">{{ inquiry.fleetDetails.pickupDate }}</p>
                 </div>
                 <div>
                    <p class="text-[10px] font-bold text-blue-800/50 uppercase tracking-widest mb-1">Drop-off</p>
                    <p class="text-sm font-bold">{{ inquiry.fleetDetails.dropLocation }}</p>
                    <p class="text-xs text-blue-700">{{ inquiry.fleetDetails.returnDate }}</p>
                 </div>
                 <div>
                    <p class="text-[10px] font-bold text-blue-800/50 uppercase tracking-widest mb-1">Passengers</p>
                    <p class="text-sm font-bold">{{ inquiry.fleetDetails.pax }} Adults</p>
                    <p class="text-[10px] text-blue-700">{{ inquiry.fleetDetails.kidsSeat ? 'Kids Seat Required' : 'No Kids Seat' }}</p>
                 </div>
                 <div>
                    <p class="text-[10px] font-bold text-blue-800/50 uppercase tracking-widest mb-1">Luggage</p>
                    <p class="text-sm font-bold">{{ inquiry.fleetDetails.luggage }} Items</p>
                 </div>
             </div>
          </div>

          <!-- Tailor Made Sections -->
          <div v-if="inquiry.tourDetails && inquiry.type !== 'Fleet'" class="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-gray-50 rounded-xl">
             <div>
                 <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
                     <span class="material-symbols-outlined text-primary">flight_takeoff</span> Tour Details
                 </h3>
                 <ul class="space-y-2 text-sm text-gray-700">
                     <li><span class="font-medium">Arrival:</span> {{ inquiry.tourDetails.arrivalDate }} @ {{ inquiry.tourDetails.arrivalTime }}</li>
                     <li><span class="font-medium">Departure:</span> {{ inquiry.tourDetails.departureDate }} @ {{ inquiry.tourDetails.departureTime }}</li>
                     <li><span class="font-medium">Duration:</span> {{ inquiry.tourDetails.duration }} Days</li>
                     <li><span class="font-medium">Pax:</span> {{ inquiry.tourDetails.adults }} Adults, {{ inquiry.tourDetails.children }} Children</li>
                     <li v-if="inquiry.tourDetails.childAges && inquiry.tourDetails.childAges.length"><span class="font-medium">Child Ages:</span> {{ inquiry.tourDetails.childAges.join(', ') }}</li>
                 </ul>
             </div>
             
             <div v-if="inquiry.accommodation">
                 <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
                     <span class="material-symbols-outlined text-primary">hotel</span> Accommodation
                 </h3>
                  <div class="space-y-4 text-sm text-gray-700">
                      <div>
                          <p class="font-medium mb-1">Rooms:</p>
                          <div class="flex flex-wrap gap-2">
                              <span v-for="(qty, type) in inquiry.accommodation.rooms" :key="type" v-show="qty > 0" class="bg-white px-2 py-1 rounded border border-gray-200 text-xs">
                                  {{ type }}: {{ qty }}
                              </span>
                          </div>
                      </div>
                      <div v-if="inquiry.accommodation.starRating && inquiry.accommodation.starRating.length">
                          <p class="font-medium mb-1">Star Rating:</p>
                          <p>{{ inquiry.accommodation.starRating.join(', ') }}</p>
                      </div>
                      <div v-if="inquiry.accommodation.mealPlan && inquiry.accommodation.mealPlan.length">
                          <p class="font-medium mb-1">Meal Plan:</p>
                          <p>{{ inquiry.accommodation.mealPlan.join(', ') }}</p>
                      </div>
                  </div>
             </div>
          </div>

          <div v-if="inquiry.interests">
               <h3 class="font-bold text-gray-800 mb-4">Interests</h3>
               <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                   <div v-for="(val, key) in inquiry.interests" :key="key" class="bg-gray-50 p-3 rounded-lg">
                       <div class="flex justify-between text-xs mb-1">
                           <span class="capitalize text-gray-600">{{ key.replace(/([A-Z])/g, ' $1').trim() }}</span>
                           <span class="font-bold text-primary">{{ val }}%</span>
                       </div>
                       <div class="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                           <div class="bg-primary h-full rounded-full" :style="{ width: val + '%' }"></div>
                       </div>
                   </div>
               </div>
          </div>

          <div>
            <p class="text-xs font-bold text-[#617c89] uppercase tracking-wider mb-2">Message</p>
            <div class="bg-background-light p-4 rounded-lg">
              <p class="text-sm leading-relaxed">{{ inquiry.message }}</p>
            </div>
          </div>

          <div class="flex flex-col gap-4">
            <p class="text-xs font-bold text-[#617c89] uppercase tracking-wider">Quick Reply</p>
            <textarea 
              v-model="replyMessage"
              class="w-full h-32 p-4 rounded-xl border border-[#dbe2e6] bg-white focus:ring-1 focus:ring-primary outline-none text-sm"
              placeholder="Type your response here..."
            ></textarea>
            <div class="flex justify-end gap-3">
              <button class="px-6 py-2 border border-[#dbe2e6] rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">Discard</button>
              <button @click="handleReply" :disabled="isSending" class="px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-sky-500 transition-all shadow-sm flex items-center gap-2">
                  <span v-if="isSending" class="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                  {{ isSending ? 'Sending...' : 'Send Reply' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
