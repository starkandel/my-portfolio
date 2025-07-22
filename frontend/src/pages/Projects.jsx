import React, { use, useEffect, useState } from 'react';
import pro1 from '../assets/pro1.png';
import pro2 from '../assets/pro2.png';
import pro3 from '../assets/pro3.png';
import { PROJECTS_URL } from '../utils/constants';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [currentProject, setCurrentProject] = useState(null); // For editing
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch(PROJECTS_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },

            });
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProject = () => {
        setCurrentProject(null); // Clear any existing project data
        setShowAddEditModal(true);
    };

    const handleEditProject = (project) => {
        setCurrentProject(project);
        setShowAddEditModal(true);
    };

    const handleDeleteProject = (project) => {
        setProjectToDelete(project);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!projectToDelete) return;

        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');

            const response = await fetch(`${PROJECTS_URL}${projectToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete project.');
            }

            console.log("Project deleted successfully!");
            window.location.reload();
        } catch (e) {
            console.error("Error deleting project:", e);
            setError("Failed to delete project.");
        } finally {
            setLoading(false);
            setShowDeleteConfirm(false);
            setProjectToDelete(null);
        }
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className="ml-4 text-lg text-gray-600">Loading projects...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        );
    }


    return (
        <section className="min-h-screen py-10 px-4">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">Projects</h2>
                {(user && user.role == 'admin') && (
                    <div className="flex justify-end mb-6">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            onClick={handleAddProject}>
                            + Add Project
                        </button>
                    </div>
                )}

                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {projects.map((proj) => (
                            <div key={proj._id} className="bg-white p-6 rounded shadow border border-gray-200">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{proj.title}</h3>
                                <p className="text-sm text-gray-600 mb-1"><strong>By:</strong> {proj.firstname} {proj.lastname}</p>
                                <p className="text-sm text-gray-600 mb-1"><strong>Email:</strong> {proj.email}</p>
                                <p className="text-sm text-gray-600 mb-2"><strong>Completed:</strong> {new Date(proj.completion).toLocaleDateString()}</p>
                                <p className="text-gray-700 mb-4">{proj.description}</p>
                                {user && user.role === 'admin' && (
                                    <div className="flex space-x-2">
                                        <button className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500" onClick={() => handleEditProject(proj)}>Edit</button>
                                        <button onClick={() => handleDeleteProject(proj._id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {showAddEditModal && (
                            <AddEditProjectModal
                                project={currentProject}
                                onClose={() => setShowAddEditModal(false)}
                                apiEndpoint={PROJECTS_URL}
                            />
                        )}

                        {showDeleteConfirm && (
                            <ConfirmDeleteModal
                                project={projectToDelete}
                                onClose={() => setShowDeleteConfirm(false)}
                                onConfirm={confirmDelete}
                            />
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

// Add/Edit Project Modal Component
const AddEditProjectModal = ({ project, onClose, apiEndpoint }) => {
    const [formData, setFormData] = useState({
        title: '',
        firstname: '',
        lastname: '',
        email: '',
        completion: '',
        description: '',
        imageUrl: '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);

    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title || '',
                firstname: project.firstname || '',
                lastname: project.lastname || '',
                email: project.email || '',
                completion: project.completion
                    ? new Date(project.completion).toISOString().split('T')[0]
                    : '',
                description: project.description || '',
                imageUrl: project.imageUrl || '',
            });
        }
    }, [project]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveError(null);

        const projectData = {
            ...formData,
            completion: new Date(formData.completion),
        };

        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(
                project ? `${apiEndpoint}${project._id}` : apiEndpoint,
                {
                    method: project ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(projectData),
                }
            );

            if (!res.ok) {
                const error = await res.json();
                throw new Error(`Error: ${error.message}` || 'Failed to save project.');
            }
            onClose(); // Close the modal
            window.location.reload();

        } catch (err) {
            setSaveError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    {project ? 'Edit Project' : 'Add New Project'}
                </h2>

                {saveError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 mb-4 rounded">
                        {saveError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="title" value={formData.title} onChange={handleChange} required placeholder="Project Title" className="w-full border px-3 py-2 rounded" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="firstname" value={formData.firstname} onChange={handleChange} required placeholder="First Name" className="w-full border px-3 py-2 rounded" />
                        <input name="lastname" value={formData.lastname} onChange={handleChange} required placeholder="Last Name" className="w-full border px-3 py-2 rounded" />
                    </div>
                    <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="Email" className="w-full border px-3 py-2 rounded" />
                    <input name="completion" type="date" value={formData.completion} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
                    <input name="imageUrl" type="url" value={formData.imageUrl} onChange={handleChange} placeholder="Image URL (optional)" className="w-full border px-3 py-2 rounded" />
                    <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="Description" rows="4" className="w-full border px-3 py-2 rounded"></textarea>

                    <div className="flex justify-end gap-4 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100">Cancel</button>
                        <button type="submit" disabled={isSaving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                            {isSaving ? 'Saving...' : project ? 'Update Project' : 'Add Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Confirm Delete Modal Component
const ConfirmDeleteModal = ({ project, onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 transform transition-all scale-100 opacity-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Confirm Deletion</h3>
                <p className="text-gray-700 mb-6">
                    Are you sure you want to delete the project "<span className="font-semibold">{project?.title}</span>"? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex justify-center py-2 px-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="inline-flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Projects;
