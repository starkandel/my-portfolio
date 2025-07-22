import React, { useState, useEffect } from 'react';
import { CONTACTS_URL } from '../utils/constants';

const Contact = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [formStatus, setFormStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const [contacts, setContacts] = useState([]);
    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [contactToDelete, setContactToDelete] = useState(null);
    const [error, setError] = useState(null);

    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const res = await fetch(CONTACTS_URL, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const data = await res.json();
                setContacts(data);
                console.log('Contacts fetched:', data);
            } catch (err) {
                console.error('Error fetching Contacts:', err);
            }
        };
        fetchContacts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormStatus('');
        setLoading(true);

        const contactData = {
            firstname: firstName,
            lastname: lastName,
            email: emailAddress
        };

        try {
            const response = await fetch(CONTACTS_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contactData),

            });

            if (response.ok) {
                setFormStatus('Message sent successfully!');
                setFirstName('');
                setLastName('');
                setEmailAddress('');
                window.location.reload();
            } else {
                const errorData = await response.json();
                setFormStatus(`Failed to send message: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            setFormStatus(`Network error: Could not connect to the server. ${error}`);
        } finally {
            setLoading(false);

        }
    };

    const handleDelete = (contact) => {
        setContactToDelete(contact);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!contactToDelete) return;

        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');

            const response = await fetch(`${CONTACTS_URL}${contactToDelete._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete contact.');
            }

            console.log("Contact deleted successfully!");
            window.location.reload();
        } catch (e) {
            console.error("Error deleting Contact:", e);
            setError("Failed to delete Contact.");
        } finally {
            setLoading(false);
            setShowDeleteConfirm(false);
            setContactToDelete(null);
        }
    };

    return (
        <>
            <section className="pt-8 px-4 flex items-center justify-center">
                <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-xl border border-gray-200">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Contact Me</h2>

                    {formStatus && (
                        <div className={`mb-4 p-3 rounded-md text-sm ${formStatus.includes('successfully') ? 'bg-green-100 text-green-700' : formStatus.includes('Failed') || formStatus.includes('error') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                            {formStatus}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="First Name"
                                required
                                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                disabled={loading}
                                aria-label="First Name"
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                required
                                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                disabled={loading}
                                aria-label="Last Name"
                            />
                        </div>

                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={emailAddress}
                            onChange={(e) => setEmailAddress(e.target.value)}
                            disabled={loading}
                            aria-label="Email Address"
                        />

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </form>
                </div>
            </section>
            {isAdmin && (
                <section className="min-h-screen py-12 px-6 flex flex-col items-center">
                    <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow">
                        {isAdmin && (
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Responses</h3>
                            </div>
                        )}


                        <ul className="space-y-4">
                            {contacts.map((contact) => (
                                <li key={contact._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                                    <div className="flex-grow mb-2 sm:mb-0">
                                        <span className="text-lg font-medium text-gray-800 block"> Name: {contact.firstname} {contact.lastname}</span>
                                        <span className="text-sm text-gray-600 block">
                                            Email: {contact.email}
                                        </span>

                                    </div>

                                    <div className="flex space-x-2 mt-2 sm:mt-0">

                                        <button
                                            onClick={() => handleDelete(contact)}
                                            className="text-sm bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {showDeleteConfirm && (
                        <ConfirmDeleteModal
                            qualification={contactToDelete}
                            onClose={() => setShowDeleteConfirm(false)}
                            onConfirm={confirmDelete}
                        />
                    )}
                </section>
            )}
        </>
    );
};

// Confirm Delete Modal Component
const ConfirmDeleteModal = ({ contact, onClose, onConfirm }) => {
    console.log("Confirming delete for contact:", contact);
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 transform transition-all scale-100 opacity-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Confirm Deletion</h3>
                <p className="text-gray-700 mb-6">
                    Are you sure you want to delete this Contact? This action cannot be undone.
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
        </div >
    );
}

export default Contact;
