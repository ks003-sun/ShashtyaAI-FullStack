-- ============================================================
-- Shastya AI — Seed Data (INSERT statements)
-- ============================================================
USE shastya_ai;

-- ────────────────────────────────────────────────────────────
-- PATIENTS
-- ────────────────────────────────────────────────────────────
INSERT INTO patients (id,uhid,full_name,age,gender,blood_group,phone,conditions,medications,risk_level) VALUES
('p-001','UHID-10001','Mohan Lal Iyer',72,'female','A+','555-0101',
  '["Type 2 Diabetes","Hypertension","Mild Cataracts"]',
  '[{"name":"Metformin","dose":"500mg","freq":"Twice daily"},{"name":"Lisinopril","dose":"10mg","freq":"Once daily"},{"name":"Aspirin","dose":"81mg","freq":"Once daily"}]',
  'high'),

('p-002','UHID-10002','Venkatesh Reddy',79,'male','O-','555-0102',
  '["Congestive Heart Failure","COPD","Atrial Fibrillation"]',
  '[{"name":"Furosemide","dose":"40mg","freq":"Once daily"},{"name":"Carvedilol","dose":"6.25mg","freq":"Twice daily"},{"name":"Warfarin","dose":"5mg","freq":"Once daily"}]',
  'critical'),

('p-003','UHID-10003','Kamala Devi Sharma',68,'female','B+','555-0103',
  '["Osteoporosis","Hypothyroidism","Mild Depression"]',
  '[{"name":"Levothyroxine","dose":"75mcg","freq":"Once daily"},{"name":"Alendronate","dose":"70mg","freq":"Weekly"},{"name":"Sertraline","dose":"50mg","freq":"Once daily"}]',
  'medium'),

('p-004','UHID-10004','",74,"male","AB+","555-0104',
  '["Type 2 Diabetes","Peripheral Neuropathy","Chronic Kidney Disease Stage 3"]',
  '[{"name":"Insulin Glargine","dose":"20 units","freq":"Once daily"},{"name":"Gabapentin","dose":"300mg","freq":"Three times daily"},{"name":"Atorvastatin","dose":"40mg","freq":"Once daily"}]',
  'high'),

('p-005','UHID-10005','Dorothy Williams',83,'female','A-','555-0105',
  '["Coronary Artery Disease","Hypertension","Type 2 Diabetes","Hyperlipidemia"]',
  '[{"name":"Nitroglycerin","dose":"0.4mg","freq":"PRN"},{"name":"Metoprolol","dose":"25mg","freq":"Twice daily"},{"name":"Metformin","dose":"1000mg","freq":"Twice daily"}]',
  'critical'),

('p-006','UHID-10006','James Rodriguez',71,'male','O+','555-0106',
  '["Parkinson\'s Disease","Hypertension","Insomnia"]',
  '[{"name":"Levodopa/Carbidopa","dose":"100/25mg","freq":"Three times daily"},{"name":"Amantadine","dose":"100mg","freq":"Twice daily"},{"name":"Melatonin","dose":"5mg","freq":"Once nightly"}]',
  'high'),

('p-007','UHID-10007','Patricia Johnson",77,"female","B-","555-0107',
  '["Severe COPD","Pulmonary Hypertension","Right Heart Failure"]',
  '[{"name":"Tiotropium","dose":"18mcg","freq":"Once daily"},{"name":"Budesonide/Formoterol","dose":"160/4.5mcg","freq":"Twice daily"},{"name":"Sildenafil","dose":"20mg","freq":"Three times daily"}]',
  'critical'),

('p-008','UHID-10008','Walter Nguyen',66,'male','AB-','555-0108',
  '["Early Alzheimer\'s Disease","Hypertension","Hyperlipidemia"]',
  '[{"name":"Donepezil","dose":"10mg","freq":"Once daily"},{"name":"Memantine","dose":"10mg","freq":"Twice daily"},{"name":"Amlodipine","dose":"5mg","freq":"Once daily"}]',
  'high');

-- ────────────────────────────────────────────────────────────
-- VITALS  (7 readings per patient over 3 weeks, showing trends)
-- ────────────────────────────────────────────────────────────

