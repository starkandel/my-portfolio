import express from 'express';
import usersController from '../controllers/user.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/api/login', usersController.loginUser);
router.post('/api/logout', usersController.logoutUser);
router.get('/api/users', protect, usersController.getAllUsers);
router.get('/api/users/:id', protect, usersController.getUserById);
router.post('/api/users', protect, usersController.createUser);
router.put('/api/users/:id', protect, usersController.updateUser);
router.delete('/api/users/:id', protect, usersController.deleteUser);
router.delete('/api/users', protect, usersController.deleteAllUsers);

export default router;