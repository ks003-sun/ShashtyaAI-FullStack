"""
data/store.py — In-memory data store (simulates MySQL tables)
"""
from datetime import datetime

# ════════════════════════════════════════════════════════════
# PATIENTS
# ════════════════════════════════════════════════════════════
PATIENTS = [
    {
        "id": "p-001", "uhid": "UHID-10001", "full_name": "Eleanor Mitchell",
        "age": 72, "gender": "female", "blood_group": "A+", "phone": "555-0101",
        "conditions": ["Type 2 Diabetes", "Hypertension", "Mild Cataracts"],
        "medications": [
            {"name": "Metformin", "dose": "500mg", "freq": "Twice daily"},
            {"name": "Lisinopril", "dose": "10mg", "freq": "Once daily"},
            {"name": "Aspirin", "dose": "81mg", "freq": "Once daily"},
        ],
        "risk_level": "high", "created_at": "2024-01-10T09:00:00Z",
    },
    {
        "id": "p-002", "uhid": "UHID-10002", "full_name": "Harold Thompson",
        "age": 79, "gender": "male", "blood_group": "O-", "phone": "555-0102",
        "conditions": ["Congestive Heart Failure", "COPD", "Atrial Fibrillation"],
        "medications": [
            {"name": "Furosemide", "dose": "40mg", "freq": "Once daily"},
            {"name": "Carvedilol", "dose": "6.25mg", "freq": "Twice daily"},
            {"name": "Warfarin", "dose": "5mg", "freq": "Once daily"},
        ],
        "risk_level": "critical", "created_at": "2024-01-12T09:00:00Z",
    },
    {
        "id": "p-003", "uhid": "UHID-10003", "full_name": "Margaret Chen",
        "age": 68, "gender": "female", "blood_group": "B+", "phone": "555-0103",
        "conditions": ["Osteoporosis", "Hypothyroidism", "Mild Depression"],
        "medications": [
            {"name": "Levothyroxine", "dose": "75mcg", "freq": "Once daily"},
            {"name": "Alendronate", "dose": "70mg", "freq": "Weekly"},
            {"name": "Sertraline", "dose": "50mg", "freq": "Once daily"},
        ],
        "risk_level": "medium", "created_at": "2024-01-15T09:00:00Z",
    },
    {
        "id": "p-004", "uhid": "UHID-10004", "full_name": "Robert Patel",
        "age": 74, "gender": "male", "blood_group": "AB+", "phone": "555-0104",
        "conditions": ["Type 2 Diabetes", "Peripheral Neuropathy", "Chronic Kidney Disease Stage 3"],
        "medications": [
            {"name": "Insulin Glargine", "dose": "20 units", "freq": "Once daily"},
            {"name": "Gabapentin", "dose": "300mg", "freq": "Three times daily"},
            {"name": "Atorvastatin", "dose": "40mg", "freq": "Once daily"},
        ],
        "risk_level": "high", "created_at": "2024-01-18T09:00:00Z",
    },
    {
        "id": "p-005", "uhid": "UHID-10005", "full_name": "Dorothy Williams",
        "age": 83, "gender": "female", "blood_group": "A-", "phone": "555-0105",
        "conditions": ["Coronary Artery Disease", "Hypertension", "Type 2 Diabetes", "Hyperlipidemia"],
        "medications": [
            {"name": "Nitroglycerin", "dose": "0.4mg", "freq": "PRN"},
            {"name": "Metoprolol", "dose": "25mg", "freq": "Twice daily"},
            {"name": "Metformin", "dose": "1000mg", "freq": "Twice daily"},
        ],
        "risk_level": "critical", "created_at": "2024-01-20T09:00:00Z",
    },
    {
        "id": "p-006", "uhid": "UHID-10006", "full_name": "James Rodriguez",
        "age": 71, "gender": "male", "blood_group": "O+", "phone": "555-0106",
        "conditions": ["Parkinson's Disease", "Hypertension", "Insomnia"],
        "medications": [
            {"name": "Levodopa/Carbidopa", "dose": "100/25mg", "freq": "Three times daily"},
            {"name": "Amantadine", "dose": "100mg", "freq": "Twice daily"},
            {"name": "Melatonin", "dose": "5mg", "freq": "Once nightly"},
        ],
        "risk_level": "high", "created_at": "2024-01-22T09:00:00Z",
    },
    {
        "id": "p-007", "uhid": "UHID-10007", "full_name": "Patricia Johnson",
        "age": 77, "gender": "female", "blood_group": "B-", "phone": "555-0107",
        "conditions": ["Severe COPD", "Pulmonary Hypertension", "Right Heart Failure"],
        "medications": [
            {"name": "Tiotropium", "dose": "18mcg", "freq": "Once daily"},
            {"name": "Budesonide/Formoterol", "dose": "160/4.5mcg", "freq": "Twice daily"},
            {"name": "Sildenafil", "dose": "20mg", "freq": "Three times daily"},
        ],
        "risk_level": "critical", "created_at": "2024-01-25T09:00:00Z",
    },
    {
        "id": "p-008", "uhid": "UHID-10008", "full_name": "Walter Nguyen",
        "age": 66, "gender": "male", "blood_group": "AB-", "phone": "555-0108",
        "conditions": ["Early Alzheimer's Disease", "Hypertension", "Hyperlipidemia"],
        "medications": [
            {"name": "Donepezil", "dose": "10mg", "freq": "Once daily"},
            {"name": "Memantine", "dose": "10mg", "freq": "Twice daily"},
            {"name": "Amlodipine", "dose": "5mg", "freq": "Once daily"},
        ],
        "risk_level": "high", "created_at": "2024-01-28T09:00:00Z",
    },
]

