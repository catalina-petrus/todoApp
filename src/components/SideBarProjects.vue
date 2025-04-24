<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { List, PlusCircle } from 'lucide-vue-next'
import { useTodoStore } from '../stores/todoStore'
import { useApi } from '../services/useApi'
import type { Project } from '../services/types'

const store = useTodoStore()
const api = useApi()

const projects = ref<Project[]>([])
const showProjectDialog = ref(false)
const newProjectName = ref('')
const newProjectDescription = ref('')
const projectError = ref('')

const createProject = async () => {
  projectError.value = ''
  if (!newProjectName.value.trim()) {
    projectError.value = 'Project name is required.'
    return
  }

  try {
    const projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
      name: newProjectName.value,
      description: newProjectDescription.value
    }

    const created = await api.createProject({
      ...projectData,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    projects.value.push(created)
    showProjectDialog.value = false
    newProjectName.value = ''
    newProjectDescription.value = ''
  } catch (err) {
    console.error(err)
    projectError.value = 'Failed to create project.'
  }
}


onMounted(async () => {
  try {
    const fetched = await api.getProjects()
    projects.value = fetched
  } catch (err) {
    console.error('Failed to load projects:', err)
  }
})

</script>
<template>
    <div class="flex items-center gap-2 text-yellow-500 font-bold text-xl mb-6">
      <List class="w-5 h-5" />
      TODO LISTS
    </div>
  
    <div class="flex flex-col gap-2">
      <p class="text-xs text-gray-400 mb-1">My Lists</p>
  
      <button
        v-for="project in projects"
        :key="project.id"
        @click="store.selectProject(project.id)"
        class="text-left hover:bg-gray-100 px-3 py-2 rounded text-sm"
        :class="{ 'bg-yellow-100 text-yellow-700 font-semibold': store.selectedProjectId === project.id }"
      >
        {{ project.name }}
      </button>
  
      <!-- New List -->
      <button
  @click="showProjectDialog = true"
  class="flex items-center gap-2 text-gray-500 text-sm hover:bg-gray-100 px-3 py-2 rounded mt-2"
>
  <PlusCircle class="w-4 h-4" />
  New List
</button>


<div v-if="showProjectDialog" class="fixed inset-0 bg-opacity-30 flex justify-center items-center">
  <div class="bg-white p-6 rounded shadow-md w-[90%] max-w-md">
    <h2 class="text-lg font-semibold mb-4">Create New Project</h2>

    <input
      v-model="newProjectName"
      type="text"
      placeholder="Project name"
      class="w-full mb-3 px-3 py-2 border rounded"
    />

    <textarea
      v-model="newProjectDescription"
      placeholder="Project description"
      class="w-full mb-3 px-3 py-2 border rounded"
    ></textarea>

    <p v-if="projectError" class="text-sm text-red-500 mb-2">{{ projectError }}</p>

    <div class="flex justify-end gap-3">
      <button @click="showProjectDialog = false" class="text-gray-600 hover:underline">Cancel</button>
      <button @click="createProject" class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
        Create
      </button>
    </div>
  </div>
</div>

    </div>
  </template>
