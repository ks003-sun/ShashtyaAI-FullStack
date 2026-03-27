import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, TrendingUp, Sparkles, Dna, Shield, Cpu, BarChart3, Microscope } from "lucide-react";
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
      className="border border-border/30 bg-card/60 backdrop-blur-md rounded-xl p-4 space-y-2"
      whileHover={{ scale: 1.02, borderColor: "hsl(var(--primary) / 0.3)" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
        <Activity className="w-3 h-3 text-teal" />
        Live Risk Index
      </div>
      <div className="flex items-end gap-2">
        <motion.span key={score} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className={`text-3xl font-bold font-display ${color}`}>{score}</motion.span>
        <span className="text-muted-foreground text-xs mb-1">/100</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-sage via-amber to-coral" animate={{ width: `${score}%` }} transition={{ duration: 1, ease: "easeOut" }} />
      </div>
    </motion.div>
  );
}

function PredictiveGraph() {
  const points = "0,60 30,55 60,62 90,48 120,52 150,38 180,42 210,30 240,35 270,25";
  const predictedPoints = "270,25 300,20 330,22 360,15";

  return (
    <motion.div className="border border-border/30 bg-card/60 backdrop-blur-md rounded-xl p-4" whileHover={{ scale: 1.02, borderColor: "hsl(var(--primary) / 0.3)" }} transition={{ type: "spring", stiffness: 300 }}>
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-2">
        <TrendingUp className="w-3 h-3 text-primary" />HbA1c Predictive Trend
      </div>
      <svg viewBox="0 0 380 80" className="w-full h-14">
        <motion.polyline points={points} fill="none" stroke="hsl(var(--teal))" strokeWidth="2" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.5 }} />
        <motion.polyline points={predictedPoints} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 2.5 }} />
        <motion.circle cx="270" cy="25" r="3" fill="hsl(var(--teal))" initial={{ scale: 0 }} animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 2.5 }} />
      </svg>
      <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
        <span>6 months ago</span>
        <span className="text-primary font-medium">ML Predicted →</span>
      </div>
    </motion.div>
  );
}

function DataModule({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string; sub: string }) {
  return (
    <motion.div
      className="border border-border/30 bg-card/60 backdrop-blur-md rounded-xl p-4"
      whileHover={{ scale: 1.02, borderColor: "hsl(var(--primary) / 0.3)" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-2">
        <Icon className="w-3 h-3 text-primary" />{label}
      </div>
      <p className="text-2xl font-bold font-display text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
    </motion.div>
  );
}

function GridLines() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      {Array.from({ length: 20 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 60} x2="100%" y2={i * 60} stroke="hsl(var(--primary))" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 30 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 80} y1="0" x2={i * 80} y2="100%" stroke="hsl(var(--primary))" strokeWidth="0.5" />
      ))}
    </svg>
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
      <motion.div className="relative min-h-screen overflow-hidden bg-background" initial={{ opacity: 1 }} animate={transitioning ? { opacity: 0, scale: 1.02 } : { opacity: 1 }} transition={{ duration: 1 }}>
        <GridLines />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/4 blur-[150px] pointer-events-none" />

        <AnimatePresence>
          {transitioning && (
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-background" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
              <motion.div className="flex flex-col items-center gap-4">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, ease: "linear", repeat: Infinity }}>
                  <ShastyaLogo height={128} />
                </motion.div>
                <motion.p className="text-sm text-muted-foreground" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}>Initializing AI Systems...</motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 min-h-screen flex flex-col">
          <motion.header className="flex items-center justify-between" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <ShastyaLogo height={192} />
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider">
              <Dna className="w-3.5 h-3.5 text-primary" />
              <span>Universal Health ID · Probabilistic Engine</span>
            </div>
          </motion.header>

          <div className="flex-1 flex items-center">
            <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
              <motion.div className="space-y-8" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
                <div className="space-y-5">
                  <motion.div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/8 border border-primary/15 text-[10px] text-primary font-semibold uppercase tracking-wider">
                    <Cpu className="w-3 h-3" />AI-Powered Geriatric Care Platform
                  </motion.div>
                  <h1 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] text-foreground leading-[1.1] tracking-tight">
                    A Unified Intelligence Agent for{" "}
                    <span className="text-primary">Lifelong Care</span>
                  </h1>
                  <p className="text-muted-foreground text-base max-w-lg leading-relaxed">
                    Predict chronic disease progression. Monitor medication conflicts. Connect family health histories through Universal Health ID.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <motion.button onClick={handleEnter} className="group relative px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm tracking-wide overflow-hidden" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <span className="relative z-10 flex items-center gap-2">Enter Platform<motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span></span>
                  </motion.button>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <Shield className="w-3 h-3" />
                    <span>HIPAA · AES-256</span>
                  </div>
                </div>
              </motion.div>

              <motion.div className="grid grid-cols-2 gap-3" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
                <div className="space-y-3"><AnimatedRiskScore /><PredictiveGraph /></div>
                <div className="space-y-3 mt-8">
                  <DataModule icon={Microscope} label="Patients Monitored" value="1,243" sub="Across 6 specialties" />
                  <DataModule icon={BarChart3} label="AI Accuracy" value="92.4%" sub="Clinical prediction engine" />
                </div>
              </motion.div>
            </div>
          </div>

          <motion.footer className="flex flex-wrap items-center justify-center gap-10 py-5 border-t border-border/20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
            {[
              { label: "Patients Monitored", value: "1,243" },
              { label: "AI Predictions", value: "92% Accuracy" },
              { label: "Health IDs Linked", value: "4,800+" },
              { label: "Med Conflicts Caught", value: "387" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-base font-bold font-display text-foreground">{stat.value}</p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </motion.footer>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
