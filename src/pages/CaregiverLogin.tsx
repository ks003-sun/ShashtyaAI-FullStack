import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, HandHeart, Fingerprint, Eye, EyeOff, ArrowLeft, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CaregiverLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [showPassword, setShowPassword] = useState(false);
  const [authMethod, setAuthMethod] = useState<"password" | "otp">("otp");
  const [scanning, setScanning] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMethod === "otp" && step === "credentials") {
      setStep("otp");
      return;
    }
    setScanning(true);
    setTimeout(() => navigate("/caregiver/dashboard"), 1800);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newValues = [...otpValues];
    newValues[index] = value;
    setOtpValues(newValues);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center overflow-hidden">
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-teal/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />

      {/* Grid lines background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="absolute w-px h-full bg-foreground" style={{ left: `${(i + 1) * 5}%` }} />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={`h${i}`} className="absolute h-px w-full bg-foreground" style={{ top: `${(i + 1) * 5}%` }} />
        ))}
      </div>

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
                className="relative w-20 h-20"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute inset-0 rounded-full border-2 border-teal/20" />
                <div className="absolute inset-0 rounded-full border-t-2 border-teal" />
              </motion.div>
              <div className="text-center space-y-2">
                <motion.p
                  className="text-sm font-medium text-teal"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Loading patient workspace...
                </motion.p>
                <p className="text-xs text-muted-foreground">Fetching assigned patient records</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="relative z-10 w-full max-w-sm mx-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.button
          onClick={() => step === "otp" ? setStep("credentials") : navigate("/login")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft className="w-4 h-4" />
          {step === "otp" ? "Back" : "Back to role selection"}
        </motion.button>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-teal flex items-center justify-center shadow-lg">
            <HandHeart className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-xl text-foreground">ShastyaAI</h1>
            <p className="text-[10px] text-muted-foreground tracking-wide uppercase">Caregiver Portal</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-xl p-6 shadow-xl">
          <AnimatePresence mode="wait">
            {step === "credentials" ? (
              <motion.div
                key="creds"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-5">
                  <h2 className="font-display text-lg text-foreground">Caregiver Sign In</h2>
                  <p className="text-xs text-muted-foreground mt-1">Access your assigned patient's health dashboard</p>
                </div>

                {/* Auth method toggle */}
                <div className="flex rounded-lg border border-border/40 p-0.5 mb-5 bg-muted/30">
                  {(["otp", "password"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setAuthMethod(m)}
                      className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${
                        authMethod === m
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {m === "otp" ? "OTP Login" : "Password"}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Caregiver Name</label>
                    <Input
                      placeholder="Sunita Sharma"
                      className="bg-card/40 backdrop-blur-sm border-border/40 focus:border-teal/60 h-10"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Employee ID</label>
                    <Input
                      placeholder="CG-2024-XXXXX"
                      className="bg-card/40 backdrop-blur-sm border-border/40 focus:border-teal/60 h-10"
                      required
                    />
                  </div>

                  {authMethod === "otp" ? (
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">Registered Mobile</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          className="bg-card/40 backdrop-blur-sm border-border/40 focus:border-teal/60 h-10 pl-10"
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">Password</label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="bg-card/40 backdrop-blur-sm border-border/40 focus:border-teal/60 h-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  <Button type="submit" className="w-full h-11 bg-teal hover:bg-teal/90 text-primary-foreground">
                    {authMethod === "otp" ? (
                      <>
                        <Phone className="w-4 h-4 mr-2" />
                        Send OTP
                      </>
                    ) : (
                      <>
                        <Fingerprint className="w-4 h-4 mr-2" />
                        Sign In
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-6 text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-teal/10 flex items-center justify-center mb-4">
                    <Shield className="w-7 h-7 text-teal" />
                  </div>
                  <h2 className="font-display text-lg text-foreground">Enter Verification Code</h2>
                  <p className="text-xs text-muted-foreground mt-1">Sent to your registered mobile number</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex justify-center gap-2">
                    {otpValues.map((val, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={val}
                        onChange={(e) => handleOtpChange(i, e.target.value.replace(/\D/g, ""))}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-10 h-12 text-center text-lg font-medium rounded-lg border border-border/50 bg-card/40 backdrop-blur-sm text-foreground focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/40 transition-all"
                      />
                    ))}
                  </div>

                  <Button type="submit" className="w-full h-11 bg-teal hover:bg-teal/90 text-primary-foreground">
                    <Fingerprint className="w-4 h-4 mr-2" />
                    Verify & Enter
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    Didn't receive?{" "}
                    <button type="button" className="text-teal hover:underline font-medium">
                      Resend OTP
                    </button>
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-[10px] text-muted-foreground mt-4 flex items-center justify-center gap-1.5">
          <Shield className="w-3 h-3" />
          Encrypted · HIPAA Compliant · Session expires in 4 hours
        </p>
      </motion.div>
    </div>
  );
}
