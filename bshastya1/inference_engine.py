"""
ai/inference_engine.py — AI model outputs
  • RNN  → vitals trend prediction (LSTM time-series)
  • CNN  → chest imaging insight
  • LLM  → clinical summary
"""
import random
from services.patient_service import get_patient_data, get_vitals_trend

# ── RNN model output templates keyed by dominant trend ───────────────────────
_RNN_TEMPLATES = {
    "glucose_rising": {
        "model": "RNN-LSTM (vitals_v3.h5)",
        "risk": "High",
        "confidence": "91%",
        "insight": (
            "LSTM model detected a monotonic upward glucose trend over 21 days "
            "(Δ+{glucose_delta} mg/dL, slope ≈ {slope:.1f} mg/dL/day). "
            "Concurrent mild hypertension progression noted. "
            "Pattern matches pre-diabetic decompensation in 88% of training cohort."
        ),
        "recommendation": (
            "Review Metformin / Insulin dosage. Schedule HbA1c within 7 days. "
            "Restrict refined carbohydrates. Increase hydration monitoring."
        ),
        "predicted_next_72h": {
            "glucose": "+8–12 mg/dL",
            "blood_pressure_sys": "+3–5 mmHg",
            "probability_of_hyperglycemic_event": "67%",
        },
    },
    "spo2_falling": {
        "model": "RNN-LSTM (vitals_v3.h5)",
        "risk": "Critical",
        "confidence": "94%",
        "insight": (
            "LSTM model flagged continuous SpO2 decline ({spo2_first}%→{spo2_last}% over 21 days). "
            "Concurrent tachycardia (HR +{hr_delta} bpm) and fluid retention (+{weight_delta:.1f} lbs) "
            "indicate worsening cardiopulmonary failure. "
            "Trajectory matches acute decompensated HF pattern in 93% of validation set."
        ),
        "recommendation": (
            "Escalate Furosemide dose (physician approval required). "
            "Initiate continuous pulse oximetry monitoring. "
            "Consider hospital admission if SpO2 < 84% within 24 h."
        ),
        "predicted_next_72h": {
            "spo2": "−1 to −3%",
            "heart_rate": "+3–6 bpm",
            "probability_of_acute_event": "79%",
        },
    },
    "multi_system": {
        "model": "RNN-LSTM (vitals_v3.h5)",
        "risk": "Critical",
        "confidence": "96%",
        "insight": (
            "Multi-variate LSTM model detected simultaneous deterioration across three dimensions: "
            "glucose (+{glucose_delta} mg/dL), systolic BP (+{bp_delta} mmHg), "
            "and SpO2 (−{spo2_drop}%). "
            "This correlated multi-system pattern carries the highest prognostic severity "
            "in the Shastya AI training corpus (n=42,000 elderly patients)."
        ),
        "recommendation": (
            "Immediate physician review. Consider ER referral. "
            "Pause PRN medications pending full clinical assessment. "
            "Alert next-of-kin per protocol."
        ),
        "predicted_next_72h": {
            "composite_deterioration_risk": "89%",
            "estimated_hospitalization_probability": "72%",
        },
    },
    "stable": {
        "model": "RNN-LSTM (vitals_v3.h5)",
        "risk": "Low",
        "confidence": "88%",
        "insight": (
            "All monitored vitals remain within normal variance bounds over the 21-day window. "
            "LSTM sequence model reports no anomalous trajectory. "
            "Residual variance within ±1.2 σ of baseline."
        ),
        "recommendation": (
            "Continue current medication regimen. "
            "Maintain bi-weekly vitals cadence. "
            "No escalation required at this time."
        ),
        "predicted_next_72h": {
            "glucose": "stable ±5 mg/dL",
            "blood_pressure_sys": "stable ±3 mmHg",
            "probability_of_adverse_event": "<8%",
        },
    },
    "parkinson_pattern": {
        "model": "RNN-LSTM (vitals_v3.h5)",
        "risk": "High",
        "confidence": "89%",
        "insight": (
            "HR variability analysis (HRV) shows irregular inter-beat patterns consistent with "
            "autonomic dysfunction in Parkinson's disease. "
            "Systolic BP rising trend (+{bp_delta} mmHg) may indicate off-medication orthostatic instability. "
            "LSTM model correlates pattern with increased fall risk."
        ),
        "recommendation": (
            "Review Levodopa/Carbidopa dosing schedule. "
            "Orthostatic BP checks morning and evening. "
            "Fall-risk assessment within 48 h. "
            "Consider referral to movement disorder specialist."
        ),
        "predicted_next_72h": {
            "fall_risk_probability": "41%",
            "bp_orthostatic_drop_risk": "55%",
        },
    },
}

