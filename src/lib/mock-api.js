
const API_BASE_URL = "";

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: "same-origin",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error("The server returned an invalid response.");
  }

  if (!response.ok || result.error) {
    throw new Error(
      result.error?.message || `Request failed (${response.status}).`
    );
  }

  return result.data;
}

// Student: get only the signed-in student's complaints.
export async function getComplaints() {
  return apiRequest("/api/complaints");
}

// Admin: get complaints from all students.
export async function getAllComplaints() {
  return apiRequest("/api/admin/complaints");
}

// Get one complaint.
export async function getComplaint(id) {
  return apiRequest(`/api/complaints/${encodeURIComponent(id)}`);
}

// Create a complaint.
export async function createComplaint(values) {
  return apiRequest("/api/complaints", {
    method: "POST",
    body: JSON.stringify({
      title: values.title,
      category: values.category,
      description: values.description,
      location_text: values.location_text,
      ...(values.latitude != null && { latitude: values.latitude }),
      ...(values.longitude != null && { longitude: values.longitude }),
      ...(values.photo_url && { photo_url: values.photo_url }),
    }),
  });
}

// Update a student's own Pending complaint.
export async function updateComplaint(id, values) {
  return apiRequest(`/api/complaints/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({
      title: values.title,
      category: values.category,
      description: values.description,
      location_text: values.location_text,
      ...(values.latitude != null && { latitude: values.latitude }),
      ...(values.longitude != null && { longitude: values.longitude }),
      ...(values.photo_url && { photo_url: values.photo_url }),
    }),
  });
}

// Delete a student's own Pending complaint.
export async function deleteComplaint(id) {
  return apiRequest(`/api/complaints/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

// Admin: update complaint status.
export async function updateComplaintStatus(id, status) {
  return apiRequest(
    `/api/admin/complaints/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  );
}

// Geocode a location. Coordinates are optional.
export async function geocodeLocation(location) {
  const query = encodeURIComponent(location);
  return apiRequest(`/api/geocode?q=${query}`);
}
