import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Todo, Project } from '../services/types'
import { useApi } from '../services/useApi'



export const useTodoStore = defineStore('todo', () => {
  const api = useApi()
  const todos = ref<Todo[]>([])
  const project = ref<Project | undefined>(undefined)
  const selectedProjectId = ref<number | null>(null)

  const fetchTodos = async () => {
    const fetched = await api.getTodosByProjectId(selectedProjectId.value || 0)
    setTodos(fetched)
  }

  const filteredTodos = computed(() => {
    return selectedProjectId.value
      ? todos.value.filter(todo => todo.projectId === selectedProjectId.value)
      : todos.value
  })

  function setTodos(newTodos: Todo[]) {
    todos.value = newTodos
  }

  function selectProject(id: number) {
    selectedProjectId.value = id
    console.log("selected project id:", id)
    fetchProjectData(id)
  }
   
  async function fetchProjectData(id: number) {
    const response = await api.getProjectData(id)
    project.value = response
  }

  return {
    todos,
    setTodos,
    selectedProjectId,
    selectProject,
    filteredTodos,
    fetchProjectData,
    project,
    fetchTodos
  }
})
