import { vi } from 'vitest';

export const getProjects = vi.fn().mockResolvedValue([
  { _id: 'p1', name: 'Test Project 1', createdAt: new Date().toISOString() },
  { _id: 'p2', name: 'Test Project 2', createdAt: new Date().toISOString() },
]);

export const createProject = vi.fn().mockImplementation((project) =>
  Promise.resolve({ ...project, _id: 'new-project', createdAt: new Date().toISOString() })
);

export const deleteProject = vi.fn().mockResolvedValue(undefined);
