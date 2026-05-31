<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { getMessages, sendMessage as sendMsgService } from '../services/messages'

const searchQuery = ref('')
const activeChatId = ref(null)
const newMessage = ref('')
const rawMessages = ref([])
const isLoading = ref(true)

onMounted(async () => {
  await loadMessages()
})

const loadMessages = async () => {
    try {
        rawMessages.value = await getMessages()
        // Select first chat by default if available
        if (chats.value.length > 0 && !activeChatId.value) {
            activeChatId.value = chats.value[0].id
        }
    } catch (error) {
        console.error("Error loading messages:", error)
    } finally {
        isLoading.value = false
    }
}

// Group messages by customer email to form "Chats"
const chats = computed(() => {
    const groups = {}
    
    rawMessages.value.forEach(msg => {
        // Assume messages have customerEmail. If not, fallback to 'Unknown'
        // For Admin sent messages, we need a 'recipientEmail' or 'chatId' to know where it belongs.
        // For simplicity, we'll group by 'chatId' if present, or 'customerEmail'.
        
        const key = msg.chatId || msg.customerEmail || 'General'
        if (!groups[key]) {
            groups[key] = {
                id: key,
                name: msg.customerName || (key === 'General' ? 'General Chat' : key.split('@')[0]),
                initial: (msg.customerName || 'U').charAt(0).toUpperCase(),
                messages: [],
                lastMessage: '',
                time: '',
                category: msg.subject || 'Inquiry',
                active: false
            }
        }
        groups[key].messages.push(msg)
    })

    return Object.values(groups).map(group => {
        // Sort messages in group
        group.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        const lastMsg = group.messages[group.messages.length - 1]
        
        return {
            ...group,
            lastMessage: lastMsg.text,
            time: new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            active: group.id === activeChatId.value
        }
    }).filter(chat => 
        chat.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
})

const currentChatMessages = computed(() => {
    if (!activeChatId.value) return []
    const chat = chats.value.find(c => c.id === activeChatId.value)
    if (!chat) return []
    
    return chat.messages.map(msg => ({
        id: msg.id,
        chatId: activeChatId.value,
        sender: msg.sender === 'Admin' ? 'Admin' : chat.name,
        initial: msg.sender === 'Admin' ? 'AD' : chat.initial,
        text: msg.text,
        time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: msg.sender === 'Admin' ? 'sent' : 'received',
        status: 'Sent'
    }))
})

const activeChat = computed(() => chats.value.find(c => c.id === activeChatId.value))

const sendMessage = async () => {
    if (!newMessage.value.trim() || !activeChatId.value) return

    const text = newMessage.value
    const chatId = activeChatId.value
    
    // Optimistic UI update
    const tempMsg = {
        id: Date.now().toString(),
        chatId: chatId,
        customerEmail: chatId, // Assuming chatId is email
        sender: 'Admin',
        text: text,
        createdAt: new Date().toISOString()
    }
    rawMessages.value.push(tempMsg)
    newMessage.value = ''

    try {
        await sendMsgService({
            text: text,
            sender: 'Admin',
            chatId: chatId,
            customerEmail: chatId,
            createdAt: new Date().toISOString()
        })
    } catch (error) {
        console.error("Failed to send message", error)
        // Revert optimistic update? For now just log
        alert("Failed to send message")
    }
}
</script>

<template>
  <div class="flex h-full overflow-hidden bg-white">
    <!-- Conversations List -->
    <div class="w-80 border-r border-[#dbe2e6] flex flex-col shrink-0 bg-white">
      <div class="p-4 border-b border-[#dbe2e6]">
        <h2 class="text-xl font-bold mb-4">Messages</h2>
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#617c89] text-[20px]">search</span>
          <input v-model="searchQuery"
            class="w-full h-10 pl-10 pr-4 rounded-lg bg-background-light border-transparent focus:ring-1 focus:ring-primary text-sm"
            placeholder="Search chats..." type="text" />
        </div>
      </div>
      <div class="flex-1 overflow-y-auto">
        <div v-if="chats.length === 0" class="p-4 text-center text-sm text-[#617c89]">
            No messages found.
        </div>
        <div v-for="chat in chats" :key="chat.id" 
          @click="activeChatId = chat.id"
          :class="[
            'p-4 border-b border-[#f0f3f4] cursor-pointer transition-all',
            activeChatId === chat.id ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-gray-50'
          ]">
          <div class="flex items-center gap-3 mb-1">
            <div :class="['size-10 rounded-full flex items-center justify-center font-bold bg-primary/10 text-primary']">
              {{ chat.initial }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <span class="font-bold text-sm truncate">{{ chat.name }}</span>
                <span class="text-[10px] text-[#617c89] shrink-0">{{ chat.time }}</span>
              </div>
              <p :class="['text-xs truncate', activeChatId === chat.id ? 'text-primary font-bold' : 'text-[#617c89]']">
                {{ chat.category }}
              </p>
            </div>
          </div>
          <p class="text-xs text-[#617c89] truncate">{{ chat.lastMessage }}</p>
        </div>
      </div>
    </div>

    <!-- Chat Window -->
    <div class="flex-1 flex flex-col bg-background-light">
      <!-- Chat Header -->
      <div v-if="activeChat" class="h-16 px-6 border-b border-[#dbe2e6] bg-white flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3">
          <div class="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {{ activeChat.initial }}
          </div>
          <div>
            <p class="font-bold text-sm">{{ activeChat.name }}</p>
            <p class="text-[10px] text-green-500 font-bold">Active</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <button class="text-[#617c89] hover:text-primary transition-colors">
            <span class="material-symbols-outlined">call</span>
          </button>
          <button class="text-[#617c89] hover:text-primary transition-colors">
            <span class="material-symbols-outlined">videocam</span>
          </button>
          <button class="text-[#617c89] hover:text-primary transition-colors">
            <span class="material-symbols-outlined">info</span>
          </button>
        </div>
      </div>
      <div v-else class="h-16 px-6 border-b border-[#dbe2e6] bg-white flex items-center justify-between shrink-0">
          <p class="text-sm text-gray-500">Select a chat to view messages</p>
      </div>

      <!-- Messages Area -->
      <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        
        <div v-if="currentChatMessages.length === 0" class="flex justify-center mt-10">
            <p class="text-sm text-gray-400">No messages yet.</p>
        </div>

        <div v-else>
            <div class="flex justify-center mb-4">
            <span class="px-3 py-1 rounded-full bg-gray-200 text-[10px] font-bold text-[#617c89] uppercase tracking-widest">Today</span>
            </div>

            <div v-for="msg in currentChatMessages" :key="msg.id" 
            :class="[
                'flex items-end gap-2 max-w-[80%] mb-4',
                msg.type === 'sent' ? 'flex-row-reverse ml-auto' : ''
            ]">
            <div v-if="msg.type === 'received'" 
                class="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] shrink-0">
                {{ msg.initial }}
            </div>
            <div :class="[
                'p-4 rounded-2xl shadow-sm text-sm',
                msg.type === 'sent' 
                ? 'bg-primary text-white rounded-br-none shadow-lg shadow-primary/20' 
                : 'bg-white rounded-bl-none'
            ]">
                <p>{{ msg.text }}</p>
                <p :class="['text-[10px] mt-2', msg.type === 'sent' ? 'text-white/70 text-right' : 'text-[#617c89]']">
                {{ msg.time }}
                </p>
            </div>
            </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="p-6 bg-white border-t border-[#dbe2e6]">
        <div class="flex items-center gap-4 bg-background-light rounded-2xl p-2 pr-4 self-center mx-auto w-full">
          <button class="size-10 flex items-center justify-center text-[#617c89] hover:text-primary transition-colors">
            <span class="material-symbols-outlined">add_circle</span>
          </button>
          <input v-model="newMessage" @keyup.enter="sendMessage"
            class="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3"
            placeholder="Type a message..." type="text" />
          <div class="flex items-center gap-2">
            <button class="size-10 flex items-center justify-center text-[#617c89] hover:text-primary transition-colors">
              <span class="material-symbols-outlined">mood</span>
            </button>
            <button @click="sendMessage"
              class="size-10 flex items-center justify-center bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:bg-sky-500 transition-colors">
              <span class="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
