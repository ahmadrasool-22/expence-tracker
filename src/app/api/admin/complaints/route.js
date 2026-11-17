import { getAdminUser } from "@/lib/supabase/admin";

export async function GET() {
    const { user, supabase, error } = await getAdminUser();

    if (error) {
        return Response.json(
            { data: null, error },
            { status: error === "UNAUTHENTICATED" ? 401 : 403 }
        );
    }

    const { data, error: dbError } = await supabase
        .from("complaints")
        .select("*")
        .order("created_at", { ascending: false });

    if (dbError) {
        return Response.json(
            { data: null, error: "SERVER_ERROR" },
            { status: 500 }
        );
    }

    return Response.json({ data, error: null });
}