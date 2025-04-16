import Head from "next/head";
import SignUpFormWrapper from "./SignUpFormWrapper";

export default function SignUpPage() {
    return (
        <>
            <Head>
                <title>Sign Up - Book Store</title>
                <meta name="description" content="Create your account to start exploring books!" />
            </Head>

            <main className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center transition-all duration-700">
                <SignUpFormWrapper />
            </main>
        </>
    );
}
