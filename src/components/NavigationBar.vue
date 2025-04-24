<script setup lang="ts">
import { Bell, UserCircle2 } from 'lucide-vue-next'
import { ref } from 'vue';

const notificationNo = ref(1)
const username = ref('Catalina Petrus')

</script>

<template>
  <nav class="flex items-center justify-between bg-white shadow px-4 py-2 w-full mb-4">

    <div class="flex items-center gap-2">
      <img src="../assets/logo.png" alt="Logo" class="h-8 w-8" />
      <span class="text-lg font-bold text-blue-800">ToDoApp</span>
    </div>

    <div class="hidden md:flex text-gray-700 font-medium text-sm">
      Personal board
    </div>

    <div class="flex items-center gap-4">
      <button class="relative hover:text-blue-600">
        <Bell class="w-5 h-5" />
        <span class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{{ notificationNo }}</span>
      </button>
      <div>{{ username }}</div>
      <UserCircle2 class="w-8 h-8 text-gray-600" />
    </div>
  </nav>
</template>
