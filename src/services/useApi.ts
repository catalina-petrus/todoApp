
import http from './api'
import type { Todo, Project } from './types';

export const useApi = () => {
    const getTodos = async (): Promise<Todo[]> => {
      const response = await http.get<Todo[]>('/todos')
      return response.data
    }

    const getProjects = async (): Promise<Project[]> => {
      const response = await http.get<Project[]>('/projects')
      return response.data
    }

    const createTodo = async (todo: Omit<Todo, 'id'>): Promise<Todo> => {
        const response = await http.post<Todo>('/todos', todo)
        return response.data
    }

    const getTodo = async (id: number): Promise<Todo> => {
        const response = await http.get<Todo>(`/todos/${id}`)
        return response.data
    }

    const updateTodo = async (id: number, data: Partial<Todo>) => {
      return await http.put(`/todos/${id}`, data).then(res => res.data)
    }

    const deleteTodo = async (id: number) => {
      try {
        console.log("delete", { id })
        await http.delete(`/todos/${id}`)
      } catch (err: any) {
        console.error(err)
      }
    }

    const getProjectData = async (id: number): Promise<Project> => {
      const response = await http.get<Project>(`/projects/${id}`)
        console.log(response.data)
        return response.data
    }

    const createProject = async (project: Omit<Project, 'id'>): Promise<Project> => {
      const response = await http.post<Project>('/projects', project)
      return response.data
    }
    //added after feedback session : get lists of todos by project id
    const getTodosByProjectId = async (projectId: number | string): Promise<Todo[]> => {
      const response = await http.get<Todo[]>(`/todos?projectId=${projectId}`)
      return response.data
    }
      
    return {
      getTodos,
      createTodo,
      deleteTodo,
      getProjects,
      getTodo,
      updateTodo,
      getProjectData,
      createProject,
      getTodosByProjectId
    }
}