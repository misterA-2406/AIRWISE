"""Centralized climate, emission factors, and atmospheric constants for AIRWISE.

Grounded in IPCC 2021 AR6 Transport Metrics and WHO 2021 Global Air Quality Guidelines.
"""

from typing import Final

# Transport emission factors in kg CO2e per passenger-kilometer (IPCC 2021 AR6)
SOLO_CAR_KG_CO2E_PER_KM: Final[float] = 0.192
MOTORCYCLE_KG_CO2E_PER_KM: Final[float] = 0.084
BUS_KG_CO2E_PER_KM: Final[float] = 0.068
ELECTRIC_METRO_KG_CO2E_PER_KM: Final[float] = 0.028
ACTIVE_TRANSIT_KG_CO2E_PER_KM: Final[float] = 0.0

# Atmospheric baseline defaults
SEVERE_INVERSION_AQI_BASELINE: Final[int] = 284
BOUNDARY_LAYER_INVERSION_HEIGHT_M: Final[int] = 320
RESIDENTIAL_INFILTRATION_RATIO: Final[float] = 0.65
WHO_PM25_24H_TARGET_UG_M3: Final[float] = 15.0
