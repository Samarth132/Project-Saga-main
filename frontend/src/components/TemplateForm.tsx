import { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Template, NewTemplate, TemplateField } from '../types/template';

interface FieldRow extends TemplateField {
  id: number;
}

interface TemplateFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (templateData: NewTemplate) => void;
  template?: Template | null;
}

const fieldTypes: TemplateField['type'][] = ['text', 'textarea', 'number', 'date'];

const TemplateForm = ({ open, onClose, onSubmit, template }: TemplateFormProps) => {
  const [name, setName] = useState('');
  const [fields, setFields] = useState<FieldRow[]>([{ id: Date.now(), name: '', type: 'text' }]);

  useEffect(() => {
    if (template) {
      setName(template.name);
      const initialFields = template.fields.map((f, i) => ({ ...f, id: Date.now() + i }));
      setFields(initialFields.length > 0 ? initialFields : [{ id: Date.now(), name: '', type: 'text' }]);
    } else {
      setName('');
      setFields([{ id: Date.now(), name: '', type: 'text' }]);
    }
  }, [template, open]);

  const handleFieldChange = (id: number, field: keyof TemplateField, value: string) => {
    setFields(
      fields.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleAddField = () => {
    setFields([...fields, { id: Date.now(), name: '', type: 'text' }]);
  };

  const handleRemoveField = (id: number) => {
    setFields(fields.filter((item) => item.id !== id));
  };

  const handleSubmit = () => {
    const templateData: NewTemplate = {
      name,
      fields: fields.map(({ name, type, defaultValue }) => ({ name, type, defaultValue })),
    };
    onSubmit(templateData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{template ? 'Edit Template' : 'Create New Template'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Template Name"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2, mt: 1 }}
        />
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Fields
        </Typography>
        {fields.map((field) => (
          <Box key={field.id} sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
            <TextField
              label="Field Name"
              value={field.name}
              onChange={(e) => handleFieldChange(field.id, 'name', e.target.value)}
              variant="outlined"
              sx={{ flex: 2 }}
            />
            <FormControl sx={{ flex: 1 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={field.type}
                label="Type"
                onChange={(e) => handleFieldChange(field.id, 'type', e.target.value)}
              >
                {fieldTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Default Value"
              value={field.defaultValue || ''}
              onChange={(e) => handleFieldChange(field.id, 'defaultValue', e.target.value)}
              variant="outlined"
              sx={{ flex: 2 }}
            />
            <IconButton onClick={() => handleRemoveField(field.id)} disabled={fields.length === 1}>
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        <Button startIcon={<AddIcon />} onClick={handleAddField} sx={{ mt: 1 }}>
          Add Field
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {template ? 'Save Changes' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TemplateForm;