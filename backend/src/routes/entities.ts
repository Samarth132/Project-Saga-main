import { Router } from 'express';
import {
  getEntitiesByProject,
  createEntity,
  getEntity,
  updateEntity,
  deleteEntity,
  getGraphData,
  findEntitiesByName,
} from '../controllers/entityController';

const router = Router();

// Route for graph data
router.route('/projects/:projectId/graph')
  .get(getGraphData);

// Route for finding entities by name (for backlinking)
router.route('/projects/:projectId/entities/find-by-name')
    .post(findEntitiesByName);

// Routes for entities within a project
router.route('/projects/:projectId/entities')
  .get(getEntitiesByProject)
  .post(createEntity);

// Routes for a single entity
router.route('/entities/:entityId')
  .get(getEntity)
  .put(updateEntity)
  .delete(deleteEntity);

export default router;
