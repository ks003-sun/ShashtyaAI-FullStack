export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
  conflicts?: string[];
}

export interface VitalReading {
  date: string;
  bloodPressureSys: number;
  bloodPressureDia: number;
  heartRate: number;
  bloodSugar: number;
  weight: number;
  oxygenSat: number;
}

export interface HealthInsight {
  id: string;
  type: "warning" | "info" | "critical" | "positive";
  title: string;
  description: string;
  confidence: number;
  date: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  healthId: string;
  conditions: string[];
  riskFactors: string[];
}

export interface Patient {
  id: string;
  healthId: string;
  name: string;
  age: number;
  gender: string;
  avatar: string;
  conditions: string[];
  riskLevel: "low" | "medium" | "high";
  medications: Medication[];
  vitals: VitalReading[];
  insights: HealthInsight[];
  familyMembers: FamilyMember[];
  lastVisit: string;
  nextAppointment: string;
  caregiverName: string;
  doctorName: string;
}

export const patients: Patient[] = [
  {
    id: "1",
    healthId: "UHID-2024-0847-A",
    name: "Margaret Thompson",
    age: 78,
    gender: "Female",
    avatar: "MT",
    conditions: ["Type 2 Diabetes", "Hypertension", "Osteoarthritis"],
    riskLevel: "high",
    medications: [
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily", purpose: "Blood sugar control" },
      { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", purpose: "Blood pressure" },
      { name: "Aspirin", dosage: "81mg", frequency: "Once daily", purpose: "Heart protection", conflicts: ["Ibuprofen"] },
      { name: "Atorvastatin", dosage: "20mg", frequency: "Once daily", purpose: "Cholesterol" },
    ],
    vitals: [
      { date: "2024-03-01", bloodPressureSys: 145, bloodPressureDia: 92, heartRate: 78, bloodSugar: 180, weight: 165, oxygenSat: 96 },
      { date: "2024-03-08", bloodPressureSys: 140, bloodPressureDia: 88, heartRate: 76, bloodSugar: 165, weight: 164, oxygenSat: 97 },
      { date: "2024-03-15", bloodPressureSys: 138, bloodPressureDia: 85, heartRate: 74, bloodSugar: 155, weight: 163, oxygenSat: 97 },
      { date: "2024-03-22", bloodPressureSys: 142, bloodPressureDia: 90, heartRate: 80, bloodSugar: 172, weight: 164, oxygenSat: 96 },
      { date: "2024-03-29", bloodPressureSys: 148, bloodPressureDia: 94, heartRate: 82, bloodSugar: 190, weight: 166, oxygenSat: 95 },
      { date: "2024-04-05", bloodPressureSys: 150, bloodPressureDia: 96, heartRate: 84, bloodSugar: 195, weight: 167, oxygenSat: 94 },
    ],
    insights: [
      { id: "i1", type: "critical", title: "Rising Blood Sugar Trend", description: "Blood glucose levels have increased 15% over the past 3 weeks. Consider adjusting Metformin dosage or dietary plan.", confidence: 92, date: "2024-04-05" },
      { id: "i2", type: "warning", title: "Blood Pressure Spike Detected", description: "Systolic BP exceeded 145mmHg in recent readings. Correlated with increased sodium intake pattern.", confidence: 87, date: "2024-04-04" },
      { id: "i3", type: "info", title: "Medication Interaction Alert", description: "Patient reported taking OTC Ibuprofen which conflicts with current Aspirin regimen. Risk of GI bleeding.", confidence: 95, date: "2024-04-03" },
      { id: "i4", type: "positive", title: "Weight Stabilization", description: "Weight has remained within 2% variance over the past month, indicating stable metabolic function.", confidence: 78, date: "2024-04-01" },
    ],
    familyMembers: [
      { id: "f1", name: "Robert Thompson", relation: "Son", healthId: "UHID-2024-1203-B", conditions: ["Pre-diabetes"], riskFactors: ["Type 2 Diabetes (72% risk by age 65)", "Hypertension (58% risk)"] },
      { id: "f2", name: "Susan Clarke", relation: "Daughter", healthId: "UHID-2024-1204-C", conditions: [], riskFactors: ["Type 2 Diabetes (65% risk by age 60)", "Osteoarthritis (45% risk)"] },
    ],
    lastVisit: "2024-04-02",
    nextAppointment: "2024-04-16",
    caregiverName: "Linda Thompson",
    doctorName: "Dr. Rithika Singh",
  },
  {
    id: "2",
    healthId: "UHID-2024-1156-D",
    name: "Harold Jenkins",
    age: 82,
    gender: "Male",
    avatar: "HJ",
    conditions: ["Congestive Heart Failure", "Atrial Fibrillation", "COPD"],
    riskLevel: "high",
    medications: [
      { name: "Warfarin", dosage: "5mg", frequency: "Once daily", purpose: "Blood thinner", conflicts: ["Aspirin", "NSAIDs"] },
      { name: "Metoprolol", dosage: "25mg", frequency: "Twice daily", purpose: "Heart rate control" },
      { name: "Furosemide", dosage: "40mg", frequency: "Once daily", purpose: "Fluid retention" },
      { name: "Albuterol", dosage: "90mcg", frequency: "As needed", purpose: "COPD symptom relief" },
    ],
    vitals: [
      { date: "2024-03-01", bloodPressureSys: 130, bloodPressureDia: 78, heartRate: 88, bloodSugar: 110, weight: 185, oxygenSat: 92 },
      { date: "2024-03-08", bloodPressureSys: 128, bloodPressureDia: 76, heartRate: 85, bloodSugar: 108, weight: 186, oxygenSat: 93 },
      { date: "2024-03-15", bloodPressureSys: 132, bloodPressureDia: 80, heartRate: 90, bloodSugar: 112, weight: 188, oxygenSat: 91 },
      { date: "2024-03-22", bloodPressureSys: 135, bloodPressureDia: 82, heartRate: 92, bloodSugar: 115, weight: 190, oxygenSat: 90 },
      { date: "2024-03-29", bloodPressureSys: 138, bloodPressureDia: 85, heartRate: 95, bloodSugar: 118, weight: 192, oxygenSat: 89 },
      { date: "2024-04-05", bloodPressureSys: 140, bloodPressureDia: 88, heartRate: 98, bloodSugar: 120, weight: 194, oxygenSat: 88 },
    ],
    insights: [
      { id: "i5", type: "critical", title: "Weight Gain Alert — Fluid Retention", description: "9 lbs gained in 5 weeks. Likely fluid buildup from CHF. Furosemide dosage review recommended.", confidence: 94, date: "2024-04-05" },
      { id: "i6", type: "critical", title: "Declining Oxygen Saturation", description: "SpO2 trending below 90%. COPD exacerbation risk increasing. Pulmonology consult advised.", confidence: 91, date: "2024-04-04" },
      { id: "i7", type: "warning", title: "Heart Rate Elevation", description: "Resting HR rising steadily, now at 98 bpm. Metoprolol effectiveness may be declining.", confidence: 85, date: "2024-04-03" },
    ],
    familyMembers: [
      { id: "f3", name: "David Jenkins", relation: "Son", healthId: "UHID-2024-2301-E", conditions: ["Hypertension"], riskFactors: ["Heart Disease (68% risk by age 70)", "A-Fib (42% risk)"] },
    ],
    lastVisit: "2024-04-01",
    nextAppointment: "2024-04-10",
    caregiverName: "Mary Jenkins",
    doctorName: "Dr. Sarah Williams",
  },
  {
    id: "3",
    healthId: "UHID-2024-0932-F",
    name: "Dorothy Williams",
    age: 74,
    gender: "Female",
    avatar: "DW",
    conditions: ["Hypertension", "Hypothyroidism"],
    riskLevel: "low",
    medications: [
      { name: "Amlodipine", dosage: "5mg", frequency: "Once daily", purpose: "Blood pressure" },
      { name: "Levothyroxine", dosage: "50mcg", frequency: "Once daily", purpose: "Thyroid hormone" },
    ],
    vitals: [
      { date: "2024-03-01", bloodPressureSys: 128, bloodPressureDia: 80, heartRate: 72, bloodSugar: 98, weight: 145, oxygenSat: 98 },
      { date: "2024-03-08", bloodPressureSys: 126, bloodPressureDia: 78, heartRate: 70, bloodSugar: 96, weight: 145, oxygenSat: 98 },
      { date: "2024-03-15", bloodPressureSys: 125, bloodPressureDia: 78, heartRate: 71, bloodSugar: 95, weight: 144, oxygenSat: 99 },
      { date: "2024-03-22", bloodPressureSys: 124, bloodPressureDia: 76, heartRate: 70, bloodSugar: 94, weight: 144, oxygenSat: 98 },
      { date: "2024-03-29", bloodPressureSys: 122, bloodPressureDia: 76, heartRate: 68, bloodSugar: 96, weight: 143, oxygenSat: 99 },
      { date: "2024-04-05", bloodPressureSys: 120, bloodPressureDia: 74, heartRate: 68, bloodSugar: 95, weight: 143, oxygenSat: 99 },
    ],
    insights: [
      { id: "i8", type: "positive", title: "Blood Pressure Improving", description: "Consistent downward trend in BP readings. Current medications are effective.", confidence: 90, date: "2024-04-05" },
      { id: "i9", type: "info", title: "Thyroid Levels Stable", description: "TSH within normal range for 3 consecutive months. Continue current Levothyroxine dose.", confidence: 88, date: "2024-04-01" },
    ],
    familyMembers: [],
    lastVisit: "2024-03-28",
    nextAppointment: "2024-04-25",
    caregiverName: "Self-managed",
    doctorName: "Dr. Michael Park",
  },
  {
    id: "4",
    healthId: "UHID-2024-1478-G",
    name: "George Martinez",
    age: 80,
    gender: "Male",
    avatar: "GM",
    conditions: ["Type 2 Diabetes", "Chronic Kidney Disease", "Neuropathy"],
    riskLevel: "medium",
    medications: [
      { name: "Insulin Glargine", dosage: "20 units", frequency: "Once daily", purpose: "Blood sugar control" },
      { name: "Gabapentin", dosage: "300mg", frequency: "Three times daily", purpose: "Neuropathic pain" },
      { name: "Losartan", dosage: "50mg", frequency: "Once daily", purpose: "Kidney protection" },
    ],
    vitals: [
      { date: "2024-03-01", bloodPressureSys: 135, bloodPressureDia: 82, heartRate: 75, bloodSugar: 160, weight: 175, oxygenSat: 96 },
      { date: "2024-03-08", bloodPressureSys: 132, bloodPressureDia: 80, heartRate: 74, bloodSugar: 155, weight: 174, oxygenSat: 97 },
      { date: "2024-03-15", bloodPressureSys: 130, bloodPressureDia: 78, heartRate: 73, bloodSugar: 148, weight: 174, oxygenSat: 97 },
      { date: "2024-03-22", bloodPressureSys: 128, bloodPressureDia: 76, heartRate: 72, bloodSugar: 142, weight: 173, oxygenSat: 97 },
      { date: "2024-03-29", bloodPressureSys: 130, bloodPressureDia: 78, heartRate: 74, bloodSugar: 150, weight: 174, oxygenSat: 96 },
      { date: "2024-04-05", bloodPressureSys: 132, bloodPressureDia: 80, heartRate: 75, bloodSugar: 155, weight: 175, oxygenSat: 96 },
    ],
    insights: [
      { id: "i10", type: "warning", title: "Kidney Function Monitoring", description: "eGFR showing gradual decline. Stage 3b CKD progression risk at 34% over next 12 months.", confidence: 82, date: "2024-04-05" },
      { id: "i11", type: "info", title: "Blood Sugar Partially Controlled", description: "Fasting glucose averaging 150mg/dL. Consider insulin adjustment to reach <130mg/dL target.", confidence: 86, date: "2024-04-03" },
    ],
    familyMembers: [
      { id: "f4", name: "Carlos Martinez", relation: "Son", healthId: "UHID-2024-3102-H", conditions: ["Pre-diabetes"], riskFactors: ["Type 2 Diabetes (78% risk by age 55)", "CKD (35% risk)"] },
      { id: "f5", name: "Elena Rodriguez", relation: "Daughter", healthId: "UHID-2024-3103-I", conditions: [], riskFactors: ["Type 2 Diabetes (70% risk by age 60)"] },
    ],
    lastVisit: "2024-04-03",
    nextAppointment: "2024-04-17",
    caregiverName: "Maria Martinez",
    doctorName: "Dr. James Chen",
  },
];

export const dashboardStats = {
  totalPatients: 847,
  highRisk: 124,
  medicationAlerts: 38,
  upcomingAppointments: 56,
  aiInsightsGenerated: 1243,
  avgRiskScore: 42,
};
