import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Fingerprint, Stethoscope, Heart, Calendar,
  Activity, Droplets, Weight, Wind, Pill, Brain, Users, ClipboardPlus,
  AlertTriangle, TrendingUp, TrendingDown, Clock, Plus, Send, Shield,
  HandHeart, LogOut, ChevronDown, ChevronUp, Sparkles, CheckCircle,
  Upload, FileText, File, MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePatientData } from "@/context/PatientDataContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import VitalsChart from "@/components/VitalsChart";
import NearestHospitals from "@/components/NearestHospitals";

export default function CaregiverDashboard() {
  const navigate = useNavigate();
  const { patients, getLogsForPatient, addCaregiverLog, getSuggestionsForPatient, toggleSuggestion, getDocumentsForPatient, addPatientDocument } = usePatientData();

  // Assigned patient for this caregiver
  const patient = patients[0];
  const entryLogs = getLogsForPatient(patient.id);
  const suggestions = getSuggestionsForPatient(patient.id);

  const documents = getDocumentsForPatient(patient.id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"overview" | "vitals" | "meds" | "insights" | "family" | "log" | "care" | "documents">("overview");
  const [newLog, setNewLog] = useState({ weight: "", symptoms: "", notes: "", additionalMeds: "" });
  const [showNewLog, setShowNewLog] = useState(false);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

  const handleSubmitLog = () => {
    if (!newLog.weight && !newLog.symptoms && !newLog.notes) return;
    const now = new Date();
    addCaregiverLog({
      patientId: patient.id,
      date: now.toISOString().split("T")[0],
      time: now.toTimeString().slice(0, 5),
      ...newLog,
    });
    setNewLog({ weight: "", symptoms: "", notes: "", additionalMeds: "" });
    setShowNewLog(false);
  };

  const latestVitals = patient.vitals[patient.vitals.length - 1];
  const prevVitals = patient.vitals[patient.vitals.length - 2];

  const vitalCards = [
    { label: "Blood Pressure", value: `${latestVitals.bloodPressureSys}/${latestVitals.bloodPressureDia}`, unit: "mmHg", icon: Activity, trend: latestVitals.bloodPressureSys > prevVitals.bloodPressureSys ? "up" : "down", color: "coral" },
    { label: "Blood Sugar", value: `${latestVitals.bloodSugar}`, unit: "mg/dL", icon: Droplets, trend: latestVitals.bloodSugar > prevVitals.bloodSugar ? "up" : "down", color: "amber" },
    { label: "Weight", value: `${latestVitals.weight}`, unit: "lbs", icon: Weight, trend: latestVitals.weight > prevVitals.weight ? "up" : "down", color: "teal" },
    { label: "SpO₂", value: `${latestVitals.oxygenSat}`, unit: "%", icon: Wind, trend: latestVitals.oxygenSat > prevVitals.oxygenSat ? "up" : "down", color: "sage" },
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "vitals", label: "Vitals", icon: Heart },
    { id: "meds", label: "Meds", icon: Pill },
    { id: "insights", label: "AI Insights", icon: Brain },
    { id: "care", label: "Care Tips", icon: Sparkles },
    { id: "family", label: "Family", icon: Users },
    { id: "log", label: "Entry Log", icon: ClipboardPlus },
    { id: "documents", label: "Documents", icon: FileText },
  ] as const;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      addPatientDocument({
        patientId: patient.id,
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size < 1024 * 1024 ? `${(file.size / 1024).toFixed(1)} KB` : `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedBy: patient.caregiverName,
        date: new Date().toISOString().split("T")[0],
      });
    });
    e.target.value = "";
  };

  const riskColors: Record<string, string> = { high: "text-coral", medium: "text-amber", low: "text-sage" };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center">
              <HandHeart className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">ShastyaAI · Caregiver</p>
              <p className="text-[10px] text-muted-foreground">Logged in as {patient.caregiverName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-muted-foreground hidden sm:block">
              <Clock className="w-3 h-3 inline mr-1" />Session active
            </span>
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Patient Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center text-lg font-bold text-accent-foreground">{patient.avatar}</div>
              <div>
                <h1 className="font-display text-xl text-foreground">{patient.name}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{patient.age}y · {patient.gender}</span>
                  <span className="flex items-center gap-1"><Fingerprint className="w-3 h-3" />{patient.healthId}</span>
                  <span className="flex items-center gap-1"><Stethoscope className="w-3 h-3" />{patient.doctorName}</span>
                  {patient.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{patient.location}</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground">Risk Level</p>
                <p className={`text-base font-bold font-display ${riskColors[patient.riskLevel]}`}>{patient.riskLevel.toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground">Next Visit</p>
                <p className="text-xs font-medium text-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />{patient.nextAppointment}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {patient.conditions.map((c) => (
              <span key={c} className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[11px] font-medium">{c}</span>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? "bg-teal text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
              <tab.icon className="w-3.5 h-3.5" />{tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {vitalCards.map((v) => (
                    <div key={v.label} className="card-healthcare p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <v.icon className={`w-4 h-4 text-${v.color}`} />
                        {v.trend === "up" ? <TrendingUp className="w-3.5 h-3.5 text-coral" /> : <TrendingDown className="w-3.5 h-3.5 text-sage" />}
                      </div>
                      <div>
                        <p className="text-xl font-bold text-foreground">{v.value}</p>
                        <p className="text-[10px] text-muted-foreground">{v.label} · {v.unit}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {patient.recentEvents && patient.recentEvents.length > 0 && (
                  <div className="card-healthcare p-4">
                    <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-coral" />Recent Alerts
                    </h3>
                    <div className="space-y-2">
                      {patient.recentEvents.map((event, i) => (
                        <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/30 text-xs">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${event.type === "fall" ? "bg-coral-light text-coral" : event.type === "vitals_change" ? "bg-amber-light text-amber" : "bg-teal-light text-teal"}`}>{event.type.replace("_", " ")}</span>
                          <div className="flex-1">
                            <p className="text-foreground">{event.description}</p>
                            <p className="text-muted-foreground mt-0.5">{event.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="card-healthcare p-4 border-l-2 border-l-coral">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Top AI Insight</p>
                  <h4 className="text-sm font-medium text-foreground">{patient.insights[0].title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{patient.insights[0].description}</p>
                </div>
              </div>
            )}

            {activeTab === "vitals" && (
              <div className="grid sm:grid-cols-2 gap-4">
                <VitalsChart data={patient.vitals} metric="bloodPressure" title="Blood Pressure (mmHg)" color="hsl(var(--coral))" />
                <VitalsChart data={patient.vitals} metric="heartRate" title="Heart Rate (bpm)" color="hsl(var(--sage))" />
                <VitalsChart data={patient.vitals} metric="bloodSugar" title="Blood Sugar (mg/dL)" color="hsl(var(--amber))" />
                <VitalsChart data={patient.vitals} metric="oxygenSat" title="Oxygen Saturation (%)" color="hsl(var(--teal))" />
              </div>
            )}

            {activeTab === "meds" && (
              <div className="space-y-3">
                {patient.medications.map((med, i) => (
                  <motion.div key={med.name} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-healthcare p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center"><Pill className="w-4 h-4 text-primary" /></div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{med.name} · {med.dosage}</p>
                        <p className="text-[11px] text-muted-foreground">{med.frequency} — {med.purpose}</p>
                      </div>
                    </div>
                    {med.conflicts && med.conflicts.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-coral-light text-coral text-[10px] font-medium">⚠ {med.conflicts.join(", ")}</span>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === "insights" && (
              <div className="space-y-3">
                {patient.insights.map((insight, i) => {
                  const typeStyles: Record<string, string> = { critical: "border-l-coral bg-coral-light/20", warning: "border-l-amber bg-amber-light/20", info: "border-l-primary bg-primary/5", positive: "border-l-sage bg-sage-light/20" };
                  const isExpanded = expandedInsight === insight.id;
                  return (
                    <motion.div key={insight.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`card-healthcare p-4 border-l-2 cursor-pointer ${typeStyles[insight.type]}`} onClick={() => setExpandedInsight(isExpanded ? null : insight.id)}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Brain className="w-3.5 h-3.5 text-primary" />
                            <p className="text-sm font-medium text-foreground">{insight.title}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{insight.description}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          <span className="text-xs font-bold text-foreground">{insight.confidence}%</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* CARE SUGGESTIONS */}
            {activeTab === "care" && (
              <div className="space-y-4">
                <div className="card-healthcare p-4 bg-teal-light/20 border-teal/20">
                  <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-teal" /> Supportive Actions
                  </h3>
                  <p className="text-[11px] text-muted-foreground">Non-medical care suggestions based on patient's current condition and trends</p>
                </div>
                {suggestions.map((s, i) => {
                  const catColors = { physical: "teal", mental: "lavender", lifestyle: "sage" };
                  const c = catColors[s.category];
                  return (
                    <motion.div key={s.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`card-healthcare p-4 ${s.completed ? "opacity-60" : ""}`}>
                      <div className="flex items-start gap-3">
                        <button onClick={() => toggleSuggestion(s.id)} className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${s.completed ? `bg-${c} border-${c}` : `border-muted-foreground/40`}`}>
                          {s.completed && <CheckCircle className="w-3 h-3 text-primary-foreground" />}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`text-sm font-medium ${s.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>{s.title}</h4>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full bg-${c}-light text-${c} font-medium uppercase`}>{s.category}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground">{s.description}</p>
                          <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1"><TrendingUp className="w-3 h-3" />{s.trigger}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                {suggestions.length === 0 && (
                  <div className="card-healthcare p-8 text-center text-sm text-muted-foreground">No care suggestions generated for current patient state</div>
                )}
              </div>
            )}

            {activeTab === "family" && (
              <div className="space-y-4">
                {patient.familyMembers.length > 0 ? patient.familyMembers.map((member) => (
                  <div key={member.id} className="card-healthcare p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-accent-foreground">
                        {member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{member.name}</p>
                        <p className="text-[11px] text-muted-foreground">{member.relation}</p>
                      </div>
                    </div>
                    {member.conditions.length > 0 && (
                      <div className="flex gap-1.5 mb-2">
                        {member.conditions.map(c => (
                          <span key={c} className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px]">{c}</span>
                        ))}
                      </div>
                    )}
                    {member.conditions.length === 0 && <p className="text-[10px] text-muted-foreground italic">No known conditions</p>}
                  </div>
                )) : (
                  <div className="card-healthcare p-8 text-center text-sm text-muted-foreground">No linked family health records available</div>
                )}
              </div>
            )}

            {activeTab === "log" && (
              <div className="space-y-4">
                {!showNewLog ? (
                  <Button onClick={() => setShowNewLog(true)} className="w-full h-12 bg-teal hover:bg-teal/90 text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />Add Daily Observation
                  </Button>
                ) : (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card-healthcare p-5 border-l-2 border-l-teal space-y-4">
                    <h3 className="text-sm font-medium text-foreground">New Daily Observation</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-foreground">Weight</label>
                        <Input placeholder="e.g. 167 lbs" value={newLog.weight} onChange={(e) => setNewLog(p => ({ ...p, weight: e.target.value }))} className="bg-card/40 border-border/40 h-9 text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-foreground">Additional Medications</label>
                        <Input placeholder="e.g. Paracetamol 500mg" value={newLog.additionalMeds} onChange={(e) => setNewLog(p => ({ ...p, additionalMeds: e.target.value }))} className="bg-card/40 border-border/40 h-9 text-sm" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-foreground">Symptom Changes</label>
                      <Textarea placeholder="Describe any new or changed symptoms..." value={newLog.symptoms} onChange={(e) => setNewLog(p => ({ ...p, symptoms: e.target.value }))} className="bg-card/40 border-border/40 min-h-[60px] text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-foreground">Condition Notes</label>
                      <Textarea placeholder="General observations, mood, appetite, mobility..." value={newLog.notes} onChange={(e) => setNewLog(p => ({ ...p, notes: e.target.value }))} className="bg-card/40 border-border/40 min-h-[60px] text-sm" />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSubmitLog} className="bg-teal hover:bg-teal/90 text-primary-foreground"><Send className="w-3.5 h-3.5 mr-1.5" />Submit Entry</Button>
                      <Button variant="ghost" onClick={() => setShowNewLog(false)}>Cancel</Button>
                    </div>
                  </motion.div>
                )}

                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-foreground flex items-center gap-2"><ClipboardPlus className="w-4 h-4 text-teal" />Previous Entries</h3>
                  {entryLogs.map((log, i) => (
                    <motion.div key={log.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-healthcare p-4">
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-2"><Clock className="w-3 h-3" />{log.date} at {log.time}</div>
                      <div className="grid sm:grid-cols-2 gap-2 text-xs">
                        {log.weight && <div className="p-2 rounded-lg bg-muted/30"><span className="text-muted-foreground">Weight: </span><span className="text-foreground font-medium">{log.weight}</span></div>}
                        {log.additionalMeds && <div className="p-2 rounded-lg bg-muted/30"><span className="text-muted-foreground">Added Med: </span><span className="text-foreground font-medium">{log.additionalMeds}</span></div>}
                      </div>
                      {log.symptoms && <div className="mt-2 p-2 rounded-lg bg-amber-light/30"><span className="text-[10px] font-medium text-amber">Symptoms: </span><span className="text-xs text-foreground">{log.symptoms}</span></div>}
                      {log.notes && <p className="text-xs text-muted-foreground mt-2">{log.notes}</p>}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "documents" && (
              <div className="space-y-4">
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.dicom,.dcm" />
                <Button onClick={() => fileInputRef.current?.click()} className="w-full h-12 bg-teal hover:bg-teal/90 text-primary-foreground">
                  <Upload className="w-4 h-4 mr-2" /> Upload Report / Scan
                </Button>
                <p className="text-[10px] text-muted-foreground text-center">Supports PDF, images, DICOM, and Office documents</p>

                {documents.length > 0 ? (
                  <div className="space-y-2.5">
                    {documents.map((doc, i) => (
                      <motion.div key={doc.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-healthcare p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <File className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                          <p className="text-[10px] text-muted-foreground">{doc.size} · Uploaded by {doc.uploadedBy} · {doc.date}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="card-healthcare p-8 text-center text-sm text-muted-foreground">No documents uploaded yet</div>
                )}

                <NearestHospitals city={patient.location} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
