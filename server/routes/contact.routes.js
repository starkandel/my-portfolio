import express from 'express';
import contactsController from '../controllers/contact.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/api/contacts', contactsController.getContacts);
router.get('/api/contacts/:id', protect, contactsController.getContactById);
router.post('/api/contacts/', contactsController.createContact);
router.put('/api/contacts/:id', protect, contactsController.updateContact);
router.delete('/api/contacts/:id', protect, contactsController.deleteContact);
router.delete('/api/contacts', protect, contactsController.deleteAllContacts);

export default router;