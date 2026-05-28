"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  Settings,
  LogOut,
  Mail,
  Package,
  Menu,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/blog", label: "Blog Posts", icon: FileText },
  { href: "/admin/services", label: "Services", icon: Package },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/work", label: "Portfolio", icon: Briefcase },
  { href: "/admin/contacts", label: "Contacts", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

type SidebarProps = {
  session: { user?: { email?: string } } | null;
  pathname: string | null;
  closeSidebar: () => void;
};

function Sidebar({ session, pathname, closeSidebar }: SidebarProps) {
  return (
    <aside
      className="admin-sidebar"
      style={{
        width: 260,
        minWidth: 260,
        borderRight: "1px solid rgba(201,168,76,0.1)",
        background: "#0a0908",
        padding: "32px 24px",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      <div style={{ marginBottom: 48, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid #c9a84c", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 16, height: 16, background: "#c9a84c", borderRadius: "50%" }} />
        </div>
        <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "0.2em", color: "#c9a84c" }}>SAKO</span>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeSidebar}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                borderRadius: 12,
                background: isActive ? "rgba(201,168,76,0.1)" : "transparent",
                color: isActive ? "#c9a84c" : "rgba(245,240,232,0.6)",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(201,168,76,0.05)"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <item.icon size={18} /> {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ borderTop: "1px solid rgba(201,168,76,0.1)", paddingTop: 16, marginTop: "auto" }}>
        {session?.user?.email && (
          <p style={{ fontSize: 12, color: "rgba(245,240,232,0.4)", marginBottom: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {session.user.email}
          </p>
        )}
        <button
          onClick={() => {
            closeSidebar();
            signOut({ callbackUrl: "/admin/login" });
          }}
          style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "none", border: "none", color: "rgba(245,240,232,0.6)", fontSize: 14, fontWeight: 500, cursor: "pointer", width: "100%", borderRadius: 12, transition: "all 0.2s" }}
          aria-label="Sign out"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mountedRef = useRef(false);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    mountedRef.current = true;
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  if (status === "loading" || !mountedRef.current) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#050505" }}>
        <div style={{ width: 32, height: 32, border: "2px solid #c9a84c", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!session) return null;

  const Sidebar = () => (
    <aside className="admin-sidebar" style={{
      width: 260,
      minWidth: 260,
      borderRight: "1px solid rgba(201,168,76,0.1)",
      background: "#0a0908",
      padding: "32px 24px",
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      position: "sticky",
      top: 0,
    }}>
      <div style={{ marginBottom: 48, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid #c9a84c", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 16, height: 16, background: "#c9a84c", borderRadius: "50%" }} />
        </div>
        <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "0.2em", color: "#c9a84c" }}>SAKO</span>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                borderRadius: 12,
                background: isActive ? "rgba(201,168,76,0.1)" : "transparent",
                color: isActive ? "#c9a84c" : "rgba(245,240,232,0.6)",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(201,168,76,0.05)"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <item.icon size={18} /> {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ borderTop: "1px solid rgba(201,168,76,0.1)", paddingTop: 16, marginTop: "auto" }}>
        {session.user?.email && (
          <p style={{ fontSize: 12, color: "rgba(245,240,232,0.4)", marginBottom: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {session.user.email}
          </p>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "none", border: "none", color: "rgba(245,240,232,0.6)", fontSize: 14, fontWeight: 500, cursor: "pointer", width: "100%", borderRadius: 12, transition: "all 0.2s" }}
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="admin-shell" style={{ display: "flex", minHeight: "100vh", background: "#050505", color: "#f5f0e8", fontFamily: "var(--font-outfit), sans-serif" }}>
      {/* Desktop sidebar - always visible on lg+ */}
      <div className="admin-sidebar-desktop">
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="admin-overlay"
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 39 }}
        />
      )}

      {/* Mobile drawer */}
      <div className="admin-sidebar-mobile" style={{
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 40,
        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
      }}>
        <Sidebar />
      </div>

      <main style={{ flex: 1, overflowY: "auto", minWidth: 0 }} className="admin-main">
        <div className="admin-mobile-header" style={{ display: "none", alignItems: "center", marginBottom: 24, padding: "16px 16px 0" }}>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ background: "none", border: "none", color: "#c9a84c", cursor: "pointer", padding: 4, marginRight: "auto" }}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.2em", color: "#c9a84c" }}>SAKO</span>
          <div style={{ width: 32, marginLeft: "auto" }} />
        </div>
        <div style={{ padding: "48px 64px" }} className="admin-content">
          {children}
        </div>
      </main>

      <style>{`
        @media (max-width: 1023px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-mobile-header { display: flex !important; }
          .admin-content { padding: 24px 16px !important; }
          .admin-overlay { display: block !important; }
        }
        @media (min-width: 1024px) {
          .admin-sidebar-desktop { display: flex !important; }
          .admin-sidebar-mobile { display: none !important; }
          .admin-overlay { display: none !important; }
          .admin-mobile-header { display: none !important; }
        }
      `}</style>
    </div>
  );
}
