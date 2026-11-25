from typing import Dict, Any

def evaluate_exercise_safety(exercise_type: str, timing: str, aqi: int) -> Dict[str, Any]:
    """
    Evaluates pulmonary minute volume during physical exertion.
    At rest: ~8 Liters/min.
    Moderate walk: ~25 Liters/min.
    Intense aerobic run: ~70 Liters/min (almost 9x particulate inhalation rate).
    """
    ex_lower = exercise_type.lower()
    is_aerobic = ("run" in ex_lower or "cardio" in ex_lower or "cycle" in ex_lower or "hiit" in ex_lower)

    if aqi > 200:
        if is_aerobic:
            return {
                "safe_outdoors": False,
                "action": "Shift planned outdoor exercise to an indoor mobility / core workout.",
                "why": f"Under AQI {aqi}, aerobic hyperventilation deposits severe particulate mass deep into dilated alveolar cavities.",
                "indoor_alternative": "25-minute indoor HIIT, yoga, or bodyweight circuit in a sealed room.",
                "reduction_estimate": "Avoids ~140 µg deep alveolar particulate deposition"
            }
        else:
            return {
                "safe_outdoors": False,
                "action": "Keep outdoor walking strictly under 15 minutes; wear an N95 mask.",
                "why": "Fine particulate concentration exceeds acute irritation thresholds.",
                "indoor_alternative": "Indoor walking or stair mobility.",
                "reduction_estimate": "50% lower particulate inhalation"
            }
    elif aqi > 100:
        return {
            "safe_outdoors": True,
            "action": "Exercise outdoors during the 1:00 PM - 3:00 PM solar boundary lift window only.",
            "why": "Midday convective solar heating disperses the lower boundary layer.",
            "indoor_alternative": "Indoor gym or park with dense vegetative tree canopy buffer.",
            "reduction_estimate": "35% lower exposure compared to evening rush"
        }
    else:
        return {
            "safe_outdoors": True,
            "action": "Favorable conditions for all outdoor jogging, cycling, and sports.",
            "why": "Ambient particulate concentration is within biological safety guidelines.",
            "indoor_alternative": "Enjoy outdoor parks.",
            "reduction_estimate": "Baseline clean air"
        }
