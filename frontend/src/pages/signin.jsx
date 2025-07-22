import React, { useState } from 'react';
import { SIGNIN_URL } from '../utils/constants';
import { useNavigate } from 'react-router-dom';




function SignInForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(SIGNIN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Login successful');
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('user', JSON.stringify(data.user));
                setEmail('');
                setPassword('');
                navigate('/');
                window.location.reload();
            } else {
                setMessage(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setMessage('Network error, please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 font-sans">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Sign In</h2>

                {/* Display messages to the user */}
                {message && (
                    <div className={`mb-4 p-3 rounded-md text-sm ${message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
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

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out font-semibold text-lg"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SignInForm;