"""Unit and edge-case integration tests for Indoor Air Service and Atmospheric Pollution Rules.

Provides comprehensive coverage across zero-budget protocols, diurnal boundary layer
inversion calculations, and input boundary edge cases.
"""

from backend.app.services.indoor_air_service import indoor_air_service
from backend.app.rules.pollution_rules import evaluate_pollution_risk, detect_atmospheric_trapping
from backend.app.constants import SEVERE_INVERSION_AQI_BASELINE, BOUNDARY_LAYER_INVERSION_HEIGHT_M


def test_indoor_air_assessment_complete():
    """Verify indoor air service returns populated sources and recommendations."""
    assessment = indoor_air_service.get_assessment(zero_budget_only=False)
    assert assessment is not None
    assert len(assessment.sources_audited) >= 5
    assert len(assessment.recommendations) >= 5
    assert len(assessment.home_priorities) >= 3


def test_indoor_air_zero_budget_filter_strict():
    """Verify zero-budget mode strictly filters out paid equipment recommendations."""
    assessment = indoor_air_service.get_assessment(zero_budget_only=True)
    assert assessment.zero_budget_active is True
    # Every returned recommendation in zero-budget mode MUST have is_zero_budget_eligible == True
    for rec in assessment.recommendations:
        assert rec.is_zero_budget_eligible is True


def test_indoor_toggle_check_state():
    """Verify toggling detection state on an indoor audit source works symmetrically."""
    initial_sources = indoor_air_service.get_assessment().sources_audited
    first_check = initial_sources[0]
    original_state = first_check.detected_or_reported

    # Toggle state
    updated_sources = indoor_air_service.toggle_check(first_check.id)
    toggled_check = next(c for c in updated_sources if c.id == first_check.id)
    assert toggled_check.detected_or_reported != original_state

    # Revert to original to keep test suite idempotent
    indoor_air_service.toggle_check(first_check.id)


def test_indoor_toggle_recommendation_state():
    """Verify toggling implementation status on an indoor protocol works symmetrically."""
    recs = indoor_air_service.get_assessment().recommendations
    first_rec = recs[0]
    original_state = first_rec.is_implemented

    # Toggle implementation
    updated_recs = indoor_air_service.toggle_recommendation(first_rec.id)
    toggled_rec = next(r for r in updated_recs if r.id == first_rec.id)
    assert toggled_rec.is_implemented != original_state

    # Revert to original
    indoor_air_service.toggle_recommendation(first_rec.id)


def test_pollution_rules_constants():
    """Verify atmospheric baseline constants are properly defined and bounded."""
    assert SEVERE_INVERSION_AQI_BASELINE == 284
    assert BOUNDARY_LAYER_INVERSION_HEIGHT_M == 320


def test_pollution_rules_tier_evaluations():
    """Verify air risk classification across low, moderate, high, and severe thresholds."""
    # Test low air risk
    low_tier, _, _ = evaluate_pollution_risk(35, "PM2.5", standard="IN_NAAQS")
    assert low_tier == "low"

    # Test moderate risk
    mod_tier, _, _ = evaluate_pollution_risk(80, "PM2.5", standard="IN_NAAQS")
    assert mod_tier == "moderate"

    # Test high risk
    high_tier, _, _ = evaluate_pollution_risk(180, "PM2.5", standard="IN_NAAQS")
    assert high_tier == "high"

    # Test severe risk (winter smog)
    severe_tier, adv, concern = evaluate_pollution_risk(350, "PM2.5", standard="IN_NAAQS")
    assert severe_tier == "severe"
    assert "inversion" in concern.lower() or "particulate" in concern.lower()

    # Test international / US_AQI standard branch
    us_severe, _, _ = evaluate_pollution_risk(250, "PM2.5", standard="US_AQI")
    assert us_severe == "severe"


def test_detect_atmospheric_trapping():
    """Verify planetary boundary layer thermal trapping detection logic."""
    # Morning rush hour with calm wind -> trapping ACTIVE
    assert detect_atmospheric_trapping(wind_speed=3.2, temperature=14.0, hour=7) is True

    # Nighttime inversion with calm wind -> trapping ACTIVE
    assert detect_atmospheric_trapping(wind_speed=2.0, temperature=11.0, hour=22) is True

    # Midday peak solar lift with higher wind -> trapping INACTIVE
    assert detect_atmospheric_trapping(wind_speed=12.5, temperature=24.0, hour=13) is False
