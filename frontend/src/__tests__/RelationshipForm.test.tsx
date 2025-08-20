import { render, screen, fireEvent } from '@testing-library/react';
import RelationshipForm from '../components/RelationshipForm';
import useEntityStore from '../store/entityStore';
import { MemoryRouter } from 'react-router-dom';
import type { Entity } from '../types/entity';
import { vi } from 'vitest';

// Mock the services that might be indirectly imported
vi.mock('../services/entityService.ts', () => ({}));
vi.mock('../services/templateService.ts', () => ({}));
vi.mock('../services/relationshipService.ts', () => ({}));

const mockEntities: Entity[] = [
  { _id: '1', name: 'Aragorn', type: 'Character', projectId: 'p1', data: {}, createdAt: '2023-01-01T00:00:00.000Z', updatedAt: '2023-01-01T00:00:00.000Z' },
  { _id: '2', name: 'Gondor', type: 'Location', projectId: 'p1', data: {}, createdAt: '2023-01-01T00:00:00.000Z', updatedAt: '2023-01-01T00:00:00.000Z' },
  { _id: '3', name: 'Anduril', type: 'Item', projectId: 'p1', data: {}, createdAt: '2023-01-01T00:00:00.000Z', updatedAt: '2023-01-01T00:00:00.000Z' },
];

describe('RelationshipForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useEntityStore.setState({
      entities: mockEntities,
    });
  });

  const mockOnSubmit = vi.fn();
  const mockOnClose = vi.fn();
  const sourceEntity = mockEntities[0]; // Aragorn

  it('submits the correct data when form is filled', async () => {
    render(
      <RelationshipForm
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        sourceEntity={sourceEntity}
        projectId="p1"
      />
    );

    // Fill out the relationship type
    fireEvent.change(screen.getByLabelText(/Relationship Type/i), { target: { value: 'King of' } });

    // Select the target entity from the Autocomplete
    const autocomplete = screen.getByLabelText('Target Entity');
    fireEvent.mouseDown(autocomplete);
    const option = await screen.findByText('Gondor');
    fireEvent.click(option);

    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'Create' });
    fireEvent.click(submitButton);

    // Check if onSubmit was called with the correct data
    expect(mockOnSubmit).toHaveBeenCalledWith({
      projectId: 'p1',
      source: '1', // Aragorn's ID
      target: '2', // Gondor's ID
      type: 'King of',
    });
  });
});
