from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
from datetime import datetime

from ai.aura_analysis import analyze_image


# ============================================================
# AURA API
# ============================================================

app = FastAPI(
    title="AURA - AI Urban Risk System",
    description="AI-powered urban scene analysis and risk intelligence",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# INCIDENT STORAGE
# ============================================================

incidents = []


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/")
def home():

    return {
        "project": "AURA",
        "status": "online",
        "message": "AURA Intelligence System is running"
    }


# ============================================================
# IMAGE ANALYSIS
# ============================================================

@app.post("/analyze")
async def analyze_image_endpoint(
    file: UploadFile = File(...)
):

    upload_dir = "uploads"

    os.makedirs(upload_dir, exist_ok=True)

    image_path = os.path.join(
        upload_dir,
        file.filename
    )

    # --------------------------------------------------------
    # Save uploaded image
    # --------------------------------------------------------

    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    try:

        # ----------------------------------------------------
        # Run AURA AI analysis
        # ----------------------------------------------------

        result = analyze_image(image_path)


        # ----------------------------------------------------
        # Add filename
        # ----------------------------------------------------

        if isinstance(result, dict):

            result["filename"] = file.filename


            # ------------------------------------------------
            # Create incident record
            # ------------------------------------------------

            incident = {

                "id": len(incidents) + 1,

                "timestamp": datetime.now().isoformat(),

                "filename": file.filename,

                "risk_score": result.get(
                    "risk_score",
                    0
                ),

                "risk_level": result.get(
                    "risk_level",
                    "UNKNOWN"
                ),

                "people_count": result.get(
                    "people_count",
                    0
                ),

                "vehicle_count": result.get(
                    "vehicle_count",
                    0
                ),

                "reasons": result.get(
                    "reasons",
                    ""
                )

            }


            # ------------------------------------------------
            # Store incident
            # ------------------------------------------------

            incidents.insert(
                0,
                incident
            )


            # ------------------------------------------------
            # Keep only latest 50 incidents
            # ------------------------------------------------

            if len(incidents) > 50:

                incidents.pop()


        return result


    finally:

        # ----------------------------------------------------
        # Remove temporary image
        # ----------------------------------------------------

        if os.path.exists(image_path):

            os.remove(image_path)


# ============================================================
# GET INCIDENT HISTORY
# ============================================================

@app.get("/incidents")
def get_incidents():

    return {

        "total_incidents": len(incidents),

        "incidents": incidents

    }


# ============================================================
# CLEAR INCIDENT HISTORY
# ============================================================

@app.delete("/incidents")
def clear_incidents():

    incidents.clear()

    return {

        "message": "Incident history cleared",

        "total_incidents": 0

    }
