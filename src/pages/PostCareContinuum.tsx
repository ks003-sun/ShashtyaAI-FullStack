import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Heart, Bone, Brain, Clock, CheckCircle, AlertTriangle, Calendar, Users, Pill, ChevronRight } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import { usePatientData } from "@/context/PatientDataContext";
import { useNavigate } from "react-router-dom";

type TabId = "surgical" | "chronic" | "geriatric";

const tabConfig: { id: TabId; label: string; icon: React.ElementType; description: string }[] = [
  { id: "surgical", label: "Surgical Recovery", icon: Bone, description: "Post-operative patients across all ages" },
  { id: "chronic", label: "Chronic Disease", icon: Heart, description: "Long-term disease management programs" },
  { id: "geriatric", label: "Geriatric Care", icon: Brain, description: "Elderly-specific care protocols & monitoring" },
];

const recoveryMilestones: Record<string, { week: number; milestone: string; status: "done" | "current" | "upcoming" }[]> = {
  "Post-ACL Reconstruction": [
    { week: 1, milestone: "Weight-bearing with crutches, ROM 0–90°", status: "done" },
    { week: 2, milestone: "Wound check, suture removal, begin quad sets", status: "done" },
    { week: 4, milestone: "Full WB, ROM >120°, stationary cycling", status: "current" },
    { week: 8, milestone: "Jogging protocol, functional testing", status: "upcoming" },
    { week: 16, milestone: "Sport-specific drills, agility training", status: "upcoming" },
    { week: 24, milestone: "Return to sport clearance, MRI graft check", status: "upcoming" },
  ],
  "Post-Spinal Fusion (Scoliosis)": [
    { week: 2, milestone: "Wound check, mobility assessment, pain management", status: "done" },
    { week: 4, milestone: "Independent ambulation, X-ray check", status: "done" },
    { week: 6, milestone: "Return to school, light activities", status: "current" },
    { week: 12, milestone: "Physical therapy initiation, core strengthening", status: "upcoming" },
    { week: 24, milestone: "Follow-up X-rays, full activity clearance", status: "upcoming" },
    { week: 52, milestone: "Annual imaging, final hardware assessment", status: "upcoming" },
  ],
};

const chronicPrograms = [
  { condition: "Type 2 Diabetes", stages: ["Diagnosis & Education", "Medication Optimization", "Lifestyle Modification", "Complication Screening", "Long-term Monitoring"], metrics: "HbA1c, FPG, Lipids, eGFR" },
  { condition: "Heart Failure", stages: ["Acute Stabilization", "Medication Titration", "Volume Management", "Cardiac Rehab", "Maintenance"], metrics: "BNP, EF%, Weight, SpO2" },
  { condition: "COPD", stages: ["Spirometry Staging", "Bronchodilator Therapy", "Pulmonary Rehab", "Exacerbation Prevention", "Palliative Integration"], metrics: "FEV1, SpO2, 6MWT, CAT Score" },
  { condition: "CKD", stages: ["eGFR Staging", "Renoprotective Therapy", "Electrolyte Management", "Anemia Correction", "Dialysis Planning"], metrics: "eGFR, Cr, K+, Hb, UACR" },
];

const geriatricProtocols = [
  { title: "Fall Prevention Program", description: "Comprehensive home safety assessment, balance training, medication review for fall-risk drugs.", icon: AlertTriangle, patients: 8, color: "coral" },
  { title: "Cognitive Decline Monitoring", description: "Serial MMSE/MoCA scoring, caregiver burden assessment, behavioral symptom management.", icon: Brain, patients: 4, color: "lavender" },
  { title: "Polypharmacy Review", description: "Quarterly medication reconciliation using STOPP/START criteria, deprescribing protocol.", icon: Pill, patients: 12, color: "amber" },
  { title: "Nutritional Support", description: "MNA screening, dietitian referral, oral supplement prescription, dysphagia evaluation.", icon: Activity, patients: 6, color: "sage" },
];

