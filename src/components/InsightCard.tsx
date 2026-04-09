import { motion } from "framer-motion";
import { AlertTriangle, AlertCircle, Info, CheckCircle, Stethoscope } from "lucide-react";
import { HealthInsight } from "@/data/mockPatients";

const typeConfig = {
  critical: { icon: AlertTriangle, bg: "bg-coral-light", text: "text-coral", border: "border-l-coral" },
  warning: { icon: AlertCircle, bg: "bg-amber-light", text: "text-amber", border: "border-l-amber" },
  info: { icon: Info, bg: "bg-teal-light", text: "text-teal", border: "border-l-teal" },
  positive: { icon: CheckCircle, bg: "bg-sage-light", text: "text-sage", border: "border-l-sage" },
};

export default function InsightCard({ insight, index }: { insight: HealthInsight; index: number }) {
  const config = typeConfig[insight.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className={`glass-card p-4 border-l-[3px] ${config.border}`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${config.bg}`}>
          <config.icon className={`w-3.5 h-3.5 ${config.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-[13px] font-semibold text-foreground">{insight.title}</h4>
            <span className={`text-[10px] font-bold ${config.text}`}>{insight.confidence}%</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
          {insight.recommendation && (
            <div className="mt-2 p-2 rounded-md bg-muted/50 border border-border/30 flex items-start gap-2">
              <Stethoscope className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-foreground leading-relaxed">{insight.recommendation}</p>
            </div>
          )}
          <p className="text-[10px] text-muted-foreground mt-2">{insight.date}</p>
        </div>
      </div>
    </motion.div>
  );
}
