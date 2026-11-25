from typing import Dict, Any, Tuple

def evaluate_pollution_risk(aqi: int, primary_pollutant: str, standard: str = "IN_NAAQS") -> Tuple[str, str, str]:
    """
    Evaluates pollution severity and returns:
    (risk_tier, general_advisory, primary_concern)
    """
    if standard == "IN_NAAQS":
        if aqi <= 50:
            return ("low", "Minimal air health impact.", "Clean ambient air")
        elif aqi <= 100:
            return ("moderate", "Minor breathing discomfort to sensitive individuals.", "Slight particulate elevation")
        elif aqi <= 250:
            return ("high", "Breathing discomfort to most people on prolonged exposure.", "Particulate matter accumulation")
        else:
            return ("severe", "Respiratory illness on prolonged exposure; pronounced effect on vulnerable lungs.", "Critical particulate inversion trap")
    else:
        if aqi <= 50:
            return ("low", "Air quality is satisfactory.", "Low airborne risk")
        elif aqi <= 100:
            return ("moderate", "Acceptable air quality; moderate health concern for sensitive individuals.", "Moderate ground pollutants")
        elif aqi <= 200:
            return ("high", "Everyone may begin to experience health effects.", "Elevated combustion aerosol")
        else:
            return ("severe", "Health alert: everyone may experience more serious health effects.", "Critical toxicity threshold")

def detect_atmospheric_trapping(wind_speed: float, temperature: float, hour: int) -> bool:
    """
    Detects if thermal boundary layer inversion is likely trapping surface emissions.
    Typically early morning (06:00 - 09:30) or night (20:00 - 05:00) with low surface wind (< 6 km/h).
    """
    is_diurnal_cooling = (hour >= 20 or hour <= 9)
    is_calm_wind = (wind_speed <= 5.5)
    return is_diurnal_cooling and is_calm_wind
