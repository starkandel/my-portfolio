import Contact from '../models/contact.model.js';


// Create contact
const createContact = async (req, res) => {
    try {
        const contact = await Contact.create(req.body);
        res.status(201).json(contact);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all contacts
const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single contact
const getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) return res.status(404).json({ message: 'Contact not found' });
        res.json(contact);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update contact
const updateContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(contact);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete contact
const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) return res.status(404).json({ message: 'Contact not found' });
        res.json({ message: 'Contact deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//Delete all contacts
const deleteAllContacts = async (req, res) => {
    try {
        await Contact.deleteMany({});
        res.json({ message: 'All contacts deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export default { createContact, getContacts, getContactById, updateContact, deleteContact, deleteAllContacts };
