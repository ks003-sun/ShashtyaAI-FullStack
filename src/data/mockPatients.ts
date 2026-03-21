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
  recommendation?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  healthId: string;
  conditions: string[];
  riskFactors: string[];
  confidenceMatrix?: { condition: string; probability: number; reasoning: string }[];
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
  location?: string;
  recentEvents?: { type: "fall" | "hospitalization" | "vitals_change" | "ailment"; description: string; date: string }[];
}

export const patients: Patient[] = [
  {
    id: "1",
    healthId: "UHID-2024-0847-A",
    name: "Kamala Devi Sharma",
    age: 78,
    gender: "Female",
    avatar: "KS",
    location: "Jaipur, Rajasthan",
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
      { id: "i1", type: "critical", title: "Rising Blood Sugar Trend", description: "Fasting glucose has increased 15% over 3 weeks (155→195 mg/dL). Metformin 500mg BID may be insufficient. HbA1c likely above 8%.", confidence: 92, date: "2024-04-05", recommendation: "Increase Metformin to 1000mg BID or add Glimepiride 1mg. Order HbA1c and fasting lipid panel. Refer to endocrinologist if HbA1c >9%." },
      { id: "i2", type: "warning", title: "Blood Pressure Spike — Sodium Correlation", description: "Systolic BP exceeded 148mmHg despite Lisinopril 10mg. Dietary sodium intake estimated >3g/day from caregiver dietary logs.", confidence: 87, date: "2024-04-04", recommendation: "Increase Lisinopril to 20mg or add Amlodipine 5mg. Order renal function panel (Cr, BUN, eGFR). Advise DASH diet consultation." },
      { id: "i3", type: "critical", title: "NSAID–Aspirin Drug Interaction", description: "Patient reported taking OTC Ibuprofen for joint pain. Concurrent use with Aspirin 81mg increases GI bleeding risk by 2.4x.", confidence: 95, date: "2024-04-03", recommendation: "Discontinue Ibuprofen immediately. Switch to Acetaminophen 500mg PRN for arthritis. Consider upper GI endoscopy if any abdominal symptoms." },
      { id: "i4", type: "positive", title: "Weight Stabilization", description: "Weight has remained within 2% variance (163–167 lbs) over past month, indicating stable metabolic function despite glucose rise.", confidence: 78, date: "2024-04-01", recommendation: "Continue current diet plan. Monitor BMI quarterly." },
    ],
    familyMembers: [
      { id: "f1", name: "Rajesh Sharma", relation: "Son", healthId: "UHID-2024-1203-B", conditions: ["Pre-diabetes"], riskFactors: ["Type 2 Diabetes (72% risk by age 65)", "Hypertension (58% risk)"], confidenceMatrix: [{ condition: "Type 2 Diabetes", probability: 0.72, reasoning: "Mother has T2DM with poor glycemic control. Son has fasting glucose 110 mg/dL (pre-diabetic). Strong genetic predisposition with BMI 28." }, { condition: "Hypertension", probability: 0.58, reasoning: "Maternal hypertension present. Son's BP borderline at 135/85. Sedentary lifestyle adds modifiable risk." }] },
      { id: "f2", name: "Priya Sharma Gupta", relation: "Daughter", healthId: "UHID-2024-1204-C", conditions: [], riskFactors: ["Type 2 Diabetes (65% risk by age 60)", "Osteoarthritis (45% risk)"], confidenceMatrix: [{ condition: "Type 2 Diabetes", probability: 0.65, reasoning: "Mother has T2DM. Daughter's BMI 26 with occasional elevated postprandial glucose. Lower risk than sibling due to active lifestyle." }, { condition: "Osteoarthritis", probability: 0.45, reasoning: "Maternal OA in bilateral knees. Daughter shows early radiographic changes in right knee at age 48." }] },
    ],
    lastVisit: "2024-04-02",
    nextAppointment: "2024-04-16",
    caregiverName: "Sunita Sharma",
    doctorName: "Dr. Rithika Singh",
    recentEvents: [
      { type: "vitals_change", description: "Blood sugar spiked to 195 mg/dL — 25% increase over 3 weeks", date: "2024-04-05" },
      { type: "ailment", description: "Complained of blurred vision and increased thirst — hyperglycemia symptoms", date: "2024-04-04" },
    ],
  },
  {
    id: "2",
    healthId: "UHID-2024-1156-D",
    name: "Ramesh Prasad Verma",
    age: 82,
    gender: "Male",
    avatar: "RV",
    location: "Varanasi, Uttar Pradesh",
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
      { id: "i5", type: "critical", title: "Weight Gain — Fluid Retention (CHF Decompensation)", description: "9 lbs gained in 5 weeks (185→194 lbs). Furosemide 40mg appears insufficient. BNP likely elevated. Signs of CHF decompensation.", confidence: 94, date: "2024-04-05", recommendation: "Increase Furosemide to 80mg or add Spironolactone 25mg. Stat BNP and chest X-ray. Cardiology consult within 48 hours. Daily weight monitoring mandatory." },
      { id: "i6", type: "critical", title: "Declining Oxygen Saturation — COPD Exacerbation Risk", description: "SpO2 trending 92%→88% over 5 weeks. COPD exacerbation risk at 78%. Concurrent CHF worsening may compound respiratory distress.", confidence: 91, date: "2024-04-04", recommendation: "Urgent pulmonology consult. Order ABG, spirometry, and chest CT. Consider adding Tiotropium 18mcg inhaler. Evaluate need for home oxygen therapy." },
      { id: "i7", type: "warning", title: "Heart Rate Elevation Despite Beta-Blocker", description: "Resting HR rising from 88→98 bpm despite Metoprolol 25mg BID. Suggests worsening A-Fib or beta-blocker resistance.", confidence: 85, date: "2024-04-03", recommendation: "ECG to assess A-Fib rhythm. Consider increasing Metoprolol to 50mg BID or adding Digoxin 0.125mg. Check thyroid function (TSH, free T4)." },
    ],
    familyMembers: [
      { id: "f3", name: "Amit Verma", relation: "Son", healthId: "UHID-2024-2301-E", conditions: ["Hypertension"], riskFactors: ["Heart Disease (68% risk by age 70)", "A-Fib (42% risk)"], confidenceMatrix: [{ condition: "Congestive Heart Failure", probability: 0.68, reasoning: "Father has CHF with A-Fib. Son has hypertension and LVH on echo. Strong hereditary cardiac remodeling pattern." }, { condition: "Atrial Fibrillation", probability: 0.42, reasoning: "Paternal A-Fib. Son's ECG shows occasional PACs. Family history contributes ~40% A-Fib heritability." }] },
    ],
    lastVisit: "2024-04-01",
    nextAppointment: "2024-04-10",
    caregiverName: "Geeta Verma",
    doctorName: "Dr. Rithika Singh",
    recentEvents: [
      { type: "fall", description: "Fell in bathroom due to dizziness — likely orthostatic hypotension from Furosemide", date: "2024-04-03" },
      { type: "vitals_change", description: "SpO2 dropped to 88% — lowest recorded value", date: "2024-04-05" },
      { type: "hospitalization", description: "Brief ER visit for dyspnea and peripheral edema", date: "2024-03-28" },
    ],
  },
  {
    id: "3",
    healthId: "UHID-2024-0932-F",
    name: "Savitri Bai Patel",
    age: 74,
    gender: "Female",
    avatar: "SP",
    location: "Ahmedabad, Gujarat",
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
      { id: "i8", type: "positive", title: "Blood Pressure Well Controlled", description: "Consistent downward trend from 128/80 to 120/74 mmHg over 5 weeks. Amlodipine 5mg achieving target BP <130/80.", confidence: 90, date: "2024-04-05", recommendation: "Maintain current Amlodipine dose. Recheck BP in 3 months. Annual echocardiogram recommended for LVH screening." },
      { id: "i9", type: "info", title: "Thyroid Levels Stable", description: "TSH within normal range (2.1 mIU/L) for 3 consecutive months. Levothyroxine 50mcg maintaining euthyroid state.", confidence: 88, date: "2024-04-01", recommendation: "Continue Levothyroxine 50mcg. Recheck TSH and free T4 in 6 months. Monitor for hypothyroid symptoms (fatigue, cold intolerance)." },
    ],
    familyMembers: [],
    lastVisit: "2024-03-28",
    nextAppointment: "2024-04-25",
    caregiverName: "Self-managed",
    doctorName: "Dr. Rithika Singh",
  },
  {
    id: "4",
    healthId: "UHID-2024-1478-G",
    name: "Mohan Lal Iyer",
    age: 80,
    gender: "Male",
    avatar: "MI",
    location: "Chennai, Tamil Nadu",
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
      { id: "i10", type: "warning", title: "Kidney Function Declining — eGFR Trend", description: "eGFR dropped from 42 to 38 mL/min over 6 months (Stage 3b CKD). Losartan 50mg may need dose adjustment if potassium rises.", confidence: 82, date: "2024-04-05", recommendation: "Order comprehensive metabolic panel (Cr, BUN, K+, eGFR). Nephrology referral for CKD Stage 3b management. Consider ACE-i/ARB dose optimization. Renal ultrasound if not done in 12 months." },
      { id: "i11", type: "info", title: "Blood Sugar Partially Controlled", description: "Fasting glucose averaging 150mg/dL on Insulin Glargine 20 units. HbA1c estimated at 7.5% — above target of <7% for CKD patients.", confidence: 86, date: "2024-04-03", recommendation: "Increase Insulin Glargine to 24 units. Add short-acting insulin before meals if postprandial >200mg/dL. Order HbA1c. Avoid Metformin due to CKD." },
      { id: "i12", type: "warning", title: "Gabapentin Dose Review — Renal Adjustment", description: "Gabapentin 300mg TID requires renal dose adjustment at eGFR <40. Current dose may accumulate causing drowsiness and fall risk.", confidence: 89, date: "2024-04-02", recommendation: "Reduce Gabapentin to 200mg BID based on eGFR 38. Monitor for sedation and dizziness. Consider Pregabalin as alternative with better renal dosing profile." },
    ],
    familyMembers: [
      { id: "f4", name: "Vikram Iyer", relation: "Son", healthId: "UHID-2024-3102-H", conditions: ["Pre-diabetes"], riskFactors: ["Type 2 Diabetes (78% risk by age 55)", "CKD (35% risk)"], confidenceMatrix: [{ condition: "Type 2 Diabetes", probability: 0.78, reasoning: "Father has T2DM on insulin. Son has fasting glucose 115 mg/dL with BMI 30. South Asian ethnicity adds 2x baseline risk." }, { condition: "Chronic Kidney Disease", probability: 0.35, reasoning: "Paternal CKD Stage 3b secondary to diabetic nephropathy. If son develops T2DM, nephropathy risk significantly increases." }] },
      { id: "f5", name: "Meena Iyer Nair", relation: "Daughter", healthId: "UHID-2024-3103-I", conditions: [], riskFactors: ["Type 2 Diabetes (70% risk by age 60)"], confidenceMatrix: [{ condition: "Type 2 Diabetes", probability: 0.70, reasoning: "Father has T2DM with complications. Daughter's BMI 27 with sedentary lifestyle. South Asian female risk elevated." }] },
    ],
    lastVisit: "2024-04-03",
    nextAppointment: "2024-04-17",
    caregiverName: "Lakshmi Iyer",
    doctorName: "Dr. Rithika Singh",
    recentEvents: [
      { type: "ailment", description: "Increased tingling and numbness in feet — worsening peripheral neuropathy", date: "2024-04-04" },
    ],
  },
  {
    id: "5",
    healthId: "UHID-2024-2089-J",
    name: "Balwinder Singh Dhillon",
    age: 76,
    gender: "Male",
    avatar: "BD",
    location: "Amritsar, Punjab",
    conditions: ["Coronary Artery Disease", "Type 2 Diabetes", "Hyperlipidemia"],
    riskLevel: "high",
    medications: [
      { name: "Clopidogrel", dosage: "75mg", frequency: "Once daily", purpose: "Antiplatelet", conflicts: ["Omeprazole"] },
      { name: "Metformin", dosage: "1000mg", frequency: "Twice daily", purpose: "Blood sugar control" },
      { name: "Rosuvastatin", dosage: "40mg", frequency: "Once daily", purpose: "Cholesterol" },
      { name: "Nitroglycerin", dosage: "0.4mg", frequency: "As needed", purpose: "Angina relief" },
      { name: "Omeprazole", dosage: "20mg", frequency: "Once daily", purpose: "Acid reflux", conflicts: ["Clopidogrel"] },
    ],
    vitals: [
      { date: "2024-03-01", bloodPressureSys: 138, bloodPressureDia: 85, heartRate: 82, bloodSugar: 170, weight: 200, oxygenSat: 95 },
      { date: "2024-03-08", bloodPressureSys: 140, bloodPressureDia: 88, heartRate: 84, bloodSugar: 175, weight: 201, oxygenSat: 95 },
      { date: "2024-03-15", bloodPressureSys: 142, bloodPressureDia: 90, heartRate: 86, bloodSugar: 168, weight: 202, oxygenSat: 94 },
      { date: "2024-03-22", bloodPressureSys: 145, bloodPressureDia: 92, heartRate: 88, bloodSugar: 182, weight: 203, oxygenSat: 94 },
      { date: "2024-03-29", bloodPressureSys: 148, bloodPressureDia: 95, heartRate: 90, bloodSugar: 188, weight: 205, oxygenSat: 93 },
      { date: "2024-04-05", bloodPressureSys: 152, bloodPressureDia: 98, heartRate: 92, bloodSugar: 195, weight: 206, oxygenSat: 93 },
    ],
    insights: [
      { id: "i13", type: "critical", title: "Clopidogrel–Omeprazole Drug Interaction", description: "Omeprazole inhibits CYP2C19, reducing Clopidogrel activation by ~45%. Increases risk of stent thrombosis or MI in CAD patient.", confidence: 96, date: "2024-04-05", recommendation: "Switch Omeprazole to Pantoprazole 40mg (no CYP2C19 interaction). Urgent cardiology review. Consider platelet function assay to verify Clopidogrel efficacy." },
      { id: "i14", type: "critical", title: "Uncontrolled Hypertension with CAD", description: "BP rising to 152/98 mmHg — significantly above target <130/80 for CAD. At current trajectory, 6-month cardiac event risk at 22%.", confidence: 88, date: "2024-04-04", recommendation: "Add Ramipril 5mg daily. Order cardiac stress test and 2D echocardiogram. Carotid Doppler if not done in 12 months. Low-sodium diet counseling." },
      { id: "i15", type: "warning", title: "Obesity Worsening — BMI 30.5", description: "Weight gain of 6 lbs in 5 weeks (200→206 lbs). BMI now 30.5. Exacerbates insulin resistance and cardiac workload.", confidence: 84, date: "2024-04-03", recommendation: "Dietitian referral for structured weight loss plan. Target 5% body weight reduction in 6 months. Consider GLP-1 agonist (Semaglutide) for dual weight/glucose benefit." },
    ],
    familyMembers: [
      { id: "f6", name: "Harpreet Kaur Dhillon", relation: "Wife", healthId: "UHID-2024-2090-K", conditions: ["Hypertension"], riskFactors: ["Cardiovascular event risk elevated due to shared lifestyle"], confidenceMatrix: [{ condition: "Cardiovascular Disease", probability: 0.45, reasoning: "Shared dietary habits (high-fat Punjabi cuisine) and sedentary lifestyle. Hypertension already present. Not genetic linkage but environmental." }] },
      { id: "f7", name: "Gurpreet Singh Dhillon", relation: "Son", healthId: "UHID-2024-2091-L", conditions: ["Hyperlipidemia"], riskFactors: ["CAD (62% risk by age 60)", "T2DM (55% risk)"], confidenceMatrix: [{ condition: "Coronary Artery Disease", probability: 0.62, reasoning: "Father has CAD. Son already has hyperlipidemia with LDL 185 mg/dL at age 45. Strong paternal cardiac history." }, { condition: "Type 2 Diabetes", probability: 0.55, reasoning: "Paternal T2DM. Son's BMI 29 with elevated fasting glucose at 108 mg/dL." }] },
    ],
    lastVisit: "2024-04-01",
    nextAppointment: "2024-04-12",
    caregiverName: "Harpreet Kaur Dhillon",
    doctorName: "Dr. Rithika Singh",
    recentEvents: [
      { type: "ailment", description: "Chest tightness during morning walk — used Nitroglycerin sublingual", date: "2024-04-04" },
      { type: "vitals_change", description: "BP reached 152/98 — highest recorded in 6 months", date: "2024-04-05" },
    ],
  },
  {
    id: "6",
    healthId: "UHID-2024-3201-M",
    name: "Lakshmi Narasimhan",
    age: 71,
    gender: "Female",
    avatar: "LN",
    location: "Kochi, Kerala",
    conditions: ["Parkinson's Disease", "Osteoporosis", "Depression"],
    riskLevel: "medium",
    medications: [
      { name: "Levodopa/Carbidopa", dosage: "250/25mg", frequency: "Three times daily", purpose: "Parkinson's motor symptoms" },
      { name: "Alendronate", dosage: "70mg", frequency: "Once weekly", purpose: "Bone density" },
      { name: "Sertraline", dosage: "50mg", frequency: "Once daily", purpose: "Depression", conflicts: ["Levodopa/Carbidopa"] },
      { name: "Calcium + Vitamin D", dosage: "600mg/400IU", frequency: "Twice daily", purpose: "Bone health" },
    ],
    vitals: [
      { date: "2024-03-01", bloodPressureSys: 118, bloodPressureDia: 72, heartRate: 68, bloodSugar: 102, weight: 125, oxygenSat: 97 },
      { date: "2024-03-08", bloodPressureSys: 115, bloodPressureDia: 70, heartRate: 66, bloodSugar: 100, weight: 124, oxygenSat: 97 },
      { date: "2024-03-15", bloodPressureSys: 112, bloodPressureDia: 68, heartRate: 65, bloodSugar: 98, weight: 123, oxygenSat: 98 },
      { date: "2024-03-22", bloodPressureSys: 108, bloodPressureDia: 65, heartRate: 64, bloodSugar: 96, weight: 122, oxygenSat: 97 },
      { date: "2024-03-29", bloodPressureSys: 105, bloodPressureDia: 62, heartRate: 62, bloodSugar: 95, weight: 121, oxygenSat: 97 },
      { date: "2024-04-05", bloodPressureSys: 102, bloodPressureDia: 60, heartRate: 60, bloodSugar: 94, weight: 120, oxygenSat: 97 },
    ],
    insights: [
      { id: "i16", type: "warning", title: "Progressive Hypotension — Fall Risk", description: "Systolic BP declining 118→102 mmHg over 5 weeks. Levodopa-induced orthostatic hypotension likely. Combined with Parkinson's gait instability, fall risk is 3x elevated.", confidence: 88, date: "2024-04-05", recommendation: "Tilt-table test for orthostatic hypotension. Add Midodrine 5mg TID if confirmed. Home fall risk assessment. Consider hip protectors given osteoporosis." },
      { id: "i17", type: "warning", title: "Sertraline–Levodopa Interaction", description: "Sertraline (SSRI) may reduce Levodopa efficacy by increasing serotonin-dopamine competition. Motor symptoms may worsen.", confidence: 79, date: "2024-04-03", recommendation: "Consider switching to Mirtazapine 15mg (fewer dopaminergic interactions) or low-dose Bupropion. Neuropsychiatry consult for Parkinson's-specific depression management." },
      { id: "i18", type: "info", title: "Weight Loss Trend — Nutritional Concern", description: "5 lbs lost in 5 weeks (125→120 lbs). In Parkinson's patients, weight loss correlates with disease progression and malnutrition risk.", confidence: 82, date: "2024-04-02", recommendation: "Nutritional assessment and calorie-dense meal plan. Check serum albumin and prealbumin. Speech therapy evaluation for dysphagia screening." },
    ],
    familyMembers: [
      { id: "f8", name: "Arun Narasimhan", relation: "Son", healthId: "UHID-2024-3202-N", conditions: [], riskFactors: ["Parkinson's Disease (15% risk — first-degree relative)", "Depression (30% risk)"], confidenceMatrix: [{ condition: "Parkinson's Disease", probability: 0.15, reasoning: "Maternal PD diagnosed at 66. First-degree relatives have ~2-3x population risk. Son age 44, no motor symptoms yet." }, { condition: "Depression", probability: 0.30, reasoning: "Maternal clinical depression. Caregiver burden adds psychosocial risk factor. Genetic heritability ~37%." }] },
    ],
    lastVisit: "2024-04-02",
    nextAppointment: "2024-04-19",
    caregiverName: "Arun Narasimhan",
    doctorName: "Dr. Rithika Singh",
    recentEvents: [
      { type: "fall", description: "Fell while getting up from chair — no fracture, bruised hip", date: "2024-04-01" },
    ],
  },
  {
    id: "7",
    healthId: "UHID-2024-4502-O",
    name: "Abdul Karim Sheikh",
    age: 85,
    gender: "Male",
    avatar: "AS",
    location: "Srinagar, Jammu & Kashmir",
    conditions: ["Chronic Obstructive Pulmonary Disease", "Cor Pulmonale", "Benign Prostatic Hyperplasia"],
    riskLevel: "high",
    medications: [
      { name: "Tiotropium", dosage: "18mcg", frequency: "Once daily", purpose: "COPD maintenance" },
      { name: "Prednisolone", dosage: "10mg", frequency: "Once daily", purpose: "Anti-inflammatory" },
      { name: "Tamsulosin", dosage: "0.4mg", frequency: "Once daily", purpose: "BPH/urinary flow" },
      { name: "Theophylline", dosage: "200mg", frequency: "Twice daily", purpose: "Bronchodilator" },
    ],
    vitals: [
      { date: "2024-03-01", bloodPressureSys: 125, bloodPressureDia: 78, heartRate: 90, bloodSugar: 130, weight: 155, oxygenSat: 90 },
      { date: "2024-03-08", bloodPressureSys: 128, bloodPressureDia: 80, heartRate: 92, bloodSugar: 135, weight: 156, oxygenSat: 89 },
      { date: "2024-03-15", bloodPressureSys: 130, bloodPressureDia: 82, heartRate: 94, bloodSugar: 140, weight: 157, oxygenSat: 88 },
      { date: "2024-03-22", bloodPressureSys: 132, bloodPressureDia: 85, heartRate: 96, bloodSugar: 142, weight: 158, oxygenSat: 87 },
      { date: "2024-03-29", bloodPressureSys: 135, bloodPressureDia: 88, heartRate: 98, bloodSugar: 148, weight: 160, oxygenSat: 86 },
      { date: "2024-04-05", bloodPressureSys: 138, bloodPressureDia: 90, heartRate: 100, bloodSugar: 152, weight: 162, oxygenSat: 85 },
    ],
    insights: [
      { id: "i19", type: "critical", title: "Severe Hypoxemia — Urgent Intervention", description: "SpO2 at 85% — below critical threshold of 88%. Cor pulmonale progression evident with rising HR (100 bpm) and weight gain (fluid retention).", confidence: 95, date: "2024-04-05", recommendation: "Immediate pulmonology review. Start home oxygen 2L/min via nasal cannula. Urgent ABG and 2D echocardiogram for right heart function. Consider long-term oxygen therapy (LTOT)." },
      { id: "i20", type: "critical", title: "Steroid-Induced Hyperglycemia", description: "Blood sugar rising 130→152 mg/dL concurrent with Prednisolone 10mg daily. No prior diabetes diagnosis — likely steroid-induced diabetes.", confidence: 87, date: "2024-04-04", recommendation: "Fasting glucose and HbA1c to confirm. If HbA1c >6.5%, start Metformin 500mg. Taper Prednisolone to 5mg if COPD permits. Consider inhaled corticosteroid (Budesonide) as steroid-sparing alternative." },
      { id: "i21", type: "warning", title: "Theophylline Toxicity Risk", description: "At age 85, hepatic clearance of Theophylline is reduced by ~30%. Serum levels may be supra-therapeutic, causing tachycardia and GI symptoms.", confidence: 83, date: "2024-04-03", recommendation: "Stat serum Theophylline level (target 10-15 mcg/mL). Reduce dose to 100mg BID if level >15. Monitor for tremor, nausea, and palpitations." },
    ],
    familyMembers: [
      { id: "f9", name: "Farooq Sheikh", relation: "Son", healthId: "UHID-2024-4503-P", conditions: ["Asthma"], riskFactors: ["COPD (48% risk — smoking history + genetics)", "Cor Pulmonale (25% risk)"], confidenceMatrix: [{ condition: "COPD", probability: 0.48, reasoning: "Father has severe COPD. Son has 15 pack-year smoking history and childhood asthma. Genetic susceptibility + environmental exposure = high cumulative risk." }, { condition: "Cor Pulmonale", probability: 0.25, reasoning: "If COPD develops, ~30% progress to cor pulmonale. Combined paternal history makes this a significant long-term risk." }] },
    ],
    lastVisit: "2024-04-04",
    nextAppointment: "2024-04-08",
    caregiverName: "Nasreen Sheikh",
    doctorName: "Dr. Rithika Singh",
    recentEvents: [
      { type: "vitals_change", description: "SpO2 dropped to 85% — critical desaturation event", date: "2024-04-05" },
      { type: "ailment", description: "Severe breathlessness at rest — unable to complete sentences", date: "2024-04-05" },
    ],
  },
  {
    id: "8",
    healthId: "UHID-2024-5678-Q",
    name: "Padma Rao Kulkarni",
    age: 69,
    gender: "Female",
    avatar: "PK",
    location: "Pune, Maharashtra",
    conditions: ["Rheumatoid Arthritis", "Hypertension", "Chronic Liver Disease"],
    riskLevel: "medium",
    medications: [
      { name: "Methotrexate", dosage: "15mg", frequency: "Once weekly", purpose: "RA immunosuppression", conflicts: ["NSAIDs", "Alcohol"] },
      { name: "Folic Acid", dosage: "5mg", frequency: "Once daily (except MTX day)", purpose: "Methotrexate side effect prevention" },
      { name: "Enalapril", dosage: "10mg", frequency: "Once daily", purpose: "Blood pressure" },
      { name: "Ursodeoxycholic Acid", dosage: "300mg", frequency: "Twice daily", purpose: "Liver protection" },
    ],
    vitals: [
      { date: "2024-03-01", bloodPressureSys: 135, bloodPressureDia: 82, heartRate: 74, bloodSugar: 105, weight: 148, oxygenSat: 97 },
      { date: "2024-03-08", bloodPressureSys: 132, bloodPressureDia: 80, heartRate: 72, bloodSugar: 102, weight: 147, oxygenSat: 97 },
      { date: "2024-03-15", bloodPressureSys: 130, bloodPressureDia: 78, heartRate: 73, bloodSugar: 100, weight: 147, oxygenSat: 98 },
      { date: "2024-03-22", bloodPressureSys: 128, bloodPressureDia: 76, heartRate: 71, bloodSugar: 98, weight: 146, oxygenSat: 97 },
      { date: "2024-03-29", bloodPressureSys: 126, bloodPressureDia: 75, heartRate: 70, bloodSugar: 96, weight: 146, oxygenSat: 98 },
      { date: "2024-04-05", bloodPressureSys: 124, bloodPressureDia: 74, heartRate: 70, bloodSugar: 95, weight: 145, oxygenSat: 98 },
    ],
    insights: [
      { id: "i22", type: "warning", title: "Methotrexate Hepatotoxicity Monitoring", description: "Chronic liver disease + Methotrexate 15mg weekly poses cumulative hepatotoxicity risk. ALT trend needs evaluation with cumulative dose >3g.", confidence: 90, date: "2024-04-05", recommendation: "Urgent LFT panel (ALT, AST, ALP, bilirubin). FibroScan or liver elastography if ALT >2x ULN. Rheumatology consult for switching to Leflunomide or biologic (Adalimumab) if liver function deteriorating." },
      { id: "i23", type: "positive", title: "Blood Pressure Reaching Target", description: "BP improving steadily from 135/82 to 124/74 on Enalapril 10mg. Within target range for secondary prevention.", confidence: 86, date: "2024-04-03", recommendation: "Maintain current Enalapril dose. Annual microalbuminuria screening. Continue home BP monitoring." },
      { id: "i24", type: "info", title: "RA Disease Activity Moderate", description: "DAS28 score estimated at 3.8 based on reported joint symptoms. Partial response to Methotrexate. May need combination therapy.", confidence: 75, date: "2024-04-01", recommendation: "Formal DAS28 assessment at next visit. If >3.2, consider adding Hydroxychloroquine 200mg BID. ESR and CRP levels needed for disease activity quantification." },
    ],
    familyMembers: [
      { id: "f10", name: "Suresh Kulkarni", relation: "Husband", healthId: "UHID-2024-5679-R", conditions: ["Type 2 Diabetes"], riskFactors: [], confidenceMatrix: [] },
      { id: "f11", name: "Anita Kulkarni Deshpande", relation: "Daughter", healthId: "UHID-2024-5680-S", conditions: [], riskFactors: ["Rheumatoid Arthritis (18% risk)", "Autoimmune disorders (25% risk)"], confidenceMatrix: [{ condition: "Rheumatoid Arthritis", probability: 0.18, reasoning: "Maternal RA. Daughter age 40, no joint symptoms. HLA-DR4 testing recommended. First-degree relative risk ~3x population." }, { condition: "Autoimmune disorders", probability: 0.25, reasoning: "Maternal RA indicates autoimmune predisposition. Hashimoto's and SLE screening advisable if symptoms emerge." }] },
    ],
    lastVisit: "2024-04-01",
    nextAppointment: "2024-04-22",
    caregiverName: "Suresh Kulkarni",
    doctorName: "Dr. Rithika Singh",
  },
  {
    id: "9",
    healthId: "UHID-2024-6789-T",
    name: "Gopal Krishna Das",
    age: 88,
    gender: "Male",
    avatar: "GD",
    location: "Kolkata, West Bengal",
    conditions: ["Alzheimer's Disease", "Type 2 Diabetes", "Hypertension"],
    riskLevel: "high",
    medications: [
      { name: "Donepezil", dosage: "10mg", frequency: "Once daily (bedtime)", purpose: "Cognitive decline — Alzheimer's" },
      { name: "Memantine", dosage: "10mg", frequency: "Twice daily", purpose: "NMDA receptor modulation" },
      { name: "Glimepiride", dosage: "2mg", frequency: "Once daily", purpose: "Blood sugar control", conflicts: ["Donepezil"] },
      { name: "Amlodipine", dosage: "5mg", frequency: "Once daily", purpose: "Blood pressure" },
    ],
    vitals: [
      { date: "2024-03-01", bloodPressureSys: 140, bloodPressureDia: 85, heartRate: 70, bloodSugar: 145, weight: 140, oxygenSat: 96 },
      { date: "2024-03-08", bloodPressureSys: 138, bloodPressureDia: 82, heartRate: 68, bloodSugar: 140, weight: 139, oxygenSat: 96 },
      { date: "2024-03-15", bloodPressureSys: 135, bloodPressureDia: 80, heartRate: 66, bloodSugar: 135, weight: 138, oxygenSat: 97 },
      { date: "2024-03-22", bloodPressureSys: 130, bloodPressureDia: 78, heartRate: 64, bloodSugar: 128, weight: 136, oxygenSat: 96 },
      { date: "2024-03-29", bloodPressureSys: 128, bloodPressureDia: 75, heartRate: 62, bloodSugar: 110, weight: 134, oxygenSat: 96 },
      { date: "2024-04-05", bloodPressureSys: 125, bloodPressureDia: 72, heartRate: 58, bloodSugar: 85, weight: 132, oxygenSat: 95 },
    ],
    insights: [
      { id: "i25", type: "critical", title: "Hypoglycemia Risk — Glimepiride + Reduced Intake", description: "Blood sugar dropped from 145→85 mg/dL over 5 weeks. Patient's food intake declining due to Alzheimer's-related appetite loss. Glimepiride 2mg may cause severe hypoglycemia.", confidence: 93, date: "2024-04-05", recommendation: "Reduce Glimepiride to 1mg or switch to DPP-4 inhibitor (Sitagliptin 50mg) with lower hypoglycemia risk. CGMS monitoring for 2 weeks. Ensure caregiver trained in hypoglycemia recognition and glucagon use." },
      { id: "i26", type: "critical", title: "Significant Weight Loss — Alzheimer's Progression", description: "8 lbs lost in 5 weeks (140→132 lbs). Alzheimer's patients losing >5% body weight in 6 months have 2.5x mortality risk. Possible dysphagia.", confidence: 90, date: "2024-04-04", recommendation: "Swallowing assessment by speech pathologist. High-calorie oral supplements (e.g., Ensure Plus). Consider PEG tube discussion with family if oral intake continues declining. Nutritional status labs (albumin, prealbumin, B12)." },
      { id: "i27", type: "warning", title: "Bradycardia — Donepezil Side Effect", description: "Heart rate declining from 70→58 bpm. Donepezil's cholinergic effect known to cause bradycardia, especially in elderly. Risk of syncope.", confidence: 85, date: "2024-04-03", recommendation: "12-lead ECG and 24-hour Holter monitor. If symptomatic bradycardia (dizziness, syncope), reduce Donepezil to 5mg. Avoid concurrent rate-lowering drugs." },
    ],
    familyMembers: [
      { id: "f12", name: "Subhash Das", relation: "Son", healthId: "UHID-2024-6790-U", conditions: ["Mild Cognitive Impairment"], riskFactors: ["Alzheimer's Disease (45% risk by age 75)", "T2DM (50% risk)"], confidenceMatrix: [{ condition: "Alzheimer's Disease", probability: 0.45, reasoning: "Father has AD diagnosed at 83. Son already showing MCI at age 58. ApoE4 carrier testing recommended. MCI converts to AD at ~10-15% per year." }, { condition: "Type 2 Diabetes", probability: 0.50, reasoning: "Paternal T2DM. Son's BMI 28 with fasting glucose 106 mg/dL. Insulin resistance common in cognitive decline." }] },
      { id: "f13", name: "Rina Das Chatterjee", relation: "Daughter", healthId: "UHID-2024-6791-V", conditions: [], riskFactors: ["Alzheimer's Disease (30% risk by age 70)"], confidenceMatrix: [{ condition: "Alzheimer's Disease", probability: 0.30, reasoning: "Paternal AD. No current cognitive symptoms. Female sex modestly increases lifetime AD risk. Recommend baseline cognitive screening at age 60." }] },
    ],
    lastVisit: "2024-04-03",
    nextAppointment: "2024-04-11",
    caregiverName: "Subhash Das",
    doctorName: "Dr. Rithika Singh",
    recentEvents: [
      { type: "fall", description: "Found on floor in bedroom — likely fell during night, disoriented", date: "2024-04-02" },
      { type: "ailment", description: "Refused meals for 2 consecutive days — caregiver reported", date: "2024-04-04" },
      { type: "vitals_change", description: "Blood sugar dropped to 85 mg/dL — near hypoglycemic threshold", date: "2024-04-05" },
    ],
  },
  {
    id: "10",
    healthId: "UHID-2024-7890-W",
    name: "Devika Menon",
    age: 73,
    gender: "Female",
    avatar: "DM",
    location: "Thiruvananthapuram, Kerala",
    conditions: ["Systemic Lupus Erythematosus", "Lupus Nephritis", "Anemia"],
    riskLevel: "medium",
    medications: [
      { name: "Hydroxychloroquine", dosage: "200mg", frequency: "Twice daily", purpose: "SLE disease modification" },
      { name: "Mycophenolate", dosage: "500mg", frequency: "Twice daily", purpose: "Lupus nephritis" },
      { name: "Prednisolone", dosage: "7.5mg", frequency: "Once daily", purpose: "SLE flare control" },
      { name: "Iron Sucrose", dosage: "200mg IV", frequency: "Weekly", purpose: "Iron deficiency anemia" },
    ],
    vitals: [
      { date: "2024-03-01", bloodPressureSys: 130, bloodPressureDia: 82, heartRate: 80, bloodSugar: 108, weight: 135, oxygenSat: 96 },
      { date: "2024-03-08", bloodPressureSys: 132, bloodPressureDia: 84, heartRate: 82, bloodSugar: 110, weight: 134, oxygenSat: 96 },
      { date: "2024-03-15", bloodPressureSys: 135, bloodPressureDia: 86, heartRate: 84, bloodSugar: 115, weight: 134, oxygenSat: 95 },
      { date: "2024-03-22", bloodPressureSys: 138, bloodPressureDia: 88, heartRate: 86, bloodSugar: 118, weight: 135, oxygenSat: 95 },
      { date: "2024-03-29", bloodPressureSys: 140, bloodPressureDia: 90, heartRate: 88, bloodSugar: 120, weight: 136, oxygenSat: 94 },
      { date: "2024-04-05", bloodPressureSys: 142, bloodPressureDia: 92, heartRate: 90, bloodSugar: 122, weight: 137, oxygenSat: 94 },
    ],
    insights: [
      { id: "i28", type: "warning", title: "Rising BP — Lupus Nephritis Progression", description: "BP trending up 130/82→142/92 over 5 weeks. In lupus nephritis, rising BP often indicates worsening renal function or disease flare.", confidence: 87, date: "2024-04-05", recommendation: "Urgent urinalysis (protein/creatinine ratio), serum complement (C3, C4), anti-dsDNA titers. Renal biopsy if proteinuria >1g/day. Add Losartan 50mg for renoprotection. Nephrology consult." },
      { id: "i29", type: "warning", title: "Triple Immunosuppression Infection Risk", description: "Prednisolone + Mycophenolate + Hydroxychloroquine combination increases infection risk 4x. Patient age 73 compounds immunocompromised state.", confidence: 84, date: "2024-04-03", recommendation: "CBC with differential weekly. Pneumococcal and influenza vaccination status check. Prophylactic TMP-SMX if lymphocyte count <1000. Avoid crowded settings during monsoon season." },
      { id: "i30", type: "info", title: "Anemia Improving with IV Iron", description: "Hemoglobin estimated improving based on reduced tachycardia trend (pending labs). Iron sucrose 200mg weekly regimen showing clinical response.", confidence: 72, date: "2024-04-01", recommendation: "Check CBC, serum ferritin, and TIBC at 4-week mark. If Hb >10 g/dL, reduce Iron Sucrose to biweekly. Monitor for iron overload if ferritin >500." },
    ],
    familyMembers: [
      { id: "f14", name: "Anjali Menon", relation: "Daughter", healthId: "UHID-2024-7891-X", conditions: ["Raynaud's Phenomenon"], riskFactors: ["SLE (22% risk)", "Autoimmune thyroiditis (28% risk)"], confidenceMatrix: [{ condition: "Systemic Lupus", probability: 0.22, reasoning: "Maternal SLE. Daughter has Raynaud's phenomenon — an early autoimmune marker. ANA screening recommended. Female sex + family history = elevated risk." }, { condition: "Autoimmune Thyroiditis", probability: 0.28, reasoning: "Autoimmune clustering in family. Raynaud's + maternal SLE suggests broader autoimmune predisposition. TSH and anti-TPO testing advisable." }] },
    ],
    lastVisit: "2024-04-02",
    nextAppointment: "2024-04-16",
    caregiverName: "Anjali Menon",
    doctorName: "Dr. Rithika Singh",
    recentEvents: [
      { type: "ailment", description: "Facial butterfly rash reappeared — possible SLE flare", date: "2024-04-03" },
    ],
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
