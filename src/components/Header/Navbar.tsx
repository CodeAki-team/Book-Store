"use client";
import { useState } from "react";
import { Search, ShoppingCart } from "lucide-react";

const navItems = [
    { name: "Home", href: "#" },
    { name: "Products", href: "#" },
    { name: "Contact", href: "/ContactPage" },
];

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-50 bg-white shadow-md">
                <div className="mx-auto flex items-center justify-between p-3 max-w-6xl">
                    {/* Logo Section */}
                    <div className="flex items-center space-x-3">
                        {/* SVG Logo */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            className="h-16 w-16 text-blue-600"
                        >
                            <rect x="3" y="4" width="18" height="16" stroke="currentColor" strokeWidth="2" />
                            <path d="M3 12l9 4 9-4" stroke="currentColor" strokeWidth="2" />
                        </svg>

                        {/* Store Name */}
                        <span className="text-3xl font-extrabold text-gray-800 font-[Poppins, sans-serif]">
              INKSPIRE
            </span>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden text-gray-600 hover:text-blue-600 transition-all"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-8 h-8"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center space-x-12">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="group relative text-gray-700 hover:text-blue-600 transition-all pb-1"
                            >
                                {item.name}
                                <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                            </a>
                        ))}

                        {/* Cart with Icon */}
                        <a
                            href="#"
                            className="group relative flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-all pb-1"
                        >
                            <ShoppingCart size={20} />
                            <span>Cart</span>
                            <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                        </a>
                    </nav>

                    {/* Desktop Search and Sign Up Icons */}
                    <div className="hidden md:flex items-center gap-5">
                        <button className="text-gray-600 hover:text-blue-600 transition-all pb-1 cursor-pointer">
                            <Search size={28} />
                        </button>

                        <button className="text-white bg-blue-600 hover:bg-blue-700 transition-all py-2 px-4 rounded-md text-lg cursor-pointer">
                            Sign Up
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`md:hidden flex flex-col items-center space-y-4 bg-white p-4 shadow-md ${
                        isMenuOpen ? "block" : "hidden"
                    }`}
                >
                    {navItems.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="text-gray-700 hover:text-blue-600 transition-all"
                        >
                            {item.name}
                        </a>
                    ))}

                    {/* Cart with Icon */}
                    <a
                        href="#"
                        className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-all"
                    >
                        <ShoppingCart size={20} />
                        <span>Cart</span>
                    </a>

                    {/* Search Icon in Mobile Menu */}
                    <button className="text-gray-600 hover:text-blue-600 transition-all pb-1 cursor-pointer">
                        <Search size={28} />
                    </button>

                    {/* Sign Up Button */}
                    <button className="text-white bg-blue-600 hover:bg-blue-700 transition-all py-2 px-4 rounded-md text-lg cursor-pointer">
                        Sign Up
                    </button>
                </div>
            </header>
        </>
    );
};

export default Navbar;
