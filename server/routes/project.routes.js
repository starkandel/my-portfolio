import express from 'express';
import projectsController from '../controllers/project.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();


router.get('/api/projects', projectsController.getProjects);
router.get('/api/projects/:id', protect, projectsController.getProjectById);
router.post('/api/projects', protect, projectsController.createProject);
router.put('/api/projects/:id', protect, projectsController.updateProject);
router.delete('/api/projects/:id', protect, projectsController.deleteProject);
router.delete('/api/projects', protect, projectsController.deleteAllProject);

export default router;