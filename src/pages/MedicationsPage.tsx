import { useState } from "react";
import { motion } from "framer-motion";
import { Pill, Search, CheckCircle, XCircle, AlertTriangle, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePatientData } from "@/context/PatientDataContext";
import DashboardHeader from "@/components/DashboardHeader";

export default function MedicationsPage() {
  const { patients, adherenceRecords, toggleAdherence, caregiverLogs } = usePatientData();
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<string>("all");

  const dates = ["2024-04-03", "2024-04-04", "2024-04-05"];

  const filteredPatients = patients.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.medications.some(m => m.name.toLowerCase().includes(search.toLowerCase()));
    const matchPatient = selectedPatient === "all" || p.id === selectedPatient;
    return matchSearch && matchPatient;
  });

  return (
    <div>
      <DashboardHeader title="Medications" subtitle="Current medications, adherence tracking, and caregiver-logged additions" />

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search medications or patients..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-card/60 border-border/40" />
        </div>
        <select
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
          className="px-3 py-2 rounded-lg text-xs bg-card border border-border/40 text-foreground"
        >
          <option value="all">All Patients</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-6">
        {filteredPatients.map((patient, pi) => {
          const patientAdherence = adherenceRecords.filter(r => r.patientId === patient.id);
          const patientLogs = caregiverLogs.filter(l => l.patientId === patient.id && l.additionalMeds);
          const totalDoses = patientAdherence.length;
          const takenDoses = patientAdherence.filter(r => r.taken).length;
          const adherenceRate = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;

          return (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: pi * 0.05 }}
              className="card-healthcare p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-accent-foreground">
                    {patient.avatar}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">{patient.name}</h3>
                    <p className="text-[10px] text-muted-foreground">{patient.age}y · {patient.medications.length} medications</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">{adherenceRate}%</p>
                  <p className="text-[10px] text-muted-foreground">Adherence (3-day)</p>
                </div>
              </div>

              {/* Adherence progress bar */}
              <div className="w-full h-2 rounded-full bg-muted mb-4">
                <div
                  className={`h-2 rounded-full transition-all ${adherenceRate >= 80 ? "bg-sage" : adherenceRate >= 50 ? "bg-amber" : "bg-coral"}`}
                  style={{ width: `${adherenceRate}%` }}
                />
              </div>

              {/* Medications table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/30">
                      <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Medication</th>
                      <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Dosage</th>
                      <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Frequency</th>
                      {dates.map(d => (
                        <th key={d} className="text-center py-2 px-2 text-muted-foreground font-medium">{d.slice(5)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {patient.medications.map((med) => (
                      <tr key={med.name} className="border-b border-border/20">
                        <td className="py-2.5 pr-4">
                          <div className="flex items-center gap-2">
                            <Pill className={`w-3.5 h-3.5 ${med.conflicts?.length ? "text-coral" : "text-primary"}`} />
                            <span className="font-medium text-foreground">{med.name}</span>
                            {med.conflicts && med.conflicts.length > 0 && (
                              <AlertTriangle className="w-3 h-3 text-coral" />
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 pr-4 text-muted-foreground">{med.dosage}</td>
                        <td className="py-2.5 pr-4 text-muted-foreground">{med.frequency}</td>
                        {dates.map((date) => {
                          const record = patientAdherence.find(r => r.medicationName === med.name && r.date === date);
                          return (
                            <td key={date} className="py-2.5 text-center">
                              <button
                                onClick={() => toggleAdherence(patient.id, med.name, date)}
                                className="mx-auto"
                              >
                                {record?.taken ? (
                                  <CheckCircle className="w-4 h-4 text-sage" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-coral/60" />
                                )}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Caregiver-logged additional medications */}
              {patientLogs.length > 0 && (
                <div className="mt-4 pt-3 border-t border-border/30">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Caregiver-Logged Additional Medications
                  </p>
                  <div className="space-y-1.5">
                    {patientLogs.map((log) => (
                      <div key={log.id} className="flex items-center gap-2 text-[11px] p-2 rounded-lg bg-teal-light/30">
                        <Pill className="w-3 h-3 text-teal" />
                        <span className="text-foreground font-medium">{log.additionalMeds}</span>
                        <span className="text-muted-foreground ml-auto">{log.date} at {log.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Conflicts summary */}
              {patient.medications.some(m => m.conflicts?.length) && (
                <div className="mt-3 p-3 rounded-lg bg-coral-light/30 border border-coral/10">
                  <p className="text-[10px] font-medium text-coral uppercase tracking-wider mb-1">Known Interactions</p>
                  {patient.medications.filter(m => m.conflicts?.length).map(m => (
                    <p key={m.name} className="text-[11px] text-foreground">
                      <span className="font-medium">{m.name}</span> conflicts with {m.conflicts?.join(", ")}
                    </p>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
