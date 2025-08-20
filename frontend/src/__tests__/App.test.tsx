import { screen } from '@testing-library/react';
import App from '../App';
import { renderWithProviders } from '../tests/test-utils';
import { vi } from 'vitest';

// Mock page components
vi.mock('../pages/ProjectSelectionPage', () => ({ default: () => <div>Project Selection Page</div> }));
vi.mock('../pages/WorldForgePage', () => ({ default: () => <div>World Forge Page</div> }));

describe('App Component and Routing', () => {

  it('renders the project selection page and hides main navigation when no project is selected', () => {
    renderWithProviders(<App />, {
      preloadedState: {
        project: { selectedProjectId: null }
      }
    });
    expect(screen.getByText(/Project Selection Page/i)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'World Forge' })).not.toBeInTheDocument();
  });

  it('redirects to the world forge page and shows main navigation when a project is selected', () => {
    renderWithProviders(<App />, {
      preloadedState: {
        project: { selectedProjectId: 'project-123' }
      }
    });
    expect(screen.getByText(/World Forge Page/i)).toBeInTheDocument();
    expect(screen.queryByText(/Project Selection Page/i)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'World Forge' })).toBeInTheDocument();
  });
});
