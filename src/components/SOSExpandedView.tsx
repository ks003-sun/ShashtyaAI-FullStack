import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, Building2, Navigation, Phone, Clock, Activity, Heart, Droplets, Wind, Ambulance } from "lucide-react";
import { SOSEvent } from "@/context/PatientDataContext";
import { Patient } from "@/data/mockPatients";
import LeafletMap, { MapMarker } from "@/components/LeafletMap";
import { getPatientCoords, cityCoordinates } from "@/data/patientCoordinates";

interface Hospital {
  name: string;
  type: string;
  distance: string;
  lat: number;
  lng: number;
  phone: string;
  specialties: string[];
}

const hospitalsByCity: Record<string, Hospital[]> = {
  "Jaipur, Rajasthan": [
    { name: "Sawai Man Singh Hospital", type: "Government", distance: "2.3 km", lat: 26.9050, lng: 75.8010, phone: "+91-141-256-0291", specialties: ["Cardiology", "Endocrinology", "Geriatrics"] },
    { name: "Fortis Escorts Hospital", type: "Private", distance: "5.1 km", lat: 26.8600, lng: 75.8000, phone: "+91-141-254-7000", specialties: ["Cardiac Sciences", "Neurology"] },
  ],
  "Varanasi, Uttar Pradesh": [
    { name: "BHU Sir Sunderlal Hospital", type: "Government", distance: "1.8 km", lat: 25.2700, lng: 82.9900, phone: "+91-542-236-7568", specialties: ["Cardiology", "Pulmonology"] },
    { name: "Heritage Hospital", type: "Private", distance: "4.2 km", lat: 25.3300, lng: 82.9600, phone: "+91-542-227-5555", specialties: ["Cardiac Surgery", "Nephrology"] },
  ],
  "Chennai, Tamil Nadu": [
    { name: "Rajiv Gandhi Hospital", type: "Government", distance: "2.1 km", lat: 13.0700, lng: 80.2800, phone: "+91-44-2530-5000", specialties: ["Nephrology", "Diabetology"] },
    { name: "Apollo Hospitals", type: "Private", distance: "4.8 km", lat: 13.0600, lng: 80.2500, phone: "+91-44-2829-3333", specialties: ["Cardiology", "Neurology"] },
  ],
  "Amritsar, Punjab": [
    { name: "Govt Medical College Hospital", type: "Government", distance: "1.5 km", lat: 31.6250, lng: 74.8800, phone: "+91-183-222-5681", specialties: ["Cardiology", "General Medicine"] },
    { name: "Fortis Escorts Hospital", type: "Private", distance: "4.0 km", lat: 31.6450, lng: 74.8600, phone: "+91-183-504-1111", specialties: ["Cardiac Sciences", "Neurology"] },
  ],
  "Kolkata, West Bengal": [
    { name: "SSKM Hospital", type: "Government", distance: "2.8 km", lat: 22.5400, lng: 88.3450, phone: "+91-33-2223-5611", specialties: ["Neurology", "Geriatrics"] },
    { name: "Apollo Gleneagles", type: "Private", distance: "5.3 km", lat: 22.5850, lng: 88.3900, phone: "+91-33-2320-3040", specialties: ["Cardiology", "Neurology"] },
  ],
  "Hyderabad, Telangana": [
    { name: "Osmania General Hospital", type: "Government", distance: "2.2 km", lat: 17.3700, lng: 78.4750, phone: "+91-40-2460-0146", specialties: ["Cardiology", "General Medicine"] },
    { name: "KIMS Hospital", type: "Private", distance: "4.5 km", lat: 17.4100, lng: 78.5000, phone: "+91-40-4488-5000", specialties: ["Cardiac Surgery", "Pulmonology"] },
  ],
  "Kochi, Kerala": [
    { name: "Govt Medical College Ernakulam", type: "Government", distance: "2.5 km", lat: 9.9500, lng: 76.2800, phone: "+91-484-254-5001", specialties: ["Neurology", "General Medicine"] },
    { name: "Amrita Hospital", type: "Private", distance: "6.0 km", lat: 9.9600, lng: 76.2900, phone: "+91-484-285-1234", specialties: ["Cardiology", "Oncology"] },
  ],
  "Srinagar, Jammu & Kashmir": [
    { name: "SKIMS Soura", type: "Government", distance: "3.2 km", lat: 34.1000, lng: 74.8100, phone: "+91-194-240-3470", specialties: ["Pulmonology", "Cardiology"] },
  ],
  "Pune, Maharashtra": [
    { name: "Sassoon General Hospital", type: "Government", distance: "2.0 km", lat: 18.5100, lng: 73.8600, phone: "+91-20-2612-0441", specialties: ["General Medicine", "Surgery"] },
    { name: "Ruby Hall Clinic", type: "Private", distance: "3.5 km", lat: 18.5300, lng: 73.8700, phone: "+91-20-6645-5555", specialties: ["Cardiology", "Rheumatology"] },
  ],
  "Ludhiana, Punjab": [
    { name: "CMC Ludhiana", type: "Private", distance: "1.2 km", lat: 30.9100, lng: 75.8500, phone: "+91-161-501-0800", specialties: ["Pulmonology", "Cardiology"] },
  ],
  "Patna, Bihar": [
    { name: "PMCH Patna", type: "Government", distance: "2.0 km", lat: 25.6100, lng: 85.1400, phone: "+91-612-230-0343", specialties: ["General Medicine", "Endocrinology"] },
  ],
  "Lucknow, Uttar Pradesh": [
    { name: "KGMU Hospital", type: "Government", distance: "1.5 km", lat: 26.8500, lng: 80.9300, phone: "+91-522-225-7540", specialties: ["Cardiology", "Geriatrics"] },
  ],
  "Bhopal, Madhya Pradesh": [
    { name: "Hamidia Hospital", type: "Government", distance: "1.8 km", lat: 23.2650, lng: 77.4100, phone: "+91-755-254-0222", specialties: ["Neurology", "Geriatrics"] },
  ],
};

