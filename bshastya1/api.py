"""
routes/api.py — REST API routes (FastAPI)
"""
from fastapi import APIRouter, Query
from controllers.patient_controller import (
    ctrl_list_patients,
    ctrl_get_patient,
    ctrl_get_vitals_trend,
    ctrl_get_ai_insight,
    ctrl_get_alerts,
)

router = APIRouter(prefix="/api/v1")


@router.get("/patients", summary="List all patients")
def list_patients(
    risk_level: str = Query(None, description="Filter by risk level: low|medium|high|critical"),
    search:     str = Query(None, description="Search by name or UHID"),
):
    return ctrl_list_patients(risk_level=risk_level, search=search)


@router.get("/patients/{patient_id}", summary="Get patient demographics")
def get_patient(patient_id: str):
    return ctrl_get_patient(patient_id)


@router.get("/patients/{patient_id}/vitals", summary="Get vitals time-series + trend deltas")
def get_vitals(patient_id: str):
    return ctrl_get_vitals_trend(patient_id)


@router.get("/patients/{patient_id}/ai-insight", summary="Run RNN + CNN AI inference")
def get_ai_insight(patient_id: str):
    return ctrl_get_ai_insight(patient_id)


@router.get("/patients/{patient_id}/alerts", summary="Get patient alerts")
def get_alerts(patient_id: str, unread_only: bool = Query(False)):
    return ctrl_get_alerts(patient_id, unread_only=unread_only)
