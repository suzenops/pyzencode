"""Metadata services only. Student code never runs on this server."""
import json
from pathlib import Path
from fastapi import FastAPI
from fastapi.responses import JSONResponse
app = FastAPI(title="PyZenCode services", version="0.1.0")
CURRICULUM = json.loads((Path(__file__).resolve().parents[2] / "shared/curriculum.json").read_text())

@app.get("/api/health")
def health():
    return {"status": "ok", "version": "0.1.0", "execution": "browser-worker"}

@app.get("/api/v1/curriculum")
def curriculum():
    return {"levels": CURRICULUM, "available_lesson": {"id": "first-program", "title": "Your First Python Program", "level": 1}, "future_lessons": "coming-soon"}

@app.get("/api/v1/features")
def features():
    return {"authentication": "not-configured", "progress": "local-browser", "ai_tutor": "coming-soon", "server_execution": False}

@app.post("/api/v1/tutor")
def tutor():
    return JSONResponse(status_code=501, content={"detail": "AI tutoring is not enabled. This version provides authored lesson guidance and hints."})
