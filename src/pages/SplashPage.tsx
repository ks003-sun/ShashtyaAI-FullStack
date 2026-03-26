import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, HeartPulse, Activity, TrendingUp, Dna, Sparkles } from "lucide-react";
import ShastyaLogo from "@/components/ShastyaLogo";

function AnimatedRiskScore() {
  const [score, setScore] = useState(42);
  useEffect(() => {
    const interval = setInterval(() => {
      setScore((s) => {
        const next = s + Math.floor(Math.random() * 7) - 3;
        return Math.max(20, Math.min(85, next));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const color = score > 65 ? "text-coral" : score > 45 ? "text-amber" : "text-sage";

  return (
    <motion.div
      className="backdrop-blur-xl bg-card/30 border border-border/30 rounded-2xl p-5 space-y-3"
      whileHover={{ scale: 1.03, boxShadow: "0 0 30px hsl(var(--teal) / 0.15)" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Activity className="w-3.5 h-3.5 text-teal" />
        Live Risk Assessment
      </div>
      <div className="flex items-end gap-2">
        <motion.span key={score} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`text-4xl font-bold font-display ${color}`}>{score}</motion.span>
        <span className="text-muted-foreground text-sm mb-1">/100</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-sage via-amber to-coral" animate={{ width: `${score}%` }} transition={{ duration: 1, ease: "easeOut" }} />
      </div>
    </motion.div>
  );
}

function FlowingDataLines() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--teal))" stopOpacity="0" />
          <stop offset="50%" stopColor="hsl(var(--teal))" stopOpacity="1" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.line key={i} x1="-200" y1={150 + i * 120} x2="2200" y2={100 + i * 130} stroke="url(#lineGrad)" strokeWidth="1.5" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: [0, 0.6, 0] }} transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.8 }} />
      ))}
    </svg>
  );
}

function PredictiveGraph() {
  const points = "0,60 30,55 60,62 90,48 120,52 150,38 180,42 210,30 240,35 270,25";
  const predictedPoints = "270,25 300,20 330,22 360,15";

  return (
    <motion.div className="backdrop-blur-xl bg-card/30 border border-border/30 rounded-2xl p-5" whileHover={{ scale: 1.03, boxShadow: "0 0 30px hsl(var(--primary) / 0.15)" }} transition={{ type: "spring", stiffness: 300 }}>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
        <TrendingUp className="w-3.5 h-3.5 text-primary" />HbA1c Predictive Trend
      </div>
      <svg viewBox="0 0 380 80" className="w-full h-16">
        <motion.polyline points={points} fill="none" stroke="hsl(var(--teal))" strokeWidth="2" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.5 }} />
        <motion.polyline points={predictedPoints} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 2.5 }} />
        <motion.circle cx="270" cy="25" r="3" fill="hsl(var(--teal))" initial={{ scale: 0 }} animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 2.5 }} />
      </svg>
      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
        <span>6 months ago</span>
        <span className="text-primary font-medium">AI Predicted →</span>
      </div>
    </motion.div>
  );
}

