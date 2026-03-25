import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { patients as initialPatients, Patient, HealthInsight } from "@/data/mockPatients";

export interface CaregiverLog {
  id: string;
  patientId: string;
  date: string;
  time: string;
  weight?: string;
  symptoms?: string;
  notes?: string;
  additionalMeds?: string;
}

export interface PatientDocument {
  id: string;
  patientId: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  date: string;
}

export interface DraftPrescription {
  id: string;
  patientId: string;
  date: string;
  medications: { name: string; dosage: string; frequency: string; duration: string }[];
  notes: string;
  status: "draft" | "finalized";
}

export interface AdherenceRecord {
  patientId: string;
  medicationName: string;
  date: string;
  taken: boolean;
}

export interface CareSuggestion {
  id: string;
  patientId: string;
  category: "physical" | "mental" | "lifestyle";
  title: string;
  description: string;
  trigger: string;
  completed: boolean;
  date: string;
}

interface PatientDataContextType {
  patients: Patient[];
  caregiverLogs: CaregiverLog[];
  adherenceRecords: AdherenceRecord[];
  careSuggestions: CareSuggestion[];
  patientDocuments: PatientDocument[];
  draftPrescriptions: DraftPrescription[];
  addCaregiverLog: (log: Omit<CaregiverLog, "id">) => void;
  toggleAdherence: (patientId: string, medicationName: string, date: string) => void;
  toggleSuggestion: (suggestionId: string) => void;
  addPatientDocument: (doc: Omit<PatientDocument, "id">) => void;
  addDraftPrescription: (rx: Omit<DraftPrescription, "id">) => void;
  getPatientById: (id: string) => Patient | undefined;
  getLogsForPatient: (patientId: string) => CaregiverLog[];
  getAdherenceForPatient: (patientId: string) => AdherenceRecord[];
  getSuggestionsForPatient: (patientId: string) => CareSuggestion[];
  getDocumentsForPatient: (patientId: string) => PatientDocument[];
  getPrescriptionsForPatient: (patientId: string) => DraftPrescription[];
}

const PatientDataContext = createContext<PatientDataContextType | null>(null);

export function usePatientData() {
  const ctx = useContext(PatientDataContext);
  if (!ctx) throw new Error("usePatientData must be used within PatientDataProvider");
  return ctx;
}

function generateCareSuggestions(patients: Patient[]): CareSuggestion[] {
  const suggestions: CareSuggestion[] = [];
  patients.forEach((p) => {
    const latest = p.vitals[p.vitals.length - 1];
    const prev = p.vitals.length > 1 ? p.vitals[p.vitals.length - 2] : latest;
    if (!latest) return;

    // Rising BP → relaxation
    if (latest.bloodPressureSys > prev.bloodPressureSys && latest.bloodPressureSys > 130) {
      suggestions.push({
        id: `cs-${p.id}-bp`, patientId: p.id, category: "lifestyle",
        title: "Guided Breathing Exercise",
        description: "Practice 4-7-8 breathing technique for 10 minutes. Inhale for 4s, hold 7s, exhale 8s. Helps reduce blood pressure naturally.",
        trigger: `BP rising (${prev.bloodPressureSys}→${latest.bloodPressureSys} mmHg)`,
        completed: false, date: "2024-04-05",
      });
      suggestions.push({
        id: `cs-${p.id}-relax`, patientId: p.id, category: "mental",
        title: "Evening Relaxation Routine",
        description: "Play calming instrumental music during dinner. Avoid stressful news or conversations before bedtime.",
        trigger: `Elevated BP trend detected`,
        completed: false, date: "2024-04-05",
      });
    }

    // Sedentary / weight gain → movement
    if (latest.weight > prev.weight) {
      suggestions.push({
        id: `cs-${p.id}-walk`, patientId: p.id, category: "physical",
        title: "Light Morning Walk",
        description: "Encourage a 10–15 minute slow walk after breakfast. Use a walker or support if needed. Stay on flat surfaces.",
        trigger: `Weight increase (${prev.weight}→${latest.weight} lbs)`,
        completed: false, date: "2024-04-05",
      });
    }

    // Cognitive decline indicators
    if (p.conditions.some(c => c.includes("Alzheimer") || c.includes("Cognitive") || c.includes("Parkinson"))) {
      suggestions.push({
        id: `cs-${p.id}-memory`, patientId: p.id, category: "mental",
        title: "Memory Engagement Activity",
        description: "Spend 15 minutes looking at old family photos and asking about memories. Use simple word puzzles or counting exercises.",
        trigger: `Cognitive condition present (${p.conditions.filter(c => c.includes("Alzheimer") || c.includes("Parkinson")).join(", ")})`,
        completed: false, date: "2024-04-05",
      });
    }

    // Low SpO2 → gentle stretching
    if (latest.oxygenSat < 93) {
      suggestions.push({
        id: `cs-${p.id}-breath`, patientId: p.id, category: "physical",
        title: "Seated Breathing Exercises",
        description: "Practice pursed-lip breathing while seated. Inhale through nose for 2s, exhale through pursed lips for 4s. 3 sets of 10.",
        trigger: `SpO2 at ${latest.oxygenSat}% (below 93%)`,
        completed: false, date: "2024-04-05",
      });
    }

    // Blood sugar irregularities → hydration
    if (latest.bloodSugar > 150) {
      suggestions.push({
        id: `cs-${p.id}-hydration`, patientId: p.id, category: "lifestyle",
        title: "Hydration Reminder",
        description: "Ensure patient drinks at least 6–8 glasses of water today. Avoid sugary drinks. Offer warm water with meals.",
        trigger: `Blood sugar elevated at ${latest.bloodSugar} mg/dL`,
        completed: false, date: "2024-04-05",
      });
    }

    // General sleep improvement
    if (p.riskLevel === "high") {
      suggestions.push({
        id: `cs-${p.id}-sleep`, patientId: p.id, category: "lifestyle",
        title: "Sleep Routine Consistency",
        description: "Maintain fixed bedtime (9:30 PM). Dim lights 30 minutes before. No screens after 8:30 PM. Light stretching before bed.",
        trigger: `High-risk patient — routine stability important`,
        completed: false, date: "2024-04-05",
      });
    }
  });
  return suggestions;
}

function generateInitialAdherence(patients: Patient[]): AdherenceRecord[] {
  const records: AdherenceRecord[] = [];
  const dates = ["2024-04-03", "2024-04-04", "2024-04-05"];
  patients.forEach((p) => {
    p.medications.forEach((med) => {
      dates.forEach((date) => {
        records.push({
          patientId: p.id,
          medicationName: med.name,
          date,
          taken: Math.random() > 0.15, // 85% adherence rate
        });
      });
    });
  });
  return records;
}

function generateInitialLogs(): CaregiverLog[] {
  return [
    { id: "el1", patientId: "1", date: "2024-04-05", time: "08:30", weight: "167 lbs", symptoms: "Increased thirst, blurred vision", notes: "Patient reported difficulty reading newspaper. Consumed extra water before 10 AM.", additionalMeds: "Acetaminophen 500mg for knee pain" },
    { id: "el2", patientId: "1", date: "2024-04-04", time: "09:00", weight: "166 lbs", symptoms: "Mild dizziness on standing", notes: "BP checked post-breakfast: 148/94. Patient ate salty snacks last night." },
    { id: "el3", patientId: "2", date: "2024-04-05", time: "07:45", weight: "194 lbs", symptoms: "Swollen ankles, breathlessness at rest", notes: "Could not walk to bathroom without assistance. Used oxygen concentrator for 2 hours." },
    { id: "el4", patientId: "5", date: "2024-04-04", time: "10:15", weight: "206 lbs", symptoms: "Chest tightness during morning walk", notes: "Used sublingual nitroglycerin. Rested for 30 minutes. Symptoms subsided." },
    { id: "el5", patientId: "9", date: "2024-04-05", time: "06:30", weight: "132 lbs", symptoms: "Refused breakfast, disoriented", notes: "Patient did not recognize caregiver briefly. Ate half a banana after 20 minutes of coaxing.", additionalMeds: "Multivitamin" },
    { id: "el6", patientId: "7", date: "2024-04-05", time: "08:00", weight: "162 lbs", symptoms: "Severe breathlessness, cyanosis on lips", notes: "SpO2 measured 85%. Used nebulizer. Kept patient in semi-upright position." },
    { id: "el7", patientId: "6", date: "2024-04-04", time: "11:00", weight: "120 lbs", symptoms: "Tremor worsened, difficulty eating", notes: "Spilled food twice. Needed assistance with spoon feeding. Mood was low." },
    { id: "el8", patientId: "4", date: "2024-04-05", time: "09:30", weight: "175 lbs", symptoms: "Tingling in feet increased", notes: "Patient limping on right foot. Applied warm compress. No open wounds observed." },
  ];
}

export function PatientDataProvider({ children }: { children: ReactNode }) {
  const [patients] = useState<Patient[]>(initialPatients);
  const [caregiverLogs, setCaregiverLogs] = useState<CaregiverLog[]>(generateInitialLogs);
  const [adherenceRecords, setAdherenceRecords] = useState<AdherenceRecord[]>(() => generateInitialAdherence(initialPatients));
  const [careSuggestions, setCareSuggestions] = useState<CareSuggestion[]>(() => generateCareSuggestions(initialPatients));
  const [patientDocuments, setPatientDocuments] = useState<PatientDocument[]>([]);
  const [draftPrescriptions, setDraftPrescriptions] = useState<DraftPrescription[]>([]);

  const addCaregiverLog = useCallback((log: Omit<CaregiverLog, "id">) => {
    setCaregiverLogs((prev) => [{ ...log, id: `el${Date.now()}` }, ...prev]);
  }, []);

  const toggleAdherence = useCallback((patientId: string, medicationName: string, date: string) => {
    setAdherenceRecords((prev) =>
      prev.map((r) =>
        r.patientId === patientId && r.medicationName === medicationName && r.date === date
          ? { ...r, taken: !r.taken }
          : r
      )
    );
  }, []);

  const toggleSuggestion = useCallback((suggestionId: string) => {
    setCareSuggestions((prev) =>
      prev.map((s) => (s.id === suggestionId ? { ...s, completed: !s.completed } : s))
    );
  }, []);

  const addPatientDocument = useCallback((doc: Omit<PatientDocument, "id">) => {
    setPatientDocuments((prev) => [{ ...doc, id: `doc${Date.now()}` }, ...prev]);
  }, []);

  const addDraftPrescription = useCallback((rx: Omit<DraftPrescription, "id">) => {
    setDraftPrescriptions((prev) => [{ ...rx, id: `rx${Date.now()}` }, ...prev]);
  }, []);

  const getPatientById = useCallback((id: string) => patients.find((p) => p.id === id), [patients]);
  const getLogsForPatient = useCallback((patientId: string) => caregiverLogs.filter((l) => l.patientId === patientId), [caregiverLogs]);
  const getAdherenceForPatient = useCallback((patientId: string) => adherenceRecords.filter((r) => r.patientId === patientId), [adherenceRecords]);
  const getSuggestionsForPatient = useCallback((patientId: string) => careSuggestions.filter((s) => s.patientId === patientId), [careSuggestions]);
  const getDocumentsForPatient = useCallback((patientId: string) => patientDocuments.filter((d) => d.patientId === patientId), [patientDocuments]);
  const getPrescriptionsForPatient = useCallback((patientId: string) => draftPrescriptions.filter((r) => r.patientId === patientId), [draftPrescriptions]);

  return (
    <PatientDataContext.Provider value={{
      patients, caregiverLogs, adherenceRecords, careSuggestions, patientDocuments, draftPrescriptions,
      addCaregiverLog, toggleAdherence, toggleSuggestion, addPatientDocument, addDraftPrescription,
      getPatientById, getLogsForPatient, getAdherenceForPatient, getSuggestionsForPatient, getDocumentsForPatient, getPrescriptionsForPatient,
    }}>
      {children}
    </PatientDataContext.Provider>
  );
}
