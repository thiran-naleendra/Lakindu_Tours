<script setup>
import { ref, computed, onMounted } from 'vue'
import { getInquiries, deleteInquiry } from '../services/inquiries'

const searchQuery = ref('')
const selectedStatus = ref('All Status')
const inquiries = ref([])
const isDeleting = ref(false)

onMounted(async () => {
  await loadInquiries()
})

const loadInquiries = async () => {
  try {
    inquiries.value = await getInquiries()
  } catch (error) {
    console.error("Failed to fetch inquiries", error)
  }
}

const handleDeleteInquiry = async (id) => {
  if (confirm("Are you sure you want to delete this inquiry? This action cannot be undone.")) {
    isDeleting.value = true
    try {
      await deleteInquiry(id)
      await loadInquiries()
    } catch (error) {
      console.error("Failed to delete inquiry", error)
      alert("Failed to delete inquiry")
    } finally {
      isDeleting.value = false
    }
  }
}

const filteredInquiries = computed(() => {
  return inquiries.value.map(inq => {
    // Handle Date (String ISO or Firestore Timestamp)
    let dateDisplay = 'Unknown'
    if (inq.createdAt) {
      const d = inq.createdAt;
      if (typeof d === 'object' && d.seconds) {
        dateDisplay = new Date(d.seconds * 1000).toLocaleDateString()
      } else {
        const dateObj = new Date(d);
        if (!isNaN(dateObj.getTime())) {
          dateDisplay = dateObj.toLocaleDateString();
        }
      }
    }

    const customerName = inq.customer?.name || inq.name || 'Unknown'
    const customerEmail = inq.customer?.email || inq.email || 'No Email'

    return {
      id: inq.id,
      customer: {
          name: customerName,
          email: customerEmail,
          initial: customerName.charAt(0).toUpperCase()
      },
      subject: inq.subject || (inq.message ? inq.message.substring(0, 30) + '...' : 'Inquiry Details'),
      tour: inq.tour || inq.type || 'General Inquiry',
      date: dateDisplay,
      status: inq.status || 'New',
      statusClass: (inq.status === 'Replied') ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
    }
  }).filter(inq => {
    const matchesSearch = inq.customer.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          inq.subject.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          inq.tour.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = selectedStatus.value === 'All Status' || inq.status === selectedStatus.value
    return matchesSearch && matchesStatus
  })
})
</script>

<template>
  <div class="p-4 md:p-8 bg-background-light">
    <div class="mx-auto flex flex-col gap-6">
      <!-- Page Heading -->
      <div class="flex flex-col gap-1">
        <h1 class="text-[#111618] text-3xl md:text-4xl font-extrabold tracking-tight">Tailor Made Inquiries</h1>
        <p class="text-[#617c89] text-base font-normal">Manage and respond to tour booking inquiries.</p>
      </div>

      <!-- Toolbar -->
      <div class="flex flex-col md:flex-row justify-between gap-4 bg-white p-4 rounded-xl border border-[#dbe2e6] shadow-sm">
        <div class="flex-1 relative">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#617c89]">search</span>
          <input v-model="searchQuery"
            class="w-full h-12 pl-10 pr-4 bg-background-light border-none rounded-lg text-sm focus:ring-1 focus:ring-primary"
            placeholder="Search inquiries..." type="text" />
        </div>
        <div class="flex gap-3">
          <select v-model="selectedStatus"
            class="h-12 border-transparent bg-background-light rounded-lg text-sm font-medium px-4 focus:ring-0">
            <option>All Status</option>
            <option>New</option>
            <option>Replied</option>
          </select>
        </div>
      </div>

      <!-- Inquiries Table -->
      <div class="bg-white rounded-xl border border-[#dbe2e6] shadow-sm overflow-hidden text-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-background-light border-b border-[#dbe2e6]">
                <th class="p-4 text-xs font-bold text-[#617c89] uppercase tracking-wider">Customer</th>
                <th class="p-4 text-xs font-bold text-[#617c89] uppercase tracking-wider">Tour & Subject</th>
                <th class="p-4 text-xs font-bold text-[#617c89] uppercase tracking-wider">Date</th>
                <th class="p-4 text-xs font-bold text-[#617c89] uppercase tracking-wider">Status</th>
                <th class="p-4 text-xs font-bold text-[#617c89] uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#dbe2e6]">
              <tr v-for="inquiry in filteredInquiries" :key="inquiry.id" class="hover:bg-gray-50 transition-colors group">
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <div class="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">{{ inquiry.customer.initial }}</div>
                    <div>
                      <p class="font-bold text-sm">{{ inquiry.customer.name }}</p>
                      <p class="text-[11px] text-[#617c89]">{{ inquiry.customer.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="p-4">
                  <p class="font-bold text-sm truncate max-w-[200px]">{{ inquiry.subject }}</p>
                  <p class="text-[11px] text-primary font-medium mt-0.5">{{ inquiry.tour }}</p>
                </td>
                <td class="p-4">
                  <p class="text-xs text-[#617c89]">{{ inquiry.date }}</p>
                </td>
                <td class="p-4">
                  <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase', inquiry.statusClass]">{{ inquiry.status }}</span>
                </td>
                <td class="p-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <RouterLink :to="'/admin/inquiries/' + inquiry.id" class="inline-flex items-center justify-center px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-sky-500 transition-colors shadow-sm">
                        {{ inquiry.status === 'New' ? 'View & Reply' : 'Details' }}
                    </RouterLink>
                    <button @click="handleDeleteInquiry(inquiry.id)" :disabled="isDeleting" class="p-2 text-[#617c89] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Inquiry">
                        <span class="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
