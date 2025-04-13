"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import "animate.css";
import Link from "next/link";

const SignUpForm = () => {
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
            if (form.password !== form.confirmPassword) {
                throw new Error('Passwords do not match.');
            }

            if (!form.name || !form.email || !form.password) {
                throw new Error('All fields are required.');
            }
            
            const { data: existingUser, error: emailCheckError } = await supabase
                .from("users")
                .select("id")
                .eq("email", form.email) 
                .single();

            if (emailCheckError && emailCheckError.code !== "PGRST116") {
                throw new Error(emailCheckError.message);
            }

            if (existingUser) {
                
                setErrorMessage("This email is already in use.");
                return; 
            }
            
            const { data, error } = await supabase.auth.signUp({
                email: form.email,
                password: form.password,
            });

            if (error) {
                setErrorMessage(error.message);
                return;
            }

            // Now, insert the user data into 'users' table
            const { error: dbInsertError } = await supabase
                .from("users")
                .insert([
                    {
                        id: data.user?.id,
                        name: form.name,
                        email: form.email,
                        phone: form.phone,
                    },
                ]);

            if (dbInsertError) {
                throw new Error(dbInsertError.message);
            }

            // Reset the form and show success message
            setForm({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
            console.log("Sign-Up Successful!");

        } catch (error: any) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-6 bg-white text-gray-800 rounded-lg shadow-xl opacity-0 transform transition-all duration-1000 ease-in-out scale-100 animate__animated animate__fadeInUp animate__delay-0.3s">
            <h2 className="text-2xl font-extrabold text-center mb-6 text-blue-600">Create Your Account</h2>
            {errorMessage && (
                <div className="text-red-500 text-center mb-4">
                    {errorMessage}
                    {errorMessage.includes("already") && (
                        <p className="mt-2">
                            <span>Already have an account? </span>
                            <Link href="/signin" className="text-blue-600 underline hover:text-blue-800">
                                Sign In here
                            </Link>
                        </p>
                    )}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                {["name", "email", "phone", "password", "confirmPassword"].map((field, i) => (
                    <div className="mb-3" key={field}>
                        <label htmlFor={field} className="block text-sm font-semibold mb-2">
                            {field === "confirmPassword" ? "Confirm Password" : field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        <input
                            type={field.includes("password") ? "password" : field === "email" ? "email" : "text"}
                            id={field}
                            name={field}
                            value={form[field as keyof typeof form]}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder={`Enter your ${field}`}
                            required
                        />
                    </div>
                ))}
                <button
                    type="submit"
                    className={`w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-md transition-colors transform hover:scale-105 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
            </form>
            <div className="text-center mt-4">
                <span>Already have an account? </span>
                <Link href="/signin" className="text-blue-600 underline hover:text-blue-800">
                    Sign In here
                </Link>
            </div>
        </div>
    );
};

export default SignUpForm;
