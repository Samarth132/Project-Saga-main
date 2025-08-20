import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Grid,
} from '@mui/material';
import { Chrono } from 'react-chrono';
import useStoryEventStore from '../store/storyEventStore';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { KANBAN_STATUSES } from '../config/kanbanConfig';
import KanbanColumn from '../components/KanbanColumn';
import StoryEventForm from '../components/StoryEventForm';
import type { NewStoryEvent } from '../services/storyEventService';

import useProjectStore from '../store/projectStore';

const StoryWeaverPage = () => {
  const { selectedProject } = useProjectStore();
  const { events, loading, error, fetchEvents, eventsByStatus, updateEventStatus, addEvent, editEvent } = useStoryEventStore();
  const [view, setView] = useState('timeline');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null); // Using any for now

  useEffect(() => {
    if (selectedProject) {
      fetchEvents(selectedProject._id);
    }
  }, [selectedProject, fetchEvents]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      // The logic here would be more complex to get the old and new indices
      // For now, we'll just update the status
      updateEventStatus(active.id as string, over.id as string, 0, 0);
    }
  };

  const handleOpenCreateForm = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingEvent(null);
  };

  const handleSubmitForm = async (eventData: Omit<NewStoryEvent, 'projectId'>) => {
    if (!selectedProject) return;
    if (editingEvent) {
      await editEvent(editingEvent._id, eventData);
    } else {
      await addEvent(selectedProject._id, eventData);
    }
  };

  const renderView = () => {
    if (view === 'timeline') {
      const timelineItems = events.map(event => ({
        title: event.eventDate,
        cardTitle: event.title,
        cardDetailedText: event.description,
      }));

      return (
        <Chrono
          items={timelineItems}
          mode="VERTICAL"
          // You can add other props for customization like theme, slideShow, etc.
          // Explore Chrono's props for styling and layout
        />
      );
    }
    if (view === 'kanban') {
      const groupedEvents = eventsByStatus();
      return (
        <DndContext onDragEnd={handleDragEnd}>
          <Grid container spacing={2}>
            {KANBAN_STATUSES.map(status => (
              <Grid key={status} size={4}>
                <KanbanColumn id={status} title={status} events={groupedEvents[status] || []} />
              </Grid>
            ))}
          </Grid>
        </DndContext>
      );
    }
    return null;
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          The Story Weaver
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={view} onChange={(_, newValue) => setView(newValue)}>
            <Tab label="Timeline" value="timeline" />
            <Tab label="Kanban" value="kanban" />
          </Tabs>
        </Box>
        <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleOpenCreateForm}>
          Add New Event
        </Button>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && renderView()}
      </Box>
      <StoryEventForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
        event={editingEvent}
      />
    </Container>
  );
};

export default StoryWeaverPage;
