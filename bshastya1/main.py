"""
main.py — Shastya AI Backend
Run: uvicorn main:app --reload --port 8000
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.api import router

app = FastAPI(
    title="Shastya AI - Backend",
    description=(
        "Simulated MySQL + AI inference backend for the Shastya AI healthcare platform. "
        "Provides patient vitals, RNN trend predictions, CNN imaging insights, and alerts."
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/", tags=["Health"])
def root():
    return {
        "service": "Shastya AI Backend",
        "status":  "operational",
        "version": "1.0.0",
        "db":      "MySQL 8.0 (simulated in-memory)",
        "models":  ["RNN-LSTM vitals_v3.h5", "CNN-ResNet50 imaging_v2.pt"],
        "docs":    "/docs",
    }
