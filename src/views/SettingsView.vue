<script setup>
import { ref, onMounted } from 'vue'
import { auth } from '../firebase/config'
import { getUserProfile, updateUserProfile, changeUserPassword, updateUserAvatar } from '../services/profile'
import { getSiteSettings, updateSiteSettings } from '../services/settings'

import { getTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember, uploadTeamImage, updateTeamOrder } from '../services/team'
import draggable from 'vuedraggable'

const user = ref({
  name: '',
  email: '',
  role: '',
  location: '',
  avatar: ''
})

const password = ref({
  current: '', // Not strictly needed for admin update if re-auth not required, but good practice
  new: '',
  confirm: ''
})

const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const isSaving = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const uploadLabel = ref('Uploading...')

const siteSettings = ref({ whatsappNumber: '' })
const isSavingSettings = ref(false)

// Team Management State
const teamMembers = ref([])
const isTeamModalOpen = ref(false)
const isSavingTeam = ref(false)
const currentMember = ref({
    id: null,
    name: '',
    role: '',
    quote: '',
    image: ''
})

onMounted(async () => {
    if (auth.currentUser) {
        try {
            const [profile, settings, team] = await Promise.all([
                 getUserProfile(auth.currentUser.uid),
                 getSiteSettings(),
                 getTeamMembers()
            ])
            user.value = { ...user.value, ...profile }
            if(settings) siteSettings.value = { ...siteSettings.value, ...settings }
            teamMembers.value = team
        } catch (error) {
            console.error("Failed to load data", error)
        }
    }
})

const saveSiteSettings = async () => {
    isSavingSettings.value = true
    try {
        await updateSiteSettings(siteSettings.value)
        alert('Site configuration saved!')
    } catch (error) {
        console.error("Failed to save settings", error)
        alert("Failed to save configuration")
    } finally {
        isSavingSettings.value = false
    }
}

const saveDetails = async () => {
  if (!auth.currentUser) return
  isSaving.value = true
  try {
    await updateUserProfile(auth.currentUser.uid, user.value)
    alert('Personal details saved successfully!')
  } catch (error) {
    console.error("Save failed", error)
    alert("Failed to save changes")
  } finally {
    isSaving.value = false
  }
}

const updatePassword = async () => {
  if (password.value.new !== password.value.confirm) {
    alert('Passwords do not match!')
    return
  }
  if (password.value.new.length < 8) {
      alert('Password must be at least 8 characters')
      return
  }
  
  try {
    await changeUserPassword(password.value.new)
    alert('Password updated successfully!')
    password.value.current = ''
    password.value.new = ''
    password.value.confirm = ''
  } catch (error) {
      console.error("Password update failed", error)
      alert("Failed to update password: " + error.message)
  }
}

const handleAvatarUpload = async (event) => {
    const file = event.target.files[0]
    if (!file || !auth.currentUser) return

    try {
        isUploading.value = true
        uploadLabel.value = 'Uploading Avatar...'
        const url = await updateUserAvatar(auth.currentUser.uid, file, (p) => uploadProgress.value = p)
        user.value.avatar = url
        alert("Avatar updated!")
    } catch (error) {
        console.error("Avatar upload failed", error)
        alert("Failed to upload avatar")
    } finally {
        isUploading.value = false
    }
}

// Team Management Functions
const openTeamModal = (member = null) => {
    if (member) {
        currentMember.value = { ...member }
    } else {
        currentMember.value = { id: null, name: '', role: '', quote: '', image: '' }
    }
    isTeamModalOpen.value = true
}

const closeTeamModal = () => {
    isTeamModalOpen.value = false
    currentMember.value = { id: null, name: '', role: '', quote: '', image: '' }
}

const handleTeamImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
        isUploading.value = true
        uploadLabel.value = 'Uploading Team Photo...'
        uploadLabel.value = 'Uploading Team Photo...'
        const url = await uploadTeamImage(file, (p) => uploadProgress.value = p)
        currentMember.value.image = url
    } catch (error) {
        console.error("Team image upload failed", error)
        alert("Failed to upload image")
    } finally {
        isUploading.value = false
    }
}

