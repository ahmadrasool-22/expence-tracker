import { getAdminUser } from "@/lib/supabase/admin";

export async function PATCH(request, { params }) {
    const { user, supabase, error } = await getAdminUser();

    if (error) {
        return Response.json(
            { data: null, error },
            { status: error === "UNAUTHENTICATED" ? 401 : 403 }
        );
    }

    try {
        const { id } = await params;
        const { status } = await request.json();

        const allowedStatuses = [
            "Pending",
            "In Progress",
            "Resolved"
        ];

        if (!allowedStatuses.includes(status)) {
            return Response.json(
                { data: null, error: "VALIDATION_ERROR" },
                { status: 400 }
            );
        }

        const { data, error: dbError } = await supabase
            .from("complaints")
            .update({ status })
            .eq("id", id)
            .select()
            .single();

        if (dbError || !data) {
            return Response.json(
                { data: null, error: "NOT_FOUND" },
                { status: 404 }
            );
        }

        return Response.json({ data, error: null });

    } catch {
        return Response.json(
            { data: null, error: "VALIDATION_ERROR" },
            { status: 400 }
        );
    }
}