-- Eleanor Mitchell (p-001) — rising glucose trend
INSERT INTO vitals VALUES
('v-001-1','p-001','2024-03-15 08:00:00',72,138,88,142,97,167.2,98.2),
('v-001-2','p-001','2024-03-17 08:10:00',75,140,90,148,97,167.5,98.1),
('v-001-3','p-001','2024-03-20 08:05:00',74,143,91,155,96,167.8,98.3),
('v-001-4','p-001','2024-03-23 08:00:00',76,145,92,162,96,168.0,98.0),
('v-001-5','p-001','2024-03-27 08:15:00',78,148,93,171,96,168.3,97.9),
('v-001-6','p-001','2024-04-01 08:00:00',79,151,94,178,95,168.6,97.8),
('v-001-7','p-001','2024-04-05 08:30:00',81,154,95,183,95,169.0,97.6);

-- Harold Thompson (p-002) — falling SpO2, rising BP
INSERT INTO vitals VALUES
('v-002-1','p-002','2024-03-15 07:30:00',88,145,92,128,93,194.0,97.5),
('v-002-2','p-002','2024-03-17 07:40:00',91,148,93,130,92,194.5,97.4),
('v-002-3','p-002','2024-03-20 07:35:00',94,152,95,131,91,195.0,97.3),
('v-002-4','p-002','2024-03-23 07:30:00',97,156,97,133,90,195.5,97.1),
('v-002-5','p-002','2024-03-27 07:45:00',99,160,98,135,89,196.0,97.0),
('v-002-6','p-002','2024-04-01 07:30:00',102,164,100,137,88,196.5,96.9),
('v-002-7','p-002','2024-04-05 07:45:00',104,168,102,138,86,197.0,96.8);

-- Margaret Chen (p-003) — stable, mild variation
INSERT INTO vitals VALUES
('v-003-1','p-003','2024-03-15 09:00:00',68,122,78,102,98,142.0,98.4),
('v-003-2','p-003','2024-03-17 09:05:00',70,124,79,104,98,142.2,98.5),
('v-003-3','p-003','2024-03-20 09:00:00',67,121,78,103,98,142.4,98.3),
('v-003-4','p-003','2024-03-23 09:10:00',69,123,79,106,97,142.6,98.4),
('v-003-5','p-003','2024-03-27 09:00:00',71,125,80,108,98,142.8,98.3),
('v-003-6','p-003','2024-04-01 09:05:00',68,122,78,105,98,143.0,98.4),
('v-003-7','p-003','2024-04-05 09:00:00',70,124,79,107,98,143.2,98.4);

-- Robert Patel (p-004) — glucose spike + neuropathy marker (high glucose)
INSERT INTO vitals VALUES
('v-004-1','p-004','2024-03-15 08:00:00',74,132,84,168,97,175.0,98.1),
('v-004-2','p-004','2024-03-17 08:10:00',76,134,85,175,97,175.2,98.0),
('v-004-3','p-004','2024-03-20 08:00:00',75,136,86,183,96,175.6,97.9),
('v-004-4','p-004','2024-03-23 08:05:00',78,139,87,191,96,175.8,97.9),
('v-004-5','p-004','2024-03-27 08:00:00',80,141,88,198,96,176.0,97.8),
('v-004-6','p-004','2024-04-01 08:10:00',82,143,89,207,95,176.4,97.7),
('v-004-7','p-004','2024-04-05 09:30:00',84,145,90,214,95,176.8,97.6);

-- Dorothy Williams (p-005) — near-critical, BP + glucose both rising
INSERT INTO vitals VALUES
('v-005-1','p-005','2024-03-15 07:00:00',82,158,96,188,94,206.0,97.2),
('v-005-2','p-005','2024-03-17 07:10:00',85,162,98,195,94,206.4,97.1),
('v-005-3','p-005','2024-03-20 07:00:00',88,166,99,202,93,206.8,97.0),
('v-005-4','p-005','2024-03-23 07:05:00',90,170,101,210,93,207.2,96.9),
('v-005-5','p-005','2024-03-27 07:00:00',92,173,102,218,92,207.6,96.8),
('v-005-6','p-005','2024-04-01 07:15:00',94,176,103,225,91,208.0,96.7),
('v-005-7','p-005','2024-04-05 11:00:00',96,179,104,231,90,208.4,96.5);

