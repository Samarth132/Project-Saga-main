import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, Typography } from '@mui/material';
import type { StoryEvent } from '../services/storyEventService';

interface KanbanCardProps {
  event: StoryEvent;
}

const KanbanCard = ({ event }: KanbanCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: event._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: '10px',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card>
        <CardContent>
          <Typography variant="h6">{event.title}</Typography>
          <Typography variant="body2">{event.description}</Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default KanbanCard;
