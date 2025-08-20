import { vi } from 'vitest';

const mockEntity = { _id: 'e1', projectId: 'p1', name: 'Character A', type: 'Character', data: {} };

export const getEventsByProject = vi.fn().mockResolvedValue([
  {
    _id: 'ev1',
    projectId: 'p1',
    title: 'The Prophecy',
    description: 'A prophecy is foretold.',
    eventDate: '1000-01-01',
    entities: [mockEntity],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]);

export const createEvent = vi.fn().mockImplementation((projectId, event) =>
  Promise.resolve({ ...event, _id: 'new-event', projectId, entities: [mockEntity] })
);

export const updateEvent = vi.fn().mockImplementation((eventId, updates) =>
  Promise.resolve({ _id: eventId, ...updates, entities: [mockEntity] })
);

export const deleteEvent = vi.fn().mockResolvedValue(undefined);
