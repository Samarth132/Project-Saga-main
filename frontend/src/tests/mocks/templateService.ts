import { vi } from 'vitest';

export const getTemplates = vi.fn().mockResolvedValue([
  { _id: 't1', name: 'Character', projectId: 'p1', fields: [{ name: 'Age', type: 'number' }] },
  { _id: 't2', name: 'Location', projectId: 'p1', fields: [{ name: 'Population', type: 'number' }] },
]);

export const createTemplate = vi.fn().mockImplementation((template) =>
  Promise.resolve({ ...template, _id: 'new-template' })
);

export const updateTemplate = vi.fn().mockImplementation((templateId, updates) =>
  Promise.resolve({ _id: templateId, ...updates })
);

export const deleteTemplate = vi.fn().mockResolvedValue(undefined);

export const seedTemplates = vi.fn().mockResolvedValue(undefined);
