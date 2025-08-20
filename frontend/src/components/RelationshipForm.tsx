import { useState } from 'react';
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
import type { NewRelationship } from '../services/relationshipService';

interface RelationshipFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (relationshipData: NewRelationship) => void;
  sourceEntity: Entity;
  projectId: string;
}

const RelationshipForm = ({ open, onClose, onSubmit, sourceEntity, projectId }: RelationshipFormProps) => {
  const { entities } = useEntityStore();
  const [target, setTarget] = useState<Entity | null>(null);
  const [type, setType] = useState('');

  const handleSubmit = () => {
    if (!target || !type) {
      // Add user-facing error handling in a real app
      console.error('Target and type are required');
      return;
    }

    onSubmit({
      projectId,
      source: sourceEntity._id,
      target: target._id,
      type,
    });
    onClose();
    setTarget(null);
    setType('');
  };

  // Exclude the source entity itself from the list of potential targets
  const targetOptions = entities.filter(e => e._id !== sourceEntity._id);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New Relationship</DialogTitle>
      <DialogContent>
        <TextField
          disabled
          margin="dense"
          label="Source Entity"
          fullWidth
          variant="outlined"
          value={sourceEntity.name}
          sx={{ mb: 2, mt: 1 }}
        />
        <Autocomplete
          options={targetOptions}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          value={target}
          onChange={(_, newValue) => {
            setTarget(newValue);
          }}
          renderInput={(params) => <TextField {...params} label="Target Entity" variant="outlined" />}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Relationship Type (e.g., 'ally of', 'located in')"
          type="text"
          fullWidth
          variant="outlined"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RelationshipForm;
