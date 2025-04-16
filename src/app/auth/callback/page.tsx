"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function EmailCallbackPage() {
    const router = useRouter();
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        const verify = async () => {
            const { error } = await supabase.auth.getSession();

            if (error) {
                setMessage("Verification failed. Try signing in manually.");
            } else {
                setMessage("Email confirmed! Redirecting...");
                setTimeout(() => router.push("/"), 2000); // Redirect after 2s
            }
        };

        verify();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="p-6 bg-white shadow-md rounded-md text-center">
                <h1 className="text-xl font-semibold text-blue-600">{message}</h1>
            </div>
        </div>
    );
}
