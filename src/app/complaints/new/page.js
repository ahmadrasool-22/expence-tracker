
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createComplaint } from "@/lib/mock-api";

const categories = [
  "Electrical",
  "Furniture",
  "Plumbing",
  "Cleaning",
  "Other",
];

export default function NewComplaintPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please select a JPG, PNG, or WebP image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    if (preview) URL.revokeObjectURL(preview);

    setError("");
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  }

  function removePhoto() {
    if (preview) URL.revokeObjectURL(preview);

    setPhoto(null);
    setPreview("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (
      !form.title.trim() ||
      !form.category ||
      !form.description.trim() ||
      !form.location.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    try {
      setSubmitting(true);

      await createComplaint({
        title: form.title.trim(),
        category: form.category,
        description: form.description.trim(),
        location_text: form.location.trim(),
        photo_url: null,
      });

      router.push("/complaints");
    } catch (err) {
      setError(err.message || "Failed to submit complaint.");
    } finally {
      setSubmitting(false);
    }
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
            <p className="text-xs text-[var(--sidebar-text)]">
              Maintenance Portal
            </p>
          </div>
        </div>

        <div className="px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--sidebar-text)]">
            Workspace
          </p>

          <nav className="space-y-2">
            <Link
              href="/complaints"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[var(--sidebar-text)] hover:bg-white/10 hover:text-white"
            >
              ▤ My Complaints
            </Link>

            <Link
              href="/complaints/new"
              className="flex items-center gap-3 rounded-xl bg-[var(--sidebar-active)] px-4 py-3 text-sm font-medium text-white"
            >
              ＋ Submit Complaint
            </Link>

            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[var(--sidebar-text)] hover:bg-white/10 hover:text-white"
            >
              ▦ Admin Dashboard
            </Link>
          </nav>
        </div>

        <div className="mt-auto border-t border-white/10 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-400 font-bold">
              JD
            </div>
            <div>
              <p className="text-sm font-semibold">John Doe</p>
              <p className="text-xs text-[var(--sidebar-text)]">
                Student Account
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-w-0 flex-1 p-5 md:ml-64 md:p-8 lg:p-10">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/complaints"
            className="text-sm font-medium text-muted hover:text-brand"
          >
            ← Back to Complaints
          </Link>

          <div className="mb-8 mt-5">
            <p className="text-sm font-medium text-brand">
              Student Workspace
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Submit a Complaint
            </h2>
            <p className="mt-2 text-sm text-muted">
              Report a maintenance issue and help us improve your campus.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Complaint details */}
            <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8">
              <div className="mb-6 border-b border-border pb-5">
                <h3 className="font-bold">Complaint Details</h3>
                <p className="mt-1 text-sm text-muted">
                  Provide information about the issue.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Complaint Title <span className="text-red-500">*</span>
                  </label>

                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    maxLength={120}
                    required
                    placeholder="e.g. Broken lights in Computer Lab"
                    className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-brand focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Category <span className="text-red-500">*</span>
                  </label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="">Select complaint category</option>

                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Description <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    maxLength={2000}
                    required
                    placeholder="Describe the problem in detail."
                    className="w-full resize-y rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-brand focus:ring-4 focus:ring-indigo-100"
                  />

                  <p className="mt-2 text-right text-xs text-muted">
                    {form.description.length}/2000 characters
                  </p>
                </div>
              </div>
            </section>

            {/* Location */}
            <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8">
              <div className="mb-6 border-b border-border pb-5">
                <h3 className="font-bold">Complaint Location</h3>
                <p className="mt-1 text-sm text-muted">
                  Where is this issue located?
                </p>
              </div>

              <label className="mb-2 block text-sm font-semibold">
                Campus Location <span className="text-red-500">*</span>
              </label>

              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                placeholder="e.g. Block A, Room 204, Computer Lab"
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-brand focus:ring-4 focus:ring-indigo-100"
              />

              <p className="mt-2 text-xs text-muted">
                Enter a building, block, floor, or room number.
              </p>
            </section>

            {/* Photo upload */}
            <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8">
              <div className="mb-6 border-b border-border pb-5">
                <h3 className="font-bold">Attach a Photo</h3>
                <p className="mt-1 text-sm text-muted">
                  Help the maintenance team understand the problem.
                </p>
              </div>

              {preview ? (
                <div className="overflow-hidden rounded-xl border border-border">
                  <img
                    src={preview}
                    alt="Complaint preview"
                    className="max-h-72 w-full bg-background object-contain"
                  />

                  <div className="flex items-center justify-between p-3">
                    <p className="max-w-[75%] truncate text-sm text-muted">
                      {photo?.name}
                    </p>

                    <button
                      type="button"
                      onClick={removePhoto}
                      className="text-sm font-semibold text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-background px-5 py-10 text-center transition hover:border-brand hover:bg-brand-light/40">
                  <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-light text-2xl text-brand">
                    ↑
                  </span>

                  <span className="text-sm font-semibold">
                    Click to upload a photo
                  </span>

                  <span className="mt-2 text-xs text-muted">
                    JPG, PNG or WebP · Maximum 5 MB
                  </span>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhoto}
                    className="hidden"
                  />
                </label>
              )}

              <p className="mt-3 text-xs text-muted">
                Photo attachment is optional. Actual storage upload will be
                connected during backend integration.
              </p>
            </section>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Form actions */}
            <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
              <Link
                href="/complaints"
                className="rounded-xl border border-border bg-white px-6 py-3 text-center text-sm font-semibold text-muted hover:bg-background"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-brand px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Complaint →"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
