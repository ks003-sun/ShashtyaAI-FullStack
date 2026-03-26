import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, TrendingUp, AlertTriangle, Activity, Send } from "lucide-react";
import ShastyaLogo from "@/components/ShastyaLogo";

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

const chatMessages = [
  "Good morning, Dr. Singh. 3 patients require urgent attention today.",
  "Kamala Devi Sharma's BP has spiked to 162/98 — consider scheduling a review.",
  "Medication adherence dropped for Rajesh Kumar Verma this week.",
  "Positive trend: Lakshmi Narayanan's HbA1c improved by 0.4% over 30 days.",
];

export default function AICompanionPanel() {
  const [currentMsg, setCurrentMsg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrentMsg((c) => (c + 1) % chatMessages.length), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card-healthcare p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <ShastyaLogo height={32} />
          <div>
            <h3 className="font-display text-lg text-foreground">AI Companion</h3>
            <p className="text-[10px] text-muted-foreground">Probabilistic health engine · Real-time monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
          <span className="text-[10px] text-sage font-medium">Live</span>
        </div>
      </div>

      {/* Chat-style assistant message */}
      <div className="rounded-xl bg-muted/40 border border-border/30 p-4 mb-5">
        <AnimatePresence mode="wait">
          <motion.div key={currentMsg} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Brain className="w-3.5 h-3.5 text-primary" />
            </div>
            <p className="text-sm text-foreground leading-relaxed">{chatMessages[currentMsg]}</p>
          </motion.div>
        </AnimatePresence>
        <div className="flex items-center gap-2 mt-3">
          <div className="flex-1 h-8 rounded-lg bg-card/60 border border-border/30 px-3 flex items-center text-[11px] text-muted-foreground">
            Ask ShastyaAI anything...
          </div>
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Send className="w-3.5 h-3.5 text-primary" />
          </div>
        </div>
      </div>

      {/* Quick insight cards in a horizontal row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {aiSummaries.map((item, i) => {
          const c = colorMap[item.color];
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${c.bg}`}>
                <item.icon className={`w-4 h-4 ${c.text}`} />
              </div>
              <span className={`text-lg font-bold ${c.text}`}>{item.value}</span>
              <p className="text-[10px] text-muted-foreground mt-0.5">{item.title}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
