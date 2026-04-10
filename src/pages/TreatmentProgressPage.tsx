import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Star, Target, Clock, Calendar, CheckCircle, Circle, Zap, Award, TrendingUp, Stethoscope, ChevronRight } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import { usePatientData } from "@/context/PatientDataContext";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

interface TreatmentMilestone {
  id: string;
  label: string;
  date: string;
  completed: boolean;
  description: string;
}

interface PatientTreatment {
  patientId: string;
  completionPercent: number;
  currentStage: string;
  lastProcedure: { name: string; date: string; description: string };
  milestones: TreatmentMilestone[];
  badges: { icon: string; label: string; earned: boolean }[];
  recoveryStage: "acute" | "rehabilitation" | "maintenance" | "discharged";
}

const recoveryStageConfig = {
  acute: { label: "Acute Phase", color: "text-coral", bg: "bg-coral-light" },
  rehabilitation: { label: "Rehabilitation", color: "text-amber", bg: "bg-amber-light" },
  maintenance: { label: "Maintenance", color: "text-primary", bg: "bg-lavender-light" },
  discharged: { label: "Discharged", color: "text-sage", bg: "bg-sage-light" },
};

const mockTreatments: Record<string, PatientTreatment> = {
  "p1": {
    patientId: "p1",
    completionPercent: 68,
    currentStage: "Cardiac Rehabilitation Phase II",
    lastProcedure: { name: "Coronary Angioplasty (PCI)", date: "2024-03-15", description: "Drug-eluting stent placed in LAD. No residual stenosis. Dual antiplatelet therapy initiated." },
    milestones: [
      { id: "m1", label: "Pre-operative Assessment", date: "2024-03-10", completed: true, description: "ECG, Echo, blood panel completed" },
      { id: "m2", label: "Procedure Day", date: "2024-03-15", completed: true, description: "PCI with DES - successful" },
      { id: "m3", label: "ICU Discharge", date: "2024-03-17", completed: true, description: "Hemodynamically stable" },
      { id: "m4", label: "Hospital Discharge", date: "2024-03-20", completed: true, description: "Walking independently, BP stable" },
      { id: "m5", label: "1-Week Follow-up", date: "2024-03-27", completed: true, description: "Wound healing well, vitals normal" },
      { id: "m6", label: "Cardiac Rehab Start", date: "2024-04-01", completed: true, description: "Phase I complete, Phase II initiated" },
      { id: "m7", label: "4-Week Stress Test", date: "2024-04-15", completed: false, description: "Exercise tolerance test pending" },
      { id: "m8", label: "3-Month Angiography Review", date: "2024-06-15", completed: false, description: "Stent patency assessment" },
    ],
    badges: [
      { icon: "🏥", label: "Procedure Complete", earned: true },
      { icon: "🚶", label: "First Walk", earned: true },
      { icon: "💊", label: "7-Day Adherence", earned: true },
      { icon: "❤️", label: "Cardiac Rehab Started", earned: true },
      { icon: "🏃", label: "Stress Test Clear", earned: false },
      { icon: "⭐", label: "Full Recovery", earned: false },
    ],
    recoveryStage: "rehabilitation",
  },
  "p2": {
    patientId: "p2",
    completionPercent: 45,
    currentStage: "Insulin Optimization & Lifestyle Modification",
    lastProcedure: { name: "Diabetic Foot Debridement", date: "2024-02-28", description: "Surgical debridement of neuropathic ulcer (Wagner Grade 2) on right heel. Negative pressure wound therapy initiated." },
    milestones: [
      { id: "m1", label: "Wound Assessment", date: "2024-02-25", completed: true, description: "Wagner Grade 2 classification" },
      { id: "m2", label: "Surgical Debridement", date: "2024-02-28", completed: true, description: "Clean wound bed achieved" },
      { id: "m3", label: "NPWT Initiation", date: "2024-03-01", completed: true, description: "VAC therapy commenced" },
      { id: "m4", label: "Wound 50% Closure", date: "2024-03-20", completed: false, description: "Granulation tissue forming" },
      { id: "m5", label: "Full Wound Closure", date: "2024-04-15", completed: false, description: "Complete epithelialization" },
      { id: "m6", label: "Offloading Boot Fitted", date: "2024-04-20", completed: false, description: "Custom orthotic device" },
      { id: "m7", label: "3-Month Follow-up", date: "2024-05-28", completed: false, description: "Recurrence screening" },
    ],
    badges: [
      { icon: "🔬", label: "Assessment Done", earned: true },
      { icon: "🩹", label: "Surgery Complete", earned: true },
      { icon: "📈", label: "Wound Improving", earned: true },
      { icon: "🦶", label: "Wound Closed", earned: false },
      { icon: "👟", label: "Orthotic Fitted", earned: false },
    ],
    recoveryStage: "acute",
  },
  "p3": {
    patientId: "p3",
    completionPercent: 82,
    currentStage: "Maintenance Phase - Biologic Therapy",
    lastProcedure: { name: "Joint Aspiration & Steroid Injection", date: "2024-01-10", description: "Ultrasound-guided aspiration of right knee effusion. 40mg Triamcinolone acetonide injected intra-articularly." },
    milestones: [
      { id: "m1", label: "Flare Assessment", date: "2024-01-08", completed: true, description: "DAS28 score: 5.8 (high activity)" },
      { id: "m2", label: "Joint Aspiration", date: "2024-01-10", completed: true, description: "30ml synovial fluid drained" },
      { id: "m3", label: "Steroid Injection", date: "2024-01-10", completed: true, description: "Triamcinolone 40mg administered" },
      { id: "m4", label: "1-Week Response Check", date: "2024-01-17", completed: true, description: "Significant swelling reduction" },
      { id: "m5", label: "Biologic Dose Adjustment", date: "2024-02-01", completed: true, description: "Adalimumab dose optimized" },
      { id: "m6", label: "3-Month DAS28", date: "2024-04-10", completed: false, description: "Target: DAS28 < 3.2 (low activity)" },
    ],
    badges: [
      { icon: "💉", label: "Procedure Done", earned: true },
      { icon: "📉", label: "Swelling Reduced", earned: true },
      { icon: "💊", label: "Biologic Optimized", earned: true },
      { icon: "🎯", label: "Low Disease Activity", earned: false },
      { icon: "⭐", label: "Remission Achieved", earned: false },
    ],
    recoveryStage: "maintenance",
  },
};

