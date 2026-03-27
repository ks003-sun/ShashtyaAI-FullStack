import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Phone, X, AlertTriangle, CheckCircle } from "lucide-react";
import { usePatientData } from "@/context/PatientDataContext";
import type { SOSEmergencyType } from "@/context/PatientDataContext";

const EMERGENCY_KEYWORDS = [
  "help", "fall", "fell", "fallen", "chest pain", "can't breathe",
  "cannot breathe", "breathing", "ambulance", "emergency", "heart attack",
  "stroke", "unconscious", "bleeding", "choking", "faint", "fainted"
];

const KEYWORD_CLASSIFICATION: Record<string, { type: SOSEmergencyType; issue: string }> = {
  "chest pain": { type: "cardiac", issue: "Possible cardiac event — chest pain reported" },
  "heart attack": { type: "cardiac", issue: "Suspected heart attack — immediate cardiac attention needed" },
  "can't breathe": { type: "respiratory", issue: "Respiratory distress — patient unable to breathe" },
  "cannot breathe": { type: "respiratory", issue: "Respiratory distress — patient unable to breathe" },
  "breathing": { type: "respiratory", issue: "Breathing difficulty reported — monitor oxygen levels" },
  "choking": { type: "respiratory", issue: "Choking incident — airway obstruction suspected" },
  "fall": { type: "fall", issue: "Patient fall detected — assess for fractures or head injury" },
  "fell": { type: "fall", issue: "Patient fall detected — assess for injuries" },
  "fallen": { type: "fall", issue: "Patient fall detected — assess for injuries" },
  "stroke": { type: "neurological", issue: "Suspected stroke — urgent neurological assessment needed" },
  "unconscious": { type: "neurological", issue: "Patient unconscious — check vitals immediately" },
  "faint": { type: "neurological", issue: "Patient fainted — possible syncope episode" },
  "fainted": { type: "neurological", issue: "Patient fainted — possible syncope episode" },
  "help": { type: "general", issue: "Patient called for help — assess situation" },
  "emergency": { type: "general", issue: "Emergency triggered — immediate attention required" },
  "ambulance": { type: "general", issue: "Ambulance requested — patient needs transport" },
  "bleeding": { type: "general", issue: "Bleeding reported — assess severity and apply first aid" },
};

function classifyEmergency(keyword: string): { type: SOSEmergencyType; issue: string } {
  return KEYWORD_CLASSIFICATION[keyword] || { type: "general", issue: "Emergency SOS triggered — assess patient immediately" };
}

type Phase = "idle" | "listening" | "confirm" | "dispatched";

interface EmergencyButtonProps {
  patientId?: string;
  patientName?: string;
}

export default function EmergencyButton({ patientId, patientName }: EmergencyButtonProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [transcript, setTranscript] = useState("");
  const [detected, setDetected] = useState("");
  const [countdown, setCountdown] = useState(5);
  const { addSOSEvent } = usePatientData();

  const recognitionRef = useRef<any>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleConfirm = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);

    const classification = classifyEmergency(detected);
    addSOSEvent({
      patientId: patientId || "unknown",
      patientName: patientName || "Unknown Patient",
      timestamp: new Date().toISOString(),
      detectedKeyword: detected,
      transcript,
      emergencyType: classification.type,
      predictedIssue: classification.issue,
      acknowledged: false,
    });

    setPhase("dispatched");
  }, [detected, transcript, patientId, patientName, addSOSEvent]);

  const handleCancel = useCallback(() => {
    stopRecognition();
    if (countdownRef.current) clearInterval(countdownRef.current);
    setPhase("idle");
    setTranscript("");
    setDetected("");
  }, [stopRecognition]);

  const emergencyLabel = detected ? classifyEmergency(detected) : null;

  return (
    <>
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
          <span className="absolute inset-0 rounded-full animate-ping bg-red-500/30" />
        </motion.button>
      )}

      <AnimatePresence>
        {phase !== "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/98 backdrop-blur-md flex flex-col"
          >
            {phase === "listening" && (
              <button
                onClick={handleCancel}
                className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
            )}

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
                  Say what's happening. We'll detect emergencies like <span className="text-red-500 font-medium">"help"</span>, <span className="text-red-500 font-medium">"fall"</span>, <span className="text-red-500 font-medium">"chest pain"</span>.
                </p>
                <div className="w-full max-w-lg min-h-[80px] rounded-2xl bg-muted/50 border border-border/50 p-5 text-left">
                  <p className="text-sm text-muted-foreground mb-1 font-medium">Live transcript:</p>
                  <p className="text-lg text-foreground">
                    {transcript || <span className="text-muted-foreground/50 italic">Speak now…</span>}
                  </p>
                </div>
              </div>
            )}

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
                <p className="text-xl text-red-500 font-semibold mb-1">"{detected}"</p>
                {emergencyLabel && (
                  <p className="text-sm text-muted-foreground mb-1 px-3 py-1 rounded-full bg-muted inline-block capitalize">
                    Type: {emergencyLabel.type}
                  </p>
                )}
                <p className="text-lg text-muted-foreground mb-8 mt-2">
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

            {phase === "dispatched" && (
              <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  className="w-32 h-32 rounded-full bg-green-600/20 border-4 border-green-600 flex items-center justify-center mb-8"
                >
                  <CheckCircle className="w-14 h-14 text-green-600" />
                </motion.div>
                <h1 className="font-display text-4xl text-foreground mb-3">Help is on the way</h1>
                <p className="text-xl text-muted-foreground mb-2">Your doctor has been notified. Emergency services are being contacted.</p>
                {emergencyLabel && (
                  <p className="text-sm text-muted-foreground bg-muted px-4 py-2 rounded-lg mt-2">
                    {emergencyLabel.issue}
                  </p>
                )}
                <button
                  onClick={handleCancel}
                  className="mt-10 px-8 py-4 rounded-2xl bg-muted hover:bg-muted/80 text-foreground text-lg font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
