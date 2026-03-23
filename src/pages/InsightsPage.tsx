import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Info, AlertCircle, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePatientData } from "@/context/PatientDataContext";
import DashboardHeader from "@/components/DashboardHeader";

const typeConfig = {
  critical: { icon: AlertTriangle, bg: "bg-coral-light", text: "text-coral", label: "Critical" },
  warning: { icon: AlertCircle, bg: "bg-amber-light", text: "text-amber", label: "Warning" },
  info: { icon: Info, bg: "bg-teal-light", text: "text-teal", label: "Info" },
  positive: { icon: CheckCircle, bg: "bg-sage-light", text: "text-sage", label: "Positive" },
};

export default function InsightsPage() {
  const { patients, careSuggestions, toggleSuggestion } = usePatientData();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "critical" | "warning" | "info" | "positive">("all");
  const [selectedPatient, setSelectedPatient] = useState<string>("all");

  const allInsights = patients.flatMap((p) =>
    p.insights.map((ins) => ({
      ...ins,
      patientId: p.id,
      patientName: p.name,
      patientAvatar: p.avatar,
    }))
  );

  const filtered = allInsights
    .filter((ins) => {
      const matchSearch = ins.title.toLowerCase().includes(search.toLowerCase()) || ins.description.toLowerCase().includes(search.toLowerCase()) || ins.patientName.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "all" || ins.type === typeFilter;
      const matchPatient = selectedPatient === "all" || ins.patientId === selectedPatient;
      return matchSearch && matchType && matchPatient;
    })
    .sort((a, b) => {
      const order = { critical: 0, warning: 1, info: 2, positive: 3 };
      return order[a.type] - order[b.type];
    });

  const relevantSuggestions = selectedPatient !== "all" 
    ? careSuggestions.filter(s => s.patientId === selectedPatient)
    : careSuggestions.slice(0, 6);

  return (
    <div>
      <DashboardHeader title="AI Insights" subtitle="Patient-specific analytical observations and care suggestions" />

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search insights..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-card/60 border-border/40" />
        </div>
        <select
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
          className="px-3 py-2 rounded-lg text-xs bg-card border border-border/40 text-foreground"
        >
          <option value="all">All Patients</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <div className="flex gap-1.5">
          {(["all", "critical", "warning", "info", "positive"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                typeFilter === f ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <h3 className="font-display text-lg text-foreground flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Analytical Observations ({filtered.length})
          </h3>
          {filtered.map((insight, i) => {
            const config = typeConfig[insight.type];
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`card-healthcare p-4 border-l-4 border-l-${insight.type === "critical" ? "coral" : insight.type === "warning" ? "amber" : insight.type === "positive" ? "sage" : "teal"}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                    <config.icon className={`w-4 h-4 ${config.text}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-foreground">{insight.title}</h4>
                      <span className={`text-[10px] font-bold ${config.text}`}>{insight.confidence}% conf.</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                      <span className="px-1.5 py-0.5 rounded bg-accent text-accent-foreground font-medium">{insight.patientName}</span>
                      <span>{insight.date}</span>
                      <span className={`${config.text} font-medium`}>{config.label}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="space-y-4">
          <h3 className="font-display text-lg text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal" />
            Daily Care Suggestions
          </h3>
          <p className="text-[11px] text-muted-foreground">Non-medical supportive actions based on patient trends</p>
          {relevantSuggestions.map((suggestion, i) => {
            const categoryColors = { physical: "teal", mental: "lavender", lifestyle: "sage" };
            const color = categoryColors[suggestion.category];
            const patient = patients.find(p => p.id === suggestion.patientId);
            return (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`card-healthcare p-4 ${suggestion.completed ? "opacity-60" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleSuggestion(suggestion.id)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                      suggestion.completed ? `bg-${color} border-${color}` : `border-muted-foreground/40 hover:border-${color}`
                    }`}
                  >
                    {suggestion.completed && <CheckCircle className="w-3 h-3 text-primary-foreground" />}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`text-sm font-medium ${suggestion.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {suggestion.title}
                      </h4>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full bg-${color}-light text-${color} font-medium uppercase`}>
                        {suggestion.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{suggestion.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-muted-foreground">
                        <TrendingUp className="w-3 h-3 inline mr-1" />{suggestion.trigger}
                      </span>
                    </div>
                    {patient && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent text-accent-foreground font-medium mt-1 inline-block">
                        {patient.name}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