const saveTeamMember = async () => {
    if (!currentMember.value.name || !currentMember.value.role) {
        alert("Name and Role are required")
        return
    }

    isSavingTeam.value = true
    try {
        if (currentMember.value.id) {
            await updateTeamMember(currentMember.value.id, currentMember.value)
        } else {
            await addTeamMember(currentMember.value)
        }
        // Refresh list
        teamMembers.value = await getTeamMembers()
        closeTeamModal()
        alert("Team member saved!")
    } catch (error) {
        console.error("Failed to save team member", error)
        alert("Failed to save team member")
    } finally {
        isSavingTeam.value = false
    }
}

const removeTeamMember = async (id, imageUrl) => {
    if (!confirm("Are you sure you want to delete this team member?")) return
    
    try {
        await deleteTeamMember(id, imageUrl)
        teamMembers.value = teamMembers.value.filter(m => m.id !== id)
    } catch (error) {
        console.error("Failed to delete member", error)
        alert("Failed to delete member")
    }
}

const handleTeamReorder = async () => {
    isSavingTeam.value = true
    try {
        await updateTeamOrder(teamMembers.value)
    } catch (error) {
        console.error("Failed to reorder team", error)
        alert("Failed to save new order")
    } finally {
        isSavingTeam.value = false
    }
}
</script>

