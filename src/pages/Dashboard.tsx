import { Users, AlertTriangle, Pill, Calendar, Brain, Activity } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import StatCard from "@/components/StatCard";
import PatientCard from "@/components/PatientCard";
import AICompanionPanel from "@/components/AICompanionPanel";
import InsightCard from "@/components/InsightCard";
import { patients, dashboardStats } from "@/data/mockPatients";

export default function Dashboard() {
  const allInsights = patients.flatMap((p) => p.insights).sort((a, b) => b.date.localeCompare(a.date));
  const criticalInsights = allInsights.filter((i) => i.type === "critical" || i.type === "warning").slice(0, 4);

  return (
    <div>
      <DashboardHeader title="Dashboard" subtitle="Geriatric Care Management Overview" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard icon={Users} label="Total Patients" value={dashboardStats.totalPatients} change="+12 this week" changeType="positive" color="sage" delay={0} />
        <StatCard icon={AlertTriangle} label="High Risk" value={dashboardStats.highRisk} change="+3" changeType="negative" color="coral" delay={0.05} />
        <StatCard icon={Pill} label="Med Alerts" value={dashboardStats.medicationAlerts} color="amber" delay={0.1} />
        <StatCard icon={Calendar} label="Appointments" value={dashboardStats.upcomingAppointments} color="teal" delay={0.15} />
        <StatCard icon={Brain} label="AI Insights" value={dashboardStats.aiInsightsGenerated} change="92% avg conf." changeType="positive" color="lavender" delay={0.2} />
        <StatCard icon={Activity} label="Avg Risk Score" value={`${dashboardStats.avgRiskScore}/100`} color="sage" delay={0.25} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Patients */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-foreground">Priority Patients</h2>
            <span className="text-xs text-muted-foreground">{patients.length} shown</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {patients.map((p, i) => (
              <PatientCard key={p.id} patient={p} index={i} />
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <AICompanionPanel />

          <div className="space-y-3">
            <h3 className="font-display text-lg text-foreground">Recent Alerts</h3>
            {criticalInsights.map((insight, i) => (
              <InsightCard key={insight.id} insight={insight} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
