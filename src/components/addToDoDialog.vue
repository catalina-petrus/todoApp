<script setup lang="ts">
import { ref } from 'vue'
import { Calendar1Icon, Flag, TagIcon } from 'lucide-vue-next'
import { useApi } from '../services/useApi'
import type { Todo } from '../services/types'
import { useTodoStore } from '../stores/todoStore'

const store = useTodoStore()

const api = useApi()

const error = ref(null)

const title = ref('')
const description = ref('')
const priority = ref('')
const dueDate = ref('')
const tags = ref([])
const project = ref("")
const showDatePicker = ref(false)
const showPriorityDropdown = ref(false)



const newTodo = ref('')
const formError = ref('')

const addTodo = async () => {
  formError.value = ''

  if (!title.value.trim() || !description.value.trim()) {
    formError.value = 'Please fill in both title and description.'
    return
  }

  try {
    const todo: Omit<Todo, 'id'> = {
      title: title.value,
      description: description.value,
      completed: false,
      projectId: store.selectedProjectId || 1,
      tagIds: [1, 2],
      priority: priority.value ? priority.value : null, // change :only set if user selected
      dueDate: dueDate.value ? new Date(dueDate.value) : null, // change : only set if user selected
      createdAt: new Date(),
    }

    const addedTodo = await api.createTodo(todo)
    store.setTodos([...store.todos, addedTodo])

    // reset form
    title.value = ''
    description.value = ''
    dueDate.value = ''
    priority.value = '' // reset also
    tags.value = []

  } catch (err: any) {
    formError.value = err.message || 'Failed to add todo'
  }
}




</script>

<template>
  <div class="flex flex-col lg:flex-row w-full h-full bg-white rounded-lg shadow-lg overflow-hidden">
  
    <div class="flex-1 p-6">
      <input
        v-model="title"
        placeholder="Task title"
        class="text-xl font-semibold w-full mb-4 focus:outline-none"
      />

      <textarea
        v-model="description"
        placeholder="Description"
        rows="3"
        class="w-full border rounded px-3 py-2 text-sm mb-4 focus:outline-none focus:ring"
      ></textarea>
    </div>

    <div class="w-full lg:w-1/3 bg-gray-50 border-l px-6 py-6 flex flex-col gap-5">
      <div>
        <p class="text-sm text-gray-500 font-medium">{{project}}</p>
      </div>
      <div>


  <div class="flex justify-between items-center">
    <div class="flex items-center gap-2">
      <Calendar1Icon class="w-4 h-4 text-gray-500" />
      <p class="text-sm text-gray-500 font-medium">Due date</p>
    </div>
    <button
      class="text-gray-400 hover:text-gray-600 text-xl leading-none"
      @click="showDatePicker = !showDatePicker"
    >
      <span v-if="!showDatePicker"> +</span>
      <span v-else> -</span>
    </button>
  </div>

  <!-- Date & time picker-->
  <div v-if="showDatePicker" class="mt-2">
    <input
      type="datetime-local"
      v-model="dueDate"
      class="w-full text-sm border rounded px-3 py-1"
    />
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
       <span v-if="!showPriorityDropdown"> +</span>
       <span v-else> -</span>
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

    <select
      v-if="showPriorityDropdown"
      v-model="priority"
      @change="showPriorityDropdown = false"
      class="mt-2 text-sm border rounded px-3 py-1"
    >
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>
  </div>

    <!-- Tags -->
      <div>
        <div class="flex justify-between items-center">
          <p class="text-sm text-gray-500 font-medium">Tags</p>
          <button class="text-gray-400 hover:text-gray-600 text-xl leading-none">+</button>
        </div>
      </div>
            
    </div>
    <div class="px-6">
  <button
    @click="addTodo"
    class="w-full py-2 px-4 mt-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
  >
    Save Todo
  </button>
  <p v-if="formError" class="text-sm text-red-500 mb-2">{{ formError }}</p>

</div>
  </div>
</template>
