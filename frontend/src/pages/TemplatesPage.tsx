import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import useTemplateStore from '../store/templateStore';
import TemplateForm from '../components/TemplateForm';
import type { Template, NewTemplate } from '../types/template';

const TemplatesPage = () => {
  const { templates, loading, error, fetchTemplates, addTemplate, editTemplate, removeTemplate } = useTemplateStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleOpenCreateForm = () => {
    setEditingTemplate(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (template: Template) => {
    setEditingTemplate(template);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTemplate(null);
  };

  const handleSubmitForm = async (templateData: NewTemplate) => {
    if (editingTemplate) {
      await editTemplate(editingTemplate._id, templateData);
    } else {
      await addTemplate(templateData);
    }
  };

  const handleDelete = async (templateId: string) => {
    if(window.confirm('Are you sure you want to delete this template? This cannot be undone.')) {
      await removeTemplate(templateId);
    }
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Manage Templates
        </Typography>
        <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleOpenCreateForm}>
          Create New Template
        </Button>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && (
          <TableContainer component={Paper} sx={{ height: '75vh', overflow: 'auto' }}>
            <Table sx={{ minWidth: 650 }} aria-label="templates table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Fields</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {templates.map((template) => (
                  <TableRow
                    key={template._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {template.name}
                    </TableCell>
                    <TableCell>{template.fields.length}</TableCell>
                    <TableCell align="right">
                      <IconButton aria-label={`edit ${template.name}`} onClick={() => handleOpenEditForm(template)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton aria-label={`delete ${template.name}`} onClick={() => handleDelete(template._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
      <TemplateForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
        template={editingTemplate}
      />
    </Container>
  );
};

export default TemplatesPage;