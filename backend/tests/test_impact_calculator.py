import pytest
from backend.app.services.impact_calculator import impact_calculator

def test_transit_emissions_avoided_valid():
    # 14 km from motorcycle (0.055 kg/km) to metro (0.015 kg/km) -> (0.055 - 0.015) * 14 = 0.56 kg
    res = impact_calculator.calculate_transit_emissions_avoided(
        original_mode="motorbike",
        adapted_mode="metro",
        distance_km=14.0
    )
    assert res["is_quantifiable"] is True
    assert res["estimated_kg_co2_avoided"] == 0.56
    assert "IPCC 2021" in res["emission_factor_source"]

def test_transit_emissions_missing_data_not_fabricated():
    # When distance is unknown or 0, it should NOT fabricate numbers
    res = impact_calculator.calculate_transit_emissions_avoided(
        original_mode="unknown_mode",
        adapted_mode="walking",
        distance_km=0.0
    )
    assert res["is_quantifiable"] is False
    assert res["estimated_kg_co2_avoided"] == 0.0
    assert "Quantitative emissions impact unavailable" in res["summary"]
