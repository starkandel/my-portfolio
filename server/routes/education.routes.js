import express from 'express';
import qualificationsController from '../controllers/education.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();


router.get('/api/qualifications', qualificationsController.getEducations);
router.get('/api/qualifications/:id', protect, qualificationsController.getEducationById);
router.post('/api/qualifications', protect, qualificationsController.createEducation);
router.put('/api/qualifications/:id', protect, qualificationsController.updateEducation);
router.delete('/api/qualifications/:id', protect, qualificationsController.deleteEducationById);
router.delete('/api/qualifications', protect, qualificationsController.deleteEducation);

export default router;