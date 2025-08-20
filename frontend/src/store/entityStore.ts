import { create } from 'zustand';
import type { Entity, NewEntity, UpdateEntity } from '../types/entity';
import * as entityService from '../services/entityService';

interface EntityState {
  entities: Entity[];
  loading: boolean;
  error: string | null;
  fetchEntities: (projectId: string) => Promise<void>;
  addEntity: (projectId: string, entityData: Omit<NewEntity, 'projectId'>) => Promise<void>;
  editEntity: (entityId: string, updates: UpdateEntity) => Promise<void>;
  removeEntity: (entityId: string) => Promise<void>;
}

const useEntityStore = create<EntityState>((set) => ({
  entities: [],
  loading: false,
  error: null,

  fetchEntities: async (projectId) => {
    set({ loading: true, error: null });
    try {
      const entities = await entityService.getEntitiesByProject(projectId);
      set({ entities, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch entities', loading: false });
    }
  },

  addEntity: async (projectId, entityData) => {
    set({ loading: true, error: null });
    try {
      const newEntity = await entityService.createEntity(projectId, entityData);
      set((state) => ({
        entities: [...state.entities, newEntity],
        loading: false,
      }));
    } catch (err) {
      set({ error: 'Failed to create entity', loading: false });
    }
  },

  editEntity: async (entityId, updates) => {
    set({ loading: true, error: null });
    try {
      const updatedEntity = await entityService.updateEntity(entityId, updates);
      set((state) => ({
        entities: state.entities.map((e) => (e._id === entityId ? updatedEntity : e)),
        loading: false,
      }));
    } catch (err) {
      set({ error: 'Failed to update entity', loading: false });
    }
  },

  removeEntity: async (entityId) => {
    set({ loading: true, error: null });
    try {
      await entityService.deleteEntity(entityId);
      set((state) => ({
        entities: state.entities.filter((e) => e._id !== entityId),
        loading: false,
      }));
    } catch (err) {
      set({ error: 'Failed to delete entity', loading: false });
    }
  },
}));

export default useEntityStore;
