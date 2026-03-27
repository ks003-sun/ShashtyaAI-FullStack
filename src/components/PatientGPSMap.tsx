import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, RefreshCw, Users, AlertTriangle } from "lucide-react";
import { usePatientData } from "@/context/PatientDataContext";
import { getPatientCoords } from "@/data/patientCoordinates";
import LeafletMap, { type MapMarker } from "./LeafletMap";

export default function PatientGPSMap() {
  const { patients } = usePatientData();
  const [tick, setTick] = useState(0);

  // Simulate live GPS updates
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  const markers: MapMarker[] = useMemo(() => {
    return patients.map((p) => {
      const [lat, lng] = getPatientCoords(p.location);
      // Add tiny movement to simulate real-time GPS
      const jitter = () => (Math.random() - 0.5) * 0.003;
      return {
        id: p.id,
        lat: lat + jitter(),
        lng: lng + jitter(),
        label: p.name,
        type: "patient" as const,
        riskLevel: p.riskLevel,
        popup: `${p.age}y · ${p.conditions[0]} · Risk: ${p.riskLevel.toUpperCase()}`,
      };
    });
  }, [patients, tick]);

  const highRisk = patients.filter((p) => p.riskLevel === "high").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-foreground flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" /> Live Patient GPS
        </h2>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> {patients.length} tracked
          </span>
          <span className="flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-destructive" /> {highRisk} high risk
          </span>
          <motion.div
            animate={{ rotate: tick * 360 }}
            transition={{ duration: 0.5 }}
          >
            <RefreshCw className="w-3.5 h-3.5 text-primary" />
          </motion.div>
          <span>Live · {tick}s</span>
        </div>
      </div>

      <LeafletMap markers={markers} center={[22.5, 78.5]} zoom={5} className="h-[450px]" />

      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-destructive inline-block" /> High Risk
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber inline-block" style={{ background: "#F59E0B" }} /> Medium
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" /> Low Risk
        </span>
      </div>
    </div>
  );
}
