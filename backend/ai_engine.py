import json
import google.generativeai as genai
from config import settings
from models import AskRequest, AskResponse, StadiumData

def initialize_ai():
    if settings.GEMINI_API_KEY:
        genai.configure(api_key=settings.GEMINI_API_KEY)
    else:
        # Warning for local dev if empty, but let application context handle startup properly
        pass

def get_event_coordinator_recommendation(request: AskRequest, stadium_data: StadiumData) -> AskResponse:
    model = genai.GenerativeModel("gemini-2.5-flash")

    # 🔥 Pre-filter relevant data (safe + robust)
    try:
        relevant_zones = [
            z.model_dump(exclude_none=True)
            for z in stadium_data.zones
            if z.name == request.user_context.current_zone or z.crowd_density < 0.7
        ]
    except Exception:
        relevant_zones = [z.model_dump(exclude_none=True) for z in stadium_data.zones]

    relevant_data = {
        "zones": relevant_zones,
        "food_stalls": [fs.model_dump(exclude_none=True) for fs in stadium_data.food_stalls],
        "facilities": [f.model_dump(exclude_none=True) for f in stadium_data.facilities]
    }

    context_data = json.dumps(relevant_data, separators=(",", ":"))  # compact JSON (token efficient)

    prompt = f"""
Role: Stadium Operations Decision Engine

You act as a real-time event coordinator making optimal, practical decisions.

Context:
{context_data}

User:
- Location: {request.user_context.current_zone}
- Priority: {request.user_context.priority}
- Request: {request.question}

Decision Rules:
1. Minimize wait time
2. Avoid crowd density > 0.7
3. Prefer same or nearby zones
4. Priority handling:
   - fastest → lowest wait time dominates
   - least_crowded → lowest density dominates
   - balanced → combine both

Output STRICTLY valid JSON:

{{
  "recommendation": "string",
  "reason": "string",
  "alternative": "string or null"
}}

Strict Constraints:
- Include location/zone in recommendation names
- No extra text outside JSON
- No markdown, no explanations
- No missing keys
"""

    try:
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                response_mime_type="application/json",
                temperature=0.1
            )
        )

        raw_text = response.text.strip()

        # 🔥 HARDENING: handle weird Gemini outputs
        if not raw_text.startswith("{"):
            start = raw_text.find("{")
            end = raw_text.rfind("}")
            if start != -1 and end != -1:
                raw_text = raw_text[start:end+1]

        data = json.loads(raw_text)

        # 🔥 ENSURE ALL FIELDS EXIST
        recommendation = data.get("recommendation") or "No optimal option identified."
        reason = data.get("reason") or "Insufficient data to determine reasoning."
        alternative = data.get("alternative")

        return AskResponse(
            recommendation=str(recommendation),
            reason=str(reason),
            alternative=str(alternative) if alternative else None
        )

    except Exception:
        # 🔥 SAFE FALLBACK (never crash)
        return AskResponse(
            recommendation=f"Move towards {request.user_context.current_zone} exit with lower visible crowd.",
            reason="System fallback triggered. Advising safest low-density movement.",
            alternative=None
        )
