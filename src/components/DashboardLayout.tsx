import React from "react";
import { useAuth } from "../components/AuthProvider";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Settings, CreditCard, LogOut, FileSignature } from "lucide-react";
import { logout } from "../lib/firebase";

export default function DashboardLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="animate-pulse text-blue-500">Loading...</div></div>;
  if (!user) return <Navigate to="/" />;

  const navItems = [
    { name: "Overview", path: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "My Resumes", path: "/dashboard/resumes", icon: <FileText className="w-5 h-5" /> },
    { name: "Cover Letters", path: "/dashboard/cover-letters", icon: <FileSignature className="w-5 h-5" /> },
    { name: "Billing", path: "/dashboard/billing", icon: <CreditCard className="w-5 h-5" /> },
    { name: "Settings", path: "/dashboard/settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen flex bg-[#050505] text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#0a0a0a] flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
              <FileText className="w-3 h-3 text-white" />
            </div>
            Major Resume
          </Link>
        </div>
        
        <div className="flex-1 py-6 px-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-blue-600/10 text-blue-400" : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4 px-2">
            <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} alt="Avatar" className="w-8 h-8 rounded-full border border-white/20" />
            <div className="flex flex-col">
              <span className="text-sm font-medium truncate w-32">{user.displayName}</span>
              <span className="text-xs text-slate-500 truncate w-32">{user.email}</span>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-white/10 bg-[#0a0a0a] flex items-center px-6 justify-between md:justify-end">
          <div className="md:hidden font-bold flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
              <FileText className="w-3 h-3 text-white" />
            </div>
            Major Resume
          </div>
          <div className="flex items-center gap-4">
             <Link to="/builder" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
               + New Resume
             </Link>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          {/* Subtle glow backrop */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none -z-10" />
          <Outlet />
        </div>
      </main>
    </div>
  );
}
