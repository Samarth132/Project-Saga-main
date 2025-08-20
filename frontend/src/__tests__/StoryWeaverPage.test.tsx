import { render, screen, fireEvent, act, within } from '@testing-library/react';
import StoryWeaverPage from '../pages/StoryWeaverPage';
import useStoryEventStore from '../store/storyEventStore';
import useProjectStore from '../store/projectStore';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { StoryEvent } from '../services/storyEventService';

vi.mock('react-vertical-timeline-component', () => ({
  VerticalTimeline: ({ children }: { children: React.ReactNode }) => <div data-testid="timeline">{children}</div>,
  VerticalTimelineElement: ({ children }: { children: React.ReactNode }) => <div data-testid="timeline-element">{children}</div>,
}));

const mockEvents: StoryEvent[] = [
    // @ts-ignore
  { _id: 'e1', projectId: 'p1', title: 'The Fellowship is Formed', status: 'To Do', description: 'Nine companions set out.', eventDate: 'TA 3018', entities: [], createdAt: '', updatedAt: '' },
  // @ts-ignore
  { _id: 'e2', projectId: 'p1', title: 'The Battle of Helm\'s Deep', status: 'In Progress', description: 'A great battle.', eventDate: 'TA 3019', entities: [], createdAt: '', updatedAt: '' },
];

describe('StoryWeaverPage', () => {
  beforeEach(() => {
    act(() => {
        useProjectStore.setState({ selectedProjectId: 'p1' });
        useStoryEventStore.setState({
            events: mockEvents,
            fetchEvents: vi.fn(),
            eventsByStatus: () => ({
                'To Do': [mockEvents[0]],
                'In Progress': [mockEvents[1]],
                'Done': [],
            })
        })
    });
  });

  const renderPage = () => {
    return render(
      <MemoryRouter>
        <StoryWeaverPage />
      </MemoryRouter>
    );
  };

  it('renders the timeline with events from the store', () => {
    renderPage();
    expect(screen.getByTestId('timeline')).toBeInTheDocument();
    expect(screen.getAllByTestId('timeline-element')).toHaveLength(2);
  });

  it('switches to Kanban view and renders columns', () => {
    renderPage();

    const kanbanTab = screen.getByRole('tab', { name: 'Kanban' });
    fireEvent.click(kanbanTab);

    expect(screen.getByText('To Do')).toBeInTheDocument();
    const todoColumn = screen.getByText('To Do').closest('div');
    expect(within(todoColumn!).getByText('The Fellowship is Formed')).toBeInTheDocument();
  });
});
