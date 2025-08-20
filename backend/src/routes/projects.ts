import { Router } from 'express';
import {
  getAllProjects,
  createProject,
  deleteProject,
  getProjectById,
} from '../controllers/projectController';

const router = Router();

router.route('/projects')
  .get(getAllProjects)
  .post(createProject);

router.route('/projects/:projectId')
    .get(getProjectById)
    .delete(deleteProject);

export default router;
