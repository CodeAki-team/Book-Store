import { NextResponse } from "next/server";
import { getFilters } from "@/lib/get-filters";

export async function GET() {
    try {
        const filters = await getFilters();
        return NextResponse.json(filters, { status: 200 });
    } catch (error) {
        console.error("Error fetching filters:", error);
        return NextResponse.json({ error: "Failed to fetch filters" }, { status: 500 });
    }
}