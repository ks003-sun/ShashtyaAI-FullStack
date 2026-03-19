import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Fingerprint, Stethoscope, Heart } from "lucide-react";
import { patients } from "@/data/mockPatients";
import VitalsChart from "@/components/VitalsChart";
import MedicationList from "@/components/MedicationList";
import InsightCard from "@/components/InsightCard";
import FamilyRiskTree from "@/components/FamilyRiskTree";

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const patient = patients.find((p) => p.id === id);

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
      {/* Back button + header */}
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
        {/* Left: Vitals + Meds */}
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
        </div>

        {/* Right: Insights + Family */}
        <div className="space-y-6">
          <h2 className="font-display text-xl text-foreground">AI Health Insights</h2>
          <div className="space-y-3">
            {patient.insights.map((insight, i) => (
              <InsightCard key={insight.id} insight={insight} index={i} />
            ))}
          </div>

          <h2 className="font-display text-xl text-foreground">Family Health Links</h2>
          <FamilyRiskTree members={patient.familyMembers} patientName={patient.name} />
        </div>
      </div>
    </div>
  );
}
