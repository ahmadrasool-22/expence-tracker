import { getAuthenticatedUser } from "@/lib/supabase/auth";

export async function GET(request, { params }) {
    const { user, supabase } = await getAuthenticatedUser();

    if (!user) {
        return Response.json(
            { data: null, error: "UNAUTHENTICATED" },
            { status: 401 }
        );
    }

    const { id } = await params;

    const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !data) {
        return Response.json(
            { data: null, error: "NOT_FOUND" },
            { status: 404 }
        );
    }

    return Response.json({ data, error: null });
}

export async function PATCH(request, { params }) {
    const { user, supabase } = await getAuthenticatedUser();

    if (!user) {
        return Response.json(
            { data: null, error: "UNAUTHENTICATED" },
            { status: 401 }
        );
    }

    try {
        const { id } = await params;
        const body = await request.json();

        const allowedFields = [
            "title",
            "category",
            "description",
            "location_text",
            "latitude",
            "longitude",
            "photo_url"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (field in body) {
                updates[field] = body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return Response.json(
                { data: null, error: "VALIDATION_ERROR" },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from("complaints")
            .update(updates)
            .eq("id", id)
            .eq("user_id", user.id)
            .eq("status", "Pending")
            .select()
            .single();

        if (error || !data) {
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
export async function DELETE(request, { params }) {
    const { user, supabase } = await getAuthenticatedUser();

    if (!user) {
        return Response.json(
            { data: null, error: "UNAUTHENTICATED" },
            { status: 401 }
        );
    }

    const { id } = await params;

    const { data, error } = await supabase
        .from("complaints")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)
        .eq("status", "Pending")
        .select()
        .single();

    if (error || !data) {
        return Response.json(
            { data: null, error: "NOT_FOUND" },
            { status: 404 }
        );
    }

    return Response.json({
        data: { message: "Complaint deleted successfully" },
        error: null
    });
}