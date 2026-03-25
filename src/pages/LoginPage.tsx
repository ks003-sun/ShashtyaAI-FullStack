import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Stethoscope, HandHeart, Fingerprint, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Role = "doctor" | "caregiver" | null;

export default function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [scanning, setScanning] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setScanning(true);
    setTimeout(() => navigate("/dashboard"), 1800);
  };

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-teal/5 blur-[80px] pointer-events-none" />

      {/* Scanning overlay */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col items-center gap-6">
              <motion.div
                className="relative w-24 h-24"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-t-2 border-primary" />
              </motion.div>
              <div className="text-center space-y-2">
                <motion.div
                  className="flex items-center gap-2 text-primary"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Fingerprint className="w-5 h-5" />
                  <span className="text-sm font-medium">Verifying credentials...</span>
                </motion.div>
                <p className="text-xs text-muted-foreground">Establishing secure connection</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="relative z-10 w-full max-w-md mx-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Back button */}
        <motion.button
          onClick={() => (role ? setRole(null) : navigate("/"))}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft className="w-4 h-4" />
          {role ? "Change role" : "Back to home"}
        </motion.button>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-2xl text-foreground">ShastyaAI</h1>
            <p className="text-xs text-muted-foreground">Secure Medical Access</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!role ? (
            /* Role Selection */
            <motion.div
              key="role-select"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-display text-xl text-foreground mb-1">Welcome back</h2>
                <p className="text-sm text-muted-foreground">Select your role to continue</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    id: "doctor" as const,
                    icon: Stethoscope,
                    label: "Doctor",
                    desc: "Full clinical access",
                  },
                  {
                    id: "caregiver" as const,
                    icon: HandHeart,
                    label: "Caregiver",
                    desc: "Patient monitoring",
                    link: "/caregiver/login",
                  },
                ].map((r) => (
                  <motion.button
                    key={r.id}
                    onClick={() => r.id === "caregiver" ? navigate("/caregiver/login") : setRole(r.id)}
                    className="group relative p-6 rounded-2xl border border-border/50 backdrop-blur-xl bg-card/40 hover:border-primary/40 transition-all text-left"
                    whileHover={{ scale: 1.03, boxShadow: "0 0 30px hsl(var(--primary) / 0.1)" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <r.icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="font-medium text-foreground">{r.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{r.desc}</p>
                    {/* Biometric accent line */}
                    <motion.div
                      className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-primary to-transparent"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                ))}
              </div>

              <div className="flex items-center gap-2 justify-center text-[10px] text-muted-foreground">
                <Fingerprint className="w-3 h-3" />
                End-to-end encrypted · HIPAA compliant
              </div>
            </motion.div>
          ) : (
            /* Login Form */
            <motion.div
              key="login-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="font-display text-xl text-foreground mb-1">Doctor Login</h2>
                <p className="text-sm text-muted-foreground">Access clinical dashboards and AI insights</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                {/* Biometric scan visual */}
                <motion.div
                  className="relative h-16 rounded-xl border border-border/30 bg-card/20 backdrop-blur-sm overflow-hidden flex items-center justify-center"
                  whileHover={{ borderColor: "hsl(var(--primary) / 0.4)" }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"
                    animate={{ y: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="relative z-10 flex items-center gap-2 text-xs text-muted-foreground">
                    <Fingerprint className="w-4 h-4 text-primary" />
                    Biometric verification ready
                  </div>
                </motion.div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Medical License ID</label>
                  <Input
                    placeholder="MCI-XXXX-XXXXX"
                    className="bg-card/40 backdrop-blur-sm border-border/40 focus:border-primary/60"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Email</label>
                  <Input
                    type="email"
                    placeholder="dr.singh@hospital.in"
                    className="bg-card/40 backdrop-blur-sm border-border/40 focus:border-primary/60"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="bg-card/40 backdrop-blur-sm border-border/40 focus:border-primary/60 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 text-base font-medium">
                  <Fingerprint className="w-4 h-4 mr-2" />
                  Authenticate & Enter
                </Button>

                <p className="text-center text-[11px] text-muted-foreground">
                  Protected by AES-256 encryption · Session expires in 8 hours
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
