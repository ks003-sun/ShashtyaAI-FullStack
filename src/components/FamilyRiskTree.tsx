import { motion } from "framer-motion";
import { Users, AlertCircle, ArrowRight } from "lucide-react";
import { FamilyMember } from "@/data/mockPatients";

export default function FamilyRiskTree({ members, patientName }: { members: FamilyMember[]; patientName: string }) {
  if (members.length === 0) {
    return (
      <div className="card-healthcare p-8 text-center">
        <Users className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">No family health connections linked</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Root patient */}
      <div className="card-healthcare p-4 border-primary/30 border-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Users className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{patientName}</p>
            <p className="text-[10px] text-muted-foreground">Index Patient</p>
          </div>
        </div>
      </div>

      {/* Connections */}
      {members.map((member, i) => (
        <motion.div
          key={member.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}
          className="ml-8 relative"
        >
          <div className="absolute left-[-20px] top-0 bottom-0 w-px bg-border" />
          <div className="absolute left-[-20px] top-5 w-5 h-px bg-border" />
          <div className="card-healthcare p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-lavender-light flex items-center justify-center text-xs font-bold text-lavender">
                  {member.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{member.name}</p>
                  <p className="text-[10px] text-muted-foreground">{member.relation} · {member.healthId}</p>
                </div>
              </div>
            </div>

            {member.conditions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {member.conditions.map(c => (
                  <span key={c} className="px-2 py-0.5 rounded-full bg-amber-light text-amber text-[10px] font-medium">{c}</span>
                ))}
              </div>
            )}

            <div className="space-y-2">
              {member.riskFactors.map((risk, j) => (
                <div key={j} className="flex items-center gap-2 text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5 text-coral flex-shrink-0" />
                  <span className="text-muted-foreground">{risk}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
