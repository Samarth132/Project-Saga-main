import { vi } from 'vitest';

const mockSourceEntity = { _id: 'e1', projectId: 'p1', name: 'Character A', type: 'Character', data: {} };
const mockTargetEntity = { _id: 'e2', projectId: 'p1', name: 'Location B', type: 'Location', data: {} };

export const getRelationshipsForEntity = vi.fn().mockResolvedValue([
  {
    _id: 'r1',
    projectId: 'p1',
    source: mockSourceEntity,
    target: mockTargetEntity,
    type: 'born in',
  },
]);

export const createRelationship = vi.fn().mockImplementation((relationship) =>
  Promise.resolve({ ...relationship, _id: 'new-relationship', source: mockSourceEntity, target: mockTargetEntity })
);

export const deleteRelationship = vi.fn().mockResolvedValue(undefined);
