import { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Autocomplete,
} from '@mui/material';
import useEntityStore from '../store/entityStore';
import type { Entity } from '../types/entity';
import type { StoryEvent, NewStoryEvent } from '../services/storyEventService';

interface StoryEventFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (eventData: Omit<NewStoryEvent, 'projectId'>) => void;
  event?: StoryEvent | null;
}

const StoryEventForm = ({ open, onClose, onSubmit, event }: StoryEventFormProps) => {
  const { entities } = useEntityStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [involvedEntities, setInvolvedEntities] = useState<Entity[]>([]);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setEventDate(event.eventDate);
      setInvolvedEntities(event.entities);
    } else {
      setTitle('');
      setDescription('');
      setEventDate('');
      setInvolvedEntities([]);
    }
  }, [event, open]);

  const handleSubmit = () => {
    onSubmit({
      title,
      description,
      eventDate,
      entities: involvedEntities.map(e => e._id),
      status: 'To Do', // Default status for new events
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{event ? 'Edit Event' : 'Create New Event'}</DialogTitle>
      <DialogContent>
        <TextField autoFocus margin="dense" label="Title" type="text" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mt:1, mb: 2 }} />
        <TextField margin="dense" label="Date / Timestamp" type="text" fullWidth value={eventDate} onChange={(e) => setEventDate(e.target.value)} sx={{ mb: 2 }} />
        <TextField margin="dense" label="Description" type="text" fullWidth multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} sx={{ mb: 2 }} />
        <Autocomplete
            multiple
            options={entities}
            getOptionLabel={(option) => option.name}
            value={involvedEntities}
            onChange={(_, newValue) => {
                setInvolvedEntities(newValue);
            }}
            renderInput={(params) => (
                <TextField
                {...params}
                variant="outlined"
                label="Involved Entities"
                />
            )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {event ? 'Save Changes' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StoryEventForm;
