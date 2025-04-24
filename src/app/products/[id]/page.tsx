import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/ProductDetail/ProductDetail";

interface Props {
    params: {
        id: string;
    };
}

export default async function ProductDetailPage({ params }: Props) {
    const { data: product, error } = await supabase
        .from("books")
        .select("*")
        .eq("id", params.id)
        .single();

    if (!product || error) {
        return notFound();
    }
    
    return <ProductDetail product={product} />;
}
