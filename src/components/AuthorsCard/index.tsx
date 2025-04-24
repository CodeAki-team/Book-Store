import React from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import kilgourImg from "@/assets/Author1.jpg";
import orwellImg from "@/assets/Author2.jpg";
import fitchImg from "@/assets/Author3.jpg";
import saminImg from "@/assets/Author4.jpg";

const authors = [
    {
        name: "Frederick G. Kilgour",
        image: kilgourImg,
        wiki: "https://en.wikipedia.org/wiki/Frederick_G._Kilgour",
        description:
            "A pioneer in library science and the founder of the OCLC library network.",
    },
    {
        name: "George Orwell",
        image: orwellImg,
        wiki: "https://en.wikipedia.org/wiki/George_Orwell",
        description:
            "English novelist and essayist, famous for 1984 and Animal Farm.",
    },
    {
        name: "Stona Fitch",
        image: fitchImg,
        wiki: "https://en.wikipedia.org/wiki/Stona_Fitch",
        description:
            "American novelist known for 'Senseless' and his gritty, socially conscious fiction.",
    },
    {
        name: "Samin Nosrat",
        image: saminImg,
        wiki: "https://en.wikipedia.org/wiki/Samin_Nosrat",
        description:
            "Chef and author of 'Salt Fat Acid Heat', blending science with culinary art.",
    },
];

const AuthorsCard = () => {
    return (
        <section className="p-8">
            {/* Title Section */}
            <h2 className="text-3xl font-semibold text-center text-gray-900 mb-8">
                Meet the Authors
            </h2>

            {/* Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {authors.map((author) => (
                    <div
                        key={author.name}
                        className="relative bg-white rounded-2xl shadow-lg group overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer"
                    >
                        <div className="relative w-full h-[350px]">
                            <Image
                                src={author.image}
                                alt={author.name}
                                width={400}
                                height={400}
                                className="w-full h-full object-cover rounded-t-2xl transition-opacity duration-500 ease-in-out group-hover:opacity-40"
                            />
                        </div>
                        <div className="absolute inset-0 flex flex-col justify-between p-6">
                            <div className="flex flex-col justify-center items-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <h3 className="text-2xl font-bold text-black">{author.name}</h3>
                                <p className="text-sm text-black bg-white/60 p-3 rounded-md mt-3 backdrop-blur-md shadow-inner">
                                    {author.description}
                                </p>
                            </div>
                            <div className="absolute bottom-5 left-0 right-auto p-3 bg-white/60 opacity-90 transition-opacity duration-300 ease-in-out backdrop-blur-md">
                                <a
                                    href={author.wiki}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:underline"
                                >
                                    Learn more <ArrowRight size={16} />
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AuthorsCard;
