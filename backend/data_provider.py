import datetime
from models import StadiumData, Zone, FoodStall, Facility, StadiumMetadata

def get_real_time_stadium_data() -> StadiumData:
    """
    Simulates fetching real-time data from stadium IoT sensors and systems.
    In a real implementation, this would connect to a DB or external API.
    """
    # Generating mock data simulating dynamic conditions
    now = datetime.datetime.now().isoformat()
    
    zones = [
        Zone(name="North Gate", crowd_density=0.85, movement_status="congested"),
        Zone(name="South Gate", crowd_density=0.30, movement_status="smooth"),
        Zone(name="East Gate", crowd_density=0.60, movement_status="moderate"),
        Zone(name="VIP Lounge", crowd_density=0.15, movement_status="smooth"),
        Zone(name="Main Arena Section A", crowd_density=0.95, movement_status="congested"),
    ]

    food_stalls = [
        FoodStall(name="Burger Hub", avg_wait_time=15, zone="North Gate", service_rate=2.5),
        FoodStall(name="Pizza Point", avg_wait_time=5, zone="South Gate", service_rate=4.0),
        FoodStall(name="Snack Shack", avg_wait_time=10, zone="East Gate", service_rate=3.0),
        FoodStall(name="Premium Dining", avg_wait_time=2, zone="VIP Lounge", service_rate=1.5),
    ]

    facilities = [
        Facility(type="washroom", zone="North Gate", availability_level="low"),
        Facility(type="washroom", zone="South Gate", availability_level="high"),
        Facility(type="medical", zone="East Gate", availability_level="high"),
        Facility(type="merchandise", zone="Main Arena Section A", availability_level="low"),
        Facility(type="quiet_room", zone="VIP Lounge", availability_level="high"),
    ]

    metadata = StadiumMetadata(
        timestamp=now,
        event_type="Championship Final Match"
    )

    return StadiumData(
        zones=zones,
        food_stalls=food_stalls,
        facilities=facilities,
        metadata=metadata
    )