-- James Rodriguez (p-006) — Parkinson's: tremor-affected HR variability
INSERT INTO vitals VALUES
('v-006-1','p-006','2024-03-15 08:30:00',78,136,86,122,97,162.0,98.2),
('v-006-2','p-006','2024-03-17 08:40:00',82,138,87,124,97,162.2,98.1),
('v-006-3','p-006','2024-03-20 08:30:00',76,140,88,125,97,162.4,98.2),
('v-006-4','p-006','2024-03-23 08:35:00',85,142,89,127,96,162.6,98.0),
('v-006-5','p-006','2024-03-27 08:30:00',79,144,90,129,96,162.8,98.1),
('v-006-6','p-006','2024-04-01 08:40:00',88,147,91,131,96,163.0,97.9),
('v-006-7','p-006','2024-04-05 08:00:00',83,149,92,132,95,163.2,97.9);

-- Patricia Johnson (p-007) — critical SpO2 decline
INSERT INTO vitals VALUES
('v-007-1','p-007','2024-03-15 06:00:00',96,148,94,118,91,162.0,98.0),
('v-007-2','p-007','2024-03-17 06:10:00',98,150,95,119,90,162.2,97.9),
('v-007-3','p-007','2024-03-20 06:00:00',100,153,96,121,89,162.4,97.8),
('v-007-4','p-007','2024-03-23 06:05:00',103,156,97,122,88,162.6,97.7),
('v-007-5','p-007','2024-03-27 06:00:00',106,159,98,124,87,162.8,97.6),
('v-007-6','p-007','2024-04-01 06:10:00',109,163,100,126,86,163.0,97.5),
('v-007-7','p-007','2024-04-05 08:00:00',112,167,102,128,85,163.2,97.4);

-- Walter Nguyen (p-008) — Alzheimer's, gradual BP elevation
INSERT INTO vitals VALUES
('v-008-1','p-008','2024-03-15 09:00:00',70,128,82,118,98,158.0,98.3),
('v-008-2','p-008','2024-03-17 09:10:00',72,130,83,119,98,158.2,98.3),
('v-008-3','p-008','2024-03-20 09:00:00',71,132,84,121,98,158.4,98.2),
('v-008-4','p-008','2024-03-23 09:05:00',73,134,84,122,98,158.6,98.2),
('v-008-5','p-008','2024-03-27 09:00:00',74,137,85,124,97,158.8,98.1),
('v-008-6','p-008','2024-04-01 09:10:00',75,139,86,125,97,159.0,98.1),
('v-008-7','p-008','2024-04-05 09:30:00',76,142,87,127,97,159.2,98.0);

-- ────────────────────────────────────────────────────────────
-- ALERTS
-- ────────────────────────────────────────────────────────────
INSERT INTO alerts VALUES
('a-001','p-001','high','Glucose Trend','Fasting glucose increased 29% over 21 days (142→183 mg/dL). HbA1c review recommended.',0,'2024-04-05 08:31:00'),
('a-002','p-002','critical','Respiratory + Cardiac','SpO2 declining (93%→86%) alongside rising BP (145→168 mmHg). Risk of acute decompensation.',0,'2024-04-05 07:46:00'),
('a-003','p-002','critical','Weight Gain','+3 lbs fluid retention in 21 days. Possible diuretic resistance. Furosemide dose review needed.',0,'2024-04-05 07:47:00'),
('a-004','p-004','high','Glucose Uncontrolled','Blood glucose rising steadily (168→214 mg/dL over 21 days). Insulin titration may be required.',0,'2024-04-05 09:31:00'),
('a-005','p-005','critical','Multi-System Deterioration','BP, glucose, and SpO2 all trending negatively simultaneously. Immediate clinical review advised.',0,'2024-04-05 11:01:00'),
('a-006','p-007','critical','SpO2 Critical','Oxygen saturation at 85% — below safe threshold. Nebulizer use logged. Hospital escalation protocol triggered.',0,'2024-04-05 08:01:00'),
('a-007','p-006','high','BP Elevation','Systolic BP rising trend (136→149 mmHg). Heart rate variability elevated — Parkinson\'s medication timing review suggested.',0,'2024-04-05 08:01:00'),
('a-008','p-008','medium','Cognitive Monitoring','Patient disoriented briefly this morning. MMSE score follow-up recommended. Donepezil adherence check needed.',1,'2024-04-05 09:31:00');