export default function PostCareContinuum() {
  const { patients } = usePatientData();
  const navigate = useNavigate();
  const { id: patientId } = useParams();
  const [activeTab, setActiveTab] = useState<TabId>("surgical");

  // If accessed with a patient ID, scope to that patient only
  const scopedPatients = patientId
    ? patients.filter(p => p.id === patientId)
    : patients;

  const surgicalPatients = scopedPatients.filter(p => p.conditions.some(c => c.startsWith("Post-")));
  const geriatricPatients = scopedPatients.filter(p => p.age >= 65);
  const chronicPatients = scopedPatients.filter(p => p.conditions.some(c => ["Type 2 Diabetes", "Type 1 Diabetes", "Congestive Heart Failure", "COPD", "Chronic Kidney Disease Stage 3a", "Atrial Fibrillation"].some(ch => c.includes(ch))));

  const scopedPatient = patientId ? patients.find(p => p.id === patientId) : null;

  return (
    <div>
      <DashboardHeader
        title={scopedPatient ? `Post-Care: ${scopedPatient.name}` : "Post-Care Continuum"}
        subtitle={scopedPatient ? `${scopedPatient.age}y · ${scopedPatient.conditions.join(", ")}` : "Surgical recovery, chronic disease, and geriatric care pathways"}
      />

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {tabConfig.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${activeTab === tab.id ? "bg-primary-foreground/20" : "bg-muted"}`}>
              {tab.id === "surgical" ? surgicalPatients.length : tab.id === "chronic" ? chronicPatients.length : geriatricPatients.length}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

          {activeTab === "surgical" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {surgicalPatients.map((p) => {
                  const surgicalCondition = p.conditions.find(c => c.startsWith("Post-")) || "";
                  const milestones = recoveryMilestones[surgicalCondition] || [];
                  const currentWeek = milestones.findIndex(m => m.status === "current");
                  const progress = currentWeek >= 0 ? Math.round(((currentWeek + 1) / milestones.length) * 100) : 0;

                  return (
                    <motion.div key={p.id} className="card-healthcare p-5 space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/patient/${p.id}`)}>
                          <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{p.avatar}</div>
                          <div>
                            <h3 className="text-sm font-medium text-foreground hover:text-primary transition-colors">{p.name}</h3>
                            <p className="text-[10px] text-muted-foreground">{p.age}y · {surgicalCondition}</p>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">{progress}% complete</span>
                      </div>

                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, ease: "easeOut" }} />
                      </div>

                      <div className="space-y-2">
                        {milestones.map((m, i) => (
                          <div key={i} className={`flex items-start gap-2.5 text-xs ${m.status === "upcoming" ? "opacity-50" : ""}`}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              m.status === "done" ? "bg-sage text-primary-foreground" : m.status === "current" ? "bg-primary text-primary-foreground animate-pulse" : "bg-muted text-muted-foreground"
                            }`}>
                              {m.status === "done" ? <CheckCircle className="w-3 h-3" /> : <span className="text-[8px] font-bold">W{m.week}</span>}
                            </div>
                            <div>
                              <span className="font-medium text-foreground">Week {m.week}</span>
                              <span className="text-muted-foreground ml-1.5">{m.milestone}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              {surgicalPatients.length === 0 && (
                <div className="card-healthcare p-12 text-center text-muted-foreground">No post-surgical patients {patientId ? "for this patient" : "currently in the system"}</div>
              )}
            </div>
          )}

          {activeTab === "chronic" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {chronicPrograms.map((prog, i) => {
                  const enrolled = chronicPatients.filter(p => p.conditions.some(c => c.includes(prog.condition.split(" ")[0]))).length;
                  return (
                    <motion.div key={prog.condition} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-healthcare p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-foreground">{prog.condition} Pathway</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-secondary/10 text-secondary font-medium">{enrolled} enrolled</span>
                      </div>
                      <div className="flex gap-1">
                        {prog.stages.map((stage, si) => (
                          <div key={si} className="flex-1 text-center">
                            <div className={`h-1.5 rounded-full ${si <= 2 ? "bg-primary" : "bg-muted"}`} />
                            <p className="text-[8px] text-muted-foreground mt-1 leading-tight">{stage}</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Activity className="w-3 h-3" />Key metrics: {prog.metrics}</p>
                    </motion.div>
                  );
                })}
              </div>

              <div>
                <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-primary" />Enrolled Patients</h3>
                <div className="space-y-2">
                  {chronicPatients.map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      onClick={() => navigate(`/patient/${p.id}`)}
                      className="card-healthcare p-3 flex items-center gap-3 cursor-pointer hover:border-primary/30 transition-colors">
                      <div className="w-9 h-9 rounded bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{p.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground">{p.age}y · {p.conditions.slice(0, 2).join(", ")}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`badge-risk-${p.riskLevel} text-[10px]`}>{p.riskLevel}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "geriatric" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {geriatricProtocols.map((proto, i) => (
                  <motion.div key={proto.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-healthcare p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded bg-${proto.color}-light flex items-center justify-center`}>
                        <proto.icon className={`w-4 h-4 text-${proto.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-foreground">{proto.title}</h3>
                        <p className="text-[10px] text-muted-foreground">{proto.patients} patients enrolled</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{proto.description}</p>
                  </motion.div>
                ))}
              </div>

              <div>
                <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-primary" />Geriatric Patients (65+)</h3>
                <div className="space-y-2">
                  {geriatricPatients.map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      onClick={() => navigate(`/patient/${p.id}`)}
                      className="card-healthcare p-3 flex items-center gap-3 cursor-pointer hover:border-primary/30 transition-colors">
                      <div className="w-9 h-9 rounded bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{p.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground">{p.age}y · {p.conditions.slice(0, 2).join(", ")}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground">{p.caregiverName}</span>
                        <span className={`badge-risk-${p.riskLevel} text-[10px]`}>{p.riskLevel}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
