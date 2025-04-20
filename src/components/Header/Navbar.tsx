'use client';

import { useState, useEffect } from "react";
import { Search, ShoppingCart } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser"; // if you have custom hook for user
import Link from "next/link";

const navItems = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Contact", href: "/contactpage" },
];

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null); // Initialize with null for signed-out state
    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setUser(null); // Update state after sign out
        router.push("/");
    };

    const handleSearchSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (searchQuery.trim()) {
            const { data, error } = await supabase
                .from("books")
                .select("*")
                .ilike("title", `%${searchQuery}%`);

            if (error) {
                console.error("Error fetching books:", error.message);
            } else {
                setSearchResults(data);
                window.scrollTo({ top: 0, behavior: "smooth" }); // 👈 Scroll to top
            }
        }
    };

    // Check user session on mount
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error("Error fetching session:", error.message);
            }

            if (session) {
                setUser(session.user); // Set user if signed in
            } else {
                setUser(null); // Set null if not signed in
            }
        };

        checkSession();

        // Optionally, listen to auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                setUser(session.user);
            } else {
                setUser(null);
            }
        });

        // Clean up the subscription on unmount
        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    return (
        <>
            <header className="sticky top-0 z-50 bg-white shadow-md">
                <div className="mx-auto max-w-6xl flex items-center justify-between p-3">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            className="h-16 w-16 text-blue-600"
                        >
                            <rect x="3" y="4" width="18" height="16" strokeWidth="2" />
                            <path d="M3 12l9 4 9-4" strokeWidth="2" />
                        </svg>
                        <span className="text-3xl font-extrabold text-gray-800 font-[Poppins, sans-serif]">
              INKSPIRE
            </span>
                    </div>

                    {/* Menu toggle for mobile */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden text-gray-600 hover:text-blue-600 transition-all duration-700 ease-in-out transform hover:scale-105"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className={`w-8 h-8 transform transition-all duration-700 ease-in-out ${
                                isMenuOpen ? "rotate-45" : ""
                            }`}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-10">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="group relative text-gray-700 hover:text-blue-600 transition-all pb-1"
                            >
                                {item.name}
                                <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        ))}

                        <Link
                            href="/cart"
                            className="group relative flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-all pb-1"
                        >
                            <ShoppingCart size={20} />
                            <span>Cart</span>
                            <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    </nav>

                    {/* Right Side - Search + Auth */}
                    <div className="hidden md:flex items-center gap-5 min-w-[320px] justify-end">
                        <button
                            onClick={() => setIsSearchVisible(!isSearchVisible)}
                            className="text-gray-600 hover:text-blue-600 transition-all pb-1 cursor-pointer"
                        >
                            <Search size={26} />
                        </button>

                        {isSearchVisible && (
                            <form
                                onSubmit={handleSearchSubmit}
                                className="flex items-center space-x-2"
                            >
                                <input
                                    type="text"
                                    placeholder="Search for books..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-md w-[200px]"
                                />
                            </form>
                        )}

                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full shadow-sm text-sm font-medium max-w-[180px] truncate">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.779.76 6.879 2.057M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                    <span className="truncate">{user.email}</span>
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="bg-red-600 hover:bg-red-700 text-white py-1.5 px-3 rounded-md text-sm cursor-pointer"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/signup"
                                className="text-white bg-blue-600 hover:bg-blue-700 transition-all py-2 px-4 rounded-md text-sm"
                            >
                                Sign Up
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Search Results */}
            {searchResults.length > 0 && (
                <div className="p-6 bg-gray-50 shadow-inner mt-4 max-w-6xl mx-auto rounded-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-gray-800">Search Results</h2>
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setSearchResults([]);
                                setIsSearchVisible(false);
                            }}
                            className="text-sm text-red-500 hover:underline cursor-pointer"
                        >
                            Clear Results
                        </button>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {searchResults.map((book: any) => (
                            <li
                                key={book.id}
                                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                            >
                                <h3 className="text-lg font-bold text-blue-700">{book.title}</h3>
                                <p className="text-gray-600 mt-1">{book.author}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Mobile Menu */}
            <div
                className={`md:hidden flex flex-col items-center space-y-4 bg-white p-4 shadow-md ${
                    isMenuOpen ? "block" : "hidden"
                }`}
            >
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="text-gray-700 hover:text-blue-600 transition-all duration-700 ease-in-out transform hover:scale-105"
                    >
                        {item.name}
                    </Link>
                ))}

                <Link
                    href="/cart"
                    className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-all"
                >
                    <ShoppingCart size={20} />
                    <span>Cart</span>
                </Link>
            </div>
        </>
    );
};

export default Navbar;
