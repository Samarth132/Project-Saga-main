import { create } from 'zustand';
import type { Template, NewTemplate, UpdateTemplate } from '../types/template';
import * as templateService from '../services/templateService';

interface TemplateState {
  templates: Template[];
  loading: boolean;
  error: string | null;
  fetchTemplates: () => Promise<void>;
  addTemplate: (templateData: NewTemplate) => Promise<void>;
  editTemplate: (templateId: string, updates: UpdateTemplate) => Promise<void>;
  removeTemplate: (templateId: string) => Promise<void>;
  seedTemplates: () => Promise<void>;
}

const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: [],
  loading: false,
  error: null,

  fetchTemplates: async () => {
    set({ loading: true, error: null });
    try {
      const templates = await templateService.getTemplates();
      set({ templates, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch templates', loading: false });
    }
  },

  addTemplate: async (templateData) => {
    try {
      const newTemplate = await templateService.createTemplate(templateData);
      set((state) => ({
        templates: [...state.templates, newTemplate],
      }));
    } catch (err) {
      set({ error: 'Failed to create template' });
    }
  },

  editTemplate: async (templateId, updates) => {
    try {
      const updatedTemplate = await templateService.updateTemplate(templateId, updates);
      set((state) => ({
        templates: state.templates.map((t) => (t._id === templateId ? updatedTemplate : t)),
      }));
    } catch (err) {
      set({ error: 'Failed to update template' });
    }
  },

  removeTemplate: async (templateId) => {
    try {
      await templateService.deleteTemplate(templateId);
      set((state) => ({
        templates: state.templates.filter((t) => t._id !== templateId),
      }));
    } catch (err) {
      set({ error: 'Failed to delete template' });
    }
  },

  seedTemplates: async () => {
    set({ loading: true, error: null });
    try {
      await templateService.seedTemplates();
      // After seeding, refetch the templates to get the updated list
      await get().fetchTemplates();
    } catch (err) {
      set({ error: 'Failed to seed templates', loading: false });
    }
  },

}));

export default useTemplateStore;
