import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  color: "sage" | "coral" | "amber" | "teal" | "lavender";
  delay?: number;
}

const colorMap = {
  sage: "bg-sage-light text-sage",
  coral: "bg-coral-light text-coral",
  amber: "bg-amber-light text-amber",
  teal: "bg-teal-light text-teal",
  lavender: "bg-lavender-light text-lavender",
};

export default function StatCard({ icon: Icon, label, value, change, changeType = "neutral", color, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="glass-card p-4 space-y-2 hover:glow-primary transition-shadow duration-300"
    >
      <div className="flex items-center justify-between">
        <div className={`w-9 h-9 rounded flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
        {change && (
          <span className={`text-[11px] font-semibold ${
            changeType === "positive" ? "text-sage" : changeType === "negative" ? "text-coral" : "text-muted-foreground"
          }`}>
            {change}
          </span>
        )}
      </div>
      <div>
        <p className="text-xl font-bold text-foreground font-display">{value}</p>
        <p className="text-[11px] text-muted-foreground">{label}</p>
      </div>
    </motion.div>
  );
}
