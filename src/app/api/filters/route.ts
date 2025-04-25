import { NextRequest, NextResponse } from "next/server";
import { getFilters } from "@/lib/get-filters";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  const endpoint = "/api/filters";
  const method = "GET";

  try {
    const filters = await getFilters();

    // 📦 ثبت درخواست موفق
    await supabase.from("logs").insert([
      {
        endpoint,
        method,
        message: "Filters fetched successfully",
        status_code: 200,
      },
    ]);

    return NextResponse.json(filters, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching filters:", error);

    // 🧯 ثبت خطا
    await supabase.from("logs").insert([
      {
        endpoint,
        method,
        message: error.message || "Unknown error",
        status_code: 500,
      },
    ]);

    return NextResponse.json(
      { error: "Failed to fetch filters" },
      { status: 500 }
    );
  }
}
