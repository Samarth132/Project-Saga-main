import { Router } from 'express';
import {
  getAllTemplates,
  createTemplate,
  getTemplate,
  updateTemplate,
  deleteTemplate,
  seedDefaultTemplates,
} from '../controllers/templateController';

const router = Router();

router.route('/templates')
  .get(getAllTemplates)
  .post(createTemplate);

router.route('/templates/seed')
  .post(seedDefaultTemplates);

router.route('/templates/:templateId')
  .get(getTemplate)
  .put(updateTemplate)
  .delete(deleteTemplate);

export default router;
