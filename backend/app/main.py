from fastapi import FastAPI

app = FastAPI(
    title="OceanShield API",
    version="1.0.0",
    description="AI Powered Coastal Disaster Intelligence Platform"
)

@app.get("/")
def root():
    return {
        "name": "OceanShield API",
        "version": "1.0.0",
        "status": "running"
    }