# ── CNN imaging outputs (mocked as if from chest X-ray / retinal scan) ────────
_CNN_TEMPLATES = {
    "p-001": {
        "model": "CNN-ResNet50 (imaging_v2.pt)",
        "modality": "Fundus Photography",
        "risk": "Moderate",
        "confidence": "87%",
        "finding": (
            "Mild arteriovenous nicking detected in superior temporal quadrant. "
            "Microaneurysm probability: 34%. "
            "No neovascularisation detected. "
            "Findings consistent with mild hypertensive retinopathy (Grade I–II)."
        ),
        "recommendation": "Ophthalmology referral within 30 days. Strict BP management.",
    },
    "p-002": {
        "model": "CNN-ResNet50 (imaging_v2.pt)",
        "modality": "Chest X-Ray",
        "risk": "Critical",
        "confidence": "93%",
        "finding": (
            "Cardiomegaly detected (cardiothoracic ratio 0.62). "
            "Bilateral perihilar haziness consistent with pulmonary oedema. "
            "Pleural effusion probability: 71% (right > left). "
            "Kerley B lines detected. Findings indicate acute decompensated CHF."
        ),
        "recommendation": (
            "Urgent cardiology review. IV diuretics consideration. "
            "Repeat CXR in 48 h post-treatment."
        ),
    },
    "p-004": {
        "model": "CNN-ResNet50 (imaging_v2.pt)",
        "modality": "Fundus Photography",
        "risk": "High",
        "confidence": "90%",
        "finding": (
            "Dot-blot haemorrhages in 2 quadrants. Cotton-wool spots present. "
            "Hard exudates detected near macula. "
            "Non-proliferative diabetic retinopathy (NPDR) — moderate severity. "
            "Macular oedema probability: 48%."
        ),
        "recommendation": (
            "Urgent ophthalmology referral. Anti-VEGF evaluation. "
            "Tighten glycaemic control — target HbA1c < 7%."
        ),
    },
    "p-005": {
        "model": "CNN-ResNet50 (imaging_v2.pt)",
        "modality": "Chest X-Ray",
        "risk": "Critical",
        "confidence": "95%",
        "finding": (
            "Coronary artery calcification score estimated HIGH. "
            "Left ventricular enlargement suspected. "
            "Pulmonary vascular congestion pattern detected. "
            "CNN flags > 80% similarity to documented pre-infarct imaging in training set."
        ),
        "recommendation": (
            "Cardiology referral STAT. "
            "Consider stress test or CT coronary angiography. "
            "Do not delay — acute coronary syndrome risk elevated."
        ),
    },
    "p-007": {
        "model": "CNN-ResNet50 (imaging_v2.pt)",
        "modality": "Chest X-Ray",
        "risk": "Critical",
        "confidence": "92%",
        "finding": (
            "Hyperinflation with flattened diaphragm. "
            "Increased AP diameter. Bullous changes in upper lobes. "
            "Right heart border enlargement (cor pulmonale pattern). "
            "Findings consistent with severe emphysema + early right heart failure."
        ),
        "recommendation": (
            "Pulmonology + cardiology co-management. "
            "Supplemental oxygen titration. "
            "LTOT assessment if PaO2 < 55 mmHg."
        ),
    },
    "default": {
        "model": "CNN-ResNet50 (imaging_v2.pt)",
        "modality": "Chest X-Ray",
        "risk": "Low",
        "confidence": "85%",
        "finding": "No acute cardiopulmonary pathology detected. Lung fields clear. Heart size normal.",
        "recommendation": "Routine annual imaging. No immediate follow-up required.",
    },
}

# ─────────────────────────────────────────────────────────────────────────────

def _select_rnn_template(trends: dict, patient: dict) -> tuple[str, dict]:
    t = trends
    glucose_delta = t["glucose"]["last"] - t["glucose"]["first"]
    bp_delta      = t["blood_pressure_sys"]["last"] - t["blood_pressure_sys"]["first"]
    spo2_drop     = t["spo2"]["first"] - t["spo2"]["last"]
    hr_delta      = t["heart_rate"]["last"] - t["heart_rate"]["first"]
    weight_delta  = t["weight"]["last"] - t["weight"]["first"]

    ctx = {
        "glucose_delta": glucose_delta,
        "slope": glucose_delta / 21,
        "bp_delta": bp_delta,
        "spo2_first": t["spo2"]["first"],
        "spo2_last": t["spo2"]["last"],
        "spo2_drop": spo2_drop,
        "hr_delta": hr_delta,
        "weight_delta": weight_delta,
    }

    if "Parkinson" in " ".join(patient.get("conditions", [])):
        key = "parkinson_pattern"
    elif spo2_drop >= 5 and glucose_delta > 15:
        key = "multi_system"
    elif spo2_drop >= 4:
        key = "spo2_falling"
    elif glucose_delta > 20:
        key = "glucose_rising"
    else:
        key = "stable"

    return key, ctx


def generate_ai_insight(patient_id: str) -> dict:
    """
    Simulates RNN + CNN inference pipeline.
    Returns a structured AI output object.
    """
    patient = get_patient_data(patient_id)
    if not patient:
        return {"error": f"Patient {patient_id} not found"}

    trend_data   = get_vitals_trend(patient_id)
    trends       = trend_data.get("trends", {})
    cnn_output   = _CNN_TEMPLATES.get(patient_id, _CNN_TEMPLATES["default"])

    if not trends:
        return {
            "patient_id": patient_id,
            "rnn_prediction": {"risk": "Unknown", "insight": "No vitals data available."},
            "cnn_imaging":    cnn_output,
        }

    template_key, ctx = _select_rnn_template(trends, patient)
    template = _RNN_TEMPLATES[template_key]

    rnn_output = {
        "model":          template["model"],
        "risk":           template["risk"],
        "confidence":     template["confidence"],
        "insight":        template["insight"].format(**ctx),
        "recommendation": template["recommendation"],
        "predicted_next_72h": template["predicted_next_72h"],
        "vitals_trends":  trends,
    }

    return {
        "patient_id":     patient_id,
        "patient_name":   patient["full_name"],
        "analysis_date":  "2024-04-05T12:00:00Z",
        "rnn_prediction": rnn_output,
        "cnn_imaging":    cnn_output,
        "composite_risk": _composite_risk(rnn_output["risk"], cnn_output["risk"]),
    }


def _composite_risk(rnn_risk: str, cnn_risk: str) -> dict:
    order = {"Low": 1, "Moderate": 2, "High": 3, "Critical": 4}
    dominant = max([rnn_risk, cnn_risk], key=lambda r: order.get(r, 0))
    score = order.get(dominant, 1)
    return {
        "level":       dominant,
        "score":       score,
        "out_of":      4,
        "action_required": dominant in ("High", "Critical"),
    }
