"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // Assuming your supabaseClient setup is correct
import "animate.css";

const SignUpPage: React.FC = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
    });

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            // Check if passwords match
            if (form.password !== form.confirmPassword) {
                throw new Error('Passwords do not match.');
            }

            // Check if required fields are filled
            if (!form.name || !form.email || !form.password) {
                throw new Error('All fields are required.');
            }

            // Sign up with Supabase Auth
            const { data, error } = await supabase.auth.signUp({
                email: form.email,
                password: form.password,
            });

            if (error) throw new Error(error.message);

            // Ensure user data is available in the response
            const user = data?.user;

            if (!user) throw new Error('User not found after signup.');

            // Insert user details into the 'users' table, excluding password
            const { data: dbData, error: dbError } = await supabase
                .from('users')
                .insert([
                    {
                        id: user.id, // Use the user ID from the sign-up response
                        name: form.name,
                        email: form.email,
                        phone: form.phone,
                    },
                ]);

            if (dbError) throw new Error(dbError.message);

            // Reset form after successful sign-up
            setForm({ name: '', email: '', password: '', confirmPassword: '', phone: '' });

            console.log('Sign-Up Successful!', dbData);
        } catch (error: any) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center transition-all duration-700">
            {/* Form Container */}
            <div className="w-full max-w-md p-6 bg-white text-gray-800 rounded-lg shadow-xl opacity-0 transform transition-all duration-1000 ease-in-out scale-100 animate__animated animate__fadeInUp animate__delay-0.3s">
                <h2 className="text-2xl font-extrabold text-center mb-6 text-blue-600">Create Your Account</h2>
                {errorMessage && (
                    <div className="text-red-500 text-center mb-4">
                        {errorMessage}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="block text-sm font-semibold mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="block text-sm font-semibold mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="phone" className="block text-sm font-semibold mb-2">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="Enter your phone number"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-semibold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="Confirm your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-md transition-colors transform hover:scale-105 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;
