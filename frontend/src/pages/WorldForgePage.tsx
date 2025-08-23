import { useEffect, useState, useMemo, type SyntheticEvent } from 'react';
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
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemSecondaryAction,
  Tabs,
  Tab,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AutoLinkedText from '../components/AutoLinkedText';
import useEntityStore from '../store/entityStore';
import useRelationshipStore from '../store/relationshipStore';
import useProjectStore from '../store/projectStore';
import EntityForm from '../components/EntityForm';
import RelationshipForm from '../components/RelationshipForm';
import type { Entity, NewEntity } from '../types/entity';
import type { NewRelationship } from '../services/relationshipService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`entity-tabpanel-${index}`}
      aria-labelledby={`entity-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const WorldForgePage = () => {
  const { selectedProject } = useProjectStore();
  const { entities, loading, error, fetchEntities, addEntity, editEntity, removeEntity } = useEntityStore();
  const relStore = useRelationshipStore();

  const [isEntityFormOpen, setIsEntityFormOpen] = useState(false);
  const [isRelFormOpen, setIsRelFormOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEntities = useMemo(() => {
    if (!searchTerm.trim()) return entities;
    return entities.filter(entity =>
      entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [entities, searchTerm]);

  const groupedEntities = useMemo(() => {
    return filteredEntities.reduce((acc, entity) => {
      const { type } = entity;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(entity);
      return acc;
    }, {} as Record<string, Entity[]>);
  }, [filteredEntities]);

  const entityTypes = useMemo(() => Object.keys(groupedEntities), [groupedEntities]);

  useEffect(() => {
    if (selectedProject) {
      fetchEntities(selectedProject._id);
    }
  }, [selectedProject, fetchEntities]);

  useEffect(() => {
    if (selectedEntity) {
      relStore.fetchRelationships(selectedEntity._id);
    } else {
      relStore.clearRelationships();
    }
  }, [selectedEntity?._id, relStore.fetchRelationships, relStore.clearRelationships]);

  const handleRowClick = (entity: Entity) => {
    // Toggle selection off if clicking the same entity
    if (selectedEntity?._id === entity._id) {
      setSelectedEntity(null);
    } else {
      setSelectedEntity(entity);
    }
  };

  const handleOpenCreateForm = () => {
    setEditingEntity(null);
    setIsEntityFormOpen(true);
  };

  const handleOpenEditForm = (entity: Entity) => {
    setEditingEntity(entity);
    setIsEntityFormOpen(true);
  };

  const handleCloseEntityForm = () => setIsEntityFormOpen(false);
  const handleOpenRelForm = () => setIsRelFormOpen(true);
  const handleCloseRelForm = () => setIsRelFormOpen(false);

  const handleSubmitEntityForm = async (entityData: Omit<NewEntity, 'projectId'>) => {
    if (!selectedProject) return;
    if (editingEntity) {
      await editEntity(editingEntity._id, entityData);
    } else {
      await addEntity(selectedProject._id, entityData);
    }
  };

  const handleSubmitRelationshipForm = async (relData: NewRelationship) => {
    await relStore.addRelationship(relData);
  };

  const handleDeleteEntity = async (entityId: string) => {
    if(window.confirm('Are you sure you want to delete this entity?')) {
      await removeEntity(entityId);
      if (selectedEntity?._id === entityId) setSelectedEntity(null);
    }
  };

  const handleDeleteRelationship = async (relId: string) => {
    await relStore.removeRelationship(relId);
  };

  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    setSelectedEntity(null); // Deselect entity when changing tabs
  };

  if (!selectedProject) {
    return <Alert severity="warning">Please select a project first.</Alert>;
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          The World Forge
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleOpenCreateForm}>
            Create New Entity
          </Button>
          <input
            type="text"
            placeholder="Search entities..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #888', background: '#222', color: '#fff', minWidth: '220px' }}
          />
        </Box>
        <Grid container spacing={4}>
          <Grid
            size={{
              xs: 12,
              md: 6
            }}>
            {loading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}
            {!loading && !error && (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={currentTab} onChange={handleTabChange} aria-label="entity types tabs">
                    {entityTypes.map((type, index) => (
                      <Tab label={type} key={type} id={`entity-tab-${index}`} aria-controls={`entity-tabpanel-${index}`} />
                    ))}
                  </Tabs>
                </Box>
                {entityTypes.map((type, index) => (
                  <TabPanel value={currentTab} index={index} key={type}>
                    <TableContainer component={Paper} sx={{ height: '60vh', overflow: 'auto' }}>
                      <Table stickyHeader aria-label={`${type} table`}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell align="right">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {groupedEntities[type].map((entity) => (
                            <TableRow key={entity._id} hover onClick={() => handleRowClick(entity)} selected={selectedEntity?._id === entity._id} sx={{ cursor: 'pointer' }}>
                              <TableCell>{entity.name}</TableCell>
                              <TableCell>{entity.type}</TableCell>
                              <TableCell align="right">
                                <IconButton size="small" aria-label={`edit ${entity.name}`} onClick={(e) => { e.stopPropagation(); handleOpenEditForm(entity); }}>
                                  <EditIcon />
                                </IconButton>
                                <IconButton size="small" aria-label={`delete ${entity.name}`} onClick={(e) => { e.stopPropagation(); handleDeleteEntity(entity._id); }}>
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </TabPanel>
                ))}
              </Box>
            )}
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 6
            }}>
      <Paper sx={{ p: 2, minHeight: '70vh', maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>Details</Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          {selectedEntity ? (
            <>
              <Typography variant="subtitle1" gutterBottom><strong>{selectedEntity.name}</strong> ({selectedEntity.type})</Typography>
              {/* Show all entity fields except description */}
              {Object.entries(selectedEntity.data).map(([key, value]) => (
                key !== 'description' && (
                  <Box key={key} sx={{ mb: 1 }}>
                    <Typography variant="body2">{key.charAt(0).toUpperCase() + key.slice(1)}:
                      <Typography variant="body1" component={'span'} color='textSecondary'> {String(value)}</Typography>
                    </Typography>
                  </Box>
                )
              ))}
              {selectedEntity.data.description && (
                <Box sx={{ my: 2 }}>
                  <Typography variant="body2" color="textSecondary">Description:</Typography>
                  <Typography variant="body1" component="div">
                    <AutoLinkedText text={selectedEntity.data.description} />
                  </Typography>
                </Box>
              )}
              <Typography variant="h6" gutterBottom sx={{mt: 4}}>Relationships</Typography>
              <Divider sx={{ mb: 2 }} />
              <Button variant="outlined" size="small" sx={{ mb: 2 }} onClick={handleOpenRelForm}>Add Relationship</Button>
              {relStore.loading ? <CircularProgress size={24} /> :
               relStore.error ? <Alert severity="error" sx={{mt: 2}}>{relStore.error}</Alert> :
               <List dense>
                {relStore.relationships.map(rel => (
                  <ListItem key={rel._id} disablePadding>
                    <ListItemText
                      primary={`${rel.source.name} → ${rel.target.name}`}
                      secondary={rel.type}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete relationship" onClick={() => handleDeleteRelationship(rel._id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
                {relStore.relationships.length === 0 && <Typography variant="body2">No relationships found.</Typography>}
              </List>
              }
            </>
          ) : <Typography variant="body2">Select an entity to view its details and relationships.</Typography>}
        </Box>
      </Paper>
          </Grid>
        </Grid>
      </Box>
      <EntityForm open={isEntityFormOpen} onClose={handleCloseEntityForm} onSubmit={handleSubmitEntityForm} entity={editingEntity} />
      {selectedEntity && (
        <RelationshipForm
          open={isRelFormOpen}
          onClose={handleCloseRelForm}
          onSubmit={handleSubmitRelationshipForm}
          sourceEntity={selectedEntity}
          projectId={selectedProject?._id}
        />
      )}
    </Container>
  );
};

export default WorldForgePage;
