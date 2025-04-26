"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
    const [isClient, setIsClient] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validatePhone = (phone: string) => {
        const phoneRegex = /^[\d\s()+-]{7,15}$/; // Accepts digits, spaces, +, -, ()
        return phoneRegex.test(phone);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            const { name, email, password, confirmPassword, phone } = form;

            if (!name || !email || !password || !confirmPassword || !phone) {
                setErrorMessage('All fields are required.');
                return;
            }

            if (!validatePhone(phone)) {
                setErrorMessage('Please enter a valid phone number.');
                return;
            }

            if (password !== confirmPassword) {
                setErrorMessage('Passwords do not match.');
                return;
            }

            const { data: existingUser, error: emailCheckError } = await supabase
                .from("users")
                .select("id")
                .eq("email", email)
                .single();

            if (emailCheckError && emailCheckError.code !== "GRIST116") {
                setErrorMessage(emailCheckError.message);
                return;
            }

            if (existingUser) {
                setErrorMessage("This email is already in use.");
                return;
            }

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/auth/callback}`,
                },
            });

            if (error) {
                setErrorMessage(error.message);
                return;
            }

            const { error: dbInsertError } = await supabase
                .from("users")
                .insert([
                    {
                        id: data.user?.id,
                        name,
                        email,
                        phone,
                    },
                ]);

            if (dbInsertError) {
                setErrorMessage(dbInsertError.message);
                return;
            }

            setForm({
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                phone: '',
            });

            router.push("/signin");

        } catch (error: any) {
            setErrorMessage("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isClient) return null;

    return (
        <div className="w-full max-w-md p-6 bg-white text-gray-800 rounded-lg shadow-xl opacity-0 transform transition-all duration-1000 ease-in-out scale-100 animate__animated animate__fadeInUp animate__delay-0.3s">
            <h2 className="text-2xl font-extrabold text-center mb-6 text-blue-600">Create Your Account</h2>

            {errorMessage && (
                <div className="text-red-500 text-center mb-4">
                    <p>{errorMessage}</p>
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
                {[
                    { id: "name", type: "text", label: "Full Name" },
                    { id: "email", type: "email", label: "Email Address" },
                    { id: "phone", type: "tel", label: "Phone Number" },
                    { id: "password", type: "password", label: "Password" },
                    { id: "confirmPassword", type: "password", label: "Confirm Password" },
                ].map(({ id, type, label }) => (
                    <div className="mb-3" key={id}>
                        <label htmlFor={id} className="block text-sm font-semibold mb-2">
                            {label}
                        </label>
                        <input
                            type={type}
                            id={id}
                            name={id}
                            value={form[id as keyof typeof form]}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder={`Enter your ${label.toLowerCase()}`}
                            required
                        />
                    </div>
                ))}

                <button
                    type="submit"
                    className={`w-full cursor-pointer bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-md transition-all transform hover:scale-105 ${
                        loading ? 'cursor-not-allowed opacity-50' : ''
                    }`}
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
