from typing import List, Optional
from pydantic import BaseModel, Field
from enum import Enum

class Priority(str, Enum):
    fastest = "fastest"
    least_crowded = "least_crowded"
    balanced = "balanced"

class MovementStatus(str, Enum):
    smooth = "smooth"
    moderate = "moderate"
    congested = "congested"

class AvailabilityLevel(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

# --- Mock Data Models ---

class Zone(BaseModel):
    name: str = Field(..., description="Name of the stadium zone")
    crowd_density: float = Field(..., ge=0.0, le=1.0, description="0.0 to 1.0 density")
    movement_status: MovementStatus = Field(..., description="smooth, moderate, or congested")

class FoodStall(BaseModel):
    name: str = Field(..., description="Name of the food stall")
    avg_wait_time: int = Field(..., description="Average wait time in minutes")
    zone: str = Field(..., description="Zone where the stall is located")
    service_rate: float = Field(..., description="People served per minute")

class Facility(BaseModel):
    type: str = Field(..., description="Type of facility e.g. washroom, medical, exit")
    zone: str = Field(..., description="Zone where the facility is located")
    availability_level: AvailabilityLevel = Field(..., description="low, medium, or high")

class StadiumMetadata(BaseModel):
    timestamp: str
    event_type: str

class StadiumData(BaseModel):
    zones: List[Zone]
    food_stalls: List[FoodStall]
    facilities: List[Facility]
    metadata: StadiumMetadata

# --- API Models ---

class UserContext(BaseModel):
    current_zone: str = Field(..., description="The user's current physical zone")
    priority: Priority = Field(..., description="E.g., fastest, least_crowded, balanced, medical_emergency")

class AskRequest(BaseModel):
    question: str
    user_context: UserContext

class AskResponse(BaseModel):
    recommendation: str
    reason: str
    alternative: Optional[str] = None
