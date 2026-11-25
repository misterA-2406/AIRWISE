from typing import Dict, Any

def calculate_recommendation_score(
    condition_relevance: float,    # 0.0 to 1.0 (AQI urgency)
    exposure_reduction: float,     # 0.0 to 1.0 (magnitude of avoided dose)
    schedule_match: float,         # 0.0 to 1.0 (coincides with user itinerary)
    feasibility: float,            # 0.0 to 1.0 (low effort = 1.0, high effort = 0.5)
    cost_alignment: float          # 0.0 to 1.0 (₹0 free matches zero-budget preference = 1.0)
) -> float:
    """
    Transparent composite ranking formula:
    Score = (0.30 * condition_relevance) + 
            (0.25 * exposure_reduction) + 
            (0.20 * schedule_match) + 
            (0.15 * feasibility) + 
            (0.10 * cost_alignment)
    """
    score = (
        (0.30 * condition_relevance) +
        (0.25 * exposure_reduction) +
        (0.20 * schedule_match) +
        (0.15 * feasibility) +
        (0.10 * cost_alignment)
    )
    return round(score * 100.0, 1)
