import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Phone, X, AlertTriangle, CheckCircle, MapPin, Navigation } from "lucide-react";
import { usePatientData } from "@/context/PatientDataContext";
import type { SOSEmergencyType } from "@/context/PatientDataContext";

// Multi-language emergency keywords (English + 6 Indian languages)
const EMERGENCY_KEYWORDS: { keyword: string; lang: string; type: SOSEmergencyType; issue: string }[] = [
  // English
  { keyword: "help", lang: "en", type: "general", issue: "Patient called for help — assess situation" },
  { keyword: "fall", lang: "en", type: "fall", issue: "Patient fall detected — assess for fractures or head injury" },
  { keyword: "fell", lang: "en", type: "fall", issue: "Patient fall detected — assess for injuries" },
  { keyword: "fallen", lang: "en", type: "fall", issue: "Patient fall detected — assess for injuries" },
  { keyword: "chest pain", lang: "en", type: "cardiac", issue: "Possible cardiac event — chest pain reported" },
  { keyword: "can't breathe", lang: "en", type: "respiratory", issue: "Respiratory distress — patient unable to breathe" },
  { keyword: "cannot breathe", lang: "en", type: "respiratory", issue: "Respiratory distress — patient unable to breathe" },
  { keyword: "breathing", lang: "en", type: "respiratory", issue: "Breathing difficulty reported" },
  { keyword: "ambulance", lang: "en", type: "general", issue: "Ambulance requested — patient needs transport" },
  { keyword: "emergency", lang: "en", type: "general", issue: "Emergency triggered — immediate attention required" },
  { keyword: "heart attack", lang: "en", type: "cardiac", issue: "Suspected heart attack — immediate cardiac attention needed" },
  { keyword: "stroke", lang: "en", type: "neurological", issue: "Suspected stroke — urgent neurological assessment needed" },
  { keyword: "unconscious", lang: "en", type: "neurological", issue: "Patient unconscious — check vitals immediately" },
  { keyword: "bleeding", lang: "en", type: "general", issue: "Bleeding reported — assess severity" },
  { keyword: "choking", lang: "en", type: "respiratory", issue: "Choking incident — airway obstruction suspected" },
  { keyword: "faint", lang: "en", type: "neurological", issue: "Patient fainted — possible syncope episode" },

  // Hindi (हिन्दी)
  { keyword: "बचाओ", lang: "hi", type: "general", issue: "मदद की पुकार — स्थिति का आकलन करें" },
  { keyword: "मदद", lang: "hi", type: "general", issue: "मदद की पुकार — स्थिति का आकलन करें" },
  { keyword: "गिर गया", lang: "hi", type: "fall", issue: "रोगी गिर गया — चोट की जाँच करें" },
  { keyword: "गिर गयी", lang: "hi", type: "fall", issue: "रोगी गिर गयी — चोट की जाँच करें" },
  { keyword: "छाती में दर्द", lang: "hi", type: "cardiac", issue: "छाती में दर्द — हृदय की जाँच करें" },
  { keyword: "सांस नहीं आ रही", lang: "hi", type: "respiratory", issue: "साँस की तकलीफ — तुरंत ध्यान दें" },
  { keyword: "एम्बुलेंस", lang: "hi", type: "general", issue: "एम्बुलेंस बुलाई गई" },
  { keyword: "दिल का दौरा", lang: "hi", type: "cardiac", issue: "दिल का दौरा — तुरंत हृदय चिकित्सा आवश्यक" },
  { keyword: "बेहोश", lang: "hi", type: "neurological", issue: "रोगी बेहोश — तुरंत जाँच करें" },
  { keyword: "खून", lang: "hi", type: "general", issue: "रक्तस्राव — गंभीरता का आकलन करें" },

  // Telugu (తెలుగు)
  { keyword: "సహాయం", lang: "te", type: "general", issue: "సహాయం కోసం పిలుపు — పరిస్థితిని అంచనా వేయండి" },
  { keyword: "పడిపోయాను", lang: "te", type: "fall", issue: "రోగి పడిపోయారు — గాయాలను తనిఖీ చేయండి" },
  { keyword: "ఛాతీ నొప్పి", lang: "te", type: "cardiac", issue: "ఛాతీ నొప్పి — హృదయ పరీక్ష చేయండి" },
  { keyword: "ఊపిరి రావడం లేదు", lang: "te", type: "respiratory", issue: "శ్వాస ఇబ్బంది — తక్షణ శ్రద్ధ" },
  { keyword: "అంబులెన్స్", lang: "te", type: "general", issue: "అంబులెన్స్ అవసరం" },
  { keyword: "స్పృహ లేదు", lang: "te", type: "neurological", issue: "రోగికి స్పృహ లేదు — వెంటనే తనిఖీ చేయండి" },

  // Tamil (தமிழ்)
  { keyword: "உதவி", lang: "ta", type: "general", issue: "உதவிக்கான அழைப்பு — நிலைமையை மதிப்பிடுங்கள்" },
  { keyword: "விழுந்துவிட்டேன்", lang: "ta", type: "fall", issue: "நோயாளி விழுந்தார் — காயங்களை சரிபார்க்கவும்" },
  { keyword: "நெஞ்சு வலி", lang: "ta", type: "cardiac", issue: "நெஞ்சு வலி — இதய பரிசோதனை செய்யுங்கள்" },
  { keyword: "மூச்சு விட முடியவில்லை", lang: "ta", type: "respiratory", issue: "சுவாச சிக்கல் — உடனடி கவனம்" },
  { keyword: "ஆம்புலன்ஸ்", lang: "ta", type: "general", issue: "ஆம்புலன்ஸ் தேவை" },
  { keyword: "மயக்கம்", lang: "ta", type: "neurological", issue: "நோயாளி மயக்கமடைந்தார்" },

  // Malayalam (മലയാളം)
  { keyword: "സഹായം", lang: "ml", type: "general", issue: "സഹായത്തിനായുള്ള വിളി — സാഹചര്യം വിലയിരുത്തുക" },
  { keyword: "വീണു", lang: "ml", type: "fall", issue: "രോഗി വീണു — പരിക്കുകൾ പരിശോധിക്കുക" },
  { keyword: "നെഞ്ചുവേദന", lang: "ml", type: "cardiac", issue: "നെഞ്ചുവേദന — ഹൃദയ പരിശോധന നടത്തുക" },
  { keyword: "ശ്വാസം കിട്ടുന്നില്ല", lang: "ml", type: "respiratory", issue: "ശ്വാസതടസ്സം — അടിയന്തര ശ്രദ്ധ" },
  { keyword: "ആംബുലൻസ്", lang: "ml", type: "general", issue: "ആംബുലൻസ് ആവശ്യമാണ്" },
  { keyword: "ബോധമില്ല", lang: "ml", type: "neurological", issue: "രോഗിക്ക് ബോധമില്ല — ഉടൻ പരിശോധിക്കുക" },

  // Kannada (ಕನ್ನಡ)
  { keyword: "ಸಹಾಯ", lang: "kn", type: "general", issue: "ಸಹಾಯಕ್ಕಾಗಿ ಕರೆ — ಪರಿಸ್ಥಿತಿಯನ್ನು ನಿರ್ಣಯಿಸಿ" },
  { keyword: "ಬಿದ್ದೆ", lang: "kn", type: "fall", issue: "ರೋಗಿ ಬಿದ್ದರು — ಗಾಯಗಳನ್ನು ಪರಿಶೀಲಿಸಿ" },
  { keyword: "ಎದೆ ನೋವು", lang: "kn", type: "cardiac", issue: "ಎದೆ ನೋವು — ಹೃದಯ ಪರೀಕ್ಷೆ ಮಾಡಿ" },
  { keyword: "ಉಸಿರಾಡಲು ಆಗುತ್ತಿಲ್ಲ", lang: "kn", type: "respiratory", issue: "ಉಸಿರಾಟ ತೊಂದರೆ — ತಕ್ಷಣ ಗಮನ" },
  { keyword: "ಆಂಬುಲೆನ್ಸ್", lang: "kn", type: "general", issue: "ಆಂಬುಲೆನ್ಸ್ ಅಗತ್ಯವಿದೆ" },
  { keyword: "ಪ್ರಜ್ಞೆ ಇಲ್ಲ", lang: "kn", type: "neurological", issue: "ರೋಗಿಗೆ ಪ್ರಜ್ಞೆ ಇಲ್ಲ — ತಕ್ಷಣ ಪರಿಶೀಲಿಸಿ" },

  // Bengali (বাংলা)
  { keyword: "বাঁচাও", lang: "bn", type: "general", issue: "সাহায্যের জন্য ডাক — পরিস্থিতি মূল্যায়ন করুন" },
  { keyword: "সাহায্য", lang: "bn", type: "general", issue: "সাহায্যের জন্য ডাক — পরিস্থিতি মূল্যায়ন করুন" },
  { keyword: "পড়ে গেছি", lang: "bn", type: "fall", issue: "রোগী পড়ে গেছেন — আঘাত পরীক্ষা করুন" },
  { keyword: "বুকে ব্যথা", lang: "bn", type: "cardiac", issue: "বুকে ব্যথা — হৃদয় পরীক্ষা করুন" },
  { keyword: "শ্বাস নিতে পারছি না", lang: "bn", type: "respiratory", issue: "শ্বাসকষ্ট — জরুরি মনোযোগ" },
  { keyword: "অ্যাম্বুলেন্স", lang: "bn", type: "general", issue: "অ্যাম্বুলেন্স প্রয়োজন" },
  { keyword: "অজ্ঞান", lang: "bn", type: "neurological", issue: "রোগী অজ্ঞান — এখনই পরীক্ষা করুন" },
];

