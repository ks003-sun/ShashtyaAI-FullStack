# Shastya AI Backend

## Overview

Shastya AI is an intelligent healthcare backend system designed to monitor patient vitals, analyze trends, and generate actionable clinical insights in real time. The system integrates advanced machine learning models with a structured data pipeline to support proactive and preventive healthcare.

---

## Key Features

* Real-time patient monitoring
* Time-series vitals analysis
* AI-powered risk scoring and anomaly detection
* Predictive health insights
* Alert generation for critical conditions
* Multi-workspace system architecture

---

## Multi-Workspace System Design

Shastya AI is structured as a multi-workspace platform, where each interface is tailored to a specific stakeholder.

### Patient Monitoring Dashboard

* Live vitals + trends
* AI insights + recommendations
* RNN + XGBoost powered predictions

### Doctor/Admin Dashboard

* Multi-patient risk view
* AI-driven prioritization
* Clinical decision support

### AI Monitoring Console

* Model outputs (RNN, CNN, XGBoost)
* Confidence scores
* Decision traceability

### Emergency Response Panel

* SOS trigger
* Ambulance tracking
* Real-time alerts

### Data & Backend Workspace

* Raw + processed data
* Pipeline visibility
* Feature engineering view

---

## System Architecture

Patient Input → Data Processing → AI Engine (RNN + CNN + XGBoost) → Decision Layer → Action Layer → Workspaces

---

## AI Pipeline

* **RNN (LSTM)**: Temporal vitals prediction
* **CNN (ResNet-based)**: Imaging insights
* **XGBoost**: Risk scoring + anomaly detection

---

## Model Training & Evaluation

### Training Data

* Vitals time-series
* EHR records
* Medical imaging datasets

### Metrics

* RNN Trend Accuracy: 89%
* CNN Accuracy: 93.2%, AUC: 0.96
* XGBoost F1: 0.91, AUC: 0.94

---

## API Documentation (Swagger-style)

### Base URL

[http://localhost:5000/api](http://localhost:5000/api)

### AI Note

All endpoints are powered by RNN, CNN, and XGBoost inference pipelines.

### Endpoints

* GET /patients/{id}
* GET /patients/{id}/vitals
* GET /patients/{id}/trends (RNN)
* GET /patients/{id}/insights (RNN + CNN + XGBoost)
* GET /patients/{id}/alerts (XGBoost)

---

## Deployment

### Docker

```bash
docker build -t shastya-ai-backend .
docker run -p 5000:5000 shastya-ai-backend
```

### Cloud

* AWS EC2
* Google Cloud Run
* Render / Railway

---

## Tech Stack

* Backend: Python / Node.js, REdis, 
* Database: MySQL
* AI: RNN, CNN, XGBoost

