import { vi } from 'vitest';

export const getGraphData = vi.fn().mockResolvedValue({
  nodes: [
    { id: 'e1', type: 'custom', data: { label: 'Character A' }, position: { x: 0, y: 0 } },
    { id: 'e2', type: 'custom', data: { label: 'Location B' }, position: { x: 200, y: 100 } },
  ],
  edges: [
    { id: 'r1', source: 'e1', target: 'e2', label: 'born in' },
  ],
});
