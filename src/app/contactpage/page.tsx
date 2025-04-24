'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const ContactPage: React.FC = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        message: '',
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(''); // Clear previous error message

        try {
            // Submit the form data without any email duplicate check
            const { data, error } = await supabase
                .from('contact_form_submissions')
                .insert([
                    {
                        name: form.name,
                        email: form.email,
                        message: form.message,
                    },
                ]);
            if (error) {
                console.error('Error submitting form:', error);
                setErrorMessage(error.message || 'An unexpected error occurred.');
                return; // Return early instead of throwing an error
            }

            console.log('Form submitted:', data);
            setSuccess(true);
            setForm({ name: '', email: '', message: '' });

            // Hide success message after 3 seconds
            setTimeout(() => {
                setSuccess(false);
            }, 3000);

        } catch (error) {
            if (error instanceof Error) {
                console.error('Error submitting form:', error.message);
                setErrorMessage(error.message);
            } else {
                console.error('Unknown error submitting form:', error);
                setErrorMessage('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 text-gray-800 py-12 px-4 sm:px-8 lg:px-24">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-5xl font-bold text-blue-700 mb-4 text-center">Contact Us</h1>
                <p className="text-gray-600 mb-10 text-center text-lg">
                    Have a question or want to collaborate? Send us a message!
                </p>

                {success && (
                    <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg text-center">
                        Your message has been successfully submitted!
                    </div>
                )}

                {errorMessage && (
                    <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg text-center">
                        {errorMessage}
                    </div>
                )}

                <div className="grid gap-12 md:grid-cols-2 mb-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <Mail className="text-blue-600 mt-1" />
                            <div>
                                <h4 className="font-semibold text-blue-700">Email</h4>
                                <p><a href="mailto:support@example.com" className="hover:underline">support@example.com</a></p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Phone className="text-blue-600 mt-1" />
                            <div>
                                <h4 className="font-semibold text-blue-700">Phone</h4>
                                <p><a href="tel:+1234567890" className="hover:underline">+1 (234) 567-890</a></p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <MapPin className="text-blue-600 mt-1" />
                            <div>
                                <h4 className="font-semibold text-blue-700">Address</h4>
                                <p>123 Main St, Your City, Country</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white shadow-lg rounded-lg p-8 sm:p-10 border border-blue-300 w-full space-y-6"
                    >
                        <div className="mb-6">
                            <label htmlFor="name" className="block text-sm font-semibold mb-2 text-blue-700">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                placeholder="Your name"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="email" className="block text-sm font-semibold mb-2 text-blue-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="message" className="block text-sm font-semibold mb-2 text-blue-700">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows={5}
                                value={form.message}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                placeholder="Type your message here..."
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={`w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-colors ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ContactPage;
