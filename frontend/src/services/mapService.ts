import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
});

export interface Map {
  _id: string;
  projectId: string;
  name: string;
  imageUrl: string;
}

export interface Pin {
  _id: string;
  mapId: string;
  position: {
    lat: number;
    lng: number;
  };
  entityId?: string;
}

export const createMap = async (projectId: string, name: string, mapImage: File): Promise<Map> => {
  const formData = new FormData();
  formData.append('projectId', projectId);
  formData.append('name', name);
  formData.append('mapImage', mapImage);

  const response = await api.post(`/projects/${projectId}/maps`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getMapsByProject = async (projectId: string): Promise<Map[]> => {
  const response = await api.get(`/projects/${projectId}/maps`);
  return response.data;
};

export const deleteMap = async (mapId: string): Promise<void> => {
  await api.delete(`/maps/${mapId}`);
};

export const createPin = async (mapId: string, position: { lat: number; lng: number }, entityId?: string): Promise<Pin> => {
    const response = await api.post(`/maps/${mapId}/pins`, { mapId, position, entityId });
    return response.data;
};

export const getPinsByMap = async (mapId: string): Promise<Pin[]> => {
    const response = await api.get(`/maps/${mapId}/pins`);
    return response.data;
};

export const updatePin = async (pinId: string, updates: Partial<Pin>): Promise<Pin> => {
    const response = await api.put(`/pins/${pinId}`, updates);
    return response.data;
};

export const deletePin = async (pinId: string): Promise<void> => {
    await api.delete(`/pins/${pinId}`);
};
