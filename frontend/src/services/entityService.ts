import axios from 'axios';
import type { Entity, NewEntity, UpdateEntity } from '../types/entity';
import useSnackbarStore from '../store/snackbarStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
});

export const getEntitiesByProject = async (projectId: string): Promise<Entity[]> => {
  const response = await api.get(`/projects/${projectId}/entities`);
  return response.data;
};

export const createEntity = async (projectId: string, entityData: Omit<NewEntity, 'projectId'>): Promise<Entity> => {
  try {
    const response = await api.post(`/projects/${projectId}/entities`, entityData);
    useSnackbarStore.getState().showSnackbar('Entity created successfully!', 'success');
    return response.data;
  } catch (error) {
    console.error('Failed to create entity:', error);
    useSnackbarStore.getState().showSnackbar('Failed to create entity.', 'error');
    throw error;
  }
};

export const updateEntity = async (entityId: string, updates: UpdateEntity): Promise<Entity> => {
  try {
    const response = await api.put(`/entities/${entityId}`, updates);
    useSnackbarStore.getState().showSnackbar('Entity updated successfully!', 'success');
    return response.data;
  } catch (error) {
    console.error('Failed to update entity:', error);
    useSnackbarStore.getState().showSnackbar('Failed to update entity.', 'error');
    throw error;
  }
};

export const deleteEntity = async (entityId: string): Promise<void> => {
  try {
    await api.delete(`/entities/${entityId}`);
    useSnackbarStore.getState().showSnackbar('Entity deleted successfully!', 'success');
  } catch (error) {
    console.error('Failed to delete entity:', error);
    useSnackbarStore.getState().showSnackbar('Failed to delete entity.', 'error');
    throw error;
  }
};

export const findEntitiesByName = async (projectId: string, names: string[]): Promise<Entity[]> => {
  const response = await api.post(`/projects/${projectId}/entities/find-by-name`, { names });
  return response.data;
};
