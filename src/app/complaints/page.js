
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getComplaints, deleteComplaint } from "@/lib/mock-api";

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-amber-50 text-amber-700",
    "In Progress": "bg-blue-50 text-blue-700",
    Resolved: "bg-emerald-50 text-emerald-700",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  async function loadComplaints() {
    try {
      setLoading(true);
      setError("");

      const result = await getComplaints();
      setComplaints(result.data || []);
    } catch (err) {
      setError(err.message || "Unable to load complaints.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComplaints();
  }, []);

  async function handleDelete(id) {
    const confirmed = window.confirm("Are you sure you want to delete this complaint?");
    if (!confirmed) return;

    try {
      await deleteComplaint(id);
      await loadComplaints();
    } catch (err) {
      setError(err.message || "Unable to delete complaint.");
    }
  }

  const filteredComplaints =
    filter === "All"
      ? complaints
      : complaints.filter((item) => item.status === filter);

  const stats = [
    {
      label: "Total Complaints",
      value: complaints.length,
      icon: "▤",
      color: "text-brand",
      bg: "bg-brand-light",
    },
    {
      label: "Pending",
      value: complaints.filter((item) => item.status === "Pending").length,
      icon: "◷",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "In Progress",
      value: complaints.filter((item) => item.status === "In Progress").length,
      icon: "↻",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Resolved",
      value: complaints.filter((item) => item.status === "Resolved").length,
      icon: "✓",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="min-h-screen md:flex">
      <aside className="flex w-full flex-col bg-[var(--sidebar)] text-white md:fixed md:inset-y-0 md:w-64">
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-xl font-bold">C</div>
          <div>
            <h1 className="text-lg font-bold">CampusCare</h1>
            <p className="text-xs text-[var(--sidebar-text)]">Maintenance Portal</p>
          </div>
        </div>

        <div className="px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--sidebar-text)]">Workspace</p>
          <nav className="space-y-2">
            <Link href="/complaints" className="flex items-center gap-3 rounded-xl bg-[var(--sidebar-active)] px-4 py-3 text-sm font-medium text-white">
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

        <div className="mt-auto border-t border-white/10 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-400 font-bold">JD</div>
            <div>
              <p className="text-sm font-semibold">John Doe</p>
              <p className="text-xs text-[var(--sidebar-text)]">Student Account</p>
            </div>
          </div>
          <button className="mt-5 w-full rounded-lg px-3 py-2 text-left text-sm text-[var(--sidebar-text)] hover:bg-white/10 hover:text-white">
            ↪ Sign out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-5 md:ml-64 md:p-8 lg:p-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted">Student Workspace / Overview</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">My Complaints</h2>
            <p className="mt-2 text-sm text-muted">Track and manage your campus maintenance requests.</p>
          </div>

          <Link href="/complaints/new" className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-brand-hover">
            + New Complaint
          </Link>
        </header>

        {/* Statistics */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted">{stat.label}</p>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${stat.bg} ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              <h3 className="mt-4 text-3xl font-bold">{stat.value}</h3>
              <p className="mt-1 text-xs text-muted">Your complaint records</p>
            </div>
          ))}
        </section>

        {/* Complaint list */}
        <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
            <div>
              <h3 className="font-bold">Your Complaints</h3>
              <p className="mt-1 text-xs text-muted">Manage and track your requests</p>
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border border-border bg-white px-4 py-2 text-sm outline-none focus:border-brand"
            >
              <option value="All">All Complaints</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {loading ? (
            <div className="p-16 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-brand-light border-t-brand" />
              <p className="mt-4 text-sm text-muted">Loading complaints...</p>
            </div>
          ) : error ? (
            <div className="p-10 text-center">
              <p className="text-sm text-red-600">{error}</p>
              <button onClick={loadComplaints} className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm text-white">
                Try Again
              </button>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="p-14 text-center">
              <div className="text-4xl">📋</div>
              <h3 className="mt-4 font-bold">No complaints found</h3>
              <p className="mt-2 text-sm text-muted">Submit a new complaint or select another filter.</p>
              <Link href="/complaints/new" className="mt-5 inline-block rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white">
                Submit Complaint
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead className="bg-background text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-5 py-4">Complaint</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Location</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredComplaints.map((item) => (
                    <tr key={item.id} className="transition hover:bg-background/70">
                      <td className="px-5 py-4">
                        <p className="font-semibold">{item.title}</p>
                        <p className="mt-1 text-xs text-muted">{item.id}</p>
                      </td>
                      <td className="px-5 py-4 text-muted">{item.category}</td>
                      <td className="px-5 py-4 text-muted">{item.location_text}</td>
                      <td className="px-5 py-4 text-muted">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4"><StatusBadge status={item.status} /></td>
                      <td className="px-5 py-4">
                        {item.status === "Pending" ? (
                          <div className="flex items-center gap-3">
                            <Link href={`/complaints/${item.id}/edit`} className="font-semibold text-brand hover:underline">
                              Edit
                            </Link>
                            <button onClick={() => handleDelete(item.id)} className="font-semibold text-red-600 hover:underline">
                              Delete
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted">No actions</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && filteredComplaints.length > 0 && (
            <div className="border-t border-border px-5 py-4 text-xs text-muted">
              Showing {filteredComplaints.length} complaints
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
