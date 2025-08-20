import axios from 'axios';
import type { Template, NewTemplate, UpdateTemplate } from '../types/template';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
});

export const getTemplates = async (): Promise<Template[]> => {
  const response = await api.get('/templates');
  return response.data;
};

export const createTemplate = async (templateData: NewTemplate): Promise<Template> => {
  const response = await api.post('/templates', templateData);
  return response.data;
};

export const updateTemplate = async (templateId: string, updates: UpdateTemplate): Promise<Template> => {
  const response = await api.put(`/templates/${templateId}`, updates);
  return response.data;
};

export const deleteTemplate = async (templateId: string): Promise<void> => {
  await api.delete(`/templates/${templateId}`);
};

export const seedTemplates = async (): Promise<void> => {
  await api.post('/templates/seed');
};
