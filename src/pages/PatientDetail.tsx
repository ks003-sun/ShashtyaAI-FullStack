import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Fingerprint, Stethoscope, Heart, Sparkles, CheckCircle, TrendingUp, MapPin, FileText, Plus, X } from "lucide-react";
import { usePatientData } from "@/context/PatientDataContext";
import VitalsChart from "@/components/VitalsChart";
import MedicationList from "@/components/MedicationList";
import InsightCard from "@/components/InsightCard";
import FamilyRiskTree from "@/components/FamilyRiskTree";
import NearestHospitals from "@/components/NearestHospitals";
import VitalsRiskEngine from "@/components/VitalsRiskEngine";
import FollowUpScheduler from "@/components/FollowUpScheduler";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import EmergencyButton from "@/components/EmergencyButton";

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPatientById, getSuggestionsForPatient, toggleSuggestion, getLogsForPatient, getPrescriptionsForPatient, addDraftPrescription } = usePatientData();
  const patient = getPatientById(id || "");
  const suggestions = getSuggestionsForPatient(id || "");
  const logs = getLogsForPatient(id || "");
  const prescriptions = getPrescriptionsForPatient(id || "");

  const [showRxForm, setShowRxForm] = useState(false);
  const [rxMeds, setRxMeds] = useState([{ name: "", dosage: "", frequency: "", duration: "" }]);
  const [rxNotes, setRxNotes] = useState("");

  if (!patient) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Patient not found</p>
      </div>
    );
  }

  const handleAddRxMed = () => setRxMeds((prev) => [...prev, { name: "", dosage: "", frequency: "", duration: "" }]);
  const handleRemoveRxMed = (i: number) => setRxMeds((prev) => prev.filter((_, idx) => idx !== i));
  const handleRxMedChange = (i: number, field: string, value: string) => {
    setRxMeds((prev) => prev.map((m, idx) => idx === i ? { ...m, [field]: value } : m));
  };

  const handleSubmitRx = () => {
    if (rxMeds.some((m) => m.name && m.dosage)) {
      addDraftPrescription({
        patientId: patient.id,
        date: new Date().toISOString().split("T")[0],
        medications: rxMeds.filter((m) => m.name),
        notes: rxNotes,
        status: "draft",
      });
      setRxMeds([{ name: "", dosage: "", frequency: "", duration: "" }]);
      setRxNotes("");
      setShowRxForm(false);
    }
  };

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
                <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{patient.age}y · {patient.gender}</span>
                  <span className="flex items-center gap-1"><Fingerprint className="w-3.5 h-3.5" />{patient.healthId}</span>
                  <span className="flex items-center gap-1"><Stethoscope className="w-3.5 h-3.5" />{patient.doctorName}</span>
                  <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{patient.caregiverName}</span>
                  {patient.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{patient.location}</span>}
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

          {/* Draft Prescription */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Draft Prescriptions
              </h2>
              {!showRxForm && (
                <Button size="sm" onClick={() => setShowRxForm(true)} className="bg-primary hover:bg-primary/90">
                  <Plus className="w-3.5 h-3.5 mr-1" /> New Prescription
                </Button>
              )}
            </div>

            {showRxForm && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card-healthcare p-5 border-l-2 border-l-primary space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">New Draft Prescription</h3>
                  <button onClick={() => setShowRxForm(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
                </div>
                {rxMeds.map((med, i) => (
                  <div key={i} className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-end">
                    <div className="space-y-1">
                      <label className="text-[10px] font-medium text-muted-foreground">Medication</label>
                      <Input placeholder="Drug name" value={med.name} onChange={(e) => handleRxMedChange(i, "name", e.target.value)} className="bg-card/40 border-border/40 h-9 text-xs" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-medium text-muted-foreground">Dosage</label>
                      <Input placeholder="e.g. 500mg" value={med.dosage} onChange={(e) => handleRxMedChange(i, "dosage", e.target.value)} className="bg-card/40 border-border/40 h-9 text-xs" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-medium text-muted-foreground">Frequency</label>
                      <Input placeholder="e.g. Twice daily" value={med.frequency} onChange={(e) => handleRxMedChange(i, "frequency", e.target.value)} className="bg-card/40 border-border/40 h-9 text-xs" />
                    </div>
                    <div className="flex gap-1 items-end">
                      <div className="space-y-1 flex-1">
                        <label className="text-[10px] font-medium text-muted-foreground">Duration</label>
                        <Input placeholder="e.g. 30 days" value={med.duration} onChange={(e) => handleRxMedChange(i, "duration", e.target.value)} className="bg-card/40 border-border/40 h-9 text-xs" />
                      </div>
                      {rxMeds.length > 1 && (
                        <button onClick={() => handleRemoveRxMed(i)} className="h-9 w-9 flex items-center justify-center text-muted-foreground hover:text-coral"><X className="w-3.5 h-3.5" /></button>
                      )}
                    </div>
                  </div>
                ))}
                <button onClick={handleAddRxMed} className="text-xs text-primary hover:underline flex items-center gap-1"><Plus className="w-3 h-3" /> Add medication</button>
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-muted-foreground">Notes / Instructions</label>
                  <Textarea placeholder="Additional instructions..." value={rxNotes} onChange={(e) => setRxNotes(e.target.value)} className="bg-card/40 border-border/40 min-h-[50px] text-xs" />
                </div>
                <Button onClick={handleSubmitRx} size="sm"><FileText className="w-3.5 h-3.5 mr-1" /> Save Draft</Button>
              </motion.div>
            )}

            {prescriptions.map((rx) => (
              <div key={rx.id} className="card-healthcare p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] text-muted-foreground">{rx.date}</p>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-light text-amber font-medium uppercase">{rx.status}</span>
                </div>
                <div className="space-y-1">
                  {rx.medications.map((m, i) => (
                    <p key={i} className="text-xs text-foreground">
                      <span className="font-medium">{m.name}</span> · {m.dosage} · {m.frequency} {m.duration && `· ${m.duration}`}
                    </p>
                  ))}
                </div>
                {rx.notes && <p className="text-[11px] text-muted-foreground mt-2 italic">{rx.notes}</p>}
              </div>
            ))}
          </div>

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
          <VitalsRiskEngine patient={patient} />

          <FollowUpScheduler patientId={patient.id} />

          <NearestHospitals city={patient.location} />

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
      <EmergencyButton patientId={patient.id} patientName={patient.name} />
    </div>
  );
}
