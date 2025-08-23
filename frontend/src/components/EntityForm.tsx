import { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import type { Entity, NewEntity } from '../types/entity';
import useTemplateStore from '../store/templateStore';

interface EntityFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (entityData: Omit<NewEntity, 'projectId'>) => void;
  entity?: Entity | null;
}

const EntityForm = ({ open, onClose, onSubmit, entity }: EntityFormProps) => {
  const { templates, fetchTemplates } = useTemplateStore();
  const [name, setName] = useState('');
  const [selectedTemplateName, setSelectedTemplateName] = useState('');
  const [data, setData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (open) {
      fetchTemplates();
    }
  }, [open, fetchTemplates]);

  useEffect(() => {
    if (entity) {
      setName(entity.name);
      setSelectedTemplateName(entity.type);
      setData(entity.data);
    } else {
      // Reset form when opening for creation
      setName('');
      setSelectedTemplateName('');
      setData({});
    }
  }, [entity, open]);

  const getSelectedTemplate = () => templates.find(t => t.name === selectedTemplateName);

  const handleDataChange = (key: string, value: any) => {
    setData(prevData => ({ ...prevData, [key]: value }));
  };

  const handleSubmit = () => {
    const entityType = getSelectedTemplate()?.name || 'Custom';
    onSubmit({ name, type: entityType, data });
    onClose();
  };

  const renderTemplateFields = () => {
    const template = getSelectedTemplate();
    if (!template || !Array.isArray(template.fields)) {
      // Fallback: show a message or a custom key-value editor for entities without a template or fields
      return <Typography>Select a template to see its fields, or fill in custom fields later.</Typography>;
    }

    return template.fields.map(field => (
      <TextField
        key={field.name}
        margin="dense"
        label={field.name}
        type={field.type === 'text' ? 'string' : field.type}
        fullWidth
        multiline={field.type === 'text'}
        rows={field.type === 'text' ? 4 : 1}
        variant="outlined"
        value={data?.[field.name] || ''}
        onChange={(e) => handleDataChange(field.name, e.target.value)}
        sx={{ mb: 2 }}
      />
    ));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{entity ? 'Edit Entity' : 'Create New Entity'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2, mt: 1 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="template-select-label">Type</InputLabel>
          <Select
            labelId="template-select-label"
            value={selectedTemplateName}
            label="Type"
            onChange={(e) => setSelectedTemplateName(e.target.value)}
            disabled={!!entity} // Disable changing type after creation
          >
            <MenuItem value=""><em>None (Custom)</em></MenuItem>
            {templates.map(t => (
              <MenuItem key={t._id} value={t.name}>{t.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Data
        </Typography>
        {renderTemplateFields()}

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {entity ? 'Save Changes' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EntityForm;