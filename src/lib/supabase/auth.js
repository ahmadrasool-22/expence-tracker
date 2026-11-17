import { createClient } from "./server";

export async function getAuthenticatedUser() {
    const supabase = await createClient();

    const {
        data: { user },
        error
    } = await supabase.auth.getUser();

    if (error || !user) {
        return {
            user: null,
            supabase: null
        };
    }

    return {
        user,
        supabase
    };
}