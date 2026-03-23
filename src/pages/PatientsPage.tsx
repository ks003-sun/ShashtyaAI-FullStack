import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ChevronRight, AlertTriangle, Shield, Activity, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePatientData } from "@/context/PatientDataContext";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";

const riskConfig = {
  high: { badge: "badge-risk-high", icon: AlertTriangle, label: "High Risk", order: 0 },
  medium: { badge: "badge-risk-medium", icon: Activity, label: "Medium Risk", order: 1 },
  low: { badge: "badge-risk-low", icon: Shield, label: "Low Risk", order: 2 },
};

export default function PatientsPage() {
  const { patients } = usePatientData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<"all" | "high" | "medium" | "low">("all");

  const sorted = [...patients]
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.conditions.some(c => c.toLowerCase().includes(search.toLowerCase()));
      const matchesRisk = riskFilter === "all" || p.riskLevel === riskFilter;
      return matchesSearch && matchesRisk;
    })
    .sort((a, b) => riskConfig[a.riskLevel].order - riskConfig[b.riskLevel].order);

  return (
    <div>
      <DashboardHeader title="All Patients" subtitle={`${patients.length} patients sorted by risk level`} />

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or condition..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card/60 border-border/40"
          />
        </div>
        <div className="flex gap-1.5">
          {(["all", "high", "medium", "low"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setRiskFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                riskFilter === f ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {sorted.map((patient, i) => {
          const risk = riskConfig[patient.riskLevel];
          return (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => navigate(`/patient/${patient.id}`)}
              className="card-healthcare p-5 cursor-pointer hover:shadow-md hover:border-primary/20 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-accent-foreground">
                    {patient.avatar}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{patient.name}</h3>
                    <p className="text-[11px] text-muted-foreground">{patient.age}y · {patient.gender}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>

              {patient.location && (
                <p className="text-[10px] text-muted-foreground flex items-center gap-1 mb-2">
                  <MapPin className="w-3 h-3" />{patient.location}
                </p>
              )}

              <div className="flex flex-wrap gap-1 mb-3">
                {patient.conditions.map((c) => (
                  <span key={c} className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-medium">{c}</span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className={risk.badge}>
                  <risk.icon className="w-3 h-3 inline mr-1" />{risk.label}
                </span>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span>{patient.medications.length} meds</span>
                  <span>{patient.insights.length} insights</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {sorted.length === 0 && (
        <div className="card-healthcare p-12 text-center">
          <p className="text-muted-foreground">No patients match your search criteria</p>
        </div>
      )}
    </div>
  );
}
