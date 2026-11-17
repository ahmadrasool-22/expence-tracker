
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getComplaint, updateComplaint, deleteComplaint } from "@/lib/mock-api";

const categories = [
  "Electrical",
  "Furniture",
  "Plumbing",
  "Cleaning",
  "Other",
];

export default function EditComplaintPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    location_text: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [notEditable, setNotEditable] = useState(false);

  useEffect(() => {
    async function loadComplaint() {
      try {
        const result = await getComplaint(id);
        const complaint = result.data;

        if (complaint.status !== "Pending") {
          setNotEditable(true);
          return;
        }

        setForm({
          title: complaint.title || "",
          category: complaint.category || "",
          description: complaint.description || "",
          location_text: complaint.location_text || "",
        });
      } catch (err) {
        setError(err.message || "Unable to load complaint.");
      } finally {
        setLoading(false);
      }
    }

    if (id) loadComplaint();
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (
      !form.title.trim() ||
      !form.category ||
      !form.description.trim() ||
      !form.location_text.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    try {
      setSaving(true);

      await updateComplaint(id, {
        title: form.title.trim(),
        category: form.category,
        description: form.description.trim(),
        location_text: form.location_text.trim(),
      });

      router.push("/complaints");
    } catch (err) {
      setError(err.message || "Unable to update complaint.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this complaint?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      await deleteComplaint(id);
      router.push("/complaints");
    } catch (err) {
      setError(err.message || "Unable to delete complaint.");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-brand-light border-t-brand" />
          <p className="mt-4 text-sm text-muted">Loading complaint...</p>
        </div>
      </div>
    );
  }

  if (notEditable) {
    return (
      <div className="flex min-h-screen items-center justify-center p-5">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
          <div className="text-4xl">🔒</div>
          <h2 className="mt-4 text-xl font-bold">Editing not available</h2>
          <p className="mt-2 text-sm text-muted">
            Only complaints with Pending status can be edited.
          </p>
          <Link
            href="/complaints"
            className="mt-6 inline-block rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-hover"
          >
            Back to Complaints
          </Link>
        </div>
      </div>
    );
  }

  if (error && !form.title && !loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-5">
        <div className="max-w-md rounded-2xl border border-border bg-surface p-8 text-center">
          <h2 className="text-xl font-bold">Unable to open complaint</h2>
          <p className="mt-3 text-sm text-red-600">{error}</p>
          <Link href="/complaints" className="mt-5 inline-block text-sm font-semibold text-brand">
            Back to Complaints
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:flex">
      {/* Sidebar */}
      <aside className="flex w-full flex-col bg-[var(--sidebar)] text-white md:fixed md:inset-y-0 md:w-64">
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-xl font-bold">
            C
          </div>
          <div>
            <h1 className="text-lg font-bold">CampusCare</h1>
            <p className="text-xs text-[var(--sidebar-text)]">Maintenance Portal</p>
          </div>
        </div>

        <div className="px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--sidebar-text)]">
            Workspace
          </p>
          <nav className="space-y-2">
            <Link href="/complaints" className="flex items-center gap-3 rounded-xl bg-[var(--sidebar-active)] px-4 py-3 text-sm text-white">
              ▤ My Complaints
            </Link>
            <Link href="/complaints/new" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[var(--sidebar-text)] hover:bg-white/10 hover:text-white">
              ＋ Submit Complaint
            </Link>
            <Link href="/admin" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[var(--sidebar-text)] hover:bg-white/10 hover:text-white">
              ▦ Admin Dashboard
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main */}
      <main className="min-w-0 flex-1 p-5 md:ml-64 md:p-8 lg:p-10">
        <div className="mx-auto max-w-4xl">
          <Link href="/complaints" className="text-sm font-medium text-muted hover:text-brand">
            ← Back to Complaints
          </Link>

          <div className="mb-8 mt-5">
            <p className="text-sm font-medium text-brand">Student Workspace</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Edit Complaint</h2>
            <p className="mt-2 text-sm text-muted">
              Update the information about your maintenance request.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8">
              <div className="mb-6 border-b border-border pb-5">
                <h3 className="font-bold">Complaint Details</h3>
                <p className="mt-1 text-sm text-muted">
                  Update the fields you need to change.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold">Complaint Title *</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    maxLength={120}
                    required
                    className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">Category *</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">Description *</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    maxLength={2000}
                    required
                    className="w-full resize-y rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-indigo-100"
                  />
                  <p className="mt-2 text-right text-xs text-muted">
                    {form.description.length}/2000 characters
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">Campus Location *</label>
                  <input
                    name="location_text"
                    value={form.location_text}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>
            </section>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting || saving}
                className="rounded-xl border border-red-200 px-6 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Complaint"}
              </button>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/complaints"
                  className="rounded-xl border border-border bg-white px-6 py-3 text-center text-sm font-semibold text-muted hover:bg-background"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={saving || deleting}
                  className="rounded-xl bg-brand px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes →"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
