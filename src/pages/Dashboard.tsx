import { Users, AlertTriangle, Pill, Calendar, Brain, Activity } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import StatCard from "@/components/StatCard";
import PatientCard from "@/components/PatientCard";
import AICompanionPanel from "@/components/AICompanionPanel";
import InsightCard from "@/components/InsightCard";
import { usePatientData } from "@/context/PatientDataContext";

export default function Dashboard() {
  const { patients } = usePatientData();
  const allInsights = patients.flatMap((p) => p.insights).sort((a, b) => b.date.localeCompare(a.date));
  const criticalInsights = allInsights.filter((i) => i.type === "critical" || i.type === "warning").slice(0, 4);
  const highRisk = patients.filter(p => p.riskLevel === "high").length;
  const medAlerts = patients.reduce((acc, p) => acc + p.medications.filter(m => m.conflicts?.length).length, 0);

  const sortedPatients = [...patients].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.riskLevel] - order[b.riskLevel];
  });

  return (
    <div>
      <DashboardHeader title="Dashboard" subtitle="Geriatric Care Management Overview" />

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard icon={Users} label="Total Patients" value={patients.length} change={`${patients.length} active`} changeType="positive" color="sage" delay={0} />
        <StatCard icon={AlertTriangle} label="High Risk" value={highRisk} change={`${Math.round((highRisk/patients.length)*100)}%`} changeType="negative" color="coral" delay={0.05} />
        <StatCard icon={Pill} label="Med Conflicts" value={medAlerts} color="amber" delay={0.1} />
        <StatCard icon={Calendar} label="Appointments" value={patients.length} color="teal" delay={0.15} />
        <StatCard icon={Brain} label="AI Insights" value={allInsights.length} change="Active" changeType="positive" color="lavender" delay={0.2} />
        <StatCard icon={Activity} label="Avg Risk" value={`${Math.round((highRisk * 80 + (patients.length - highRisk) * 35) / patients.length)}/100`} color="sage" delay={0.25} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-foreground">Priority Patients</h2>
            <span className="text-xs text-muted-foreground">{sortedPatients.length} total</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {sortedPatients.slice(0, 8).map((p, i) => (
              <PatientCard key={p.id} patient={p} index={i} />
            ))}
          </div>
        </div>

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
