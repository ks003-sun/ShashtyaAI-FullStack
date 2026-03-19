import { motion } from "framer-motion";
import { ChevronRight, AlertTriangle, Shield, Activity } from "lucide-react";
import { Patient } from "@/data/mockPatients";
import { useNavigate } from "react-router-dom";

const riskConfig = {
  high: { badge: "badge-risk-high", icon: AlertTriangle, label: "High Risk" },
  medium: { badge: "badge-risk-medium", icon: Activity, label: "Medium Risk" },
  low: { badge: "badge-risk-low", icon: Shield, label: "Low Risk" },
};

export default function PatientCard({ patient, index }: { patient: Patient; index: number }) {
  const navigate = useNavigate();
  const risk = riskConfig[patient.riskLevel];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      onClick={() => navigate(`/patient/${patient.id}`)}
      className="card-healthcare p-5 cursor-pointer hover:shadow-md hover:border-primary/20 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-accent-foreground">
            {patient.avatar}
          </div>
          <div>
            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">{patient.name}</h3>
            <p className="text-xs text-muted-foreground">{patient.age}y · {patient.gender} · {patient.healthId}</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {patient.conditions.map((c) => (
          <span key={c} className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-medium">
            {c}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className={risk.badge}>
          <risk.icon className="w-3 h-3 inline mr-1" />
          {risk.label}
        </span>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span>{patient.medications.length} meds</span>
          <span>{patient.insights.length} insights</span>
        </div>
      </div>
    </motion.div>
  );
}
