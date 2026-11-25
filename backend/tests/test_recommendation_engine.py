import pytest
from backend.app.services.recommendation_engine import recommendation_engine
from backend.app.schemas.air_quality import CurrentAirQuality, PollutantConcentrations, WeatherContext
from backend.app.rules.scoring import calculate_recommendation_score

@pytest.fixture
def mock_severe_air():
    return CurrentAirQuality(
        aqi=284,
        standard="IN_NAAQS",
        risk_level="severe",
        primary_pollutant="pm25",
        pollutants=PollutantConcentrations(pm25=198.4, pm10=312.0),
        weather=WeatherContext(temperature=24, humidity=68, wind_speed=4.8, wind_direction="NW", condition="Haze"),
        timestamp="2026-11-21 08:30 UTC",
        location_name="Delhi NCR",
        latitude=28.56,
        longitude=77.21,
        outdoor_recommendation="Avoid outdoor cardio",
        health_advisory="High particulate load",
        data_source="Station Mesh",
        is_demo=True
    )

def test_recommendation_engine_generates_all_periods(mock_severe_air):
    profile = {"has_children": True, "has_elderly": True, "budget_preference": "zero-budget"}
    routine = {"primary_transport": "Metro", "commute_minutes": 38, "exercise_type": "Running"}
    
    actions = recommendation_engine.generate_plan(mock_severe_air, profile, routine)
    assert len(actions) == 8
    
    # Check periods
    periods = [a.period for a in actions]
    assert "before-leaving" in periods
    assert "commute-morning" in periods
    assert "outdoor-activities" in periods
    assert "evening" in periods
    assert "sleep" in periods

def test_recommendation_engine_wfh_override(mock_severe_air):
    profile = {"has_children": True}
    routine = {"primary_transport": "Metro", "commute_minutes": 38, "exercise_type": "Running"}
    
    actions = recommendation_engine.generate_plan(mock_severe_air, profile, routine, is_wfh_today=True)
    # Commute actions should be omitted when working from home
    periods = [a.period for a in actions]
    assert "commute-morning" not in periods
    assert "returning-home" not in periods

def test_ranking_scoring_formula():
    score = calculate_recommendation_score(
        condition_relevance=1.0,
        exposure_reduction=0.8,
        schedule_match=1.0,
        feasibility=0.9,
        cost_alignment=1.0
    )
    # (0.30 * 1.0) + (0.25 * 0.8) + (0.20 * 1.0) + (0.15 * 0.9) + (0.10 * 1.0) = 0.3 + 0.2 + 0.2 + 0.135 + 0.1 = 0.935 -> 93.5
    assert score == 93.5
