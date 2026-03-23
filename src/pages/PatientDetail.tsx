import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Fingerprint, Stethoscope, Heart, Sparkles, CheckCircle, TrendingUp } from "lucide-react";
import { usePatientData } from "@/context/PatientDataContext";
import VitalsChart from "@/components/VitalsChart";
import MedicationList from "@/components/MedicationList";
import InsightCard from "@/components/InsightCard";
import FamilyRiskTree from "@/components/FamilyRiskTree";

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPatientById, getSuggestionsForPatient, toggleSuggestion, getLogsForPatient } = usePatientData();
  const patient = getPatientById(id || "");
  const suggestions = getSuggestionsForPatient(id || "");
  const logs = getLogsForPatient(id || "");

  if (!patient) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Patient not found</p>
      </div>
    );
  }

  const riskColors = { high: "text-coral", medium: "text-amber", low: "text-sage" };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="card-healthcare p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-xl font-bold text-accent-foreground">
                {patient.avatar}
              </div>
              <div>
                <h1 className="font-display text-2xl text-foreground">{patient.name}</h1>
                <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{patient.age}y · {patient.gender}</span>
                  <span className="flex items-center gap-1"><Fingerprint className="w-3.5 h-3.5" />{patient.healthId}</span>
                  <span className="flex items-center gap-1"><Stethoscope className="w-3.5 h-3.5" />{patient.doctorName}</span>
                  <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{patient.caregiverName}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground">Risk Level</p>
                <p className={`text-lg font-bold font-display ${riskColors[patient.riskLevel]}`}>{patient.riskLevel.toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground">Next Appointment</p>
                <p className="text-sm font-medium text-foreground flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{patient.nextAppointment}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-4">
            {patient.conditions.map((c) => (
              <span key={c} className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">{c}</span>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="font-display text-xl text-foreground">Vitals Trends</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <VitalsChart data={patient.vitals} metric="bloodPressure" title="Blood Pressure (mmHg)" color="hsl(4, 70%, 58%)" />
            <VitalsChart data={patient.vitals} metric="heartRate" title="Heart Rate (bpm)" color="hsl(160, 30%, 38%)" />
            <VitalsChart data={patient.vitals} metric="bloodSugar" title="Blood Sugar (mg/dL)" color="hsl(38, 85%, 55%)" />
            <VitalsChart data={patient.vitals} metric="oxygenSat" title="Oxygen Saturation (%)" color="hsl(180, 35%, 42%)" />
          </div>

          <h2 className="font-display text-xl text-foreground">Medications ({patient.medications.length})</h2>
          <MedicationList medications={patient.medications} />

          {/* Caregiver Logs */}
          {logs.length > 0 && (
            <>
              <h2 className="font-display text-xl text-foreground">Caregiver Observations</h2>
              <div className="space-y-2">
                {logs.map((log) => (
                  <div key={log.id} className="card-healthcare p-4 text-xs">
                    <p className="text-[10px] text-muted-foreground mb-1">{log.date} at {log.time}</p>
                    {log.weight && <p><span className="text-muted-foreground">Weight:</span> <span className="font-medium text-foreground">{log.weight}</span></p>}
                    {log.symptoms && <p className="text-amber mt-1">{log.symptoms}</p>}
                    {log.notes && <p className="text-muted-foreground mt-1">{log.notes}</p>}
                    {log.additionalMeds && <p className="text-teal mt-1">+ {log.additionalMeds}</p>}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="font-display text-xl text-foreground">AI Health Insights</h2>
          <div className="space-y-3">
            {patient.insights.map((insight, i) => (
              <InsightCard key={insight.id} insight={insight} index={i} />
            ))}
          </div>

          {/* Daily Care Suggestions */}
          {suggestions.length > 0 && (
            <>
              <h2 className="font-display text-xl text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal" /> Daily Care Suggestions
              </h2>
              <div className="space-y-2">
                {suggestions.map((s) => {
                  const categoryColors = { physical: "teal", mental: "lavender", lifestyle: "sage" };
                  const color = categoryColors[s.category];
                  return (
                    <div key={s.id} className={`card-healthcare p-3 ${s.completed ? "opacity-60" : ""}`}>
                      <div className="flex items-start gap-2">
                        <button onClick={() => toggleSuggestion(s.id)} className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${s.completed ? `bg-${color} border-${color}` : "border-muted-foreground/40"}`}>
                          {s.completed && <CheckCircle className="w-3 h-3 text-primary-foreground" />}
                        </button>
                        <div>
                          <p className={`text-xs font-medium ${s.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>{s.title}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{s.description}</p>
                          <p className="text-[9px] text-muted-foreground mt-1 flex items-center gap-1">
                            <TrendingUp className="w-2.5 h-2.5" />{s.trigger}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <h2 className="font-display text-xl text-foreground">Family Health Links</h2>
          <FamilyRiskTree members={patient.familyMembers} patientName={patient.name} />
        </div>
      </div>
    </div>
  );
}
