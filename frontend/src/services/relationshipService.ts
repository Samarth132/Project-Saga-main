import axios from 'axios';
import type { Entity } from '../types/entity';

// Define the types for the Relationship data
export interface Relationship {
  _id: string;
  projectId: string;
  source: Entity; // Populated
  target: Entity; // Populated
  type: string;
}

export type NewRelationship = {
  projectId: string;
  source: string; // ID
  target: string; // ID
  type: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
});

export const getRelationshipsForEntity = async (entityId: string): Promise<Relationship[]> => {
  const response = await api.get(`/entities/${entityId}/relationships`);
  return response.data;
};

export const createRelationship = async (relationshipData: NewRelationship): Promise<Relationship> => {
  const response = await api.post('/relationships', relationshipData);
  return response.data;
};

export const deleteRelationship = async (relationshipId: string): Promise<void> => {
  await api.delete(`/relationships/${relationshipId}`);
};
