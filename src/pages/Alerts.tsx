import { motion } from "framer-motion";
import { AlertTriangle, Activity, Heart, Bone, Clock, MapPin, Mic, CheckCircle2, XCircle } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import { usePatientData } from "@/context/PatientDataContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const eventTypeConfig = {
  fall: { icon: Bone, label: "Fall", bg: "bg-coral-light", text: "text-coral" },
  hospitalization: { icon: Heart, label: "Hospitalization", bg: "bg-coral-light", text: "text-coral" },
  vitals_change: { icon: Activity, label: "Vitals Change", bg: "bg-amber-light", text: "text-amber" },
  ailment: { icon: AlertTriangle, label: "Ailment", bg: "bg-amber-light", text: "text-amber" },
};

const sosTypeColors: Record<string, string> = {
  cardiac: "text-red-600 bg-red-100",
  respiratory: "text-orange-600 bg-orange-100",
  fall: "text-amber-700 bg-amber-100",
  neurological: "text-purple-600 bg-purple-100",
  general: "text-muted-foreground bg-muted",
};

export default function Alerts() {
  const { patients, sosEvents, acknowledgeSOS } = usePatientData();
  const navigate = useNavigate();

  const alertPatients = patients
    .filter((p) => p.recentEvents && p.recentEvents.length > 0)
    .sort((a, b) => {
      const riskOrder = { high: 0, medium: 1, low: 2 };
      return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
    });

  const unacknowledgedSOS = sosEvents.filter((e) => !e.acknowledged);
  const acknowledgedSOS = sosEvents.filter((e) => e.acknowledged);

  return (
    <div>
      <DashboardHeader title="Alerts & Events" subtitle="SOS events, high-risk patients, recent falls, ailments, or vital changes" />

      {/* SOS Events Section */}
      {sosEvents.length > 0 && (
        <div className="mb-8">
          <h2 className="font-display text-lg text-foreground mb-4 flex items-center gap-2">
            <Mic className="w-5 h-5 text-red-500" />
            SOS Emergency Events
            {unacknowledgedSOS.length > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-red-600 text-white text-xs font-bold animate-pulse">
                {unacknowledgedSOS.length} NEW
              </span>
            )}
          </h2>

          <div className="space-y-3">
            {sosEvents.map((event, i) => {
              const typeColor = sosTypeColors[event.emergencyType] || sosTypeColors.general;
              const time = new Date(event.timestamp);
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`card-healthcare p-4 border-l-4 ${event.acknowledged ? "border-l-muted-foreground/30" : "border-l-red-600"}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span
                          className="font-medium text-foreground cursor-pointer hover:text-primary transition-colors"
                          onClick={() => navigate(`/patient/${event.patientId}`)}
                        >
                          {event.patientName}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${typeColor}`}>
                          {event.emergencyType}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {time.toLocaleDateString()} {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mb-1">{event.predictedIssue}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Keyword: <span className="font-medium text-red-500">"{event.detectedKeyword}"</span></span>
                      </div>
                      {event.transcript && (
                        <p className="text-[11px] text-muted-foreground mt-1 italic truncate">"{event.transcript}"</p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {event.acknowledged ? (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle2 className="w-4 h-4" /> Acknowledged
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => acknowledgeSOS(event.id)}
                          className="text-xs"
                        >
                          Acknowledge
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Regular Alerts */}
      <div className="grid gap-4">
        {alertPatients.map((patient, i) => (
          <motion.div
            key={patient.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="card-healthcare p-5 cursor-pointer hover:shadow-md transition-all"
            onClick={() => navigate(`/patient/${patient.id}`)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-accent-foreground">
                  {patient.avatar}
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{patient.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{patient.age}y · {patient.gender}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{patient.location}</span>
                  </div>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${patient.riskLevel === "high" ? "badge-risk-high" : patient.riskLevel === "medium" ? "badge-risk-medium" : "badge-risk-low"}`}>
                {patient.riskLevel.toUpperCase()} RISK
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {patient.conditions.map((c) => (
                <span key={c} className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-medium">{c}</span>
              ))}
            </div>

            <div className="space-y-2.5">
              {patient.recentEvents?.map((event, j) => {
                const config = eventTypeConfig[event.type];
                return (
                  <div key={j} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                      <config.icon className={`w-4 h-4 ${config.text}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase ${config.text}`}>{config.label}</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />{event.date}
                        </span>
                      </div>
                      <p className="text-xs text-foreground mt-0.5">{event.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
