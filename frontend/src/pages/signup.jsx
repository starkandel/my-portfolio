import React, { useState } from 'react';
import { SIGNUP_URL } from '../utils/constants'; // Import the SIGNUP_URL constant

// SignUpForm component
function SignUpForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        if (password !== confirmPassword) {
            setMessage('Passwords do not match!');
            setLoading(false);
            return;
        }

        const userData = {
            name,
            email,
            password,
        };

        try {
            const response = await fetch(SIGNUP_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage('Sign up successful! Welcome, ' + data.name || name + '!');
                console.log('API Response:', data);

                // Clear the form fields after successful submission
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            } else {
                const errorData = await response.json();
                setMessage(`Sign up failed: ${errorData.message || 'An unknown error occurred.'}`);
                console.error('API Error:', errorData);
            }
        } catch (error) {
            setMessage('Network error: Could not connect to the server. Please try again.');
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 font-sans">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Sign Up</h2>

                {/* Display messages to the user */}
                {message && (
                    <div className={`mb-4 p-3 rounded-md text-sm ${message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name Input */}
                    <div>
                        <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            aria-label="Full Name"
                        />
                    </div>

                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            aria-label="Email"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            aria-label="Password"
                        />
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            aria-label="Confirm Password"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    );
}


export default SignUpForm;