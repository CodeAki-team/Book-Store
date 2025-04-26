import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/ProductDetail/ProductDetail";

interface PageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductDetailPage({ params, searchParams }: PageProps) {
    const { id } = await params;
    const _searchParams = await searchParams; // If you need it

    // Fetch the product
    const { data: product, error } = await supabase
        .from("books")
        .select("*")
        .eq("id", id)
        .single();

    if (!product || error) {
        notFound();
    }

    return <ProductDetail product={product} />;
}

