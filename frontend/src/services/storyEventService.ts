import axios from 'axios';
import type { Entity } from '../types/entity';

// Define the types for the StoryEvent data
export interface StoryEvent {
  _id: string;
  projectId: string;
  title: string;
  description: string;
  eventDate: string;
  entities: Entity[]; // Populated
  status: string;
  createdAt: string;
  updatedAt: string;
}

export type NewStoryEvent = Omit<StoryEvent, '_id' | 'createdAt' | 'updatedAt' | 'entities'> & {
  entities: string[]; // Array of entity IDs
};
export type UpdateStoryEvent = Partial<Omit<NewStoryEvent, 'projectId'>>;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
});

export const getEventsByProject = async (projectId: string): Promise<StoryEvent[]> => {
  const response = await api.get(`/projects/${projectId}/events`);
  return response.data;
};

export const createEvent = async (projectId: string, eventData: Omit<NewStoryEvent, 'projectId'>): Promise<StoryEvent> => {
  const response = await api.post(`/projects/${projectId}/events`, eventData);
  return response.data;
};

export const updateEvent = async (eventId: string, updates: UpdateStoryEvent): Promise<StoryEvent> => {
  const response = await api.put(`/events/${eventId}`, updates);
  return response.data;
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  await api.delete(`/events/${eventId}`);
};
