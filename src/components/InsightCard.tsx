import { motion } from "framer-motion";
import { AlertTriangle, AlertCircle, Info, CheckCircle } from "lucide-react";
import { HealthInsight } from "@/data/mockPatients";

const typeConfig = {
  critical: { icon: AlertTriangle, bg: "bg-coral-light", text: "text-coral", border: "border-coral/20" },
  warning: { icon: AlertCircle, bg: "bg-amber-light", text: "text-amber", border: "border-amber/20" },
  info: { icon: Info, bg: "bg-teal-light", text: "text-teal", border: "border-teal/20" },
  positive: { icon: CheckCircle, bg: "bg-sage-light", text: "text-sage", border: "border-sage/20" },
};

export default function InsightCard({ insight, index }: { insight: HealthInsight; index: number }) {
  const config = typeConfig[insight.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className={`card-healthcare p-4 border-l-4 ${config.border}`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bg}`}>
          <config.icon className={`w-4 h-4 ${config.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-medium text-foreground">{insight.title}</h4>
            <span className={`text-[10px] font-bold ${config.text}`}>{insight.confidence}% conf.</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
          <p className="text-[10px] text-muted-foreground mt-2">{insight.date}</p>
        </div>
      </div>
    </motion.div>
  );
}
