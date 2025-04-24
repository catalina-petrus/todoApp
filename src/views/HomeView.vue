<script setup lang="ts">
import { ref } from 'vue'
import { List, PlusCircle, XIcon } from 'lucide-vue-next'
import ToDosSection from '../components/ToDosSection.vue'
import ProjectInfoRightSide from '../components/ProjectInfoRightSide.vue';
import SideBarProjects from '../components/SideBarProjects.vue';
import { useTodoStore } from '../stores/todoStore'

const store = useTodoStore()
const selectedTodoId = ref<number>(0)

const handleTodoClick = (id: number) => {
  selectedTodoId.value = id
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800 mt-4">
    <div class="flex-1 flex flex-col lg:flex-row overflow-hidden">
      <aside
        class="w-full lg:w-[18%] min-w-[220px] max-w-[300px] px-5 py-6 bg-white shadow-md overflow-y-auto h-screen"
      >

       <SideBarProjects/>
      </aside>

      <main class="flex-1 px-6 py-6 overflow-y-auto">
        <ToDosSection  @select-todo="handleTodoClick"/>
      </main>

      <aside
        class="w-full lg:w-[18%] min-w-[220px] max-w-[300px] px-5 py-6 bg-white shadow-md overflow-y-auto h-screen"
      >
        <ProjectInfoRightSide  :todoId="selectedTodoId" />
      </aside>
    </div>
  </div>
</template>
