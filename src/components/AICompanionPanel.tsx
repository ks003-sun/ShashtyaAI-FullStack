import { motion } from "framer-motion";
import { Brain, Sparkles, TrendingUp, AlertTriangle, Activity } from "lucide-react";

const aiSummaries = [
  {
    icon: AlertTriangle,
    title: "Critical Alerts Today",
    value: "3",
    description: "2 patients showing deteriorating vitals, 1 medication conflict detected",
    color: "coral" as const,
  },
  {
    icon: TrendingUp,
    title: "Disease Progression",
    value: "7 patients",
    description: "Showing measurable changes in chronic condition markers this week",
    color: "amber" as const,
  },
  {
    icon: Activity,
    title: "Positive Outcomes",
    value: "12 patients",
    description: "Blood pressure or blood sugar targets met in the last 30 days",
    color: "sage" as const,
  },
  {
    icon: Sparkles,
    title: "AI Predictions",
    value: "92%",
    description: "Average confidence across 1,243 health insights generated this month",
    color: "teal" as const,
  },
];

const colorMap = {
  sage: { bg: "bg-sage-light", text: "text-sage" },
  coral: { bg: "bg-coral-light", text: "text-coral" },
  amber: { bg: "bg-amber-light", text: "text-amber" },
  teal: { bg: "bg-teal-light", text: "text-teal" },
};

export default function AICompanionPanel() {
  return (
    <div className="card-healthcare p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-display text-lg text-foreground">ShastyaAI Companion</h3>
          <p className="text-xs text-muted-foreground">Probabilistic health engine · Real-time monitoring</p>
        </div>
      </div>

      <div className="space-y-4">
        {aiSummaries.map((item, i) => {
          const c = colorMap[item.color];
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${c.bg}`}>
                <item.icon className={`w-4 h-4 ${c.text}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-foreground">{item.title}</p>
                  <span className={`text-sm font-bold ${c.text}`}>{item.value}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">{item.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
