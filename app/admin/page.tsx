"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { get, orderByChild, query, ref } from "firebase/database";
import { auth, db } from "../../lib/firebase";

type Lead = {
  id: string;
  name: string;
  phone: string;
  business: string;
  need: string;
  source?: string;
  createdAt?: number;
};

export default function AdminPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  // =========================
  // AUTH
  // =========================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/admin/login");
        return;
      }

      setUser(currentUser);
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [router]);

  // =========================
  // LOAD FIREBASE LEADS
  // =========================

  useEffect(() => {
    if (!user) return;

    async function fetchLeads() {
      try {
        setLoading(true);
        setError("");

        const leadsQuery = query(
          ref(db, "leads"),
          orderByChild("createdAt")
        );

        const snapshot = await get(leadsQuery);

        if (!snapshot.exists()) {
          setLeads([]);
          return;
        }

        const data = snapshot.val();

        const loadedLeads: Lead[] = Object.entries(data).map(
          ([id, value]) => {
            const lead = value as Omit<Lead, "id">;

            return {
              id,
              ...lead,
            };
          }
        );

        loadedLeads.sort(
          (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
        );

        setLeads(loadedLeads);
      } catch (err) {
        console.error("Firebase leads error:", err);

        const firebaseError = err as {
          code?: string;
          message?: string;
        };

        setError(
          firebaseError.code
            ? firebaseError.code
            : "Could not load leads."
        );

        console.error("Firebase error code:", firebaseError.code);
        console.error(
          "Firebase error message:",
          firebaseError.message
        );
      } finally {
        setLoading(false);
      }
    }

    fetchLeads();
  }, [user]);

  // =========================
  // LOGOUT
  // =========================

  async function handleLogout() {
    try {
      await signOut(auth);
      router.replace("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  // =========================
  // SEARCH
  // =========================

  const filteredLeads = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return leads;
    }

    return leads.filter((lead) => {
      return (
        lead.name?.toLowerCase().includes(searchText) ||
        lead.phone?.toLowerCase().includes(searchText) ||
        lead.business?.toLowerCase().includes(searchText) ||
        lead.need?.toLowerCase().includes(searchText)
      );
    });
  }, [leads, search]);

  // =========================
  // TODAY'S LEADS
  // =========================

  const todayLeads = leads.filter((lead) => {
    if (!lead.createdAt) return false;

    const leadDate = new Date(lead.createdAt);
    const today = new Date();

    return (
      leadDate.getDate() === today.getDate() &&
      leadDate.getMonth() === today.getMonth() &&
      leadDate.getFullYear() === today.getFullYear()
    );
  });

  // =========================
  // UNIQUE BUSINESSES
  // =========================

  const uniqueBusinesses = new Set(
    leads
      .map((lead) => lead.business?.trim().toLowerCase())
      .filter(Boolean)
  ).size;

  // =========================
  // DATE FORMAT
  // =========================

  function formatDate(timestamp?: number) {
    if (!timestamp) {
      return "Date unavailable";
    }

    return new Date(timestamp).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // =========================
  // AUTH LOADING
  // =========================

  if (checkingAuth) {
    return (
      <main className="admin-dashboard-loading">
        <div className="admin-dashboard-spinner" />
        <p>Checking admin session...</p>
      </main>
    );
  }

  // =========================
  // DASHBOARD
  // =========================

  return (
    <main className="admin-dashboard">

      {/* ================= SIDEBAR ================= */}

      <aside className="admin-sidebar">

        <div>

          {/* BRAND */}

          <div className="dashboard-brand">

            <div className="dashboard-logo">
              LS
            </div>

            <div>
              <div className="dashboard-brand-name">
                LeadStudio
              </div>

              <div className="dashboard-brand-subtitle">
                Admin Panel
              </div>
            </div>

          </div>

          {/* NAVIGATION */}

          <nav className="dashboard-nav">

            <div className="dashboard-nav-title">
              MANAGEMENT
            </div>

            <div className="dashboard-nav-item active">

              <span className="dashboard-nav-icon">
                ▦
              </span>

              <span>
                Leads
              </span>

              <span className="dashboard-nav-count">
                {leads.length}
              </span>

            </div>

          </nav>

        </div>

        {/* SIDEBAR BOTTOM */}

        <div className="dashboard-sidebar-bottom">

          <div className="dashboard-admin-user">

            <div className="dashboard-avatar">
              {user?.email?.charAt(0).toUpperCase() || "A"}
            </div>

            <div className="dashboard-admin-info">

              <strong>
                Admin
              </strong>

              <span>
                {user?.email}
              </span>

            </div>

          </div>

          <button
            className="dashboard-logout"
            onClick={handleLogout}
          >
            <span>
              ↪
            </span>

            Logout
          </button>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <section className="admin-dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>

            <div className="dashboard-page-label">
              LEAD MANAGEMENT
            </div>

            <h1>
              Website Leads
            </h1>

            <p>
              Manage and follow up with your website inquiries.
            </p>

          </div>

          <div className="dashboard-live">

            <span />

            Live

          </div>

        </header>

        {/* ================= STATS ================= */}

        <section className="dashboard-stats">

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-top">

              <span>
                Total Leads
              </span>

              <div className="dashboard-stat-icon">
                ◎
              </div>

            </div>

            <strong>
              {leads.length}
            </strong>

            <p>
              All submitted requests
            </p>

          </div>

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-top">

              <span>
                Today
              </span>

              <div className="dashboard-stat-icon">
                ◷
              </div>

            </div>

            <strong>
              {todayLeads.length}
            </strong>

            <p>
              New leads today
            </p>

          </div>

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-top">

              <span>
                Businesses
              </span>

              <div className="dashboard-stat-icon">
                ◇
              </div>

            </div>

            <strong>
              {uniqueBusinesses}
            </strong>

            <p>
              Unique businesses
            </p>

          </div>

        </section>

        {/* ================= LEADS ================= */}

        <section className="dashboard-leads-section">

          <div className="dashboard-leads-header">

            <div>

              <h2>
                Recent Leads
              </h2>

              <p>
                {filteredLeads.length}{" "}
                {filteredLeads.length === 1
                  ? "lead"
                  : "leads"}{" "}
                shown
              </p>

            </div>

            <div className="dashboard-search">

              <span>
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search leads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>

          </div>

          {/* ERROR */}

          {error && (

            <div className="dashboard-error">

              <div className="dashboard-error-icon">
                !
              </div>

              <div>

                <strong>
                  Could not load leads
                </strong>

                <p>
                  {error}
                </p>

                <small>
                  Check your Firebase Realtime Database rules
                  and admin email.
                </small>

              </div>

            </div>

          )}

          {/* LOADING */}

          {loading ? (

            <div className="dashboard-empty">

              <div className="admin-dashboard-spinner" />

              <h3>
                Loading leads...
              </h3>

              <p>
                Getting your latest requests from Firebase.
              </p>

            </div>

          ) : filteredLeads.length === 0 ? (

            /* EMPTY */

            <div className="dashboard-empty">

              <div className="dashboard-empty-icon">
                □
              </div>

              <h3>
                {search
                  ? "No matching leads"
                  : "No leads yet"}
              </h3>

              <p>
                {search
                  ? "Try another search term."
                  : "New website requests will appear here."}
              </p>

            </div>

          ) : (

            /* LEAD LIST */

            <div className="dashboard-leads-list">

              {filteredLeads.map((lead) => (

                <article
                  key={lead.id}
                  className="dashboard-lead-card"
                >

                  {/* LEAD HEADER */}

                  <div className="dashboard-lead-main">

                    <div className="dashboard-lead-avatar">
                      {lead.name?.charAt(0).toUpperCase() || "?"}
                    </div>

                    <div className="dashboard-lead-content">

                      <div className="dashboard-lead-title-row">

                        <h3>
                          {lead.name || "Unnamed Lead"}
                        </h3>

                        <span className="dashboard-new-badge">
                          New
                        </span>

                      </div>

                      <div className="dashboard-lead-business">
                        {lead.business || "Business not provided"}
                      </div>

                      <div className="dashboard-lead-meta">

                        <span>
                          ☎ {lead.phone || "No phone"}
                        </span>

                        <span>
                          ◷ {formatDate(lead.createdAt)}
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* REQUIREMENT */}

                  <div className="dashboard-lead-requirement">

                    <div className="dashboard-requirement-label">
                      REQUIREMENT
                    </div>

                    <p>
                      {lead.need ||
                        "No requirement provided."}
                    </p>

                  </div>

                  {/* ACTIONS */}

                  <div className="dashboard-lead-actions">

                    {lead.phone && (

                      <a
                        href={`tel:${lead.phone}`}
                        className="dashboard-call-button"
                      >
                        Call Lead
                      </a>

                    )}

                    <div className="dashboard-source">
                      {lead.source || "lead-page"}
                    </div>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </section>

    </main>
  );
}