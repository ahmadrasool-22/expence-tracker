import { getAuthenticatedUser } from "@/lib/supabase/auth";

export async function GET() {
    const { user, supabase } = await getAuthenticatedUser();

    if (!user) {
        return Response.json(
            { data: null, error: "UNAUTHENTICATED" },
            { status: 401 }
        );
    }

    const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return Response.json(
            { data: null, error: "SERVER_ERROR" },
            { status: 500 }
        );
    }

    return Response.json(
        { data, error: null },
        { status: 200 }
    );
}
export async function POST(request) {
    const { user, supabase } = await getAuthenticatedUser();

    if (!user) {
        return Response.json(
            { data: null, error: "UNAUTHENTICATED" },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();

        const {
            title,
            category,
            description,
            location_text,
            latitude,
            longitude,
            photo_url
        } = body;

        if (!title || !category || !description || !location_text) {
            return Response.json(
                { data: null, error: "VALIDATION_ERROR" },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from("complaints")
            .insert({
                user_id: user.id,
                title,
                category,
                description,
                location_text,
                latitude: latitude ?? null,
                longitude: longitude ?? null,
                photo_url: photo_url ?? null
            })
            .select()
            .single();

        if (error) {
            return Response.json(
                { data: null, error: "SERVER_ERROR" },
                { status: 500 }
            );
        }

        return Response.json(
            { data, error: null },
            { status: 201 }
        );

    } catch {
        return Response.json(
            { data: null, error: "VALIDATION_ERROR" },
            { status: 400 }
        );
    }
}