export interface Todo {
    id: number;
    title: string;
    description: string;
    createdAt: Date;
    projectId: number;
    tagIds: number[];
    priority: string | null;
    dueDate: Date | null;
    completed: boolean;
  }

  export interface Project {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Tag {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface User {
    id: number;
    name: string;
    email: string;
    avatarUrl: string;
  }