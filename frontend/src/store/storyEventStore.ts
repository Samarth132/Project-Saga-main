import { create } from 'zustand';
import type { StoryEvent, NewStoryEvent, UpdateStoryEvent } from '../services/storyEventService';
import * as storyEventService from '../services/storyEventService';
import { KANBAN_STATUSES } from '../config/kanbanConfig';

type EventsByStatus = {
  [key: string]: StoryEvent[];
}

interface StoryEventState {
  events: StoryEvent[];
  loading: boolean;
  error: string | null;
  eventsByStatus: () => EventsByStatus;
  fetchEvents: (projectId: string) => Promise<void>;
  addEvent: (projectId: string, eventData: Omit<NewStoryEvent, 'projectId'>) => Promise<void>;
  editEvent: (eventId: string, updates: UpdateStoryEvent) => Promise<void>;
  removeEvent: (eventId: string) => Promise<void>;
  updateEventStatus: (eventId: string, newStatus: string, oldIndex: number, newIndex: number) => Promise<void>;
}

const useStoryEventStore = create<StoryEventState>((set, get) => ({
  events: [],
  loading: false,
  error: null,

  eventsByStatus: () => {
    const eventsByStatus: EventsByStatus = {};
    KANBAN_STATUSES.forEach(status => {
      eventsByStatus[status] = [];
    });
    get().events.forEach(event => {
      if (eventsByStatus[event.status]) {
        eventsByStatus[event.status].push(event);
      }
    });
    return eventsByStatus;
  },

  fetchEvents: async (projectId) => {
    set({ loading: true, error: null });
    try {
      const events = await storyEventService.getEventsByProject(projectId);
      set({ events, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch events', loading: false });
    }
  },

  addEvent: async (projectId, eventData) => {
    try {
      const newEvent = await storyEventService.createEvent(projectId, eventData);
      set((state) => ({
        events: [...state.events, newEvent],
      }));
    } catch (err) {
      set({ error: 'Failed to create event' });
    }
  },

  editEvent: async (eventId, updates) => {
    try {
      const updatedEvent = await storyEventService.updateEvent(eventId, updates);
      set((state) => ({
        events: state.events.map((e) => (e._id === eventId ? updatedEvent : e)),
      }));
    } catch (err) {
      set({ error: 'Failed to update event' });
    }
  },

  removeEvent: async (eventId) => {
    try {
      await storyEventService.deleteEvent(eventId);
      set((state) => ({
        events: state.events.filter((e) => e._id !== eventId),
      }));
    } catch (err) {
      set({ error: 'Failed to delete event' });
    }
  },

  updateEventStatus: async (eventId, newStatus, newIndex) => {
    // Optimistic UI update
    const originalEvents = get().events;
    const eventToMove = originalEvents.find(e => e._id === eventId);
    if (!eventToMove) return;

    const newEvents = originalEvents.filter(e => e._id !== eventId);
    const eventWithNewStatus = { ...eventToMove, status: newStatus };
    newEvents.splice(newIndex, 0, eventWithNewStatus);

    set({ events: newEvents });

    // API call
    try {
      await storyEventService.updateEvent(eventId, { status: newStatus });
    } catch (error) {
      // Revert on failure
      set({ events: originalEvents, error: 'Failed to update event status' });
    }
  },
}));

export default useStoryEventStore;
