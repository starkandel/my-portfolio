import React, { useEffect, useState } from 'react';
import myphoto from '../assets/myphoto.jpg';
import { QUALIFICATIONS_URL } from '../utils/constants';

const API_URL = '/api/educations';

const About = () => {
    const [qualifications, setQualifications] = useState([]);
    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [editingQualification, setEditingQualification] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [qualificationToDelete, setQualificationToDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('accessToken');
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        const fetchQualifications = async () => {
            try {
                const res = await fetch(QUALIFICATIONS_URL, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const data = await res.json();
                setQualifications(data);
            } catch (err) {
                console.error('Error fetching qualifications:', err);
            }
        };
        fetchQualifications();
    }, []);

    const handleAdd = () => {
        setEditingQualification();
        setShowAddEditModal(true);

    };


    const handleDelete = (q) => {
        setQualificationToDelete(q);
        setShowDeleteConfirm(true);
    };

    const handleEdit = (q) => {
        setEditingQualification(q);
        setShowAddEditModal(true);
    };

    const confirmDelete = async () => {
        if (!qualificationToDelete) return;

        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');

            const response = await fetch(`${QUALIFICATIONS_URL}${qualificationToDelete._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete qualification.');
            }

            console.log("Qualification deleted successfully!");
            window.location.reload();
        } catch (e) {
            console.error("Error deleting Qualification:", e);
            setError("Failed to delete Qualification.");
        } finally {
            setLoading(false);
            setShowDeleteConfirm(false);
            setQualificationToDelete(null);
        }
    };

    return (
        <section className="min-h-screen py-12 px-6 flex flex-col items-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">About Me</h2>
            <img src={myphoto} alt="My Photo" className="w-40 h-40 rounded-full mb-6 object-cover shadow-md" />
            <p className="text-center max-w-xl text-lg text-gray-700 mb-8">
                Hi, I'm <strong>Girija Prasad Kandel</strong>, a passionate web developer focused on creating engaging digital experiences.
            </p>

            <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Qualifications</h3>
                    {isAdmin && (
                        <button
                            onClick={handleAdd}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
                        >
                            + Add Qualification
                        </button>
                    )}
                </div>

                {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}

                {qualifications.length === 0 && !loading && (
                    <p className="text-center text-gray-600 text-lg">No qualifications found. {isAdmin && "Click 'Add Qualification' to add one!"}</p>
                )}

                <ul className="space-y-4">
                    {qualifications.map((q) => (
                        <li key={q._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex-grow mb-2 sm:mb-0">
                                <span className="text-lg font-medium text-gray-800 block">{q.title}</span>
                                <span className="text-sm text-gray-600 block">
                                    {q.description}
                                </span>
                                <span className="text-xs text-gray-500 block mt-1">
                                    By: {q.firstname} {q.lastname} ({q.email}) | Completed: {q.completion ? new Date(q.completion).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                            {isAdmin && (
                                <div className="flex space-x-2 mt-2 sm:mt-0">
                                    <button
                                        onClick={() => handleEdit(q)}
                                        className="text-sm bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition duration-200"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(q)}
                                        className="text-sm bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            {showAddEditModal && (
                <AddEditQualificationModal
                    qualification={editingQualification}
                    onClose={() => setShowAddEditModal(false)}
                    apiEndpoint={QUALIFICATIONS_URL}
                />
            )}

            {showDeleteConfirm && (
                <ConfirmDeleteModal
                    qualification={qualificationToDelete}
                    onClose={() => setShowDeleteConfirm(false)}
                    onConfirm={confirmDelete}
                />
            )}
        </section>
    );
};

// Add/Edit Qualification Modal Component
const AddEditQualificationModal = ({ qualification, onClose, apiEndpoint }) => {
    const [formData, setFormData] = useState({
        title: '',
        firstname: '',
        lastname: '',
        email: '',
        completion: '',
        description: '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);

    useEffect(() => {
        if (qualification) {
            // Pre-fill form for editing
            setFormData({
                title: qualification.title || '',
                firstname: qualification.firstname || '',
                lastname: qualification.lastname || '',
                email: qualification.email || '',
                completion: qualification.completion ? new Date(qualification.completion).toISOString().split('T')[0] : '',
                description: qualification.description || '',
            });
        } else {
            // Reset form for adding new
            setFormData({
                title: '',
                firstname: '',
                lastname: '',
                email: '',
                completion: '',
                description: '',
            });
        }
    }, [qualification]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveError(null);

        const qualificationData = {
            ...formData,
            completion: new Date(formData.completion),
        };

        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(
                qualification ? `${apiEndpoint}${qualification._id}` : apiEndpoint,
                {
                    method: qualification ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(qualificationData),
                }
            );

            if (!res.ok) {
                const error = await res.json();
                throw new Error(`Error: ${error.message}` || 'Failed to save qualification.');
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
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8 transform transition-all scale-100 opacity-100">
                <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                    {qualification ? 'Edit Qualification' : 'Add New Qualification'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input
                                type="text"
                                id="firstname"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input
                                type="text"
                                id="lastname"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="completion" className="block text-sm font-medium text-gray-700 mb-1">Completion Date</label>
                        <input
                            type="date"
                            id="completion"
                            name="completion"
                            value={formData.completion}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        ></textarea>
                    </div>

                    {saveError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm" role="alert">
                            {saveError}
                        </div>
                    )}

                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex justify-center py-2 px-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </span>
                            ) : (qualification ? 'Update Qualification' : 'Add Qualification')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Confirm Delete Modal Component
const ConfirmDeleteModal = ({ qualification, onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 transform transition-all scale-100 opacity-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Confirm Deletion</h3>
                <p className="text-gray-700 mb-6">
                    Are you sure you want to delete the qualification "<span className="font-semibold">{qualification?.title}</span>"? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex justify-center py-2 px-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
}

export default About;
