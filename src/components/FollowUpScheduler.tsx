import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Plus, Check, X, User, Bell } from "lucide-react";
import { usePatientData, type FollowUp } from "@/context/PatientDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FollowUpSchedulerProps {
  patientId?: string;
  showAll?: boolean;
}

export default function FollowUpScheduler({ patientId, showAll = false }: FollowUpSchedulerProps) {
  const { patients, followUps, addFollowUp, completeFollowUp } = usePatientData();
  const [showForm, setShowForm] = useState(false);
  const [formPatientId, setFormPatientId] = useState(patientId || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState<"routine" | "urgent" | "critical">("routine");

  const displayFollowUps = patientId
    ? followUps.filter((f) => f.patientId === patientId)
    : followUps;

  const upcoming = displayFollowUps
    .filter((f) => f.status === "scheduled")
    .sort((a, b) => a.date.localeCompare(b.date));

  const completed = displayFollowUps.filter((f) => f.status === "completed");

  const handleSubmit = () => {
    if (!formPatientId || !date || !reason) return;
    addFollowUp({
      patientId: formPatientId,
      date,
      time,
      reason,
      notes,
      priority,
      status: "scheduled",
      createdBy: "Dr. Rithika Singh",
    });
    setShowForm(false);
    setDate("");
    setTime("10:00");
    setReason("");
    setNotes("");
    setPriority("routine");
  };

  const priorityStyles = {
    routine: "bg-secondary text-secondary-foreground",
    urgent: "bg-amber-light text-amber",
    critical: "bg-destructive/10 text-destructive",
  };

  const getPatientName = (id: string) => patients.find((p) => p.id === id)?.name || id;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-foreground flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" /> {patientId ? "Follow-ups" : "All Scheduled Follow-ups"}
        </h2>
        {!showForm && (
          <Button size="sm" onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="w-3.5 h-3.5 mr-1" /> Schedule
          </Button>
        )}
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card-healthcare p-5 border-l-2 border-l-primary space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">New Follow-up</h3>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
          </div>

          {!patientId && (
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-muted-foreground">Patient</label>
              <select
                value={formPatientId}
                onChange={(e) => setFormPatientId(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-card/40 px-3 text-xs text-foreground"
              >
                <option value="">Select patient…</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.healthId})</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-muted-foreground">Date</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-card/40 border-border/40 h-9 text-xs" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-muted-foreground">Time</label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="bg-card/40 border-border/40 h-9 text-xs" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-medium text-muted-foreground">Reason</label>
            <Input placeholder="e.g. BP recheck, HbA1c review" value={reason} onChange={(e) => setReason(e.target.value)} className="bg-card/40 border-border/40 h-9 text-xs" />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-medium text-muted-foreground">Priority</label>
            <div className="flex gap-2">
              {(["routine", "urgent", "critical"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`px-3 py-1 rounded-full text-[10px] font-medium capitalize transition-all ${
                    priority === p ? priorityStyles[p] + " ring-1 ring-current" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-medium text-muted-foreground">Notes</label>
            <Textarea placeholder="Additional notes..." value={notes} onChange={(e) => setNotes(e.target.value)} className="bg-card/40 border-border/40 min-h-[40px] text-xs" />
          </div>

          <Button onClick={handleSubmit} size="sm" disabled={!formPatientId || !date || !reason}>
            <Calendar className="w-3.5 h-3.5 mr-1" /> Schedule Follow-up
          </Button>
        </motion.div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 ? (
        <div className="space-y-2">
          {upcoming.map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-healthcare p-4 flex items-center gap-3"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-primary" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                {!patientId && (
                  <p className="text-[10px] text-primary font-medium flex items-center gap-1">
                    <User className="w-2.5 h-2.5" /> {getPatientName(f.patientId)}
                  </p>
                )}
                <p className="text-xs font-medium text-foreground truncate">{f.reason}</p>
                <p className="text-[10px] text-muted-foreground flex items-center gap-2">
                  <Clock className="w-2.5 h-2.5" /> {f.date} at {f.time}
                </p>
                {f.notes && <p className="text-[10px] text-muted-foreground mt-0.5 italic">{f.notes}</p>}
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium capitalize ${priorityStyles[f.priority]}`}>
                {f.priority}
              </span>
              <button
                onClick={() => completeFollowUp(f.id)}
                className="w-7 h-7 rounded-full bg-accent/10 hover:bg-accent/20 flex items-center justify-center transition-colors"
                title="Mark complete"
              >
                <Check className="w-3.5 h-3.5 text-accent" />
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground italic">No upcoming follow-ups</p>
      )}

      {completed.length > 0 && (
        <details className="mt-2">
          <summary className="text-[10px] text-muted-foreground cursor-pointer hover:text-foreground">
            {completed.length} completed follow-up{completed.length > 1 ? "s" : ""}
          </summary>
          <div className="space-y-1 mt-2">
            {completed.slice(0, 5).map((f) => (
              <div key={f.id} className="card-healthcare p-3 opacity-60">
                <p className="text-[10px] text-muted-foreground line-through">{f.reason} — {f.date}</p>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
