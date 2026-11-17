export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length < 3) {
        return Response.json(
            { data: null, error: "VALIDATION_ERROR" },
            { status: 400 }
        );
    }

    try {
        const url = new URL(
            "https://nominatim.openstreetmap.org/search"
        );

        url.searchParams.set("q", query);
        url.searchParams.set("format", "json");
        url.searchParams.set("limit", "1");

        const response = await fetch(url, {
            headers: {
                "User-Agent": "CampusMaintenanceComplaintSystem/1.0"
            },
            next: { revalidate: 3600 }
        });

        if (!response.ok) {
            throw new Error("Geocoding request failed");
        }

        const results = await response.json();

        if (results.length === 0) {
            return Response.json(
                { data: null, error: "NOT_FOUND" },
                { status: 404 }
            );
        }

        return Response.json({
            data: {
                latitude: Number(results[0].lat),
                longitude: Number(results[0].lon),
                display_name: results[0].display_name
            },
            error: null
        });

    } catch {
        return Response.json(
            { data: null, error: "SERVER_ERROR" },
            { status: 500 }
        );
    }
}