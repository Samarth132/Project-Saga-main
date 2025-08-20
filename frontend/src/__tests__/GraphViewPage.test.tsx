import { screen, waitFor } from '@testing-library/react';
import GraphViewPage from '../pages/GraphViewPage';
import { renderWithProviders } from '../tests/test-utils';
import useGraphStore from '../store/graphStore';
import { vi } from 'vitest';

vi.mock('reactflow', () => ({
  default: ({ nodes, edges }: any) => (
    <div data-testid="react-flow-mock">
      <div data-testid="nodes">{JSON.stringify(nodes)}</div>
      <div data-testid="edges">{JSON.stringify(edges)}</div>
    </div>
  ),
  Controls: () => null,
  Background: () => null,
  MiniMap: () => null,
}));

describe('GraphViewPage', () => {
  it('fetches graph data on mount and displays it', async () => {
    const fetchGraphDataSpy = vi.spyOn(useGraphStore.getState(), 'fetchGraphData');

    renderWithProviders(<GraphViewPage />, {
      preloadedState: {
        project: { selectedProjectId: 'p1' },
      },
    });

    expect(fetchGraphDataSpy).toHaveBeenCalledWith('p1');

    await waitFor(() => {
      const nodes = screen.getByTestId('nodes');
      const edges = screen.getByTestId('edges');

      // Check if the mock data is rendered
      expect(nodes.textContent).toContain('Character A');
      expect(nodes.textContent).toContain('Location B');
      expect(edges.textContent).toContain('born in');
    });
  });
});
