from typing import Dict, Any

def evaluate_commute_exposure(transport_mode: str, commute_minutes: int, ambient_aqi: int) -> Dict[str, Any]:
    """
    Computes comparative exposure coefficient based on vehicle envelope and road placement.
    Open two-wheeler or cycling behind vehicle tailpipes has multiplier 1.8x.
    Underground Metro has multiplier 0.25x.
    """
    mode = transport_mode.lower()
    if "metro" in mode or "rail" in mode or "train" in mode:
        multiplier = 0.25
        recommendation = "Maintain Metro transit; air-conditioned carriages provide positive pressure filtration."
    elif "car" in mode:
        multiplier = 0.45
        recommendation = "Switch vehicle AC to strict cabin recirculation mode; avoid fresh air intake in bumper-to-bumper jams."
    elif "bus" in mode:
        multiplier = 0.65
        recommendation = "Opt for air-conditioned low-floor buses where doors remain closed on arterial corridors."
    elif "bike" in mode or "motorcycle" in mode or "scooter" in mode or "two-wheeler" in mode:
        multiplier = 1.85
        recommendation = "Wear a snug, certified N95/FFP2 mask; avoid diesel truck slipstreams on flyovers."
    elif "walk" in mode or "cycling" in mode or "bicycle" in mode:
        multiplier = 1.95
        recommendation = "Divert 150m away from arterial roads into residential service lanes or tree-canopied corridors."
    else:
        multiplier = 1.0
        recommendation = "Limit open road exposure during morning and evening rush hours."

    return {
        "multiplier": multiplier,
        "recommendation": recommendation,
        "is_high_exposure_vector": multiplier > 1.0
    }
