import { create } from 'zustand';
import type { Project, NewProject } from '../types/entity';
import * as projectService from '../services/projectService';

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  selectProject: (projectId: string) => Promise<void>;
  createProject: (newProject: NewProject) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  clearSelectedProject: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  selectedProject: null,
  loading: false,
  error: null,
  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      const projects = await projectService.getProjects();
      set({ projects, loading: false });
      const savedProjectId = localStorage.getItem('selectedProjectId');
      if (savedProjectId && projects.some(p => p._id === savedProjectId)) {
        get().selectProject(savedProjectId);
      }
    } catch (err) {
      set({ error: 'Failed to fetch projects', loading: false });
    }
  },
  selectProject: async (projectId: string) => {
    set({ loading: true, error: null });
    try {
      const project = await projectService.getProjectById(projectId);
      set({ selectedProject: project, loading: false });
      localStorage.setItem('selectedProjectId', projectId);
    } catch (err) {
      set({ error: 'Failed to select project', loading: false });
    }
  },
  createProject: async (newProject: NewProject) => {
    try {
      const createdProject = await projectService.createProject(newProject);
      set(state => ({ projects: [...state.projects, createdProject] }));
    } catch (err) {
      set({ error: 'Failed to create project' });
    }
  },
  deleteProject: async (projectId: string) => {
    try {
      await projectService.deleteProject(projectId);
      set(state => ({
        projects: state.projects.filter(p => p._id !== projectId),
        selectedProject: state.selectedProject?._id === projectId ? null : state.selectedProject,
      }));
      if (localStorage.getItem('selectedProjectId') === projectId) {
        localStorage.removeItem('selectedProjectId');
      }
    } catch (err) {
      set({ error: 'Failed to delete project' });
    }
  },
  clearSelectedProject: () => {
    set({ selectedProject: null });
    localStorage.removeItem('selectedProjectId');
  }
}));

export default useProjectStore;