import { motion } from "framer-motion";
import { Pill, AlertTriangle } from "lucide-react";
import { Medication } from "@/data/mockPatients";

export default function MedicationList({ medications }: { medications: Medication[] }) {
  return (
    <div className="space-y-3">
      {medications.map((med, i) => (
        <motion.div
          key={med.name}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className={`card-healthcare p-4 ${med.conflicts?.length ? "border-coral/30" : ""}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                med.conflicts?.length ? "bg-coral-light" : "bg-sage-light"
              }`}>
                <Pill className={`w-4 h-4 ${med.conflicts?.length ? "text-coral" : "text-sage"}`} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">{med.name}</h4>
                <p className="text-xs text-muted-foreground">{med.dosage} · {med.frequency}</p>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{med.purpose}</span>
          </div>
          {med.conflicts && med.conflicts.length > 0 && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-coral-light/50">
              <AlertTriangle className="w-3.5 h-3.5 text-coral" />
              <span className="text-[11px] text-coral font-medium">
                Conflicts with: {med.conflicts.join(", ")}
              </span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
