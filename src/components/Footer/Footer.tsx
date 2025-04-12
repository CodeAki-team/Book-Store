"use client";
import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"; 

const Footer: React.FC = () => {
    return ( 
        <>
        <footer className="bg-blue-700 text-white py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-6">
                {/* Footer Content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
                    {/* Quick Links Section */}
                    <div className="flex flex-col items-start space-y-6">
                        <h3 className="text-xl font-semibold">Quick Links</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="hover:text-blue-200 transition duration-300">Home</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-blue-200 transition duration-300">Products</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-blue-200 transition duration-300">Contact</a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Form Section */}
                    <div className="flex flex-col items-start space-y-6">
                        <h3 className="text-xl font-semibold">Contact Us</h3>
                        <form action="mailto:contact@inkspire.com" method="get" className="space-y-6 w-full">
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                className="p-4 w-full rounded-lg border-2 border-blue-500 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-500 transition-all py-3 px-6 rounded-lg text-lg w-full text-white font-semibold"
                            >
                                Send
                            </button>
                        </form>
                    </div>

                    {/* Social Media Icons Section */}
                    <div className="flex flex-col items-start space-y-6">
                        <h3 className="text-xl font-semibold">Follow Us</h3>
                        <div className="flex gap-8">
                            <a
                                href="https://www.facebook.com"
                                className="text-white hover:text-blue-200 transition duration-300"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Facebook size={32} />
                            </a>
                            <a
                                href="https://www.twitter.com"
                                className="text-white hover:text-blue-200 transition duration-300"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Twitter size={32} />
                            </a>
                            <a
                                href="https://www.instagram.com"
                                className="text-white hover:text-blue-200 transition duration-300"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Instagram size={32} />
                            </a>
                            <a
                                href="https://www.linkedin.com"
                                className="text-white hover:text-blue-200 transition duration-300"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Linkedin size={32} />
                            </a>
                        </div>
                    </div>

                    {/* Company Information Section */}
                    <div className="flex flex-col items-start space-y-6">
                        <h3 className="text-4xl font-extrabold text-white">INKSPIRE</h3>
                        <p className="text-lg font-light">
                            Unlock a world of knowledge with INKSPIRE. We offer a wide selection of books, carefully curated to fuel your passion for reading.
                        </p>
                        <p className="text-sm text-gray-300">© {new Date().getFullYear()} INKSPIRE. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
        </>
    );
};

export default Footer;