type Phase = "idle" | "listening" | "confirm" | "dispatched" | "tracking";

interface EmergencyButtonProps {
  patientId?: string;
  patientName?: string;
}

// Simulated ambulance tracking
function useAmbulanceTracking(active: boolean) {
  const [distance, setDistance] = useState(4.2);
  const [eta, setEta] = useState(8);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setDistance(prev => {
        const next = Math.max(0.1, prev - (0.3 + Math.random() * 0.2));
        setEta(Math.max(1, Math.round(next * 2)));
        return parseFloat(next.toFixed(1));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [active]);

  return { distance, eta };
}

export default function EmergencyButton({ patientId, patientName }: EmergencyButtonProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [transcript, setTranscript] = useState("");
  const [detected, setDetected] = useState("");
  const [detectedLang, setDetectedLang] = useState("en");
  const [countdown, setCountdown] = useState(5);
  const [emergencyInfo, setEmergencyInfo] = useState<{ type: SOSEmergencyType; issue: string } | null>(null);
  const { addSOSEvent } = usePatientData();
  const { distance, eta } = useAmbulanceTracking(phase === "tracking");

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
    setEmergencyInfo(null);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setTranscript("Speech recognition not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "hi-IN"; // Supports Indic scripts well

    recognition.onresult = (event: any) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);

      const lower = text.toLowerCase();
      const found = EMERGENCY_KEYWORDS.find(kw => lower.includes(kw.keyword.toLowerCase()));
      if (found) {
        setDetected(found.keyword);
        setDetectedLang(found.lang);
        setEmergencyInfo({ type: found.type, issue: found.issue });
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

    const info = emergencyInfo || { type: "general" as SOSEmergencyType, issue: "Emergency SOS triggered" };
    addSOSEvent({
      patientId: patientId || "unknown",
      patientName: patientName || "Unknown Patient",
      timestamp: new Date().toISOString(),
      detectedKeyword: detected,
      transcript,
      emergencyType: info.type,
      predictedIssue: info.issue,
      acknowledged: false,
    });

    setPhase("dispatched");
    setTimeout(() => setPhase("tracking"), 2500);
  }, [detected, transcript, patientId, patientName, addSOSEvent, emergencyInfo]);

  const handleCancel = useCallback(() => {
    stopRecognition();
    if (countdownRef.current) clearInterval(countdownRef.current);
    setPhase("idle");
    setTranscript("");
    setDetected("");
    setEmergencyInfo(null);
  }, [stopRecognition]);

  const langLabels: Record<string, string> = {
    en: "English", hi: "हिन्दी", te: "తెలుగు", ta: "தமிழ்", ml: "മലയാളം", kn: "ಕನ್ನಡ", bn: "বাংলা"
  };

  return (
    <>
      {phase === "idle" && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={startListening}
          className="fixed bottom-8 right-8 z-50 w-20 h-20 rounded-full bg-destructive hover:bg-destructive/90 shadow-2xl shadow-destructive/40 flex items-center justify-center transition-colors"
          aria-label="Emergency"
        >
          <div className="text-center">
            <Mic className="w-8 h-8 text-destructive-foreground mx-auto" />
            <span className="text-[9px] font-bold text-destructive-foreground/90 mt-0.5 block tracking-wide">SOS</span>
          </div>
          <span className="absolute inset-0 rounded-full animate-ping bg-destructive/30" />
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
            {(phase === "listening" || phase === "tracking") && (
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
                  className="w-32 h-32 rounded-full bg-destructive flex items-center justify-center mb-8 shadow-2xl shadow-destructive/40"
                >
                  <Mic className="w-16 h-16 text-destructive-foreground" />
                </motion.div>
                <h1 className="font-display text-3xl text-foreground mb-3">Listening…</h1>
                <p className="text-lg text-muted-foreground mb-2 max-w-md">
                  Speak in any supported language — we detect emergencies automatically.
                </p>
                <div className="flex flex-wrap gap-1.5 justify-center mb-6">
                  {Object.entries(langLabels).map(([code, label]) => (
                    <span key={code} className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-medium">
                      {label}
                    </span>
                  ))}
                </div>
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
                  className="w-28 h-28 rounded-full bg-destructive/20 border-4 border-destructive flex items-center justify-center mb-6"
                >
                  <AlertTriangle className="w-14 h-14 text-destructive" />
                </motion.div>
                <h1 className="font-display text-3xl text-foreground mb-2">Emergency Detected</h1>
                <p className="text-xl text-destructive font-semibold mb-1">"{detected}"</p>
                {emergencyInfo && (
                  <>
                    <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full capitalize">
                      {langLabels[detectedLang]} · {emergencyInfo.type}
                    </span>
                    <p className="text-sm text-muted-foreground mt-2 max-w-md">{emergencyInfo.issue}</p>
                  </>
                )}
                <p className="text-lg text-muted-foreground mb-8 mt-4">
                  Calling for help in <span className="text-destructive font-bold text-2xl">{countdown}s</span>
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={handleConfirm}
                    className="px-10 py-5 rounded-2xl bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xl font-bold shadow-xl shadow-destructive/30 transition-colors"
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
                  className="w-32 h-32 rounded-full bg-accent/20 border-4 border-accent flex items-center justify-center mb-8"
                >
                  <CheckCircle className="w-14 h-14 text-accent" />
                </motion.div>
                <h1 className="font-display text-4xl text-foreground mb-3">Help is on the way</h1>
                <p className="text-xl text-muted-foreground">Connecting to nearest ambulance…</p>
              </div>
            )}

            {phase === "tracking" && (
              <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
                <div className="w-full max-w-md space-y-6">
                  {/* Map visualization */}
                  <div className="relative w-full h-64 rounded-2xl bg-muted/30 border border-border overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="absolute border border-border/40 rounded-full" style={{
                          width: `${(i + 1) * 60}px`, height: `${(i + 1) * 60}px`,
                          top: '50%', left: '50%', transform: 'translate(-50%, -50%)'
                        }} />
                      ))}
                    </div>
                    {/* Patient pin */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-5 h-5 rounded-full bg-primary border-2 border-primary-foreground shadow-lg" />
                      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-primary font-bold whitespace-nowrap">You</span>
                    </div>
                    {/* Ambulance pin */}
                    <motion.div
                      animate={{ x: [40, 20, 10], y: [-50, -30, -15] }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                      className="absolute top-1/3 right-1/3"
                    >
                      <div className="w-5 h-5 rounded-full bg-destructive border-2 border-destructive-foreground shadow-lg" />
                      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-destructive font-bold whitespace-nowrap flex items-center gap-0.5">
                        <Navigation className="w-2.5 h-2.5" />Ambulance
                      </span>
                    </motion.div>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-4 justify-center">
                    <div className="bg-card border border-border rounded-xl px-6 py-4 text-center">
                      <MapPin className="w-5 h-5 text-primary mx-auto mb-1" />
                      <p className="text-2xl font-bold text-foreground">{distance} km</p>
                      <p className="text-xs text-muted-foreground">Distance</p>
                    </div>
                    <div className="bg-card border border-border rounded-xl px-6 py-4 text-center">
                      <Navigation className="w-5 h-5 text-accent mx-auto mb-1" />
                      <p className="text-2xl font-bold text-foreground">{eta} min</p>
                      <p className="text-xs text-muted-foreground">ETA</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">Live tracking • Updates every 3s</p>

                  <button
                    onClick={handleCancel}
                    className="px-8 py-4 rounded-2xl bg-muted hover:bg-muted/80 text-foreground text-lg font-semibold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
