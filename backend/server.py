from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="ArcaLink API", version="1.0.0-MVP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "ArcaLink API", "version": "1.0.0-MVP"}

@app.get("/api/")
async def root():
    return {"message": "ArcaLink API — Comunicação médica segura"}
