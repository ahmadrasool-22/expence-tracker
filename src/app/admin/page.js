
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getAllComplaints,
  updateComplaintStatus,
} from "@/lib/mock-api";

const statuses = ["All", "Pending", "In Progress", "Resolved"];

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-amber-50 text-amber-700",
    "In Progress": "bg-blue-50 text-blue-700",
    Resolved: "bg-green-50 text-green-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  async function loadComplaints() {
    try {
      setError("");

      const response = await getAllComplaints();

      // Accept either a direct array or an API response object.
      const data = Array.isArray(response)
        ? response
        : response?.data;

      if (!Array.isArray(data)) {
        throw new Error("Complaints API did not return an array.");
      }

      setComplaints(data);
    } catch (err) {
      setError(err.message || "Unable to load complaints.");
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComplaints();
  }, []);

  const statistics = useMemo(
    () => [
      {
        label: "Total Complaints",
        value: complaints.length,
        color: "text-foreground",
        icon: "📋",
      },
      {
        label: "Pending",
        value: complaints.filter((item) => item.status === "Pending").length,
        color: "text-amber-600",
        icon: "⏳",
      },
      {
        label: "In Progress",
        value: complaints.filter((item) => item.status === "In Progress").length,
        color: "text-blue-600",
        icon: "🔧",
      },
      {
        label: "Resolved",
        value: complaints.filter((item) => item.status === "Resolved").length,
        color: "text-green-600",
        icon: "✓",
      },
    ],
    [complaints]
  );

  const filteredComplaints =
    activeFilter === "All"
      ? complaints
      : complaints.filter((item) => item.status === activeFilter);

  async function handleStatusChange(id, newStatus) {
    try {
      setUpdatingId(id);
      setError("");

      await updateComplaintStatus(id, newStatus);
      await loadComplaints();
    } catch (err) {
      setError(err.message || "Unable to update complaint status.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col bg-[#171b35] text-white md:flex">
          <div className="border-b border-white/10 px-6 py-6">
            <h1 className="text-2xl font-bold tracking-tight">
              Campus<span className="text-indigo-400">Care</span>
            </h1>
            <p className="mt-1 text-xs text-[#a8aec7]">
              Maintenance Management
            </p>
          </div>

          <div className="px-4 py-6">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-[#777f9f]">
              Workspace
            </p>

            <nav className="space-y-2">
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-lg bg-[#343b70] px-3 py-3 text-sm font-medium text-white"
              >
                <span>▦</span>
                Admin Dashboard
              </Link>

              <Link
                href="/complaints"
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-[#a8aec7] transition hover:bg-white/10 hover:text-white"
              >
                <span>☷</span>
                My Complaints
              </Link>

              <Link
                href="/complaints/new"
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-[#a8aec7] transition hover:bg-white/10 hover:text-white"
              >
                <span>＋</span>
                Submit Complaint
              </Link>
            </nav>
          </div>

          <div className="mt-auto border-t border-white/10 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 font-semibold">
                A
              </div>
              <div>
                <p className="text-sm font-semibold">Admin User</p>
                <p className="text-xs text-[#a8aec7]">Administrator</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface px-5 py-5 sm:px-8">
            <div>
              <h2 className="text-xl font-bold">Admin Dashboard</h2>
              <p className="mt-1 text-sm text-muted">
                Manage and monitor campus maintenance complaints.
              </p>
            </div>

            <Link
              href="/complaints"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-background"
            >
              View Student Dashboard
            </Link>
          </header>

          <div className="mx-auto max-w-7xl space-y-7 p-5 sm:p-8">
            {/* Statistics */}
            <section>
              <div className="mb-4">
                <h3 className="text-lg font-bold">Overview</h3>
                <p className="mt-1 text-sm text-muted">
                  Current complaint statistics
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statistics.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-border bg-surface p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted">
                        {stat.label}
                      </p>
                      <span className="text-xl">{stat.icon}</span>
                    </div>

                    <p className={`mt-4 text-3xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Complaints table */}
            <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
              <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-bold">All Complaints</h3>
                  <p className="mt-1 text-sm text-muted">
                    Review complaints and update their status.
                  </p>
                </div>

                <button
                  onClick={loadComplaints}
                  className="w-fit rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-background"
                >
                  ↻ Refresh
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 border-b border-border px-5 py-4">
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => setActiveFilter(status)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      activeFilter === status
                        ? "bg-brand text-white"
                        : "bg-background text-muted hover:bg-brand-light hover:text-brand"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {error && (
                <div className="m-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="p-12 text-center text-sm text-muted">
                  Loading complaints...
                </div>
              ) : filteredComplaints.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-3xl">📭</p>
                  <p className="mt-3 font-semibold">No complaints found</p>
                  <p className="mt-1 text-sm text-muted">
                    There are no complaints in this category.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px] text-left text-sm">
                    <thead className="bg-background text-xs uppercase tracking-wide text-muted">
                      <tr>
                        <th className="px-5 py-4 font-semibold">Complaint</th>
                        <th className="px-5 py-4 font-semibold">Category</th>
                        <th className="px-5 py-4 font-semibold">Location</th>
                        <th className="px-5 py-4 font-semibold">Submitted</th>
                        <th className="px-5 py-4 font-semibold">Status</th>
                        <th className="px-5 py-4 font-semibold">Update Status</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                      {filteredComplaints.map((complaint) => (
                        <tr
                          key={complaint.id}
                          className="transition hover:bg-background/70"
                        >
                          <td className="px-5 py-4">
                            <p className="max-w-[230px] truncate font-semibold">
                              {complaint.title}
                            </p>
                            <p className="mt-1 text-xs text-muted">
                              ID: {complaint.id}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-muted">
                            {complaint.category}
                          </td>

                          <td className="px-5 py-4 text-muted">
                            {complaint.location_text}
                          </td>

                          <td className="px-5 py-4 text-muted">
                            {formatDate(complaint.created_at)}
                          </td>

                          <td className="px-5 py-4">
                            <StatusBadge status={complaint.status} />
                          </td>

                          <td className="px-5 py-4">
                            <select
                              value={complaint.status}
                              disabled={updatingId === complaint.id}
                              onChange={(event) =>
                                handleStatusChange(
                                  complaint.id,
                                  event.target.value
                                )
                              }
                              className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium outline-none focus:border-brand disabled:opacity-50"
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Resolved">Resolved</option>
                            </select>

                            {updatingId === complaint.id && (
                              <p className="mt-1 text-xs text-muted">
                                Updating...
                              </p>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="border-t border-border px-5 py-4 text-xs text-muted">
                Showing {filteredComplaints.length} of {complaints.length} complaints
              </div>
            </section>

            <p className="text-center text-xs text-muted">
              CampusCare · Campus Maintenance Management System
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
