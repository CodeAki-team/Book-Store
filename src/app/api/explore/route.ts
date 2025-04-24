import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient"; 


const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; 
    }
    return array;
};

export async function GET() {
    try {
        const { data, error } = await supabase
            .from("books")
            .select("id, title, image, rating");

        if (error) throw error;

       
        const shuffledBooks = shuffleArray(data);

       
        const randomBooks = shuffledBooks.slice(0, 4);

      
        const books = randomBooks.map((book) => ({
            ...book,
            image: book.image, 
            rating: book.rating, 
        }));

        return NextResponse.json(books); 
    } catch (error) {
        console.error("Error fetching books:", error);
        return NextResponse.json({ error: "Failed to load books" }, { status: 500 });
    }
}
