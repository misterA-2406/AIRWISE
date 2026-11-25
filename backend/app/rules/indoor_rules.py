from typing import List, Dict, Any

INDOOR_SOURCE_RULES = [
    {
        "id": "ind_cook",
        "source": "Cooking fumes & Hot oil frying",
        "pollutant": "Acrolein, volatile organic compounds, and micro-grease soot",
        "threshold_multiplier": 2.5,
        "free_fix": "Turn on kitchen exhaust fan 2 minutes before igniting burners and keep on for 5 minutes after; shut bedroom doors.",
        "cost": "₹0 Free",
        "effort": "Low"
    },
    {
        "id": "ind_incense",
        "source": "Incense sticks (Agarbatti) & Dhoop",
        "pollutant": "Benzene, formaldehyde, and fine PM2.5 exceeding 300 µg/m³ in room",
        "threshold_multiplier": 3.8,
        "free_fix": "Substitute with aromatic dried natural herbs, essential oil reed diffusers, or open-balcony placement.",
        "cost": "₹0 Free",
        "effort": "Low"
    },
    {
        "id": "ind_sweep",
        "source": "Dry broom sweeping",
        "pollutant": "Resuspension of settled toxic heavy-metal vehicular dust for 2+ hours",
        "threshold_multiplier": 2.0,
        "free_fix": "Switch exclusively to wet micro-fiber mopping.",
        "cost": "₹0 Free",
        "effort": "Low"
    },
    {
        "id": "ind_windows",
        "source": "Street-facing open windows during rush hour",
        "pollutant": "Direct infiltration of roadside diesel soot and nitrogen dioxide",
        "threshold_multiplier": 2.2,
        "free_fix": "Keep street-facing windows sealed 7–10 AM & 6–10 PM; aerate only during 1:30 PM solar convection.",
        "cost": "₹0 Free",
        "effort": "Low"
    }
]

def evaluate_ventilation_window(hour: int, aqi: int) -> Dict[str, Any]:
    """
    Determines whether natural ventilation is beneficial at the given hour.
    Solar peak lift occurs 13:00 - 15:00.
    """
    if 13 <= hour <= 15:
        return {
            "can_ventilate": True,
            "duration_minutes": 20,
            "reason": "Planetary boundary layer is at maximum daytime height (~1,200m). Ambient pollution is at its daily nadir.",
            "guidance": "Open opposing windows for 15-20 minutes to flush stale indoor CO2 and moisture."
        }
    else:
        return {
            "can_ventilate": False,
            "duration_minutes": 0,
            "reason": "Ground inversion or rush-hour traffic creates unfavorable ambient particulate levels.",
            "guidance": "Keep windows sealed. Use damp sill seals or recirculating filtration."
        }
