import axios from 'axios';
import type { Node, Edge } from 'reactflow';

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
});

export const getGraphData = async (projectId: string): Promise<GraphData> => {
  const response = await api.get(`/projects/${projectId}/graph`);
  return response.data;
};
