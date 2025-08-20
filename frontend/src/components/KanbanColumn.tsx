import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box, Paper, Typography } from '@mui/material';
import type { StoryEvent } from '../services/storyEventService';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
  id: string;
  title: string;
  events: StoryEvent[];
}

const KanbanColumn = ({ id, title, events }: KanbanColumnProps) => {
  return (
    <Box sx={{ p: 1, height: '100%' }}>
      <Paper sx={{ p: 2, backgroundColor: '#f4f5f7', height: '100%' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
        <SortableContext id={id} items={events.map(e => e._id)} strategy={verticalListSortingStrategy}>
          {events.map(event => (
            <KanbanCard key={event._id} event={event} />
          ))}
        </SortableContext>
      </Paper>
    </Box>
  );
};

export default KanbanColumn;
