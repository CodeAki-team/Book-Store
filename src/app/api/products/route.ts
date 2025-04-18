import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/get-products";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = new URLSearchParams(searchParams);

  try {
    const products = await getProducts(query);
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
