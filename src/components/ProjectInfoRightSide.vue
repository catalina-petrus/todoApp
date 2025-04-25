<script setup lang="ts">
import { useApi } from '../services/useApi';
import { ref, onMounted, watch } from 'vue';
import type { Project, Todo } from '../services/types';
import { Calendar1Icon, TagIcon, BriefcaseBusinessIcon, Flag, TextIcon } from 'lucide-vue-next';

import { useTodoStore } from '../stores/todoStore'

const store = useTodoStore()

console.log("here" ,store.selectedProjectId)

const api = useApi()
const props = defineProps<{ todoId: number }>()
const emit = defineEmits(['close'])
const todo = ref<Todo | null>(null)

const showPriorityDropdown = ref(false)
const priority = ref('')

const savePriority = async () => {
  if (!todo.value) return
  const updatedTodo = { ...todo.value, priority: priority.value }
  try {
    await api.updateTodo(todo.value.id, updatedTodo)
    todo.value = updatedTodo
  } catch (err) {
    console.error('Failed to update priority', err)
  }
  showPriorityDropdown.value = false
}

watch(
  () => todo.value,
  (newTodo) => {
    if (newTodo) priority.value = newTodo.priority || ''
  },
  { immediate: true }
)

const showDatePicker = ref(false)
const dueDate = ref('')

const saveDueDate = async () => {
  if (!todo.value) return
  const updatedTodo = {
    ...todo.value,
    dueDate: new Date(dueDate.value)
  }

  try {
    await api.updateTodo(todo.value.id, updatedTodo)
    todo.value = updatedTodo
  } catch (err) {
    console.error('Failed to update due date', err)
  }

  showDatePicker.value = false
}
watch(
  () => todo.value,
  (newTodo) => {
    if (newTodo) dueDate.value = new Date(newTodo.dueDate || new Date()).toISOString().slice(0, 16)
  },
  { immediate: true }
)
watch(todo, (newTodo) => {
  if (newTodo?.projectId) {
    store.fetchProjectData(newTodo.projectId)
  }
})

const fetchTodo = async () => {
  const todos = await api.getTodos()
  todo.value = todos.find(t => t.id === props.todoId) || null
  console.log(todo.value)
}

watch(() => props.todoId, fetchTodo, { immediate: true })

/// editable todo title and description
const editableTodo = ref<Todo | null>(null)


watch(todo, (val) => {
  editableTodo.value = val ? { ...val } : null
}, { immediate: true })

const saveError = ref('')
const saveSuccess = ref(false)

const saveTodoChanges = async () => {
  if (!editableTodo.value) return
  try {
    await api.updateTodo(editableTodo.value.id, editableTodo.value)
    saveSuccess.value = true
   
  } catch (err: any) {
    console.error(err)
    saveError.value = 'Failed to save changes.'
  }
}



</script>
<template>

 <!-- Project Info -->
<div class="flex items-center gap-2 text-gray-700">
  <BriefcaseBusinessIcon class="w-5 h-5" />
  <div class="flex flex-col">
    <p class="text-sm font-medium">{{ store.project?.name || 'Project Name' }}</p>
    <p class="text-sm text-gray-500">{{ store.project?.description || 'Description of Project' }}</p>
  </div>
</div>


  <!-- Only shows the card if todo is loaded -->
  <div v-if="todo" class="bg-white shadow-md rounded-lg p-6 flex flex-col gap-6">
    <div class="mb-4">
      <!-- Editable Title -->
      <input
      v-if="editableTodo"
      v-model="editableTodo.title"
      placeholder="Enter title"
      class="w-full text-lg font-semibold border border-gray-200 px-3 py-1 rounded mb-2 focus:outline-none focus:ring"
    />

    <textarea
      v-if="editableTodo"
      v-model="editableTodo.description"
      placeholder="Enter description"
      class="w-full text-sm border border-gray-200 px-3 py-2 rounded focus:outline-none focus:ring"
      rows="3"
    ></textarea>

  
  <div class="flex justify-end mt-4 gap-2">
  <button
    @click="saveTodoChanges"
    class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
  >
    Save Changes
  </button>
</div>

</div>


    <!-- Due Date -->
    <div>
  <div class="flex justify-between items-center">
    <div class="flex items-center gap-2 text-sm text-gray-600">
      <Calendar1Icon class="w-5 h-5 text-green-600" />
      <p class="text-gray-500 font-medium">Due date:</p>
      <p>
        {{
          new Date(todo.dueDate || new Date()).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })
        }}
      </p>
    </div>

    <button
      @click="showDatePicker = !showDatePicker"
      class="text-gray-400 hover:text-gray-600 text-xl leading-none"
    >
      <span v-if="!showDatePicker">+</span>
      <span v-else>-</span>
    </button>
  </div>

  <div v-if="showDatePicker" class="mt-2 flex flex-col gap-2">
  <input
    type="datetime-local"
    v-model="dueDate"
    class="text-sm border rounded px-3 py-1"
  />
  <button
    @click="saveDueDate"
    class="text-sm text-blue-600 hover:underline self-start"
  >
    Save
  </button>
</div>
</div>

    <!-- Priority -->
    <div>
  <div class="flex justify-between items-center">
    <p class="text-sm text-gray-500 font-medium">Priority</p>
    <button
      class="text-gray-400 hover:text-gray-600 text-xl leading-none"
      @click="showPriorityDropdown = !showPriorityDropdown"
    >
      <span v-if="!showPriorityDropdown">+</span>
      <span v-else>-</span>
    </button>
  </div>

  <div class="mt-1 flex items-center gap-2">
    <Flag class="w-4 h-4 text-gray-500" />
    <span
      :class="[ 
        'text-xs px-2 py-1 rounded-full font-medium capitalize',
        priority === 'high'
          ? 'bg-red-100 text-red-700'
          : priority === 'medium'
          ? 'bg-yellow-100 text-yellow-700'
          : 'bg-green-100 text-green-700'
      ]"
    >
      {{ priority }}
    </span>
  </div>

  <div v-if="showPriorityDropdown" class="mt-2 flex gap-2 items-center">
    <select
      v-model="priority"
      class="text-sm border rounded px-3 py-1"
    >
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>
    <button
      @click="savePriority"
      class="text-sm text-blue-600 hover:underline"
    >
      Save
    </button>
  </div>
</div>

    <!-- Tags -->
    <div>
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2 text-green-500">
          <TagIcon class="w-5 h-5" />
          <span class="text-sm font-medium text-gray-700">Tags</span>
        </div>
        <button class="text-gray-400 hover:text-gray-600 text-xl leading-none">+</button>
      </div>

      <div class="flex flex-wrap gap-2 mt-2">
        <span
          v-for="tagId in todo.tagIds"
          :key="tagId"
          class="px-2 py-1 rounded text-sm font-medium"
          :class="{
            'bg-green-100 text-green-800': tagId === 1,
            'bg-purple-100 text-purple-800': tagId === 2
          }"
        >
          {{ tagId }} ✕
        </span>
      </div>
    </div>
    
  </div>
</template>
