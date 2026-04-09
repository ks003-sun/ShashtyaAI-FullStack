import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, TrendingUp, AlertTriangle, Activity, Send } from "lucide-react";
import ShastyaLogo from "@/components/ShastyaLogo";

const aiSummaries = [
  { icon: AlertTriangle, title: "Critical Alerts Today", value: "3", description: "2 patients showing deteriorating vitals, 1 medication conflict detected", color: "coral" as const },
  { icon: TrendingUp, title: "Disease Progression", value: "7 patients", description: "Showing measurable changes in chronic condition markers this week", color: "amber" as const },
  { icon: Activity, title: "Positive Outcomes", value: "12 patients", description: "Blood pressure or blood sugar targets met in the last 30 days", color: "sage" as const },
  { icon: Sparkles, title: "AI Predictions", value: "92%", description: "Average confidence across 1,243 health insights generated this month", color: "teal" as const },
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
    <div className="glass-card p-5 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <ShastyaLogo height={28} />
          <div>
            <h3 className="font-display text-base text-foreground">AI Companion</h3>
            <p className="text-[10px] text-muted-foreground">Probabilistic health engine · Real-time monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[10px] text-accent font-semibold">Live</span>
        </div>
      </div>

      {/* Chat-style assistant message */}
      <div className="rounded-md bg-muted/40 border border-border/30 p-3 mb-4">
        <AnimatePresence mode="wait">
          <motion.div key={currentMsg} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-md bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Brain className="w-3 h-3 text-primary" />
            </div>
            <p className="text-[13px] text-foreground leading-relaxed">{chatMessages[currentMsg]}</p>
          </motion.div>
        </AnimatePresence>
        <div className="flex items-center gap-2 mt-3">
          <div className="flex-1 h-8 rounded-md bg-card/60 border border-border/30 px-3 flex items-center text-[11px] text-muted-foreground">
            Ask MedhaAI anything...
          </div>
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
            <Send className="w-3.5 h-3.5 text-primary" />
          </div>
        </div>
      </div>

      {/* Quick insight cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {aiSummaries.map((item, i) => {
          const c = colorMap[item.color];
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-3 rounded-md bg-muted/40 border border-border/20 hover:border-primary/20 transition-all"
            >
              <div className={`w-7 h-7 rounded-md flex items-center justify-center mb-2 ${c.bg}`}>
                <item.icon className={`w-3.5 h-3.5 ${c.text}`} />
              </div>
              <span className={`text-lg font-bold font-display ${c.text}`}>{item.value}</span>
              <p className="text-[10px] text-muted-foreground mt-0.5">{item.title}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
