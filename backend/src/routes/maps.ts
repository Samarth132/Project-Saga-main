import { Router } from 'express';
import * as mapController from '../controllers/mapController';

const router = Router();

// Map routes
router.post('/projects/:projectId/maps', mapController.createMap);
router.get('/projects/:projectId/maps', mapController.getMapsByProject);
router.delete('/maps/:mapId', mapController.deleteMap);

// Pin routes
router.post('/maps/:mapId/pins', mapController.createPin);
router.get('/maps/:mapId/pins', mapController.getPinsByMap);
router.put('/pins/:pinId', mapController.updatePin);
router.delete('/pins/:pinId', mapController.deletePin);

export default router;