function getDefaultHospitals(lat: number, lng: number): Hospital[] {
  return [
    { name: "District General Hospital", type: "Government", distance: "3.0 km", lat: lat + 0.015, lng: lng + 0.01, phone: "108", specialties: ["Emergency", "General Medicine"] },
  ];
}

interface SOSExpandedViewProps {
  event: SOSEvent;
  patient: Patient;
}

export default function SOSExpandedView({ event, patient }: SOSExpandedViewProps) {
  const patientCoords = useMemo(() => getPatientCoords(patient.location), [patient.location]);
  const hospitals = useMemo(() => {
    if (patient.location && hospitalsByCity[patient.location]) return hospitalsByCity[patient.location];
    return getDefaultHospitals(patientCoords[0], patientCoords[1]);
  }, [patient.location, patientCoords]);

  // Simulate ambulance position moving toward patient
  const [ambProgress, setAmbProgress] = useState(0);
  const nearestHospital = hospitals[0];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setAmbProgress(prev => Math.min(prev + 0.04 + Math.random() * 0.03, 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const ambLat = nearestHospital.lat + (patientCoords[0] - nearestHospital.lat) * ambProgress;
  const ambLng = nearestHospital.lng + (patientCoords[1] - nearestHospital.lng) * ambProgress;
  const distKm = ((1 - ambProgress) * parseFloat(nearestHospital.distance)).toFixed(1);
  const etaMin = Math.max(1, Math.round((1 - ambProgress) * 12));

  // Simulated live vitals
  const [liveVitals, setLiveVitals] = useState({
    hr: patient.vitals[patient.vitals.length - 1]?.heartRate || 78,
    sys: patient.vitals[patient.vitals.length - 1]?.bloodPressureSys || 130,
    dia: patient.vitals[patient.vitals.length - 1]?.bloodPressureDia || 80,
    spo2: patient.vitals[patient.vitals.length - 1]?.oxygenSat || 96,
    glucose: patient.vitals[patient.vitals.length - 1]?.bloodSugar || 120,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVitals(prev => ({
        hr: Math.max(55, Math.min(130, prev.hr + Math.round((Math.random() - 0.5) * 6))),
        sys: Math.max(90, Math.min(200, prev.sys + Math.round((Math.random() - 0.5) * 8))),
        dia: Math.max(50, Math.min(120, prev.dia + Math.round((Math.random() - 0.5) * 5))),
        spo2: Math.max(80, Math.min(100, prev.spo2 + Math.round((Math.random() - 0.4) * 3))),
        glucose: Math.max(60, Math.min(300, prev.glucose + Math.round((Math.random() - 0.5) * 10))),
      }));
    }, 60000); // every minute
    // Also do an initial update after 5s for demo purposes
    const initialTimeout = setTimeout(() => {
      setLiveVitals(prev => ({
        hr: Math.max(55, Math.min(130, prev.hr + Math.round((Math.random() - 0.5) * 4))),
        sys: Math.max(90, Math.min(200, prev.sys + Math.round((Math.random() - 0.5) * 5))),
        dia: Math.max(50, Math.min(120, prev.dia + Math.round((Math.random() - 0.5) * 3))),
        spo2: Math.max(80, Math.min(100, prev.spo2 + Math.round((Math.random() - 0.4) * 2))),
        glucose: Math.max(60, Math.min(300, prev.glucose + Math.round((Math.random() - 0.5) * 8))),
      }));
    }, 5000);
    return () => { clearInterval(interval); clearTimeout(initialTimeout); };
  }, []);

  const markers: MapMarker[] = [
    { id: "patient", lat: patientCoords[0], lng: patientCoords[1], label: patient.name, type: "patient", riskLevel: patient.riskLevel, popup: `SOS: ${event.emergencyType.toUpperCase()}` },
    { id: "ambulance", lat: ambLat, lng: ambLng, label: "Ambulance", type: "ambulance", popup: `ETA: ${etaMin} min · ${distKm} km away` },
    ...hospitals.map((h, i) => ({
      id: `hospital-${i}`, lat: h.lat, lng: h.lng, label: h.name, type: "hospital" as const, popup: `${h.type} · ${h.distance}`,
    })),
  ];

  const vitalItems = [
    { label: "Heart Rate", value: `${liveVitals.hr}`, unit: "bpm", icon: Heart, color: liveVitals.hr > 100 || liveVitals.hr < 60 ? "text-red-500" : "text-primary" },
    { label: "BP", value: `${liveVitals.sys}/${liveVitals.dia}`, unit: "mmHg", icon: Activity, color: liveVitals.sys > 140 ? "text-red-500" : liveVitals.sys > 130 ? "text-amber-500" : "text-primary" },
    { label: "SpO₂", value: `${liveVitals.spo2}`, unit: "%", icon: Wind, color: liveVitals.spo2 < 90 ? "text-red-500" : liveVitals.spo2 < 94 ? "text-amber-500" : "text-primary" },
    { label: "Glucose", value: `${liveVitals.glucose}`, unit: "mg/dL", icon: Droplets, color: liveVitals.glucose > 180 ? "text-red-500" : liveVitals.glucose < 70 ? "text-red-500" : "text-primary" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.3 }}
      className="mt-3 space-y-4"
    >
      {/* Live Vitals Mini-Dashboard */}
      <div>
        <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-primary" />
          Live Vitals Stream
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] text-muted-foreground font-normal ml-1">Updates every 60s</span>
        </h4>
        <div className="grid grid-cols-4 gap-2">
          {vitalItems.map(item => (
            <div key={item.label} className="rounded-lg bg-muted/50 border border-border/30 p-2.5 text-center">
              <item.icon className={`w-4 h-4 mx-auto mb-1 ${item.color}`} />
              <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
              <p className="text-[9px] text-muted-foreground">{item.unit}</p>
              <p className="text-[9px] text-muted-foreground mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Map + Hospitals */}
      <div className="grid lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2">
          <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            Patient Location & Ambulance Route
          </h4>
          <LeafletMap
            markers={markers}
            center={patientCoords}
            zoom={13}
            className="h-[280px]"
            showRoute
            routeFrom={[nearestHospital.lat, nearestHospital.lng]}
            routeTo={patientCoords}
          />
          <div className="flex items-center gap-4 mt-2 text-xs">
            <span className="flex items-center gap-1.5 text-red-500 font-medium">
              <Ambulance className="w-4 h-4" />
              ETA: {etaMin} min · {distKm} km
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="w-3 h-3" />
              {patient.location || "Unknown location"}
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-teal-500" />
            Nearest Hospitals
          </h4>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {hospitals.map((h, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-muted/30 border border-border/30">
                <p className="text-xs font-medium text-foreground">{h.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${h.type === "Government" ? "bg-green-100 text-green-700" : "bg-primary/10 text-primary"}`}>
                    {h.type}
                  </span>
                  <span className="text-xs font-bold text-teal-600 flex items-center gap-1">
                    <Navigation className="w-3 h-3" />{h.distance}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {h.specialties.map(s => (
                    <span key={s} className="text-[8px] px-1 py-0.5 rounded bg-secondary text-secondary-foreground">{s}</span>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" />{h.phone}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
