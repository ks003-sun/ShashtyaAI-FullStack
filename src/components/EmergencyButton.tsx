import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Phone, X, AlertTriangle, MapPin, Navigation } from "lucide-react";

const EMERGENCY_KEYWORDS = [
  "help", "fall", "fell", "fallen", "chest pain", "can't breathe",
  "cannot breathe", "breathing", "ambulance", "emergency", "heart attack",
  "stroke", "unconscious", "bleeding", "choking", "faint", "fainted"
];

type Phase = "idle" | "listening" | "confirm" | "dispatched" | "tracking";

interface AmbulanceState {
  lat: number;
  lng: number;
  distance: number;
  eta: number;
}

export default function EmergencyButton() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [transcript, setTranscript] = useState("");
  const [detected, setDetected] = useState("");
  const [countdown, setCountdown] = useState(5);
  const [ambulance, setAmbulance] = useState<AmbulanceState>({
    lat: 12.9352, lng: 77.6245, distance: 4.2, eta: 8
  });

  const recognitionRef = useRef<any>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const trackingRef = useRef<NodeJS.Timeout | null>(null);

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
  }, []);

  const startListening = useCallback(() => {
    setPhase("listening");
    setTranscript("");
    setDetected("");

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setTranscript("Speech recognition not supported. Please type your emergency.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onresult = (event: any) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);

      const lower = text.toLowerCase();
      const found = EMERGENCY_KEYWORDS.find(kw => lower.includes(kw));
      if (found) {
        setDetected(found);
        recognition.stop();
        setPhase("confirm");
      }
    };

    recognition.onerror = (e: any) => {
      if (e.error !== "aborted") {
        setTranscript(`Listening error: ${e.error}. Tap mic to retry.`);
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  }, []);

  // Countdown for auto-confirm
  useEffect(() => {
    if (phase === "confirm") {
      setCountdown(5);
      countdownRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownRef.current!);
            handleConfirm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, [phase]);

  // Simulate ambulance tracking
  useEffect(() => {
    if (phase === "tracking") {
      trackingRef.current = setInterval(() => {
        setAmbulance(prev => {
          const newDist = Math.max(0.1, prev.distance - (0.3 + Math.random() * 0.2));
          const newEta = Math.max(1, Math.round(newDist * 2));
          return {
            lat: prev.lat + (Math.random() - 0.5) * 0.002,
            lng: prev.lng + (Math.random() - 0.5) * 0.002,
            distance: Math.round(newDist * 10) / 10,
            eta: newEta
          };
        });
      }, 3000);
    }
    return () => { if (trackingRef.current) clearInterval(trackingRef.current); };
  }, [phase]);

  const handleConfirm = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setPhase("dispatched");
    // Simulate API call
    setTimeout(() => setPhase("tracking"), 2500);
  }, []);

  const handleCancel = useCallback(() => {
    stopRecognition();
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (trackingRef.current) clearInterval(trackingRef.current);
    setPhase("idle");
    setTranscript("");
    setDetected("");
  }, [stopRecognition]);

  return (
    <>
      {/* Floating Emergency Button */}
      {phase === "idle" && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={startListening}
          className="fixed bottom-8 right-8 z-50 w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 shadow-2xl shadow-red-600/40 flex items-center justify-center transition-colors"
          aria-label="Emergency"
        >
          <div className="text-center">
            <Mic className="w-8 h-8 text-white mx-auto" />
            <span className="text-[9px] font-bold text-white/90 mt-0.5 block tracking-wide">SOS</span>
          </div>
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full animate-ping bg-red-500/30" />
        </motion.button>
      )}

      {/* Full-screen overlays */}
      <AnimatePresence>
        {phase !== "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/98 backdrop-blur-md flex flex-col"
          >
            {/* Close button */}
            {(phase === "listening" || phase === "tracking") && (
              <button
                onClick={handleCancel}
                className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
            )}

            {/* LISTENING PHASE */}
            {phase === "listening" && (
              <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-32 h-32 rounded-full bg-red-600 flex items-center justify-center mb-8 shadow-2xl shadow-red-600/40"
                >
                  <Mic className="w-16 h-16 text-white" />
                </motion.div>
                <h1 className="font-display text-3xl text-foreground mb-3">Listening…</h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-md">
                  Say what's happening. We'll detect emergencies like <span className="text-red-500 font-medium">"help"</span>, <span className="text-red-500 font-medium">"fall"</span>, <span className="text-red-500 font-medium">"chest pain"</span>, or <span className="text-red-500 font-medium">"can't breathe"</span>.
                </p>
                <div className="w-full max-w-lg min-h-[80px] rounded-2xl bg-muted/50 border border-border/50 p-5 text-left">
                  <p className="text-sm text-muted-foreground mb-1 font-medium">Live transcript:</p>
                  <p className="text-lg text-foreground">
                    {transcript || <span className="text-muted-foreground/50 italic">Speak now…</span>}
                  </p>
                </div>
              </div>
            )}

            {/* CONFIRM PHASE */}
            {phase === "confirm" && (
              <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-28 h-28 rounded-full bg-red-600/20 border-4 border-red-600 flex items-center justify-center mb-6"
                >
                  <AlertTriangle className="w-14 h-14 text-red-600" />
                </motion.div>
                <h1 className="font-display text-3xl text-foreground mb-2">Emergency Detected</h1>
                <p className="text-xl text-red-500 font-semibold mb-2">"{detected}"</p>
                <p className="text-lg text-muted-foreground mb-8">
                  Calling for help in <span className="text-red-600 font-bold text-2xl">{countdown}s</span>
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={handleConfirm}
                    className="px-10 py-5 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xl font-bold shadow-xl shadow-red-600/30 transition-colors"
                  >
                    <Phone className="w-6 h-6 inline mr-2" />
                    Call Now
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-10 py-5 rounded-2xl bg-muted hover:bg-muted/80 text-foreground text-xl font-bold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* DISPATCHED PHASE */}
            {phase === "dispatched" && (
              <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  className="w-32 h-32 rounded-full bg-green-600/20 border-4 border-green-600 flex items-center justify-center mb-8"
                >
                  <Phone className="w-14 h-14 text-green-600" />
                </motion.div>
                <h1 className="font-display text-4xl text-foreground mb-3">Help is on the way</h1>
                <p className="text-xl text-muted-foreground">An ambulance has been dispatched to your location.</p>
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="mt-8 text-muted-foreground text-sm"
                >
                  Connecting to live tracking…
                </motion.div>
              </div>
            )}

            {/* TRACKING PHASE */}
            {phase === "tracking" && (
              <div className="flex-1 flex flex-col">
                <div className="p-6 border-b border-border/50 flex items-center justify-between">
                  <div>
                    <h1 className="font-display text-2xl text-foreground flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                      Ambulance En Route
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">Live tracking active</p>
                  </div>
                  <div className="flex gap-6 text-right">
                    <div>
                      <p className="text-xs text-muted-foreground">Distance</p>
                      <p className="text-2xl font-bold text-foreground">{ambulance.distance} km</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">ETA</p>
                      <p className="text-2xl font-bold text-red-500">{ambulance.eta} min</p>
                    </div>
                  </div>
                </div>

                {/* Map area */}
                <div className="flex-1 relative bg-muted/30 overflow-hidden">
                  {/* Simulated map grid */}
                  <div className="absolute inset-0 opacity-10">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div key={`h-${i}`} className="absolute w-full border-t border-foreground/20" style={{ top: `${i * 5}%` }} />
                    ))}
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div key={`v-${i}`} className="absolute h-full border-l border-foreground/20" style={{ left: `${i * 5}%` }} />
                    ))}
                  </div>

                  {/* Road lines */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M 20 80 Q 35 60 50 50 Q 65 40 75 25" stroke="hsl(var(--primary))" strokeWidth="0.5" fill="none" opacity="0.4" strokeDasharray="2,1" />
                    <path d="M 10 50 L 90 50" stroke="hsl(var(--muted-foreground))" strokeWidth="0.3" fill="none" opacity="0.2" />
                    <path d="M 50 10 L 50 90" stroke="hsl(var(--muted-foreground))" strokeWidth="0.3" fill="none" opacity="0.2" />
                  </svg>

                  {/* Patient marker */}
                  <div className="absolute" style={{ bottom: '20%', left: '20%' }}>
                    <div className="relative">
                      <div className="w-5 h-5 rounded-full bg-primary border-2 border-primary-foreground shadow-lg" />
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-foreground whitespace-nowrap bg-background/80 px-2 py-0.5 rounded">You</span>
                      <span className="absolute inset-0 rounded-full animate-ping bg-primary/30" />
                    </div>
                  </div>

                  {/* Ambulance marker */}
                  <motion.div
                    animate={{
                      bottom: `${20 + (1 - ambulance.distance / 4.2) * 40}%`,
                      left: `${20 + (1 - ambulance.distance / 4.2) * 45}%`,
                    }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                    className="absolute"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-lg bg-red-600 border-2 border-white shadow-xl flex items-center justify-center">
                        <Navigation className="w-4 h-4 text-white" />
                      </div>
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-red-600 whitespace-nowrap bg-background/80 px-2 py-0.5 rounded">🚑 Ambulance</span>
                      <span className="absolute inset-0 rounded-lg animate-ping bg-red-500/30" />
                    </div>
                  </motion.div>

                  {/* Distance line */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line
                      x1="22" y1="78"
                      x2={22 + (1 - ambulance.distance / 4.2) * 45}
                      y2={78 - (1 - ambulance.distance / 4.2) * 40}
                      stroke="hsl(0, 72%, 50%)"
                      strokeWidth="0.4"
                      strokeDasharray="1.5,1"
                      opacity="0.6"
                    />
                  </svg>

                  {/* Info card */}
                  <div className="absolute bottom-6 left-6 right-6 bg-background/90 backdrop-blur-lg border border-border/50 rounded-2xl p-5 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">Ambulance approaching</p>
                          <p className="text-xs text-muted-foreground">{ambulance.distance} km away · ETA {ambulance.eta} min</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Unit</p>
                        <p className="text-sm font-bold text-foreground">AMB-{Math.floor(Math.random() * 900 + 100)}</p>
                      </div>
                    </div>
                    <div className="mt-3 w-full bg-muted rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-red-600 rounded-full"
                        animate={{ width: `${Math.max(5, (1 - ambulance.distance / 4.2) * 100)}%` }}
                        transition={{ duration: 2 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
