# 🌊 OceanShield
### AI-Powered Coastal Disaster Intelligence & Emergency Response Platform

<p align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs)
![FastAPI](https://img.shields.io/badge/FastAPI-0.116-009688?style=for-the-badge&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue?style=for-the-badge&logo=postgresql)
![Firebase](https://img.shields.io/badge/Firebase-Authentication-orange?style=for-the-badge&logo=firebase)
![YOLO](https://img.shields.io/badge/YOLO-AI-red?style=for-the-badge)
![Gemini](https://img.shields.io/badge/Gemini-AI-purple?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</p>

---

## 🌍 About

OceanShield is an AI-powered disaster management platform developed for **Smart India Hackathon 2026 (SIH25039)**.

The platform enables citizens to instantly report coastal hazards while allowing government authorities to monitor, verify, analyze, and respond using Artificial Intelligence, GIS Mapping, Social Media Intelligence, and Weather Intelligence.

OceanShield aims to reduce disaster response time and improve coordination between citizens and emergency agencies.

---

# ✨ Features

### 👤 Citizen Portal

- Secure Authentication
- Report Coastal Hazard
- GPS Detection
- Image Upload
- Hazard Classification
- Severity Selection
- Live Incident Tracking
- Report Status

---

### 🤖 AI Intelligence

- YOLO Object Detection
- Gemini AI Verification
- Duplicate Report Detection
- Confidence Score
- Risk Assessment

---

### 🗺️ GIS Dashboard

- Live Incident Map
- Hazard Markers
- Heatmaps
- Safe Zone Visualization
- Emergency Route Planning

---

### 📡 Disaster Intelligence

- Weather Monitoring
- IMD Alerts
- News Intelligence
- Social Media Monitoring
- Risk Prediction

---

### 🚨 Emergency Response

- Emergency Dashboard
- Collector Dashboard
- Volunteer Dashboard
- Incident Timeline
- Safe Route Recommendation
- Shelter Locations

---

### 📊 Analytics Dashboard

- Live Statistics
- Hazard Trends
- AI Analytics
- Response Time
- Monthly Reports

---

# 🏗 Tech Stack

## Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Leaflet

## Backend

- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic

## Authentication

- Firebase Authentication

## Storage

- Firebase Storage

## AI

- YOLO
- Google Gemini

## Maps

- OpenStreetMap
- Leaflet

---

# 📂 Project Structure

```text
OceanShield/

├── frontend/
│   ├── app/
│   ├── components/
│   ├── services/
│   ├── lib/
│   └── public/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── routers/
│   │   ├── database/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── core/
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── docs/
│
└── README.md
```

---

# 🏛 System Architecture

```text
Citizen

      │
      ▼

Report Hazard

      │
      ▼

GPS + Images + Metadata

      │
      ▼

FastAPI Backend

      │
      ▼

PostgreSQL Database

      │
      ▼

AI Processing

├── YOLO Detection
├── Gemini Verification
├── Weather Analysis
└── Social Media Analysis

      │
      ▼

Incident Verification

      │
      ▼

GIS Dashboard

      │
      ▼

Authorities

      │
      ▼

Emergency Response
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/OceanShield.git

cd OceanShield
```

---

## Backend

```bash
cd backend

python -m venv .venv

source .venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend runs on

```
http://127.0.0.1:8000
```

Swagger Docs

```
http://127.0.0.1:8000/docs
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Runs on

```
http://localhost:3000
```

---

# 🗄 Database

Create PostgreSQL Database

```sql
CREATE DATABASE oceanshield;
```

Run Migrations

```bash
alembic upgrade head
```

---

# 🔥 Firebase

Create a Firebase Project

Enable

- Authentication
- Storage

Create

```
firebase.ts
```

Configure

```ts
export const auth

export const storage
```
---

# 📅 Development Roadmap

| Phase | Status |
|---------|---------|
| Project Planning | ✅ |
| Architecture | ✅ |
| Frontend Setup | ✅ |
| Backend Setup | ✅ |
| Authentication | ✅ |
| PostgreSQL Integration | ✅ |
| Report APIs | ✅ |
| GIS Dashboard | ✅ |
| Analytics Dashboard | ✅ |
| AI Integration | ✅ |
| Social Media Intelligence | ✅ |
| Weather Intelligence | ✅ |
| Emergency Dashboard | ✅ |
| Safe Route Engine | ✅ |
| Firebase Storage | 🚧 |
| Testing | 🚧 |
| Deployment | 🚧 |
| Documentation | 🚧 |

---

# 🎯 Future Scope

- Drone Integration
- Satellite Imagery
- IoT Buoys
- SMS Alerts
- Mesh Network Communication
- Offline Reporting
- Multi-language Support
- Android Application
- iOS Application
- AI Disaster Prediction

---

# 📈 Current Progress

```
████████████████████░░░░ 85%
```

Completed

- Authentication
- Database
- GIS
- Analytics
- AI
- Weather
- Social Intelligence
- Emergency Dashboard

Remaining

- Firebase Storage
- Testing
- Deployment
- Documentation

---

# 🤝 Contributors

Developed for

**Smart India Hackathon 2026**

Team Members

- Your Name
- Member 2
- Member 3
- Member 4

---

# 🏆 Smart India Hackathon

Problem Statement

**SIH25039**

Theme

**Disaster Management**

---

# 📜 License

This project is licensed under the MIT License.

---

# ⭐ Support

If you like this project,

⭐ Star the repository

🍴 Fork the repository

🤝 Contribute

---

<p align="center">

### 🌊 OceanShield

**AI for Safer Coasts • Smarter Response • Stronger Communities**

Made with ❤️ for Smart India Hackathon 2026

</p>
