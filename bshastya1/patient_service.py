"""
services/patient_service.py — Data access layer (simulates DB queries)
"""
from data.store import PATIENTS, VITALS, ALERTS
from typing import Optional


def get_patient_data(patient_id: str) -> Optional[dict]:
    """SELECT * FROM patients WHERE id = ?"""
    return next((p for p in PATIENTS if p["id"] == patient_id), None)


def list_patients(risk_level: str = None, search: str = None) -> list[dict]:
    """SELECT * FROM patients [WHERE risk_level = ? AND full_name LIKE ?]"""
    results = PATIENTS[:]
    if risk_level:
        results = [p for p in results if p["risk_level"] == risk_level]
    if search:
        s = search.lower()
        results = [p for p in results if s in p["full_name"].lower() or s in p["uhid"].lower()]
    return results


def get_vitals_trend(patient_id: str, limit: int = 7) -> dict:
    """
    SELECT * FROM vitals WHERE patient_id = ? ORDER BY recorded_at DESC LIMIT ?
    Returns sorted vitals + computed deltas for trend analysis.
    """
    readings = sorted(
        [v for v in VITALS if v["patient_id"] == patient_id],
        key=lambda v: v["recorded_at"],
    )[-limit:]

    if not readings:
        return {"patient_id": patient_id, "readings": [], "trends": {}}

    first, last = readings[0], readings[-1]

    def pct_change(a, b):
        return round(((b - a) / a) * 100, 1) if a else 0

    trends = {
        "heart_rate":         {"first": first["heart_rate"],         "last": last["heart_rate"],         "change_pct": pct_change(first["heart_rate"], last["heart_rate"])},
        "blood_pressure_sys": {"first": first["blood_pressure_sys"], "last": last["blood_pressure_sys"], "change_pct": pct_change(first["blood_pressure_sys"], last["blood_pressure_sys"])},
        "glucose":            {"first": first["glucose"],            "last": last["glucose"],            "change_pct": pct_change(first["glucose"], last["glucose"])},
        "spo2":               {"first": first["spo2"],               "last": last["spo2"],               "change_pct": pct_change(first["spo2"], last["spo2"])},
        "weight":             {"first": first["weight"],             "last": last["weight"],             "change_pct": pct_change(first["weight"], last["weight"])},
    }

    return {
        "patient_id": patient_id,
        "readings": readings,
        "trends": trends,
        "period_days": 21,
        "data_points": len(readings),
    }


def get_alerts(patient_id: str, unread_only: bool = False) -> list[dict]:
    """SELECT * FROM alerts WHERE patient_id = ? ORDER BY created_at DESC"""
    alerts = [a for a in ALERTS if a["patient_id"] == patient_id]
    if unread_only:
        alerts = [a for a in alerts if not a["is_read"]]
    return sorted(alerts, key=lambda a: a["created_at"], reverse=True)
