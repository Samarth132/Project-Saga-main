import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import useProjectStore from '../store/projectStore';
import { useNavigate } from 'react-router-dom';

const ProjectSelectionPage = () => {
  const { projects, loading, error, fetchProjects, createProject, deleteProject, selectProject } = useProjectStore();
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSelectProject = (projectId: string) => {
    selectProject(projectId);
    navigate('/world-forge'); // Navigate to a default page after selection
  };

  const handleCreateProject = async () => {
    if (newProjectName.trim()) {
      await createProject({ name: newProjectName, description: '' }); // Added description as it's required by NewProject
      setNewProjectName('');
      setIsFormOpen(false);
    }
  };

  const handleDeleteProject = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project and all its data?')) {
      await deleteProject(projectId);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Project Saga
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Select a Project or Create a New One
        </Typography>
        <Button variant="contained" size="large" sx={{ mt: 2, mb: 4 }} onClick={() => setIsFormOpen(true)}>
          Create New Project
        </Button>
        {loading && <CircularProgress />}
        {error && <Alert severity="error" sx={{ textAlign: 'left' }}>{error}</Alert>}
        {!loading && !error && (
          <Paper elevation={2}>
            <List>
              {projects.map((project) => (
                <ListItem key={project._id} disablePadding secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={(e) => handleDeleteProject(e, project._id)}>
                        <DeleteIcon />
                    </IconButton>
                }>
                  <ListItemButton onClick={() => handleSelectProject(project._id)}>
                    <ListItemText primary={project.name} secondary={new Date(project.createdAt).toLocaleDateString()} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            {projects.length === 0 && <Typography sx={{p: 2}}>No projects found. Create one to get started!</Typography>}
          </Paper>
        )}
      </Box>

      <Dialog open={isFormOpen} onClose={() => setIsFormOpen(false)}>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Project Name"
            type="text"
            fullWidth
            variant="standard"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsFormOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateProject}>Create</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProjectSelectionPage;