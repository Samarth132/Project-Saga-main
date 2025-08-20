import { create } from 'zustand';
import * as mapService from '../services/mapService';
import type { Map, Pin } from '../services/mapService';

interface MapState {
  maps: Map[];
  selectedMap: Map | null;
  pins: Pin[];
  loading: boolean;
  error: string | null;
  fetchMaps: (projectId: string) => Promise<void>;
  createMap: (projectId: string, name: string, mapImage: File) => Promise<void>;
  deleteMap: (mapId: string) => Promise<void>;
  selectMap: (map: Map | null) => void;
  fetchPins: (mapId: string) => Promise<void>;
  createPin: (mapId: string, position: { lat: number; lng: number }, entityId?: string) => Promise<void>;
  updatePin: (pinId: string, updates: Partial<Pin>) => Promise<void>;
  deletePin: (pinId: string) => Promise<void>;
}

const useMapStore = create<MapState>((set, get) => ({
  maps: [],
  selectedMap: null,
  pins: [],
  loading: false,
  error: null,

  fetchMaps: async (projectId) => {
    set({ loading: true, error: null });
    try {
      const maps = await mapService.getMapsByProject(projectId);
      set({ maps, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch maps', loading: false });
    }
  },

  createMap: async (projectId, name, mapImage) => {
    try {
      const newMap = await mapService.createMap(projectId, name, mapImage);
      set((state) => ({ maps: [...state.maps, newMap] }));
    } catch (err) {
      set({ error: 'Failed to create map' });
    }
  },

  deleteMap: async (mapId) => {
    try {
      await mapService.deleteMap(mapId);
      set((state) => ({
        maps: state.maps.filter((m) => m._id !== mapId),
        selectedMap: state.selectedMap?._id === mapId ? null : state.selectedMap,
        pins: state.selectedMap?._id === mapId ? [] : state.pins,
      }));
    } catch (err) {
      set({ error: 'Failed to delete map' });
    }
  },

  selectMap: (map) => {
    set({ selectedMap: map, pins: [] });
    if (map) {
      get().fetchPins(map._id);
    }
  },

  fetchPins: async (mapId) => {
    set({ loading: true, error: null });
    try {
      const pins = await mapService.getPinsByMap(mapId);
      set({ pins, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch pins', loading: false });
    }
  },

  createPin: async (mapId, position, entityId) => {
    try {
      const newPin = await mapService.createPin(mapId, position, entityId);
      set((state) => ({ pins: [...state.pins, newPin] }));
    } catch (err) {
      set({ error: 'Failed to create pin' });
    }
  },

  updatePin: async (pinId, updates) => {
    try {
      const updatedPin = await mapService.updatePin(pinId, updates);
      set((state) => ({
        pins: state.pins.map((p) => (p._id === pinId ? updatedPin : p)),
      }));
    } catch (err) {
      set({ error: 'Failed to update pin' });
    }
  },

  deletePin: async (pinId) => {
    try {
      await mapService.deletePin(pinId);
      set((state) => ({
        pins: state.pins.filter((p) => p._id !== pinId),
      }));
    } catch (err) {
      set({ error: 'Failed to delete pin' });
    }
  },
}));

export default useMapStore;