<template>
  <div class="flex-1 w-full mx-auto p-4 md:p-8 lg:p-12 pb-24 bg-background-light">
    <div class="max-w-[1000px] mx-auto">
      <!-- Page Heading -->
      <div class="flex flex-col gap-2 mb-10">
        <h1 class="text-[#111618] text-3xl md:text-4xl font-black leading-tight tracking-tight">Profile Settings</h1>
        <p class="text-[#617c89] text-base font-normal">Manage your personal information, privacy, and security settings.</p>
      </div>

      <!-- Personal Information Section -->
      <section class="bg-white rounded-xl shadow-sm border border-[#dbe2e6] overflow-hidden mb-8">
        <div class="p-6 md:p-8">
          <div class="flex flex-col gap-8">
            <!-- Header / Avatar -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[#f0f3f4]">
              <div class="flex items-center gap-5">
                <div class="relative group cursor-pointer">
                  <div class="bg-center bg-no-repeat bg-cover rounded-full h-20 w-20 md:h-24 md:w-24 border-4 border-[#f0f3f4] shadow-inner bg-gray-100"
                    :style="{ backgroundImage: user.avatar ? `url('${user.avatar}')` : 'none' }">
                    <span v-if="!user.avatar" class="material-symbols-outlined text-4xl text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">person</span>
                  </div>
                  <label class="absolute bottom-0 right-0 h-8 w-8 flex items-center justify-center bg-white rounded-full border border-[#dbe2e6] shadow-sm text-slate-600 cursor-pointer hover:bg-gray-50 transition-colors">
                    <span class="material-symbols-outlined text-[18px]">photo_camera</span>
                    <input type="file" accept="image/*" class="hidden" @change="handleAvatarUpload">
                  </label>
                </div>
                <div class="flex flex-col">
                  <h3 class="text-[#111618] text-xl font-bold leading-tight">{{ user.name || 'User' }}</h3>
                  <p class="text-[#617c89] text-sm">{{ user.role || 'Role' }}</p>
                  <p class="text-[#617c89] text-xs mt-1">{{ user.location }}</p>
                </div>
              </div>
              <label class="px-4 py-2 bg-[#f0f3f4] hover:bg-gray-200 text-[#111618] rounded-lg text-sm font-bold transition-colors w-full sm:w-auto cursor-pointer text-center">
                Change Photo
                <input type="file" accept="image/*" class="hidden" @change="handleAvatarUpload">
              </label>
            </div>

            <!-- Form Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label class="flex flex-col gap-2">
                <span class="text-[#111618] text-sm font-semibold">Full Name</span>
                <div class="relative">
                  <input v-model="user.name"
                    class="w-full bg-white border border-[#dbe2e6] rounded-lg px-4 py-3 text-[#111618] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    type="text" />
                  <span class="material-symbols-outlined absolute right-3 top-3.5 text-[#617c89] text-[20px]">person</span>
                </div>
              </label>
              <label class="flex flex-col gap-2">
                <span class="text-[#111618] text-base font-semibold">Email Address</span>
                <div class="relative">
                  <input v-model="user.email"
                    class="w-full bg-white border border-[#dbe2e6] rounded-lg px-4 py-3 text-[#111618] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    type="email" />
                  <span class="material-symbols-outlined absolute right-3 top-3.5 text-[#617c89] text-[20px]">mail</span>
                </div>
              </label>
            </div>

            <!-- Action -->
            <div class="flex justify-end pt-2">
              <button @click="saveDetails" :disabled="isSaving"
                class="bg-primary hover:bg-sky-500 text-white rounded-lg px-6 py-3 text-base font-bold tracking-wide shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-70">
                <span v-if="isSaving" class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                <span v-else class="material-symbols-outlined text-[18px]">save</span>
                {{ isSaving ? 'Saving...' : 'Save Personal Details' }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Site Configuration Section -->
      <section class="bg-white rounded-xl shadow-sm border border-[#dbe2e6] overflow-hidden mb-8">
        <div class="p-6 md:p-8">
            <div class="flex flex-col gap-1 pb-4 border-b border-[#f0f3f4] mb-6">
              <h2 class="text-[#111618] text-xl font-bold">Site Configuration</h2>
              <p class="text-[#617c89] text-base">Manage global website settings.</p>
            </div>
            
            <div class="flex flex-col gap-6">
                <!-- Contact Information -->
                 <h3 class="text-base font-bold text-gray-400 uppercase tracking-wider">Contact Details</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label class="flex flex-col gap-2">
                        <span class="text-[#111618] text-base font-semibold">WhatsApp / Phone Number</span>
                        <div class="relative">
                            <input v-model="siteSettings.whatsappNumber"
                            class="w-full bg-white border border-[#dbe2e6] rounded-lg px-4 py-3 pl-10 text-[#111618] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            placeholder="e.g. 94771234567" type="text" />
                            <span class="items-center justify-center flex absolute left-3 top-3.5 text-[#617c89]">
                                <span class="material-symbols-outlined text-[20px]">call</span>
                            </span>
                        </div>
                    </label>
                    <label class="flex flex-col gap-2">
                        <span class="text-[#111618] text-base font-semibold">Contact Email</span>
                        <div class="relative">
                            <input v-model="siteSettings.contactEmail"
                            class="w-full bg-white border border-[#dbe2e6] rounded-lg px-4 py-3 pl-10 text-[#111618] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            placeholder="e.g. hello@book2lanka.com" type="email" />
                             <span class="items-center justify-center flex absolute left-3 top-3.5 text-[#617c89]">
                                <span class="material-symbols-outlined text-[20px]">mail</span>
                            </span>
                        </div>
                    </label>
                    <label class="flex flex-col gap-2 md:col-span-2">
                        <span class="text-[#111618] text-base font-semibold">Office Address</span>
                        <textarea v-model="siteSettings.contactAddress"
                        class="w-full bg-white border border-[#dbe2e6] rounded-lg px-4 py-3 text-[#111618] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        placeholder="e.g. 235/4/2 St. Sebastian Rd, Colombo" rows="2"></textarea>
                    </label>
                </div>

                <!-- Google Maps -->
                <h3 class="text-base font-bold text-gray-400 uppercase tracking-wider border-t border-gray-100 pt-6">Map Integration</h3>
                <label class="flex flex-col gap-2">
                    <span class="text-[#111618] text-base font-semibold">Google Maps Embed code (Source URL only)</span>
                     <div class="relative">
                        <input v-model="siteSettings.googleMapsUrl"
                        class="w-full bg-white border border-[#dbe2e6] rounded-lg px-4 py-3 pl-10 text-[#111618] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        placeholder="e.g. https://www.google.com/maps/embed?pb=..." type="text" />
                        <span class="items-center justify-center flex absolute left-3 top-3.5 text-[#617c89]">
                            <span class="material-symbols-outlined text-[20px]">map</span>
                        </span>
                    </div>
                    <p class="text-xs text-gray-500">Paste the 'src' attribute from the Google Maps Embed HTML.</p>
                </label>

                <!-- Social Media -->
                 <h3 class="text-base font-bold text-gray-400 uppercase tracking-wider border-t border-gray-100 pt-6">Social Media</h3>
                 <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <label class="flex flex-col gap-2">
                        <span class="text-[#111618] text-base font-semibold">Facebook URL</span>
                        <input v-model="siteSettings.socialFacebook"
                        class="w-full bg-white border border-[#dbe2e6] rounded-lg px-4 py-3 text-[#111618] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        placeholder="https://facebook.com/..." type="text" />
                    </label>
                     <label class="flex flex-col gap-2">
                        <span class="text-[#111618] text-base font-semibold">Instagram URL</span>
                        <input v-model="siteSettings.socialInstagram"
                        class="w-full bg-white border border-[#dbe2e6] rounded-lg px-4 py-3 text-[#111618] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        placeholder="https://instagram.com/..." type="text" />
                    </label>
                     <label class="flex flex-col gap-2">
                        <span class="text-[#111618] text-base font-semibold">YouTube URL</span>
                        <input v-model="siteSettings.socialYouTube"
                        class="w-full bg-white border border-[#dbe2e6] rounded-lg px-4 py-3 text-[#111618] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        placeholder="https://youtube.com/..." type="text" />
                    </label>
                 </div>
                
                 <div class="flex justify-end pt-2">
                    <button @click="saveSiteSettings" :disabled="isSavingSettings"
                        class="bg-primary hover:bg-sky-500 text-white rounded-lg px-6 py-3 text-base font-bold tracking-wide shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-70">
                        <span v-if="isSavingSettings" class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                        <span v-else class="material-symbols-outlined text-[18px]">save</span>
                        {{ isSavingSettings ? 'Saving...' : 'Save Configuration' }}
                    </button>
                </div>
            </div>
        </div>
      </section>

      <!-- Team Management Section -->
      <section class="bg-white rounded-xl shadow-sm border border-[#dbe2e6] overflow-hidden mb-8">
        <div class="p-6 md:p-8">
            <div class="flex items-center justify-between pb-4 border-b border-[#f0f3f4] mb-6">
                <div class="flex flex-col gap-1">
                    <h2 class="text-[#111618] text-xl font-bold">Team Management</h2>
                    <p class="text-[#617c89] text-base">Manage the "Meet the Team" section.</p>
                </div>
                <button @click="openTeamModal()" class="bg-primary/10 hover:bg-primary/20 text-primary rounded-lg px-4 py-2 text-base font-bold transition-all flex items-center gap-2">
                    <span class="material-symbols-outlined text-[18px]">add</span>
                    Add Member
                </button>
            </div>

            <div v-if="teamMembers.length === 0" class="text-center py-8 text-gray-500">
                <p>No team members added yet.</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <draggable 
                    v-model="teamMembers" 
                    item-key="id" 
                    class="contents"
                    @end="handleTeamReorder"
                >
                    <template #item="{ element: member }">
                        <div class="bg-gray-50 rounded-lg p-4 relative group border border-gray-100 cursor-move hover:shadow-md transition-shadow">
                            <div class="flex items-center gap-4 mb-3">
                                <img :src="member.image || 'https://placehold.co/100'" alt="Avatar" class="w-12 h-12 rounded-full object-cover shadow-sm bg-white pointer-events-none">
                                <div>
                                    <h4 class="font-bold text-[#111618]">{{ member.name }}</h4>
                                    <p class="text-xs text-primary font-medium">{{ member.role }}</p>
                                </div>
                            </div>
                            <p v-if="member.quote" class="text-xs text-gray-500 italic mb-3 line-clamp-2">"{{ member.quote }}"</p>
                            
                            <div class="flex justify-end gap-2 mt-2">
                                <button @click="openTeamModal(member)" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition" title="Edit">
                                    <span class="material-symbols-outlined text-[18px]">edit</span>
                                </button>
                                <button @click="removeTeamMember(member.id, member.image)" class="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition" title="Delete">
                                    <span class="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                            </div>
                        </div>
                    </template>
                </draggable>
            </div>
        </div>
      </section>

      <!-- Security Section -->
      <section class="bg-white rounded-xl shadow-sm border border-[#dbe2e6] overflow-hidden">
        <div class="p-6 md:p-8">
          <form @submit.prevent="updatePassword" class="flex flex-col gap-6">
            <div class="flex flex-col gap-1 pb-4 border-b border-[#f0f3f4]">
              <h2 class="text-[#111618] text-xl font-bold">Password & Security</h2>
              <p class="text-[#617c89] text-base">Ensure your account is using a long, random password to stay secure.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Current Password -->
              <label class="flex flex-col gap-2 md:col-span-2 max-w-md">
                <span class="text-[#111618] text-base font-semibold">Current Password</span>
                <input v-model="password.current"
                  class="w-full bg-white border border-[#dbe2e6] rounded-lg px-4 py-3 text-[#111618] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="Enter your current password" type="password" autocomplete="current-password" />
              </label>
              <!-- New Password -->
              <label class="flex flex-col gap-2">
                <span class="text-[#111618] text-base font-semibold">New Password</span>
                <div class="relative">
                  <input v-model="password.new"
                    :type="showNewPassword ? 'text' : 'password'"
                    class="w-full bg-white border border-[#dbe2e6] rounded-lg px-4 py-3 text-[#111618] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="Min 8 chars" autocomplete="new-password" />
                  <button type="button" @click="showNewPassword = !showNewPassword" class="absolute right-3 top-3.5 text-[#617c89] hover:text-primary transition-colors">
                    <span class="material-symbols-outlined text-[20px]">{{ showNewPassword ? 'visibility_off' : 'visibility' }}</span>
                  </button>
                </div>
              </label>
              <!-- Confirm Password -->
              <label class="flex flex-col gap-2">
                <span class="text-[#111618] text-base font-semibold">Confirm New Password</span>
                <div class="relative">
                  <input v-model="password.confirm"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="w-full bg-white border border-[#dbe2e6] rounded-lg px-4 py-3 text-[#111618] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="Repeat new password" autocomplete="new-password" />
                  <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute right-3 top-3.5 text-[#617c89] hover:text-primary transition-colors">
                    <span class="material-symbols-outlined text-[20px]">{{ showConfirmPassword ? 'visibility_off' : 'visibility' }}</span>
                  </button>
                </div>
              </label>
            </div>
            <!-- Password Requirements Hint -->
            <div class="flex gap-2 items-start p-3 bg-gray-50 rounded-lg border border-[#f0f3f4]">
              <span class="material-symbols-outlined text-[#617c89] text-[20px] mt-0.5">info</span>
              <p class="text-xs text-[#617c89] leading-relaxed">
                Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
              </p>
            </div>
            <!-- Action -->
            <div class="flex justify-start pt-2">
              <button type="submit"
                class="bg-white border border-[#dbe2e6] hover:bg-gray-50 text-[#111618] rounded-lg px-6 py-3 text-base font-bold transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
                Update Password
              </button>
            </div>
          </form>
        </div>
      </section>

      <div class="mt-8 flex justify-center pb-8">
        <p class="text-[#617c89] text-xs">© 2023 Travel Admin Panel. All rights reserved.</p>
      </div>
    </div>


    <!-- Upload Progress Overlay -->
    <div v-if="isUploading" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div class="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl flex flex-col items-center gap-4 text-center border border-[#dbe2e6]">
            <div class="relative size-16">
                 <svg class="size-full rotate-[-90deg]" viewBox="0 0 36 36">
                    <path class="text-gray-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3"></path>
                    <path class="text-primary transition-all duration-300 ease-out" :stroke-dasharray="`${uploadProgress}, 100`" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3"></path>
                 </svg>
                 <div class="absolute inset-0 flex items-center justify-center font-bold text-base text-[#111618]">{{ uploadProgress }}%</div>
            </div>
            <div>
                <h3 class="font-bold text-lg text-[#111618]">Uploading...</h3>
                <p class="text-base text-[#617c89]">{{ uploadLabel }}</p>
            </div>
        </div>
    </div>

    <!-- Team Member Modal -->
    <div v-if="isTeamModalOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl w-full max-w-lg shadow-2xl border border-[#dbe2e6]">
            <div class="p-6 border-b border-[#f0f3f4] flex justify-between items-center">
                <h3 class="text-xl font-bold text-[#111618]">{{ currentMember.id ? 'Edit' : 'Add' }} Team Member</h3>
                <button @click="closeTeamModal" class="text-gray-500 hover:text-gray-700">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            <div class="p-6 flex flex-col gap-4">
                <div class="flex justify-center mb-4">
                     <div class="relative group cursor-pointer">
                        <div class="bg-center bg-no-repeat bg-cover rounded-full h-24 w-24 border-4 border-[#f0f3f4] shadow-sm bg-gray-100"
                            :style="{ backgroundImage: currentMember.image ? `url('${currentMember.image}')` : 'none' }">
                            <span v-if="!currentMember.image" class="material-symbols-outlined text-4xl text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">person</span>
                        </div>
                        <label class="absolute bottom-0 right-0 h-8 w-8 flex items-center justify-center bg-white rounded-full border border-[#dbe2e6] shadow-sm text-slate-600 cursor-pointer hover:bg-gray-50 transition-colors">
                            <span class="material-symbols-outlined text-[18px]">photo_camera</span>
                            <input type="file" accept="image/*" class="hidden" @change="handleTeamImageUpload">
                        </label>
                    </div>
                </div>

                <label class="flex flex-col gap-1">
                    <span class="text-base font-semibold text-[#111618]">Name</span>
                     <input v-model="currentMember.name"
                        class="w-full bg-white border border-[#dbe2e6] rounded-lg px-4 py-2.5 text-[#111618] focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="e.g. John Doe" type="text" />
                </label>
                <label class="flex flex-col gap-1">
                    <span class="text-base font-semibold text-[#111618]">Role</span>
                     <input v-model="currentMember.role"
                        class="w-full bg-white border border-[#dbe2e6] rounded-lg px-4 py-2.5 text-[#111618] focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="e.g. Senior Guide" type="text" />
                </label>
                 <label class="flex flex-col gap-1">
                    <span class="text-base font-semibold text-[#111618]">Quote (Optional)</span>
                     <textarea v-model="currentMember.quote"
                        class="w-full bg-white border border-[#dbe2e6] rounded-lg px-4 py-2.5 text-[#111618] focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Short quote or bio..." rows="3"></textarea>
                </label>
            </div>
            <div class="p-6 border-t border-[#f0f3f4] flex justify-end gap-3">
                <button @click="closeTeamModal" class="px-4 py-2 text-gray-700 font-bold hover:bg-gray-100 rounded-lg transition">Cancel</button>
                <button @click="saveTeamMember" :disabled="isSavingTeam" class="bg-primary hover:bg-sky-500 text-white rounded-lg px-6 py-2 font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-70">
                    <span v-if="isSavingTeam" class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    {{ isSavingTeam ? 'Saving...' : 'Save Member' }}
                </button>
            </div>
        </div>
    </div>
  </div>
</template>
