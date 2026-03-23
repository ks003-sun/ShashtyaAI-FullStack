import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, Users, ChevronDown, ChevronUp, Search, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePatientData } from "@/context/PatientDataContext";
import DashboardHeader from "@/components/DashboardHeader";

export default function FamilyHealthPage() {
  const { patients } = usePatientData();
  const [search, setSearch] = useState("");
  const [expandedPatient, setExpandedPatient] = useState<string | null>(null);

  const patientsWithFamily = patients.filter((p) => p.familyMembers.length > 0);
  const filtered = patientsWithFamily.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.familyMembers.some((fm) => fm.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <DashboardHeader title="Family Health" subtitle="Relational health data and shared conditions across families" />

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by patient or family member..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-card/60 border-border/40" />
      </div>

      <div className="space-y-4">
        {filtered.map((patient, i) => {
          const isExpanded = expandedPatient === patient.id;
          // Gather shared conditions between patient and family
          const familyConditions = patient.familyMembers.flatMap(fm => fm.conditions);
          const sharedConditions = patient.conditions.filter(c =>
            familyConditions.some(fc => fc.toLowerCase().includes(c.toLowerCase().split(" ")[0]))
          );

          return (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-healthcare overflow-hidden"
            >
              {/* Patient header */}
              <button
                onClick={() => setExpandedPatient(isExpanded ? null : patient.id)}
                className="w-full p-5 flex items-center justify-between hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-medium text-foreground">{patient.name}</h3>
                    <p className="text-[11px] text-muted-foreground">{patient.age}y · {patient.gender} · {patient.familyMembers.length} linked relative{patient.familyMembers.length > 1 ? "s" : ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-wrap gap-1">
                    {patient.conditions.slice(0, 2).map((c) => (
                      <span key={c} className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px]">{c}</span>
                    ))}
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 space-y-4">
                      {/* Shared conditions visual */}
                      {sharedConditions.length > 0 && (
                        <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                          <p className="text-[10px] text-primary font-medium uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Heart className="w-3.5 h-3.5" /> Shared Family Conditions
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {sharedConditions.map((c) => (
                              <span key={c} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium">{c}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Family members */}
                      <div className="grid sm:grid-cols-2 gap-3">
                        {patient.familyMembers.map((member) => (
                          <div key={member.id} className="p-4 rounded-xl bg-muted/30 border border-border/30">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-9 h-9 rounded-full bg-lavender-light flex items-center justify-center text-xs font-bold text-lavender">
                                {member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">{member.name}</p>
                                <p className="text-[10px] text-muted-foreground">{member.relation}</p>
                              </div>
                            </div>

                            {member.conditions.length > 0 && (
                              <div className="mb-3">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Known Conditions</p>
                                <div className="flex flex-wrap gap-1">
                                  {member.conditions.map((c) => (
                                    <span key={c} className="px-2 py-0.5 rounded-full bg-amber-light text-amber text-[10px] font-medium">{c}</span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {member.conditions.length === 0 && (
                              <p className="text-[10px] text-muted-foreground italic mb-2">No known conditions reported</p>
                            )}

                            <p className="text-[10px] text-muted-foreground">{member.healthId}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="card-healthcare p-12 text-center">
            <Network className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No family health records match your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
