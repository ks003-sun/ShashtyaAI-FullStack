"""
controllers/patient_controller.py — Business logic / response shaping
"""
from services.patient_service import (
    get_patient_data,
    list_patients,
    get_vitals_trend,
    get_alerts,
)
from ai.inference_engine import generate_ai_insight


def ctrl_list_patients(risk_level: str = None, search: str = None) -> dict:
    patients = list_patients(risk_level=risk_level, search=search)
    return {
        "status": "ok",
        "count": len(patients),
        "patients": [
            {
                "id":         p["id"],
                "uhid":       p["uhid"],
                "full_name":  p["full_name"],
                "age":        p["age"],
                "gender":     p["gender"],
                "conditions": p["conditions"],
                "risk_level": p["risk_level"],
            }
            for p in patients
        ],
    }


def ctrl_get_patient(patient_id: str) -> dict:
    patient = get_patient_data(patient_id)
    if not patient:
        return {"status": "error", "code": 404, "message": f"Patient {patient_id} not found"}
    return {"status": "ok", "data": patient}


def ctrl_get_vitals_trend(patient_id: str) -> dict:
    patient = get_patient_data(patient_id)
    if not patient:
        return {"status": "error", "code": 404, "message": f"Patient {patient_id} not found"}
    trend = get_vitals_trend(patient_id)
    return {"status": "ok", "data": trend}


def ctrl_get_ai_insight(patient_id: str) -> dict:
    patient = get_patient_data(patient_id)
    if not patient:
        return {"status": "error", "code": 404, "message": f"Patient {patient_id} not found"}
    insight = generate_ai_insight(patient_id)
    return {"status": "ok", "data": insight}


def ctrl_get_alerts(patient_id: str, unread_only: bool = False) -> dict:
    patient = get_patient_data(patient_id)
    if not patient:
        return {"status": "error", "code": 404, "message": f"Patient {patient_id} not found"}
    alerts = get_alerts(patient_id, unread_only=unread_only)
    return {"status": "ok", "count": len(alerts), "data": alerts}