# ════════════════════════════════════════════════════════════
# VITALS  (7 readings × 8 patients — realistic trends)
# ════════════════════════════════════════════════════════════
VITALS = [
    # Eleanor Mitchell — rising glucose
    {"id":"v-001-1","patient_id":"p-001","recorded_at":"2024-03-15T08:00:00Z","heart_rate":72,"blood_pressure_sys":138,"blood_pressure_dia":88,"glucose":142,"spo2":97,"weight":167.2,"temperature":98.2},
    {"id":"v-001-2","patient_id":"p-001","recorded_at":"2024-03-17T08:10:00Z","heart_rate":75,"blood_pressure_sys":140,"blood_pressure_dia":90,"glucose":148,"spo2":97,"weight":167.5,"temperature":98.1},
    {"id":"v-001-3","patient_id":"p-001","recorded_at":"2024-03-20T08:05:00Z","heart_rate":74,"blood_pressure_sys":143,"blood_pressure_dia":91,"glucose":155,"spo2":96,"weight":167.8,"temperature":98.3},
    {"id":"v-001-4","patient_id":"p-001","recorded_at":"2024-03-23T08:00:00Z","heart_rate":76,"blood_pressure_sys":145,"blood_pressure_dia":92,"glucose":162,"spo2":96,"weight":168.0,"temperature":98.0},
    {"id":"v-001-5","patient_id":"p-001","recorded_at":"2024-03-27T08:15:00Z","heart_rate":78,"blood_pressure_sys":148,"blood_pressure_dia":93,"glucose":171,"spo2":96,"weight":168.3,"temperature":97.9},
    {"id":"v-001-6","patient_id":"p-001","recorded_at":"2024-04-01T08:00:00Z","heart_rate":79,"blood_pressure_sys":151,"blood_pressure_dia":94,"glucose":178,"spo2":95,"weight":168.6,"temperature":97.8},
    {"id":"v-001-7","patient_id":"p-001","recorded_at":"2024-04-05T08:30:00Z","heart_rate":81,"blood_pressure_sys":154,"blood_pressure_dia":95,"glucose":183,"spo2":95,"weight":169.0,"temperature":97.6},

    # Harold Thompson — falling SpO2
    {"id":"v-002-1","patient_id":"p-002","recorded_at":"2024-03-15T07:30:00Z","heart_rate":88,"blood_pressure_sys":145,"blood_pressure_dia":92,"glucose":128,"spo2":93,"weight":194.0,"temperature":97.5},
    {"id":"v-002-2","patient_id":"p-002","recorded_at":"2024-03-17T07:40:00Z","heart_rate":91,"blood_pressure_sys":148,"blood_pressure_dia":93,"glucose":130,"spo2":92,"weight":194.5,"temperature":97.4},
    {"id":"v-002-3","patient_id":"p-002","recorded_at":"2024-03-20T07:35:00Z","heart_rate":94,"blood_pressure_sys":152,"blood_pressure_dia":95,"glucose":131,"spo2":91,"weight":195.0,"temperature":97.3},
    {"id":"v-002-4","patient_id":"p-002","recorded_at":"2024-03-23T07:30:00Z","heart_rate":97,"blood_pressure_sys":156,"blood_pressure_dia":97,"glucose":133,"spo2":90,"weight":195.5,"temperature":97.1},
    {"id":"v-002-5","patient_id":"p-002","recorded_at":"2024-03-27T07:45:00Z","heart_rate":99,"blood_pressure_sys":160,"blood_pressure_dia":98,"glucose":135,"spo2":89,"weight":196.0,"temperature":97.0},
    {"id":"v-002-6","patient_id":"p-002","recorded_at":"2024-04-01T07:30:00Z","heart_rate":102,"blood_pressure_sys":164,"blood_pressure_dia":100,"glucose":137,"spo2":88,"weight":196.5,"temperature":96.9},
    {"id":"v-002-7","patient_id":"p-002","recorded_at":"2024-04-05T07:45:00Z","heart_rate":104,"blood_pressure_sys":168,"blood_pressure_dia":102,"glucose":138,"spo2":86,"weight":197.0,"temperature":96.8},

    # Margaret Chen — stable
    {"id":"v-003-1","patient_id":"p-003","recorded_at":"2024-03-15T09:00:00Z","heart_rate":68,"blood_pressure_sys":122,"blood_pressure_dia":78,"glucose":102,"spo2":98,"weight":142.0,"temperature":98.4},
    {"id":"v-003-2","patient_id":"p-003","recorded_at":"2024-03-17T09:05:00Z","heart_rate":70,"blood_pressure_sys":124,"blood_pressure_dia":79,"glucose":104,"spo2":98,"weight":142.2,"temperature":98.5},
    {"id":"v-003-3","patient_id":"p-003","recorded_at":"2024-03-20T09:00:00Z","heart_rate":67,"blood_pressure_sys":121,"blood_pressure_dia":78,"glucose":103,"spo2":98,"weight":142.4,"temperature":98.3},
    {"id":"v-003-4","patient_id":"p-003","recorded_at":"2024-03-23T09:10:00Z","heart_rate":69,"blood_pressure_sys":123,"blood_pressure_dia":79,"glucose":106,"spo2":97,"weight":142.6,"temperature":98.4},
    {"id":"v-003-5","patient_id":"p-003","recorded_at":"2024-03-27T09:00:00Z","heart_rate":71,"blood_pressure_sys":125,"blood_pressure_dia":80,"glucose":108,"spo2":98,"weight":142.8,"temperature":98.3},
    {"id":"v-003-6","patient_id":"p-003","recorded_at":"2024-04-01T09:05:00Z","heart_rate":68,"blood_pressure_sys":122,"blood_pressure_dia":78,"glucose":105,"spo2":98,"weight":143.0,"temperature":98.4},
    {"id":"v-003-7","patient_id":"p-003","recorded_at":"2024-04-05T09:00:00Z","heart_rate":70,"blood_pressure_sys":124,"blood_pressure_dia":79,"glucose":107,"spo2":98,"weight":143.2,"temperature":98.4},

    # Robert Patel — glucose spike
    {"id":"v-004-1","patient_id":"p-004","recorded_at":"2024-03-15T08:00:00Z","heart_rate":74,"blood_pressure_sys":132,"blood_pressure_dia":84,"glucose":168,"spo2":97,"weight":175.0,"temperature":98.1},
    {"id":"v-004-2","patient_id":"p-004","recorded_at":"2024-03-17T08:10:00Z","heart_rate":76,"blood_pressure_sys":134,"blood_pressure_dia":85,"glucose":175,"spo2":97,"weight":175.2,"temperature":98.0},
    {"id":"v-004-3","patient_id":"p-004","recorded_at":"2024-03-20T08:00:00Z","heart_rate":75,"blood_pressure_sys":136,"blood_pressure_dia":86,"glucose":183,"spo2":96,"weight":175.6,"temperature":97.9},
    {"id":"v-004-4","patient_id":"p-004","recorded_at":"2024-03-23T08:05:00Z","heart_rate":78,"blood_pressure_sys":139,"blood_pressure_dia":87,"glucose":191,"spo2":96,"weight":175.8,"temperature":97.9},
    {"id":"v-004-5","patient_id":"p-004","recorded_at":"2024-03-27T08:00:00Z","heart_rate":80,"blood_pressure_sys":141,"blood_pressure_dia":88,"glucose":198,"spo2":96,"weight":176.0,"temperature":97.8},
    {"id":"v-004-6","patient_id":"p-004","recorded_at":"2024-04-01T08:10:00Z","heart_rate":82,"blood_pressure_sys":143,"blood_pressure_dia":89,"glucose":207,"spo2":95,"weight":176.4,"temperature":97.7},
    {"id":"v-004-7","patient_id":"p-004","recorded_at":"2024-04-05T09:30:00Z","heart_rate":84,"blood_pressure_sys":145,"blood_pressure_dia":90,"glucose":214,"spo2":95,"weight":176.8,"temperature":97.6},

    # Dorothy Williams — multi-system
    {"id":"v-005-1","patient_id":"p-005","recorded_at":"2024-03-15T07:00:00Z","heart_rate":82,"blood_pressure_sys":158,"blood_pressure_dia":96,"glucose":188,"spo2":94,"weight":206.0,"temperature":97.2},
    {"id":"v-005-2","patient_id":"p-005","recorded_at":"2024-03-17T07:10:00Z","heart_rate":85,"blood_pressure_sys":162,"blood_pressure_dia":98,"glucose":195,"spo2":94,"weight":206.4,"temperature":97.1},
    {"id":"v-005-3","patient_id":"p-005","recorded_at":"2024-03-20T07:00:00Z","heart_rate":88,"blood_pressure_sys":166,"blood_pressure_dia":99,"glucose":202,"spo2":93,"weight":206.8,"temperature":97.0},
    {"id":"v-005-4","patient_id":"p-005","recorded_at":"2024-03-23T07:05:00Z","heart_rate":90,"blood_pressure_sys":170,"blood_pressure_dia":101,"glucose":210,"spo2":93,"weight":207.2,"temperature":96.9},
    {"id":"v-005-5","patient_id":"p-005","recorded_at":"2024-03-27T07:00:00Z","heart_rate":92,"blood_pressure_sys":173,"blood_pressure_dia":102,"glucose":218,"spo2":92,"weight":207.6,"temperature":96.8},
    {"id":"v-005-6","patient_id":"p-005","recorded_at":"2024-04-01T07:15:00Z","heart_rate":94,"blood_pressure_sys":176,"blood_pressure_dia":103,"glucose":225,"spo2":91,"weight":208.0,"temperature":96.7},
    {"id":"v-005-7","patient_id":"p-005","recorded_at":"2024-04-05T11:00:00Z","heart_rate":96,"blood_pressure_sys":179,"blood_pressure_dia":104,"glucose":231,"spo2":90,"weight":208.4,"temperature":96.5},

    # James Rodriguez — Parkinson's
    {"id":"v-006-1","patient_id":"p-006","recorded_at":"2024-03-15T08:30:00Z","heart_rate":78,"blood_pressure_sys":136,"blood_pressure_dia":86,"glucose":122,"spo2":97,"weight":162.0,"temperature":98.2},
    {"id":"v-006-2","patient_id":"p-006","recorded_at":"2024-03-17T08:40:00Z","heart_rate":82,"blood_pressure_sys":138,"blood_pressure_dia":87,"glucose":124,"spo2":97,"weight":162.2,"temperature":98.1},
    {"id":"v-006-3","patient_id":"p-006","recorded_at":"2024-03-20T08:30:00Z","heart_rate":76,"blood_pressure_sys":140,"blood_pressure_dia":88,"glucose":125,"spo2":97,"weight":162.4,"temperature":98.2},
    {"id":"v-006-4","patient_id":"p-006","recorded_at":"2024-03-23T08:35:00Z","heart_rate":85,"blood_pressure_sys":142,"blood_pressure_dia":89,"glucose":127,"spo2":96,"weight":162.6,"temperature":98.0},
    {"id":"v-006-5","patient_id":"p-006","recorded_at":"2024-03-27T08:30:00Z","heart_rate":79,"blood_pressure_sys":144,"blood_pressure_dia":90,"glucose":129,"spo2":96,"weight":162.8,"temperature":98.1},
    {"id":"v-006-6","patient_id":"p-006","recorded_at":"2024-04-01T08:40:00Z","heart_rate":88,"blood_pressure_sys":147,"blood_pressure_dia":91,"glucose":131,"spo2":96,"weight":163.0,"temperature":97.9},
    {"id":"v-006-7","patient_id":"p-006","recorded_at":"2024-04-05T08:00:00Z","heart_rate":83,"blood_pressure_sys":149,"blood_pressure_dia":92,"glucose":132,"spo2":95,"weight":163.2,"temperature":97.9},

    # Patricia Johnson — SpO2 critical decline
    {"id":"v-007-1","patient_id":"p-007","recorded_at":"2024-03-15T06:00:00Z","heart_rate":96,"blood_pressure_sys":148,"blood_pressure_dia":94,"glucose":118,"spo2":91,"weight":162.0,"temperature":98.0},
    {"id":"v-007-2","patient_id":"p-007","recorded_at":"2024-03-17T06:10:00Z","heart_rate":98,"blood_pressure_sys":150,"blood_pressure_dia":95,"glucose":119,"spo2":90,"weight":162.2,"temperature":97.9},
    {"id":"v-007-3","patient_id":"p-007","recorded_at":"2024-03-20T06:00:00Z","heart_rate":100,"blood_pressure_sys":153,"blood_pressure_dia":96,"glucose":121,"spo2":89,"weight":162.4,"temperature":97.8},
    {"id":"v-007-4","patient_id":"p-007","recorded_at":"2024-03-23T06:05:00Z","heart_rate":103,"blood_pressure_sys":156,"blood_pressure_dia":97,"glucose":122,"spo2":88,"weight":162.6,"temperature":97.7},
    {"id":"v-007-5","patient_id":"p-007","recorded_at":"2024-03-27T06:00:00Z","heart_rate":106,"blood_pressure_sys":159,"blood_pressure_dia":98,"glucose":124,"spo2":87,"weight":162.8,"temperature":97.6},
    {"id":"v-007-6","patient_id":"p-007","recorded_at":"2024-04-01T06:10:00Z","heart_rate":109,"blood_pressure_sys":163,"blood_pressure_dia":100,"glucose":126,"spo2":86,"weight":163.0,"temperature":97.5},
    {"id":"v-007-7","patient_id":"p-007","recorded_at":"2024-04-05T08:00:00Z","heart_rate":112,"blood_pressure_sys":167,"blood_pressure_dia":102,"glucose":128,"spo2":85,"weight":163.2,"temperature":97.4},

    # Walter Nguyen — Alzheimer's / mild BP rise
    {"id":"v-008-1","patient_id":"p-008","recorded_at":"2024-03-15T09:00:00Z","heart_rate":70,"blood_pressure_sys":128,"blood_pressure_dia":82,"glucose":118,"spo2":98,"weight":158.0,"temperature":98.3},
    {"id":"v-008-2","patient_id":"p-008","recorded_at":"2024-03-17T09:10:00Z","heart_rate":72,"blood_pressure_sys":130,"blood_pressure_dia":83,"glucose":119,"spo2":98,"weight":158.2,"temperature":98.3},
    {"id":"v-008-3","patient_id":"p-008","recorded_at":"2024-03-20T09:00:00Z","heart_rate":71,"blood_pressure_sys":132,"blood_pressure_dia":84,"glucose":121,"spo2":98,"weight":158.4,"temperature":98.2},
    {"id":"v-008-4","patient_id":"p-008","recorded_at":"2024-03-23T09:05:00Z","heart_rate":73,"blood_pressure_sys":134,"blood_pressure_dia":84,"glucose":122,"spo2":98,"weight":158.6,"temperature":98.2},
    {"id":"v-008-5","patient_id":"p-008","recorded_at":"2024-03-27T09:00:00Z","heart_rate":74,"blood_pressure_sys":137,"blood_pressure_dia":85,"glucose":124,"spo2":97,"weight":158.8,"temperature":98.1},
    {"id":"v-008-6","patient_id":"p-008","recorded_at":"2024-04-01T09:10:00Z","heart_rate":75,"blood_pressure_sys":139,"blood_pressure_dia":86,"glucose":125,"spo2":97,"weight":159.0,"temperature":98.1},
    {"id":"v-008-7","patient_id":"p-008","recorded_at":"2024-04-05T09:30:00Z","heart_rate":76,"blood_pressure_sys":142,"blood_pressure_dia":87,"glucose":127,"spo2":97,"weight":159.2,"temperature":98.0},
]