function AICompanionPreview() {
  const messages = [
    "Analyzing vitals for 142 patients...",
    "3 medication conflicts detected",
    "Kamala Devi Sharma — Fall risk elevated 23%",
    "Recommending nephrology consult for Mohan Lal Iyer",
  ];
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setCurrent((c) => (c + 1) % messages.length), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div className="backdrop-blur-xl bg-card/30 border border-border/30 rounded-2xl p-5" whileHover={{ scale: 1.03, boxShadow: "0 0 30px hsl(var(--teal) / 0.15)" }} transition={{ type: "spring", stiffness: 300 }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Brain className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-xs font-medium text-foreground">AI Companion</p>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
            <span className="text-[10px] text-sage">Active</span>
          </div>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.p key={current} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="text-xs text-muted-foreground leading-relaxed">
          <Sparkles className="w-3 h-3 inline mr-1 text-teal" />{messages[current]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}

function VitalsMini() {
  const [bpm, setBpm] = useState(72);
  useEffect(() => {
    const interval = setInterval(() => setBpm((b) => b + Math.floor(Math.random() * 5) - 2), 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div className="backdrop-blur-xl bg-card/30 border border-border/30 rounded-2xl p-5" whileHover={{ scale: 1.03, boxShadow: "0 0 30px hsl(var(--coral) / 0.1)" }} transition={{ type: "spring", stiffness: 300 }}>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
        <HeartPulse className="w-3.5 h-3.5 text-coral" />Live Vitals Stream
      </div>
      <div className="flex items-center gap-3">
        <motion.span key={bpm} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="text-3xl font-bold font-display text-coral">{bpm}</motion.span>
        <span className="text-muted-foreground text-xs">BPM avg</span>
      </div>
      <div className="flex gap-[3px] mt-2 h-6 items-end">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div key={i} className="w-1.5 rounded-full bg-coral/40" animate={{ height: [8, 12 + Math.random() * 12, 8] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.06 }} />
        ))}
      </div>
    </motion.div>
  );
}

export default function SplashPage() {
  const navigate = useNavigate();
  const [transitioning, setTransitioning] = useState(false);

  const handleEnter = () => {
    setTransitioning(true);
    setTimeout(() => navigate("/login"), 1200);
  };

  return (
    <AnimatePresence>
      <motion.div className="relative min-h-screen overflow-hidden bg-background" initial={{ opacity: 1 }} animate={transitioning ? { opacity: 0, scale: 1.05 } : { opacity: 1 }} transition={{ duration: 1 }}>
        <FlowingDataLines />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-teal/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

        <AnimatePresence>
          {transitioning && (
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-background" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
              <motion.div className="flex flex-col items-center gap-4">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, ease: "linear", repeat: Infinity }}>
                  <ShastyaLogo height={48} />
                </motion.div>
                <motion.p className="text-sm text-muted-foreground" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}>Initializing AI Systems...</motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 min-h-screen flex flex-col">
          <motion.header className="flex items-center justify-between" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <ShastyaLogo height={44} />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Dna className="w-3.5 h-3.5 text-teal" />
              <span>Universal Health ID · Probabilistic Engine</span>
            </div>
          </motion.header>

          <div className="flex-1 flex items-center">
            <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
              <motion.div className="space-y-8" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
                <div className="space-y-4">
                  <motion.div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal/10 border border-teal/20 text-xs text-teal font-medium" animate={{ boxShadow: ["0 0 0px hsl(var(--teal) / 0)", "0 0 20px hsl(var(--teal) / 0.15)", "0 0 0px hsl(var(--teal) / 0)"] }} transition={{ duration: 3, repeat: Infinity }}>
                    <Sparkles className="w-3 h-3" />AI-Powered Geriatric Care Platform
                  </motion.div>
                  <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground leading-[1.1]">
                    A Unified Intelligence Agent for{" "}
                    <span className="bg-gradient-to-r from-primary to-teal bg-clip-text text-transparent">Lifelong Care</span>
                  </h1>
                  <p className="text-muted-foreground text-lg max-w-lg leading-relaxed">Predict chronic disease progression. Monitor medication conflicts. Connect family health histories through Universal Health ID.</p>
                </div>
                <div className="flex items-center gap-4">
                  <motion.button onClick={handleEnter} className="group relative px-8 py-4 rounded-xl bg-primary text-primary-foreground font-medium text-base overflow-hidden" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <span className="relative z-10 flex items-center gap-2">Enter Platform<motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span></span>
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-primary via-teal to-primary" animate={{ x: ["-100%", "100%"] }} transition={{ duration: 3, repeat: Infinity }} style={{ opacity: 0.3 }} />
                  </motion.button>
                  <span className="text-xs text-muted-foreground">HIPAA Compliant · AES-256 Encrypted</span>
                </div>
              </motion.div>

              <motion.div className="grid grid-cols-2 gap-4" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
                <div className="space-y-4"><AnimatedRiskScore /><PredictiveGraph /></div>
                <div className="space-y-4 mt-6"><AICompanionPreview /><VitalsMini /></div>
              </motion.div>
            </div>
          </div>

          <motion.footer className="flex flex-wrap items-center justify-center gap-8 py-6 border-t border-border/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
            {[
              { label: "Patients Monitored", value: "1,243" },
              { label: "AI Predictions", value: "92% Accuracy" },
              { label: "Health IDs Linked", value: "4,800+" },
              { label: "Medication Conflicts Caught", value: "387" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-lg font-bold font-display text-foreground">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </motion.footer>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
