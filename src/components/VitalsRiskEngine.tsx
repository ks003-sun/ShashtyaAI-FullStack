import { useMemo } from "react";
import { motion } from "framer-motion";
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Shield, Activity } from "lucide-react";
import { type Patient, type VitalReading } from "@/data/mockPatients";

interface RiskScore {
  overall: number; // 0-100
  label: "Low" | "Moderate" | "High" | "Critical";
  factors: { name: string; score: number; trend: "rising" | "falling" | "stable"; detail: string }[];
  predictions: string[];
}

function analyzeVitals(patient: Patient): RiskScore {
  const vitals = patient.vitals;
  if (vitals.length < 2) return { overall: 0, label: "Low", factors: [], predictions: [] };

  const latest = vitals[vitals.length - 1];
  const prev = vitals[vitals.length - 2];
  const first = vitals[0];
  const factors: RiskScore["factors"] = [];
  const predictions: string[] = [];

  // BP analysis
  const bpTrend = latest.bloodPressureSys - first.bloodPressureSys;
  const bpScore = Math.min(100, Math.max(0,
    (latest.bloodPressureSys > 140 ? 40 : latest.bloodPressureSys > 130 ? 20 : 0) +
    (bpTrend > 10 ? 30 : bpTrend > 5 ? 15 : bpTrend < -10 ? -10 : 0) +
    (latest.bloodPressureDia > 90 ? 20 : latest.bloodPressureDia > 85 ? 10 : 0)
  ));
  factors.push({
    name: "Blood Pressure",
    score: bpScore,
    trend: bpTrend > 3 ? "rising" : bpTrend < -3 ? "falling" : "stable",
    detail: `${latest.bloodPressureSys}/${latest.bloodPressureDia} mmHg (Δ${bpTrend > 0 ? "+" : ""}${bpTrend} sys)`,
  });
  if (bpScore > 50) predictions.push("Hypertensive crisis risk within 2 weeks if trend continues");

  // Heart Rate
  const hrTrend = latest.heartRate - first.heartRate;
  const hrScore = Math.min(100, Math.max(0,
    (latest.heartRate > 100 ? 40 : latest.heartRate > 90 ? 20 : latest.heartRate < 55 ? 30 : 0) +
    (Math.abs(hrTrend) > 15 ? 30 : Math.abs(hrTrend) > 8 ? 15 : 0)
  ));
  factors.push({
    name: "Heart Rate",
    score: hrScore,
    trend: hrTrend > 3 ? "rising" : hrTrend < -3 ? "falling" : "stable",
    detail: `${latest.heartRate} bpm (Δ${hrTrend > 0 ? "+" : ""}${hrTrend})`,
  });
  if (hrScore > 40 && latest.heartRate > 95) predictions.push("Tachycardia episodes likely — cardiac monitoring advised");

  // Blood Sugar
  const bsTrend = latest.bloodSugar - first.bloodSugar;
  const bsScore = Math.min(100, Math.max(0,
    (latest.bloodSugar > 180 ? 45 : latest.bloodSugar > 150 ? 25 : latest.bloodSugar > 130 ? 10 : 0) +
    (bsTrend > 20 ? 30 : bsTrend > 10 ? 15 : 0)
  ));
  factors.push({
    name: "Blood Sugar",
    score: bsScore,
    trend: bsTrend > 5 ? "rising" : bsTrend < -5 ? "falling" : "stable",
    detail: `${latest.bloodSugar} mg/dL (Δ${bsTrend > 0 ? "+" : ""}${bsTrend})`,
  });
  if (bsScore > 50) predictions.push("HbA1c likely elevated — endocrinology review recommended");

  // SpO2
  const o2Trend = latest.oxygenSat - first.oxygenSat;
  const o2Score = Math.min(100, Math.max(0,
    (latest.oxygenSat < 90 ? 60 : latest.oxygenSat < 93 ? 35 : latest.oxygenSat < 95 ? 15 : 0) +
    (o2Trend < -3 ? 30 : o2Trend < -1 ? 10 : 0)
  ));
  factors.push({
    name: "Oxygen Saturation",
    score: o2Score,
    trend: o2Trend > 1 ? "rising" : o2Trend < -1 ? "falling" : "stable",
    detail: `${latest.oxygenSat}% (Δ${o2Trend > 0 ? "+" : ""}${o2Trend}%)`,
  });
  if (o2Score > 40) predictions.push("Hypoxemia risk — consider home oxygen evaluation");

  // Weight
  const wtTrend = latest.weight - first.weight;
  const wtScore = Math.min(100, Math.max(0,
    (Math.abs(wtTrend) > 8 ? 35 : Math.abs(wtTrend) > 4 ? 15 : 0) +
    (wtTrend > 5 ? 20 : wtTrend < -5 ? 25 : 0)
  ));
  factors.push({
    name: "Weight",
    score: wtScore,
    trend: wtTrend > 2 ? "rising" : wtTrend < -2 ? "falling" : "stable",
    detail: `${latest.weight} lbs (Δ${wtTrend > 0 ? "+" : ""}${wtTrend} lbs)`,
  });
  if (wtTrend > 6) predictions.push("Rapid weight gain — assess fluid retention (CHF decompensation)");
  if (wtTrend < -5) predictions.push("Weight loss trend — nutritional assessment needed");

  // Conditions multiplier
  const condMultiplier = patient.conditions.length >= 3 ? 1.3 : patient.conditions.length >= 2 ? 1.1 : 1.0;
  const overall = Math.min(100, Math.round(
    (factors.reduce((sum, f) => sum + f.score, 0) / factors.length) * condMultiplier
  ));

  const label: RiskScore["label"] =
    overall >= 60 ? "Critical" : overall >= 40 ? "High" : overall >= 20 ? "Moderate" : "Low";

  if (patient.conditions.length >= 3) predictions.push("Multi-morbidity detected — integrated care plan essential");

  return { overall, label, factors, predictions };
}

