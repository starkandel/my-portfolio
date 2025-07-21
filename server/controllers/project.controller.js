import Project from '../models/project.model.js';


const createProject = async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json(project);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(project);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteAllProject = async (req, res) => {
    try {
        await Project.deleteMany({});
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export default {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
    deleteAllProject
};


