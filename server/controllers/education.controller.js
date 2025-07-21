import Education from '../models/qualification.model.js';


const createEducation = async (req, res) => {
    try {
        const education = await Education.create(req.body);
        res.status(201).json(education);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getEducations = async (req, res) => {
    try {
        const educations = await Education.find();
        res.json(educations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getEducationById = async (req, res) => {
    try {
        const education = await Education.findById(req.params.id);
        if (!education) return res.status(404).json({ message: 'Education not found' });
        res.json(education);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateEducation = async (req, res) => {
    try {
        const education = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(education);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteEducationById = async (req, res) => {
    try {
        await Education.findByIdAndDelete(req.params.id);
        res.json({ message: 'Education deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteEducation = async (req, res) => {
    try {
        await Education.deleteMany({});
        res.json({ message: 'Education deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export default {
    createEducation,
    getEducations,
    getEducationById,
    updateEducation,
    deleteEducationById,
    deleteEducation
};
