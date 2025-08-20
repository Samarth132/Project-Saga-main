import { vi } from 'vitest';

export const getEntitiesByProject = vi.fn().mockResolvedValue([
  { _id: 'e1', projectId: 'p1', name: 'Character A', type: 'Character', data: {} },
  { _id: 'e2', projectId: 'p1', name: 'Location B', type: 'Location', data: {} },
]);

export const createEntity = vi.fn().mockImplementation((projectId, entity) =>
  Promise.resolve({ ...entity, _id: 'new-entity', projectId })
);

export const updateEntity = vi.fn().mockImplementation((entityId, updates) =>
  Promise.resolve({ _id: entityId, ...updates })
);

export const deleteEntity = vi.fn().mockResolvedValue(undefined);
