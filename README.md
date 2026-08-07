# OceanShield AI

OceanShield is a coastal-disaster intelligence platform. Citizens can submit geo-tagged incident reports, attach evidence photos, and view incidents on a live map.

## Run locally

1. Copy `backend/.env.example` to `backend/.env`, then set `DATABASE_URL`.
2. Install backend packages with `pip install -r requirements.txt` from `backend/`. For an existing database, run `python migrate_phase6_ai.py`; for a new one, run `python create_tables.py`. Start the API with `uvicorn app.main:app --reload`.
3. Copy `frontend/.env.local.example` to `frontend/.env.local`. Firebase values are optional unless you want photo uploads or authentication.
4. Run `npm install` and `npm run dev` from `frontend/`.

The frontend runs at `http://localhost:3000`; FastAPI documentation is at `http://127.0.0.1:8000/docs`.

## Firebase Storage setup

Enable Storage in your Firebase project, add its web configuration values to `frontend/.env.local`, and add an authenticated Storage rule before allowing public uploads. The app gracefully supports reports without photos until that configuration is complete.

## Phase 6 — Local YOLO analysis

Reports with an evidence image are saved first and analysed in the background. The app writes an annotated evidence image to `backend/app/static/analysis/` and displays general object detections in the map popup. On first image analysis, Ultralytics downloads the model configured by `YOLO_MODEL_PATH` (default: `yolo11n.pt`).

This pretrained model is an object-detection baseline, not a trained coastal-hazard classifier. Replace `YOLO_MODEL_PATH` with your labelled coastal-hazard weights once training is complete; no API or frontend changes are required.

## Phase 7 — Gemini incident reasoning

After YOLO completes, OceanShield can send the report details and object detections to Gemini and store a concise, uncertainty-aware incident assessment. Add `GEMINI_API_KEY` to `backend/.env` only; never expose it through `NEXT_PUBLIC_*` frontend variables. The integration uses Gemini's `generateContent` API with the configured `GEMINI_MODEL`. Without a key, reports remain fully available and show that reasoning is awaiting configuration. [Gemini API reference](https://ai.google.dev/api)

## Unified EOC Dashboard & GIS Command Map
OceanShield features a state-of-the-art collapsible left-navigation EOC Sidebar next to its mapping views, offering:
- **EOC Command Center**: Telemetry counters, wind/rain weather metrics, dynamic AI risk indexes, and flight controllers.
- **Social Intelligence Deck**: Normalizes public alerts from platforms (X, Reddit, Telegram), hashtags, and extracted geographic coordinates.
- **Simulation Room**: Interactive canvas-based Digital Twin rendering evacuee particle flows, flood expansions, and incident playback speed scrubbers.

## Multi-Source Verification & Data Fusion
- **Verification Engine**: Combines citizen reports, GPS coordinates, weather forecasts, YOLO analysis, and social reports into an aggregated credibility score (0-100%) and categorizes warnings (HIGH CONFIDENCE, PARTIALLY VERIFIED, UNVERIFIED).
- **Early Warning System**: Scans reports density and precipitation to flag potential disasters.

## Docker Orchestration
Launch the complete stack (PostgreSQL, FastAPI, Next.js frontend) with a single command:
```bash
docker-compose up --build
```
The gateway router handles reverse proxying on port 80 dynamically.