interface VitalsRiskEngineProps {
  patient: Patient;
}

export default function VitalsRiskEngine({ patient }: VitalsRiskEngineProps) {
  const risk = useMemo(() => analyzeVitals(patient), [patient]);

  const riskColor = {
    Low: "text-accent",
    Moderate: "text-amber",
    High: "text-destructive/80",
    Critical: "text-destructive",
  };

  const riskBg = {
    Low: "bg-accent/10 border-accent/30",
    Moderate: "bg-amber-light border-amber/30",
    High: "bg-destructive/5 border-destructive/20",
    Critical: "bg-destructive/10 border-destructive/30",
  };

  const TrendIcon = ({ trend }: { trend: string }) =>
    trend === "rising" ? <TrendingUp className="w-3 h-3 text-destructive" /> :
    trend === "falling" ? <TrendingDown className="w-3 h-3 text-accent" /> :
    <Activity className="w-3 h-3 text-muted-foreground" />;

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl text-foreground flex items-center gap-2">
        <Brain className="w-5 h-5 text-primary" /> AI Risk Analysis
      </h2>

      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`card-healthcare p-5 border-l-4 ${riskBg[risk.label]}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Composite Risk Score</p>
            <p className={`text-3xl font-bold font-display ${riskColor[risk.label]}`}>
              {risk.overall}<span className="text-sm">/100</span>
            </p>
          </div>
          <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${riskColor[risk.label]} ${riskBg[risk.label]}`}>
            {risk.label === "Critical" && <AlertTriangle className="w-3 h-3 inline mr-1" />}
            {risk.label === "Low" && <Shield className="w-3 h-3 inline mr-1" />}
            {risk.label}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${risk.overall}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full rounded-full ${
              risk.overall >= 60 ? "bg-destructive" :
              risk.overall >= 40 ? "bg-amber" :
              risk.overall >= 20 ? "bg-secondary" : "bg-accent"
            }`}
          />
        </div>
      </motion.div>

      {/* Individual Factors */}
      <div className="space-y-2">
        {risk.factors.map((f, i) => (
          <motion.div
            key={f.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card-healthcare p-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendIcon trend={f.trend} />
                <span className="text-xs font-medium text-foreground">{f.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">{f.detail}</span>
                <span className={`text-[10px] font-bold ${
                  f.score > 40 ? "text-destructive" : f.score > 20 ? "text-amber" : "text-accent"
                }`}>
                  {f.score}
                </span>
              </div>
            </div>
            <div className="w-full h-1 rounded-full bg-muted mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  f.score > 40 ? "bg-destructive" : f.score > 20 ? "bg-amber" : "bg-accent"
                }`}
                style={{ width: `${f.score}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Predictions */}
      {risk.predictions.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Predictive Alerts</p>
          {risk.predictions.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-start gap-2 p-2.5 rounded-lg bg-destructive/5 border border-destructive/10"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-foreground">{p}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
