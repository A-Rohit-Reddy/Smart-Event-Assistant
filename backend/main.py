from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from models import AskRequest, AskResponse
from data_provider import get_real_time_stadium_data
from ai_engine import initialize_ai, get_event_coordinator_recommendation

# Initialize the Gemini configuration
initialize_ai()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for the Smart Event Assistant",
    version="1.0.0"
)

# Optional: Disable CORS restrictions for local dev, adjust for prod
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "environment": settings.ENVIRONMENT}

@app.post("/ask", response_model=AskResponse)
def ask_assistant(request: AskRequest):
    try:
        # 1. Fetch real-time venue telemetry
        stadium_data = get_real_time_stadium_data()
        
        # 2. Process data through Intelligence Engine
        response = get_event_coordinator_recommendation(request, stadium_data)
        
        # 3. Return the structurally validated response
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))