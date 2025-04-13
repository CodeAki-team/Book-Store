"use client";

import dynamic from "next/dynamic";

const SignUpForm = dynamic(() => import("./SignUpForm"), { ssr: false });

const SignUpFormWrapper = () => {
    return <SignUpForm />;
};

export default SignUpFormWrapper;
