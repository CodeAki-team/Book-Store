import { useState, useEffect } from "react";
import { Search, ShoppingCart } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
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
    const [user, setUser] = useState<any>(null);

    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.push("/");
    };

    const handleSearchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim() === "") return;

        const { data, error } = await supabase
            .from("books")
            .select("*")
            .ilike("title", `%${searchQuery}%`);

        if (error) {
            console.error("Error searching books:", error.message);
        } else {
            setSearchResults(data);
        }
    };

    useEffect(() => {
        const checkSession = async () => {
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession();

            if (error) console.error("Error fetching session:", error.message);
            setUser(session?.user || null);
        };

        checkSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    return (
        <>
            <header className="sticky top-0 z-50 bg-white shadow-md">
                <div className="mx-auto max-w-6xl flex items-center justify-between p-3">
                    <Link href="/" className="flex items-center space-x-3 cursor-pointer">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            fill="none"
                            className="h-16 w-16 text-blue-600"
                        >
                            <rect x="3" y="4" width="18" height="16" strokeWidth="2" />
                            <path d="M3 12l9 4 9-4" strokeWidth="2" />
                        </svg>
                        <span className="text-3xl font-extrabold text-gray-800 font-[Poppins, sans-serif] cursor-pointer">
                            INKSPIRE
                        </span>
                    </Link>

                    <button
                        onClick={() => {
                            setIsMenuOpen(!isMenuOpen);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="md:hidden cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor" className={`w-8 h-8 ${isMenuOpen ? "rotate-45" : ""}`}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                    </button>

                    <nav className="hidden md:flex items-center gap-10">
                        {navItems.map((item) => (
                            <Link key={item.name} href={item.href}
                                  className="group relative text-gray-700 hover:text-blue-600 pb-1 cursor-pointer">
                                {item.name}
                                <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-blue-600 group-hover:w-full transition-all duration-300"/>
                            </Link>
                        ))}

                        <Link href="/cart" className="relative group flex items-center gap-1 text-gray-700 hover:text-blue-600 pb-1 cursor-pointer">
                            <ShoppingCart size={20} />
                            <span>Cart</span>
                            <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-blue-600 group-hover:w-full transition-all duration-300"/>
                        </Link>
                    </nav>

                    <div className="hidden md:flex items-center gap-5 min-w-[320px] justify-end relative">
                        <button
                            onClick={() => setIsSearchVisible(!isSearchVisible)}
                            className="text-gray-600 hover:text-blue-600 cursor-pointer"
                        >
                            <Search size={26} />
                        </button>

                        {isSearchVisible && (
                            <div className="absolute top-12 right-0 bg-white border border-gray-300 shadow-md rounded-md p-4 w-[300px] z-50">
                                <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Search for books..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="p-2 border border-gray-300 rounded-md w-full"
                                    />
                                </form>

                                {searchResults.length > 0 ? (
                                    <ul className="max-h-64 overflow-y-auto space-y-2">
                                        {searchResults.map((book) => (
                                            <li key={book.id}>
                                                <Link
                                                    href={`/products/${book.id}`}
                                                    className="block hover:bg-blue-100 p-2 rounded text-sm text-gray-800 cursor-pointer"
                                                    onClick={() => setIsSearchVisible(false)}
                                                >
                                                    {book.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ) : searchQuery.length > 0 ? (
                                    <p className="text-sm text-gray-500">No results found.</p>
                                ) : null}
                            </div>
                        )}

                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full text-sm font-medium max-w-[180px] truncate cursor-pointer">
                                    <span>{user.email}</span>
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="bg-red-600 hover:bg-red-700 text-white py-1.5 px-3 rounded-md text-sm cursor-pointer"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <Link href="/signup" className="text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-md text-sm cursor-pointer">
                                Sign Up
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {isMenuOpen && (
                <div className="md:hidden flex flex-col items-start p-5 bg-white shadow-md">
                    {navItems.map((item) => (
                        <Link key={item.name} href={item.href} className="py-2 text-lg text-gray-700 hover:text-blue-600 cursor-pointer">
                            {item.name}
                        </Link>
                    ))}
                    <Link href="/cart" className="py-2 text-lg text-gray-700 hover:text-blue-600 flex items-center gap-2 relative cursor-pointer">
                        <ShoppingCart size={20} />
                        Cart
                    </Link>

                    <button
                        onClick={() => setIsSearchVisible(!isSearchVisible)}
                        className="text-gray-600 hover:text-blue-600 py-2 cursor-pointer"
                    >
                        <Search size={26} />
                    </button>

                    {isSearchVisible && (
                        <div className="absolute top-12 left-0 bg-white border border-gray-300 shadow-md rounded-md p-4 w-[300px] z-50">
                            <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="Search for books..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-md w-full"
                                />
                            </form>

                            {searchResults.length > 0 ? (
                                <ul className="max-h-64 overflow-y-auto space-y-2">
                                    {searchResults.map((book) => (
                                        <li key={book.id}>
                                            <Link
                                                href={`/products/${book.id}`}
                                                className="block hover:bg-blue-100 p-2 rounded text-sm text-gray-800 cursor-pointer"
                                                onClick={() => setIsSearchVisible(false)}
                                            >
                                                {book.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : searchQuery.length > 0 ? (
                                <p className="text-sm text-gray-500">No results found.</p>
                            ) : null}
                        </div>
                    )}

                    {user ? (
                        <div className="py-2 flex flex-col">
                            <span className="text-sm text-gray-600">Welcome, {user.email}</span>
                            <button
                                onClick={handleSignOut}
                                className="mt-2 bg-red-600 hover:bg-red-700 text-white py-1.5 px-3 rounded-md text-sm cursor-pointer"
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <Link href="/signup" className="py-2 text-lg text-white bg-blue-600 hover:bg-blue-700 rounded-md cursor-pointer">
                            Sign Up
                        </Link>
                    )}
                </div>
            )}
        </>
    );
};

export default Navbar;
