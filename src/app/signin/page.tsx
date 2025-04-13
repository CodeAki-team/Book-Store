// app/signin/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function SignInPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        const { error } = await supabase.auth.signInWithPassword({
            email: form.email,
            password: form.password,
        });

        if (error) {
            setErrorMessage(error.message);
        } else {
            router.push("/"); // or redirect to dashboard
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center transition-all duration-700">
            <div className="w-full max-w-md p-6 bg-white text-gray-800 rounded-lg shadow-xl animate__animated animate__fadeInUp">
                <h2 className="text-2xl font-extrabold text-center mb-6 text-blue-600">Sign In</h2>
                {errorMessage && <div className="text-red-500 text-center mb-4">{errorMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-semibold mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-md transition-colors transform hover:scale-105 ${loading ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm">
                    Don’t have an account?{" "}
                    <Link href="/signup" className="text-blue-600 underline hover:text-blue-800">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}
