import { Users, AlertTriangle, Pill, Calendar, Brain, MapPin, ChevronRight, Sparkles, Heart } from "lucide-react";
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
    { icon: Users, label: "Total Patients", value: patients.length, change: `${patients.length} active`, changeType: "positive" as const, color: "lavender" as const },
    { icon: AlertTriangle, label: "High Risk", value: highRisk, change: `${Math.round((highRisk / patients.length) * 100)}%`, changeType: "negative" as const, color: "coral" as const },
    { icon: Pill, label: "Med Conflicts", value: medAlerts, color: "amber" as const },
    { icon: Calendar, label: "Appointments", value: patients.length, color: "teal" as const },
    { icon: Brain, label: "AI Insights", value: allInsights.length, change: "Active", changeType: "positive" as const, color: "sage" as const },
  ];

  return (
    <div>
      <DashboardHeader title="Dashboard" subtitle="Intelligent Care Management Overview" />

      {/* Stat cards row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {statCards.map((s, i) => (
          <StatCard key={s.label} icon={s.icon} label={s.label} value={s.value} change={s.change} changeType={s.changeType} color={s.color} delay={i * 0.05} />
        ))}
      </div>

      {/* AI Companion */}
      <div className="mb-6">
        <AICompanionPanel />
      </div>

      {/* Two-column balanced grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Priority Patients */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-foreground">Priority Patients</h2>
            <span className="text-[11px] text-muted-foreground font-medium">{sortedPatients.length} total</span>
          </div>
          <div className="space-y-2">
            {sortedPatients.slice(0, 8).map((p, i) => {
              const risk = riskConfig[p.riskLevel];
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => navigate(`/patient/${p.id}`)}
                  className="glass-card p-3 cursor-pointer hover:glow-primary hover:border-primary/30 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                      {p.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors truncate">{p.name}</h3>
                      <p className="text-[10px] text-muted-foreground">{p.age}y · {p.gender}</p>
                    </div>
                    <div className="hidden md:flex flex-wrap gap-1 max-w-[180px]">
                      {p.conditions.slice(0, 2).map((c) => (
                        <span key={c} className="px-1.5 py-0.5 rounded bg-secondary/10 text-secondary text-[10px] font-medium whitespace-nowrap">{c}</span>
                      ))}
                    </div>
                    <span className={`${risk.badge} whitespace-nowrap flex-shrink-0`}>{risk.label}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Nearest Hospitals */}
          <NearestHospitals city={sortedPatients[0]?.location} />
        </div>

        {/* Right: Alerts + Recent Insights */}
        <div className="space-y-4">
          {/* Recent Alerts */}
          <div>
            <h2 className="font-display text-lg text-foreground mb-3">Recent Alerts</h2>
            <div className="space-y-2">
              {criticalInsights.slice(0, 4).map((insight, i) => (
                <InsightCard key={insight.id} insight={insight} index={i} />
              ))}
            </div>
          </div>

          {/* Family Health summary */}
          <div className="glass-card p-4 space-y-3">
            <h3 className="font-display text-sm text-foreground flex items-center gap-2">
              <Heart className="w-4 h-4 text-secondary" /> Family Health Overview
            </h3>
            {patients.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center gap-3 py-2 border-b border-border/20 last:border-0">
                <div className="w-7 h-7 rounded bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{p.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.familyMembers.length} linked relative{p.familyMembers.length !== 1 ? "s" : ""}</p>
                </div>
                <button onClick={() => navigate("/family")} className="text-[10px] text-primary hover:underline">View</button>
              </div>
            ))}
          </div>

          {/* Daily Care */}
          <div className="glass-card p-4 space-y-3">
            <h3 className="font-display text-sm text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" /> Daily Care Reminders
            </h3>
            {[
              { text: "Review medication adherence for high-risk patients", time: "9:00 AM" },
              { text: "Schedule follow-up for post-surgical patients", time: "11:00 AM" },
              { text: "Check BP readings flagged overnight", time: "2:00 PM" },
              { text: "Update treatment plans for chronic disease cohort", time: "4:00 PM" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-border/20 last:border-0">
                <p className="text-xs text-foreground">{item.text}</p>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
