import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import WorldForgePage from '../pages/WorldForgePage';
import { renderWithProviders } from '../tests/test-utils';
import useEntityStore from '../store/entityStore';
import useRelationshipStore from '../store/relationshipStore';
import type { Entity } from '../types/entity';
import type { Relationship } from '../services/relationshipService';

vi.mock('../components/EntityForm', () => ({ default: () => <div data-testid="entity-form" /> }));
vi.mock('../components/RelationshipForm', () => ({ default: () => <div data-testid="relationship-form" /> }));

const mockEntities: Entity[] = [
  { _id: 'e1', name: 'Character A', type: 'Character', projectId: 'p1', data: {}, createdAt: '2023-01-01T00:00:00.000Z', updatedAt: '2023-01-01T00:00:00.000Z' },
  { _id: 'e2', name: 'Location B', type: 'Location', projectId: 'p1', data: {}, createdAt: '2023-01-01T00:00:00.000Z', updatedAt: '2023-01-01T00:00:00.000Z' },
];

const mockRelationships: Relationship[] = [
  // @ts-ignore
  { _id: 'r1', projectId: 'p1', source: mockEntities[0], target: mockEntities[1], type: 'born in' }
];

const entityInitialState = useEntityStore.getState();

describe('WorldForgePage', () => {
  afterEach(() => {
    useEntityStore.setState(entityInitialState, true);
    vi.clearAllMocks();
  });

  it('fetches, displays, and groups entities in tabs', async () => {
    const fetchEntitiesSpy = vi.spyOn(useEntityStore.getState(), 'fetchEntities');
    const fetchRelationshipsSpy = vi.spyOn(useRelationshipStore.getState(), 'fetchRelationships');

    await act(async () => {
      renderWithProviders(<WorldForgePage />, {
        preloadedState: {
          project: { selectedProjectId: 'p1' },
          entity: { entities: mockEntities },
          relationship: { relationships: mockRelationships }
        }
      });
    });

    // 1. Check that entities are fetched and tabs are rendered
    await waitFor(() => {
      expect(fetchEntitiesSpy).toHaveBeenCalledWith('p1');
      expect(screen.getByRole('tab', { name: 'Character' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Location' })).toBeInTheDocument();
    });

    // 2. Check initial tab content
    expect(screen.getByText('Character A')).toBeInTheDocument();
    expect(screen.queryByText('Location B')).not.toBeInTheDocument();

    // 3. Switch tabs and check content
    await act(async () => {
      fireEvent.click(screen.getByRole('tab', { name: 'Location' }));
    });
    await waitFor(() => {
      expect(screen.getByText('Location B')).toBeInTheDocument();
    });
    expect(screen.queryByText('Character A')).not.toBeInTheDocument();

    // 4. Switch back and check relationship fetching
    await act(async () => {
      fireEvent.click(screen.getByRole('tab', { name: 'Character' }));
    });
    await waitFor(() => {
        expect(screen.getByText('Character A')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Character A'));
    });
    expect(fetchRelationshipsSpy).toHaveBeenCalledWith('e1');
    await waitFor(() => {
      expect(screen.getByText('Character A → Location B')).toBeInTheDocument();
      expect(screen.getByText('born in')).toBeInTheDocument();
    });
  });
});
