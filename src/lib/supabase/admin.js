import { getAuthenticatedUser } from "./auth";

export async function getAdminUser() {
    const { user, supabase } = await getAuthenticatedUser();

    if (!user) {
        return {
            user: null,
            supabase: null,
            error: "UNAUTHENTICATED"
        };
    }

    const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (error || !profile || profile.role !== "admin") {
        return {
            user: null,
            supabase: null,
            error: "FORBIDDEN"
        };
    }

    return {
        user,
        supabase,
        error: null
    };
}