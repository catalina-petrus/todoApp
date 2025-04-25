<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useApi } from '../services/useApi'
import { Trash2, Check, Circle, Edit2Icon } from 'lucide-vue-next'
import type { Todo } from '../services/types'
import AddTodoDialog from './addToDoDialog.vue' 

import { useTodoStore } from '../stores/todoStore'

const store = useTodoStore()

const api = useApi()


const loading = ref(false)
const error = ref(null)
const greeting = ref('')
const showDialog = ref(false)

const emit = defineEmits<{
  (e: 'select-todo', id: number): void
}>()

///this emits the todo id to the parent component
const handleTodoClick = (id: number) => {
  emit('select-todo', id)
}

///sets the greeting according to the moment of the day
const setGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) {
    greeting.value = 'Good Morning.'
  } else if (hour < 18) {
    greeting.value = 'Good Afternoon.'
  } else {
    greeting.value = 'Good Evening.'
  }
}

onMounted(() => {
  setGreeting()
})

onMounted(async () => {
  const fetched = await api.getTodos()
  store.setTodos(fetched)
  console.log(store.todos)
})

///deletes the todo
const deleteTodoItem = async (id: number) => {
  try {
    await api.deleteTodo(id) 
    store.setTodos(store.todos.filter(todo => todo.id !== id))
  } catch (err: any) {
    error.value = err.message || 'Failed to delete todo'
  }
}

///toggles the completion of the todo
const toggleComplete = async (todo: Todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed }

    try {
    await api.updateTodo(updatedTodo.id, updatedTodo) 
    store.setTodos(store.todos.map(t => t.id === updatedTodo.id ? updatedTodo : t))
    } catch (err: any) {
    error.value = err.message || 'Failed to update todo'
  }
}

const searchQuery = ref('')


const searchedTodos = computed(() =>
  store.filteredTodos.filter(todo =>
    todo.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    todo.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)


</script>

<template>
  <main>
    <div class="flex items-start gap-4 bg-black text-white px-6 py-4 rounded-lg">
    <div class="text-center leading-tight">
      <div class="text-sm text-gray-400">{{new Date().toLocaleString('default', { month: 'short' })}}</div>
      <div class="text-2xl font-semibold">{{ new Date().getDate() }}</div>
    </div>

    <div>
      <h1 class="text-2xl font-bold">{{ greeting }}</h1>
      <p class="text-gray-400 text-base font-medium">What's your plan for today?</p>
    </div>
  </div>

    <div class="max-w-3xl mx-auto my-6 p-6 bg-white shadow-lg rounded-xl">
      <h2 class="text-xl font-semibold mb-4">Project tasks</h2>

      <div class="mb-4">
        <input
            v-model="searchQuery"
            placeholder="Search tasks..."
            class="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>
      <!-- todo list-->
      <ul class="space-y-4">
        <li v-for="todo in searchedTodos" :key="todo.id"
          class="flex items-center justify-between border-b pb-4 last:border-b-0"
        >
          <div class="flex items-center gap-3">
            <div @click="toggleComplete(todo)" class="cursor-pointer">
                <component
                    :is="todo.completed ? Check : Circle"
                    :class="todo.completed ? 'text-green-500' : 'text-gray-300'"
                    class="w-5 h-5"
                />
            </div>
            <span :class="['text-sm', todo.completed ? 'text-gray-400 line-through' : 'text-gray-700']">
              {{ todo.title }}
            </span>
          </div>

          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-500">
  {{ todo?.dueDate ? new Date(todo.dueDate).toLocaleDateString('en-GB') : 'No due date' }}
</span>

            <span
                :class="[
                    'text-xs px-2 py-1 rounded-full font-medium capitalize',
                    todo.priority === 'high'
                    ? 'bg-red-100 text-red-700'
                    : todo.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-700'
                    : todo.priority === 'low'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                ]"
                >
                {{ todo.priority ? todo.priority : 'No priority' }}
                </span>
            <Edit2Icon class="w-5 h-5 text-gray-300 cursor-pointer hover:text-gray-700" @click="handleTodoClick(todo.id)" />
            <Trash2
              class="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700"
              @click="deleteTodoItem(todo.id)"
            />
          </div>
        </li>
      </ul>
      <!-- Message when no tasks found -->
      <p v-if="store.todos.length === 0" class="text-sm text-gray-500 text-center mt-4">
        No tasks found.
      </p>

      <p v-if="loading" class="mt-4 text-black-500">Loading todos...</p>
      <p v-if="error" class="mt-4 text-red-500">{{ error }}</p>

        <!-- Add new todo -->
        <div class="mt-6">
        <button
            @click="showDialog = true"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        >
            + Add new todo
        </button>
        </div>

        <!-- Add new todo dialog -->
        <AddTodoDialog v-if="showDialog" @close="showDialog = false" />
    </div>
  </main>
</template>