# ════════════════════════════════════════════════════════════
# ALERTS
# ════════════════════════════════════════════════════════════
ALERTS = [
    {"id":"a-001","patient_id":"p-001","risk_level":"high","category":"Glucose Trend","message":"Fasting glucose increased 29% over 21 days (142→183 mg/dL). HbA1c review recommended.","is_read":False,"created_at":"2024-04-05T08:31:00Z"},
    {"id":"a-002","patient_id":"p-002","risk_level":"critical","category":"Respiratory + Cardiac","message":"SpO2 declining (93%→86%) alongside rising BP (145→168 mmHg). Risk of acute decompensation.","is_read":False,"created_at":"2024-04-05T07:46:00Z"},
    {"id":"a-003","patient_id":"p-002","risk_level":"critical","category":"Weight Gain","message":"+3 lbs fluid retention in 21 days. Possible diuretic resistance. Furosemide dose review needed.","is_read":False,"created_at":"2024-04-05T07:47:00Z"},
    {"id":"a-004","patient_id":"p-004","risk_level":"high","category":"Glucose Uncontrolled","message":"Blood glucose rising steadily (168→214 mg/dL over 21 days). Insulin titration may be required.","is_read":False,"created_at":"2024-04-05T09:31:00Z"},
    {"id":"a-005","patient_id":"p-005","risk_level":"critical","category":"Multi-System Deterioration","message":"BP, glucose, and SpO2 all trending negatively simultaneously. Immediate clinical review advised.","is_read":False,"created_at":"2024-04-05T11:01:00Z"},
    {"id":"a-006","patient_id":"p-007","risk_level":"critical","category":"SpO2 Critical","message":"Oxygen saturation at 85% — below safe threshold. Nebulizer use logged. Hospital escalation protocol triggered.","is_read":False,"created_at":"2024-04-05T08:01:00Z"},
    {"id":"a-007","patient_id":"p-006","risk_level":"high","category":"BP Elevation","message":"Systolic BP rising trend (136→149 mmHg). Heart rate variability elevated — Parkinson's medication timing review suggested.","is_read":False,"created_at":"2024-04-05T08:01:00Z"},
    {"id":"a-008","patient_id":"p-008","risk_level":"medium","category":"Cognitive Monitoring","message":"Patient disoriented briefly this morning. MMSE score follow-up recommended. Donepezil adherence check needed.","is_read":True,"created_at":"2024-04-05T09:31:00Z"},
]