export default function TreatmentProgressPage() {
  const { patients } = usePatientData();
  const navigate = useNavigate();
  const { id: patientIdParam } = useParams();

  // If accessed with a patient ID param, scope to that patient
  const treatmentPatients = patientIdParam
    ? patients.filter(p => p.id === patientIdParam && mockTreatments[p.id])
    : patients.filter(p => mockTreatments[p.id]);

  const [selectedPatient, setSelectedPatient] = useState<string>(patientIdParam || "p1");

  const treatment = mockTreatments[selectedPatient];
  const patient = patients.find(p => p.id === selectedPatient);

  if (!treatment || !patient) return (
    <div>
      <DashboardHeader title="Treatment Progress" subtitle="Gamified recovery tracking" />
      <div className="card-healthcare p-12 text-center text-muted-foreground">No treatment data available for this patient</div>
    </div>
  );

  const stageConfig = recoveryStageConfig[treatment.recoveryStage];
  const completedCount = treatment.milestones.filter(m => m.completed).length;

  return (
    <div>
      <DashboardHeader title="Treatment Progress" subtitle="Gamified recovery tracking with milestones and achievements" />

      {/* Patient selector */}
      {!patientIdParam && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {treatmentPatients.map((p) => {
            const t = mockTreatments[p.id];
            const isActive = selectedPatient === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPatient(p.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded text-[13px] font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground glow-primary"
                    : "glass-card text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                <span className="text-sm">{p.avatar}</span>
                {p.name}
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${isActive ? "bg-primary-foreground/20" : "bg-muted"}`}>
                  {t.completionPercent}%
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Main progress */}
        <div className="space-y-5">
          {/* Progress overview card */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                  {patient.avatar}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">{patient.name}</h3>
                  <p className="text-[11px] text-muted-foreground">{patient.age}y · {treatment.currentStage}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] px-2.5 py-1 rounded font-semibold ${stageConfig.bg} ${stageConfig.color}`}>
                  {stageConfig.label}
                </span>
                <button onClick={() => navigate(`/patient/${patient.id}`)} className="p-1.5 rounded hover:bg-muted transition-colors">
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Big progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground font-medium">Treatment Completion</span>
                <span className="text-primary font-bold text-base">{treatment.completionPercent}%</span>
              </div>
              <Progress value={treatment.completionPercent} className="h-3 bg-muted" />
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>{completedCount} of {treatment.milestones.length} milestones</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Est. completion: 8 weeks</span>
              </div>
            </div>
          </motion.div>

          {/* Last Surgical Procedure */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5 border-l-[3px] border-l-secondary">
            <div className="flex items-center gap-2 mb-3">
              <Stethoscope className="w-4 h-4 text-secondary" />
              <h3 className="text-[13px] font-semibold text-foreground">Last Surgical Procedure</h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium mb-1">Procedure</p>
                <p className="text-sm font-semibold text-foreground">{treatment.lastProcedure.name}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium mb-1">Date</p>
                <p className="text-sm font-medium text-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />{treatment.lastProcedure.date}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium mb-1">Status</p>
                <p className="text-sm font-medium text-sage flex items-center gap-1"><CheckCircle className="w-3 h-3" />Completed</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed border-t border-border/30 pt-3">{treatment.lastProcedure.description}</p>
          </motion.div>

          {/* Treatment Timeline */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
            <h3 className="text-[13px] font-semibold text-foreground mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />Treatment Timeline
            </h3>
            <div className="relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-border" />
              <div className="space-y-3">
                {treatment.milestones.map((milestone, i) => (
                  <motion.div
                    key={milestone.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-start gap-3 ${!milestone.completed ? "opacity-60" : ""}`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                      milestone.completed
                        ? "bg-sage text-primary-foreground"
                        : "bg-muted border-2 border-border text-muted-foreground"
                    }`}>
                      {milestone.completed ? <CheckCircle className="w-3.5 h-3.5" /> : <Circle className="w-3 h-3" />}
                    </div>
                    <div className="flex-1 glass-card p-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[13px] font-semibold text-foreground">{milestone.label}</p>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Calendar className="w-2.5 h-2.5" />{milestone.date}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{milestone.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right: Badges & Stats */}
        <div className="space-y-5">
          {/* Badges */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5">
            <h3 className="text-[13px] font-semibold text-foreground mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber" />Achievement Badges
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {treatment.badges.map((badge, i) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded border transition-all ${
                    badge.earned
                      ? "border-amber/30 bg-amber-light/50"
                      : "border-border/30 bg-muted/30 opacity-40 grayscale"
                  }`}
                >
                  <span className="text-xl">{badge.icon}</span>
                  <span className="text-[9px] text-center font-medium text-foreground leading-tight">{badge.label}</span>
                  {badge.earned && <Star className="w-3 h-3 text-amber" />}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-5 space-y-3">
            <h3 className="text-[13px] font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />Recovery Stats
            </h3>
            {[
              { label: "Days Since Procedure", value: "25", icon: Clock },
              { label: "Milestones Completed", value: `${completedCount}/${treatment.milestones.length}`, icon: Target },
              { label: "Badges Earned", value: `${treatment.badges.filter(b => b.earned).length}/${treatment.badges.length}`, icon: Award },
              { label: "Adherence Score", value: "94%", icon: Zap },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div className="flex items-center gap-2">
                  <stat.icon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-[11px] text-muted-foreground">{stat.label}</span>
                </div>
                <span className="text-sm font-bold font-display text-foreground">{stat.value}</span>
              </div>
            ))}
          </motion.div>

          {/* Recovery Stage Indicator */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
            <h3 className="text-[13px] font-semibold text-foreground mb-3">Recovery Stages</h3>
            <div className="space-y-2">
              {(["acute", "rehabilitation", "maintenance", "discharged"] as const).map((stage, i) => {
                const config = recoveryStageConfig[stage];
                const isCurrent = treatment.recoveryStage === stage;
                const isPast = ["acute", "rehabilitation", "maintenance", "discharged"].indexOf(treatment.recoveryStage) > i;
                return (
                  <div key={stage} className={`flex items-center gap-2 p-2 rounded transition-all ${isCurrent ? config.bg + " border border-current/10" : ""}`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      isPast ? "bg-sage text-primary-foreground" : isCurrent ? "bg-primary text-primary-foreground animate-pulse" : "bg-muted text-muted-foreground"
                    }`}>
                      {isPast ? <CheckCircle className="w-3 h-3" /> : <span className="text-[8px] font-bold">{i + 1}</span>}
                    </div>
                    <span className={`text-[11px] font-medium ${isCurrent ? config.color : isPast ? "text-foreground" : "text-muted-foreground"}`}>
                      {config.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
