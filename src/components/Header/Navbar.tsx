"use client";
import { useState } from "react";
import { Search, ShoppingCart } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

const navItems = [
    { name: "Home", href: "#" },
    { name: "Products", href: "#" },
    { name: "Contact", href: "/contactpage" },
];

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const user = useUser();
    const router = useRouter();
    const handleSignOut = async () => {
        await supabase.auth.signOut();
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
            }
        }
    };

    return (
        <>
            <header className="sticky top-0 z-50 bg-white shadow-md">
                <div className="mx-auto flex items-center justify-between p-3 max-w-6xl">
                    <div className="flex items-center space-x-3">
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

                        <span className="text-3xl font-extrabold text-gray-800 font-[Poppins, sans-serif]">
                            INKSPIRE
                        </span>
                    </div>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden text-gray-600 hover:text-blue-600 transition-all duration-700 ease-in-out transform hover:scale-105"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className={`w-8 h-8 transform transition-all duration-700 ease-in-out ${isMenuOpen ? 'rotate-45' : ''}`}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>

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

                        <a
                            href="#"
                            className="group relative flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-all pb-1"
                        >
                            <ShoppingCart size={20} />
                            <span>Cart</span>
                            <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                        </a>
                    </nav>

                    <div className="hidden md:flex items-center gap-5">
                        <button
                            onClick={() => setIsSearchVisible(!isSearchVisible)}
                            className="text-gray-600 hover:text-blue-600 transition-all pb-1 cursor-pointer"
                        >
                            <Search size={28} />
                        </button>

                        {isSearchVisible && (
                            <form onSubmit={handleSearchSubmit} className="flex items-center space-x-3">
                                <input
                                    type="text"
                                    placeholder="Search for books..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-md"
                                />
                            </form>
                        )}

                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-gray-700">{user.email}</span>
                                <button
                                    onClick={handleSignOut}
                                    className="text-white bg-red-600 hover:bg-red-700 py-2 px-4 rounded-md text-lg"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <a
                                href="/signup"
                                className="text-white bg-blue-600 hover:bg-blue-700 transition-all py-2 px-4 rounded-md text-lg cursor-pointer"
                            >
                                Sign Up
                            </a>
                        )}
                    </div>
                </div>
            </header>

            {searchResults.length > 0 && (
                <div className="p-4 bg-white shadow-md mt-4">
                    <h2 className="text-xl font-semibold">Search Results:</h2>
                    <ul>
                        {searchResults.map((book: any) => (
                            <li key={book.id} className="py-2">
                                <h3 className="text-lg font-bold">{book.title}</h3>
                                <p>{book.author}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div
                className={`md:hidden flex flex-col items-center space-y-4 bg-white p-4 shadow-md ${
                    isMenuOpen ? "block" : "hidden"
                }`}
            >
                {navItems.map((item) => (
                    <a
                        key={item.name}
                        href={item.href}
                        className="text-gray-700 hover:text-blue-600 transition-all duration-700 ease-in-out transform hover:scale-105"
                    >
                        {item.name}
                    </a>
                ))}

                <a
                    href="#"
                    className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-all"
                >
                    <ShoppingCart size={20} />
                    <span>Cart</span>
                </a>
            </div>
        </>
    );
};

export default Navbar;
