import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient"; // Ensure correct supabase client import

// Function to shuffle an array
const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
};

export async function GET() {
    try {
        const { data, error } = await supabase
            .from("books")
            .select("id, title, image, rating");

        if (error) throw error;

        // Shuffle the array and pick the first 3 books
        const shuffledBooks = shuffleArray(data);

        // Select the first 3 books
        const randomBooks = shuffledBooks.slice(0, 4);

        // Customize the books without adding the "Randomized" label
        const books = randomBooks.map((book) => ({
            ...book,
            image: book.image, // Ensure the image URL is passed correctly
            rating: book.rating, // Use the original rating
        }));

        return NextResponse.json(books); // Return the randomized books without the "Randomized" text
    } catch (error) {
        console.error("Error fetching books:", error);
        return NextResponse.json({ error: "Failed to load books" }, { status: 500 });
    }
}
