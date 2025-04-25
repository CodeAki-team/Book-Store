import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/get-products";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = new URLSearchParams(searchParams);

  let statusCode = 200;
  let message = "Success";

  try {
    const products = await getProducts(query);


    await supabase.from("logs").insert({
      endpoint: "/api/products",
      message,
      status_code: statusCode,
      method: "GET",
    });

    return NextResponse.json(products, { status: statusCode });
  } catch (error: any) {
    statusCode = 500;
    message = error.message || "Unknown error";

    
    await supabase.from("logs").insert({
      endpoint: "/api/products",
      message,
      status_code: statusCode,
      method: "GET",
    });

    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
