import pytest
from backend.app.services.scenario_engine import scenario_engine

def test_list_scenarios():
    scenarios = scenario_engine.list_scenarios()
    assert len(scenarios) >= 5
    ids = [s.id for s in scenarios]
    assert "sc-1" in ids
    assert "sc-2" in ids

def test_simulate_scenario_dynamic():
    res = scenario_engine.simulate(scenario_id="sc-1", distance_km=20.0, wind_modifier=1.2)
    assert res["scenario"].id == "sc-1"
    assert res["adjusted_reduction_percent"] > 0
    assert res["adjusted_emissions_delta_kg"] > 0
    assert "IPCC 2021" in res["scenario"].calculation_method
