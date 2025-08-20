import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProjectSelectionPage from '../pages/ProjectSelectionPage';
import useProjectStore from '../store/projectStore';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { Project } from '../services/projectService';

vi.mock('../services/projectService.ts', () => ({}));

const mockProjects: Project[] = [
  { _id: 'p1', name: 'Project Alpha', createdAt: new Date().toISOString() },
];

const mockFetchProjects = vi.fn();
const mockSelectProject = vi.fn();

describe('ProjectSelectionPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useProjectStore.setState({
      projects: mockProjects,
      loading: false,
      error: null,
      fetchProjects: mockFetchProjects,
      selectProject: mockSelectProject,
    });
  });

  const renderPage = () => {
    // We need a router context for the navigate() hook
    return render(
      <MemoryRouter>
        <ProjectSelectionPage />
      </MemoryRouter>
    );
  };

  it('fetches projects on mount and displays them', () => {
    renderPage();
    expect(mockFetchProjects).toHaveBeenCalled();
    expect(screen.getByText('Project Alpha')).toBeInTheDocument();
  });

  it('calls selectProject and navigates when a project is clicked', async () => {
    renderPage();
    const projectButton = screen.getByText('Project Alpha');
    fireEvent.click(projectButton);

    await waitFor(() => {
      expect(mockSelectProject).toHaveBeenCalledWith('p1');
    });
  });
});
