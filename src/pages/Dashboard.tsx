import { Users, AlertTriangle, Pill, Calendar, Brain, MapPin, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import DashboardHeader from "@/components/DashboardHeader";
import StatCard from "@/components/StatCard";
import AICompanionPanel from "@/components/AICompanionPanel";
import InsightCard from "@/components/InsightCard";
import NearestHospitals from "@/components/NearestHospitals";
import { usePatientData } from "@/context/PatientDataContext";
import { useNavigate } from "react-router-dom";

const riskConfig = {
  high: { badge: "badge-risk-high", label: "High" },
  medium: { badge: "badge-risk-medium", label: "Medium" },
  low: { badge: "badge-risk-low", label: "Low" },
};

const tileColors = [
  "bg-card",
  "bg-muted/40",
];

export default function Dashboard() {
  const { patients } = usePatientData();
  const navigate = useNavigate();
  const allInsights = patients.flatMap((p) => p.insights).sort((a, b) => b.date.localeCompare(a.date));
  const criticalInsights = allInsights.filter((i) => i.type === "critical" || i.type === "warning").slice(0, 4);
  const highRisk = patients.filter(p => p.riskLevel === "high").length;
  const medAlerts = patients.reduce((acc, p) => acc + p.medications.filter(m => m.conflicts?.length).length, 0);

  const sortedPatients = [...patients].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.riskLevel] - order[b.riskLevel];
  });

  const statCards = [
    { icon: Users, label: "Total Patients", value: patients.length, change: `${patients.length} active`, changeType: "positive" as const, color: "sage" as const },
    { icon: AlertTriangle, label: "High Risk", value: highRisk, change: `${Math.round((highRisk / patients.length) * 100)}%`, changeType: "negative" as const, color: "coral" as const },
    { icon: Pill, label: "Med Conflicts", value: medAlerts, color: "amber" as const },
    { icon: Calendar, label: "Appointments", value: patients.length, color: "teal" as const },
    { icon: Brain, label: "AI Insights", value: allInsights.length, change: "Active", changeType: "positive" as const, color: "lavender" as const },
  ];

  return (
    <div>
      <DashboardHeader title="Dashboard" subtitle="Geriatric Care Management Overview" />

      <div className="flex gap-6">
        {/* Main content area */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* AI Companion — full-width top */}
          <AICompanionPanel />

          {/* Priority Patients — landscape tiles */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl text-foreground">Priority Patients</h2>
              <span className="text-xs text-muted-foreground">{sortedPatients.length} total</span>
            </div>
            <div className="space-y-2.5">
              {sortedPatients.slice(0, 10).map((p, i) => {
                const risk = riskConfig[p.riskLevel];
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => navigate(`/patient/${p.id}`)}
                    className={`${tileColors[i % 2]} rounded-xl border border-border/60 p-4 cursor-pointer hover:shadow-md hover:border-primary/20 transition-all duration-200 group`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-accent-foreground flex-shrink-0">
                        {p.avatar}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 flex items-center gap-6">
                        <div className="min-w-[140px]">
                          <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">{p.name}</h3>
                          <p className="text-[10px] text-muted-foreground">{p.age}y · {p.gender}</p>
                        </div>

                        {/* Conditions */}
                        <div className="hidden md:flex flex-wrap gap-1 flex-1 min-w-0">
                          {p.conditions.slice(0, 3).map((c) => (
                            <span key={c} className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-medium whitespace-nowrap">{c}</span>
                          ))}
                          {p.conditions.length > 3 && <span className="text-[10px] text-muted-foreground">+{p.conditions.length - 3}</span>}
                        </div>

                        {/* Location */}
                        {p.location && (
                          <span className="hidden lg:flex items-center gap-1 text-[10px] text-muted-foreground whitespace-nowrap">
                            <MapPin className="w-3 h-3" />{p.location}
                          </span>
                        )}

                        {/* Risk badge */}
                        <span className={`${risk.badge} whitespace-nowrap flex-shrink-0`}>{risk.label}</span>
                      </div>

                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Nearest Hospitals */}
          <NearestHospitals city={sortedPatients[0]?.location} />
        </div>

        {/* Right sidebar — stat cards + alerts */}
        <div className="hidden xl:block w-64 flex-shrink-0">
          <div className="sticky top-8 space-y-4">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-1">Overview</p>
            {statCards.map((s, i) => (
              <StatCard key={s.label} icon={s.icon} label={s.label} value={s.value} change={s.change} changeType={s.changeType} color={s.color} delay={i * 0.05} />
            ))}

            <div className="pt-2 space-y-3">
              <h3 className="font-display text-sm text-foreground">Recent Alerts</h3>
              {criticalInsights.slice(0, 3).map((insight, i) => (
                <InsightCard key={insight.id} insight={insight} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
