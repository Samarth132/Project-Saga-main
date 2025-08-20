import { create } from 'zustand';
import { type Node, type Edge, type OnNodesChange, type OnEdgesChange, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import * as graphService from '../services/graphService';

interface GraphState {
  nodes: Node[];
  edges: Edge[];
  loading: boolean;
  error: string | null;
  fetchGraphData: (projectId: string) => Promise<void>;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
}

const useGraphStore = create<GraphState>((set, get) => ({
  nodes: [],
  edges: [],
  loading: false,
  error: null,

  fetchGraphData: async (projectId) => {
    set({ loading: true, error: null });
    try {
      const { nodes, edges } = await graphService.getGraphData(projectId);
      set({ nodes, edges, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch graph data', loading: false });
    }
  },

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
}));

export default useGraphStore;
