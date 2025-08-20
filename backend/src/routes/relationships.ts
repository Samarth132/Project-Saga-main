import { Router } from 'express';
import {
  getRelationshipsForEntity,
  createRelationship,
  deleteRelationship,
} from '../controllers/relationshipController';

const router = Router();

// Route to get all relationships for a specific entity
router.route('/entities/:entityId/relationships')
  .get(getRelationshipsForEntity);

// Route to create a new relationship
router.route('/relationships')
  .post(createRelationship);

// Route to delete a specific relationship
router.route('/relationships/:relationshipId')
  .delete(deleteRelationship);

export default router;
