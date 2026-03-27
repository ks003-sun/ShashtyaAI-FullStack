import { NavLink, useLocation } from "react-router-dom";
import { usePatientData } from "@/context/PatientDataContext";
import {
  LayoutDashboard,
  Users,
  Pill,
  Brain,
  MapPin,
  Network,
  Settings,
  Bell,
  Calendar,
} from "lucide-react";
import ShastyaLogo from "@/components/ShastyaLogo";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Patients", path: "/patients" },
  { icon: MapPin, label: "GPS & Follow-ups", path: "/tracking" },
  { icon: Pill, label: "Medications", path: "/medications" },
  { icon: Brain, label: "AI Insights", path: "/insights" },
  { icon: Network, label: "Family Health", path: "/family" },
];

const bottomItems = [
  { icon: Bell, label: "Alerts", path: "/alerts" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function AppSidebar() {
  const location = useLocation();
  const { sosEvents } = usePatientData();
  const unacknowledgedCount = sosEvents.filter((e) => !e.acknowledged).length;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <ShastyaLogo height={48} />
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 px-3">Main</p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {item.label === "AI Insights" && (
                <span className="ml-auto w-2 h-2 rounded-full bg-coral animate-pulse-gentle" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-sidebar-border space-y-1">
        {bottomItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all"
          >
            <item.icon className="w-4 h-4" />
            {item.label}
            {item.label === "Alerts" && unacknowledgedCount > 0 && (
              <span className="ml-auto px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold animate-pulse min-w-[18px] text-center">
                {unacknowledgedCount}
              </span>
            )}
          </NavLink>
        ))}
        {/* Doctor Info */}
        <div className="mt-4 p-3 rounded-lg bg-sidebar-accent/50">
          <p className="text-xs font-medium text-sidebar-foreground">Dr. Rithika Singh</p>
          <p className="text-[10px] text-muted-foreground">Geriatric Medicine</p>
        </div>
      </div>
    </aside>
  );
}
