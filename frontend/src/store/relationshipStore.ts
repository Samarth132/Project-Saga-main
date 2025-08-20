import { create } from 'zustand';
import type { Relationship, NewRelationship } from '../services/relationshipService';
import * as relationshipService from '../services/relationshipService';

interface RelationshipState {
  relationships: Relationship[];
  loading: boolean;
  error: string | null;
  fetchRelationships: (entityId: string) => Promise<void>;
  addRelationship: (relationshipData: NewRelationship) => Promise<void>;
  removeRelationship: (relationshipId: string) => Promise<void>;
  clearRelationships: () => void;
}

const useRelationshipStore = create<RelationshipState>((set) => ({
  relationships: [],
  loading: false,
  error: null,

  fetchRelationships: async (entityId) => {
    set({ loading: true, error: null });
    try {
      const relationships = await relationshipService.getRelationshipsForEntity(entityId);
      set({ relationships, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch relationships', loading: false });
    }
  },

  addRelationship: async (relationshipData) => {
    try {
      const newRelationship = await relationshipService.createRelationship(relationshipData);
      set((state) => ({
        relationships: [...state.relationships, newRelationship],
      }));
    } catch (err) {
      set({ error: 'Failed to create relationship' });
    }
  },

  removeRelationship: async (relationshipId) => {
    try {
      await relationshipService.deleteRelationship(relationshipId);
      set((state) => ({
        relationships: state.relationships.filter((r) => r._id !== relationshipId),
      }));
    } catch (err) {
      set({ error: 'Failed to delete relationship' });
    }
  },

  clearRelationships: () => {
    set({ relationships: [] });
  }
}));

export default useRelationshipStore;
