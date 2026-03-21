import { motion } from "framer-motion";
import { AlertTriangle, Activity, Heart, Bone, Clock, MapPin } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import { patients } from "@/data/mockPatients";

const eventTypeConfig = {
  fall: { icon: Bone, label: "Fall", bg: "bg-coral-light", text: "text-coral" },
  hospitalization: { icon: Heart, label: "Hospitalization", bg: "bg-coral-light", text: "text-coral" },
  vitals_change: { icon: Activity, label: "Vitals Change", bg: "bg-amber-light", text: "text-amber" },
  ailment: { icon: AlertTriangle, label: "Ailment", bg: "bg-amber-light", text: "text-amber" },
};

export default function Alerts() {
  const alertPatients = patients
    .filter((p) => p.recentEvents && p.recentEvents.length > 0)
    .sort((a, b) => {
      const riskOrder = { high: 0, medium: 1, low: 2 };
      return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
    });

  return (
    <div>
      <DashboardHeader title="Alerts & Events" subtitle="High-risk patients with recent falls, ailments, or vital changes" />

      <div className="grid gap-4">
        {alertPatients.map((patient, i) => (
          <motion.div
            key={patient.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="card-healthcare p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-accent-foreground">
                  {patient.avatar}
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{patient.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{patient.age}y · {patient.gender}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{patient.location}</span>
                    <span>{patient.healthId}</span>
                  </div>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${patient.riskLevel === "high" ? "badge-risk-high" : patient.riskLevel === "medium" ? "badge-risk-medium" : "badge-risk-low"}`}>
                {patient.riskLevel.toUpperCase()} RISK
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {patient.conditions.map((c) => (
                <span key={c} className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-medium">{c}</span>
              ))}
            </div>

            <div className="space-y-2.5">
              {patient.recentEvents?.map((event, j) => {
                const config = eventTypeConfig[event.type];
                return (
                  <div key={j} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                      <config.icon className={`w-4 h-4 ${config.text}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase ${config.text}`}>{config.label}</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />{event.date}
                        </span>
                      </div>
                      <p className="text-xs text-foreground mt-0.5">{event.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
