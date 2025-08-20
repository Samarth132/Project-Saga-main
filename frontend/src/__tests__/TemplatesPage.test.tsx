import { screen, waitFor } from '@testing-library/react';
import TemplatesPage from '../pages/TemplatesPage';
import { renderWithProviders } from '../tests/test-utils';
import useTemplateStore from '../store/templateStore';
import { vi } from 'vitest';
import type { Template } from '../types/template';

const mockTemplates: Template[] = [
  { _id: 't1', name: 'Character', projectId: 'p1', fields: [{ name: 'Age', type: 'number' }] },
  { _id: 't2', name: 'Location', projectId: 'p1', fields: [{ name: 'Population', type: 'number' }] },
];

describe('TemplatesPage', () => {
  it('fetches templates on mount and displays them', async () => {
    const fetchTemplatesSpy = vi.spyOn(useTemplateStore.getState(), 'fetchTemplates');

    renderWithProviders(<TemplatesPage />, {
      preloadedState: {
        project: { selectedProjectId: 'p1' },
        template: { templates: mockTemplates }
      },
    });

    expect(fetchTemplatesSpy).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByText('Character')).toBeInTheDocument();
      expect(screen.getByText('Location')).toBeInTheDocument();
    });
  });
});
