import { Router } from 'express';
import {
  getEventsByProject,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/storyEventController';

const router = Router();

router.route('/projects/:projectId/events')
  .get(getEventsByProject)
  .post(createEvent);

router.route('/events/:eventId')
  .put(updateEvent)
  .delete(deleteEvent);

export default router;
