from typing import List, Dict, Any, Optional
from backend.app.schemas.scenario import WhatIfScenarioItem, ScenarioOptionDetail
from backend.app.services.impact_calculator import impact_calculator

DEFAULT_SCENARIOS = [
    WhatIfScenarioItem(
        id="sc-1",
        title="Commute Choice: Underground Metro vs Open-Air Two-Wheeler",
        category="Commute",
        description="Compare personal respiratory exposure and transit emissions on your standard 14km peak morning route.",
        option_a=ScenarioOptionDetail(
            name="Open-Air Two-Wheeler (Motorbike)",
            details="Riding direct on arterial road behind diesel trucks and stop-and-go traffic.",
            exposure_score=88,
            emissions_kg_co2=0.77,
            time_minutes=32,
            cost_inr=65.0,
            health_tradeoff="Severe direct inhalation of fresh diesel soot and brake dust particles at street level."
        ),
        option_b=ScenarioOptionDetail(
            name="Underground Metro + 5m Walk",
            details="Air-conditioned underground train carriage with positive pressure filtration.",
            exposure_score=24,
            emissions_kg_co2=0.21,
            time_minutes=40,
            cost_inr=40.0,
            health_tradeoff="Slightly higher crowd density, but 73% lower toxic combustion aerosol inhalation."
        ),
        ai_verdict="The Metro is decisively healthier today. While taking 8 extra minutes, you avoid inhaling an estimated 48 µg of fresh carcinogenic black carbon during the worst inversion peak.",
        tradeoff_analysis="Convenience trade-off is minor (+8 mins), financial cost is 38% lower, and personal toxic exposure drops by nearly three-quarters.",
        exposure_reduction_percent=73,
        emissions_delta_kg=0.56,
        calculation_method="IPCC 2021 Urban Rail (0.015 kg/km) vs Four-stroke 125cc Two-Wheeler (0.055 kg/km)",
        uncertainties=["Underground station concourse particulate levels may vary during track braking."],
        assumptions=["Standard 14 km one-way urban route in Delhi NCR."]
    ),
    WhatIfScenarioItem(
        id="sc-2",
        title="Workout Decision: 6:00 PM Street Run vs 6:00 PM Indoor HIIT",
        category="Exercise",
        description="Decide whether to proceed with your scheduled 5km run along the perimeter park or shift indoors.",
        option_a=ScenarioOptionDetail(
            name="6:00 PM Outdoor Road Run (5 km)",
            details="Continuous aerobic breathing (60-80 L/min) alongside peak evening commute traffic (AQI 260).",
            exposure_score=94,
            emissions_kg_co2=0.0,
            time_minutes=35,
            cost_inr=0.0,
            health_tradeoff="High respiratory minute volume deposits particulate deep into bronchial bifurcations, triggering systemic vascular inflammation."
        ),
        option_b=ScenarioOptionDetail(
            name="6:00 PM Indoor Bodyweight HIIT",
            details="High intensity interval training inside a closed room with air purifier or damp floor wipe (AQI ~45).",
            exposure_score=18,
            emissions_kg_co2=0.0,
            time_minutes=35,
            cost_inr=0.0,
            health_tradeoff="Maintains cardiovascular fitness and VO2 stimulus with minimal particulate lung burden."
        ),
        ai_verdict="Indoor HIIT is unequivocally the wiser choice this evening. Aerobic exercise under Severe AQI delivers the particulate equivalent of smoking multiple unfiltered cigarettes directly into dilated alveoli.",
        tradeoff_analysis="Zero financial cost, identical calorie burn (~320 kcal), but an 81% reduction in total inhaled PM2.5 mass.",
        exposure_reduction_percent=81,
        emissions_delta_kg=0.0,
        calculation_method="Pulmonary Minute Ventilation Equation (70 L/min aerobic vs 12 L/min baseline)",
        uncertainties=["Indoor air quality assumes closed room with minimal cooking fumes."],
        assumptions=["5 km aerobic run over 35 minutes."]
    ),
    WhatIfScenarioItem(
        id="sc-3",
        title="Ventilation Strategy: Open Windows Now vs Post-Lunch Solar Window",
        category="Ventilation",
        description="Evaluate when to flush stagnant indoor CO2 from living spaces without flooding the house with smoke.",
        option_a=ScenarioOptionDetail(
            name="Open Windows at 08:00 AM",
            details="Wide cross-ventilation during morning rush hour and nocturnal inversion trap.",
            exposure_score=82,
            emissions_kg_co2=0.0,
            time_minutes=20,
            cost_inr=0.0,
            health_tradeoff="Indoor PM2.5 climbs from 35 µg/m³ to 180 µg/m³ within 15 minutes, remaining elevated for 4 hours."
        ),
        option_b=ScenarioOptionDetail(
            name="Open Windows at 01:30 PM (Solar Peak)",
            details="Timed 15-minute cross-draft when planetary boundary layer is highest and ambient AQI dips to 145.",
            exposure_score=32,
            emissions_kg_co2=0.0,
            time_minutes=15,
            cost_inr=0.0,
            health_tradeoff="Flushes CO2 and humidity effectively with 61% less particulate intake than morning airing."
        ),
        ai_verdict="Wait until 1:30 PM. Solar heating breaks the night inversion layer, increasing vertical atmospheric dispersion and halving particulate density.",
        tradeoff_analysis="Requires delaying fresh air circulation by a few hours, but saves indoor living areas from persistent toxic smog accumulation.",
        exposure_reduction_percent=61,
        emissions_delta_kg=0.0,
        calculation_method="Diurnal Planetary Boundary Layer Convective Mixing Model",
        uncertainties=["Local cloud cover may reduce solar convection."],
        assumptions=["Two-bedroom apartment with opposing window access."]
    ),
    WhatIfScenarioItem(
        id="sc-4",
        title="Route Selection: Direct Arterial Ring Road vs Quiet Residential Greenway",
        category="Route",
        description="Compare cycling or e-rickshaw route along the primary multi-lane road versus quiet neighborhood streets.",
        option_a=ScenarioOptionDetail(
            name="Direct Arterial Ring Road (6.2 km)",
            details="Heavy diesel truck traffic, elevated flyover congestion, bumper-to-bumper vehicle tailpipes.",
            exposure_score=86,
            emissions_kg_co2=0.0,
            time_minutes=22,
            cost_inr=0.0,
            health_tradeoff="Direct exposure to unburned hydrocarbons, brake pad dust, and high roadside NO2 spikes."
        ),
        option_b=ScenarioOptionDetail(
            name="Residential Greenway & Service Lanes (7.4 km)",
            details="Secondary tree-lined streets separated 150m from arterial corridors by buildings and canopy.",
            exposure_score=48,
            emissions_kg_co2=0.0,
            time_minutes=28,
            cost_inr=0.0,
            health_tradeoff="Urban vegetation and distance from tailpipe exhaust drops local fine particulate concentrations by 44%."
        ),
        ai_verdict="Take the residential greenway. Even though the distance is 1.2 km longer and adds 6 minutes, the barrier effect of buildings and tree canopy substantially filters roadway soot.",
        tradeoff_analysis="6 minutes of additional travel yields a 44% reduction in direct toxic exhaust exposure.",
        exposure_reduction_percent=44,
        emissions_delta_kg=0.0,
        calculation_method="Microclimate Decay Gradient away from Highway Centerline",
        uncertainties=["Pavement quality on backstreets may vary."],
        assumptions=["Pedestrian or micromobility travel."]
    ),
    WhatIfScenarioItem(
        id="sc-5",
        title="Cooking Method: High-Heat Unvented Frying vs Induction with Exhaust",
        category="Cooking",
        description="Assess indoor particulate generation when cooking dinner for a family of 4.",
        option_a=ScenarioOptionDetail(
            name="High-Heat Tadka / Frying without Exhaust",
            details="Open wok cooking with cooking oil reaching smoke point; kitchen doors open to living room.",
            exposure_score=91,
            emissions_kg_co2=0.4,
            time_minutes=25,
            cost_inr=0.0,
            health_tradeoff="Spikes indoor PM2.5 past 400 µg/m³, which remains suspended for up to 3 hours."
        ),
        option_b=ScenarioOptionDetail(
            name="Induction Temperature Control + Window Exhaust Fan",
            details="Pre-ventilated cooking with pan lid and active kitchen exhaust evacuating fumes outdoors.",
            exposure_score=28,
            emissions_kg_co2=0.25,
            time_minutes=25,
            cost_inr=4.0,
            health_tradeoff="Evacuates over 70% of aerosolized oil particles before dispersion to living spaces."
        ),
        ai_verdict="Pre-ventilate and control cooking oil heat. Indoor cooking can easily exceed outdoor pollution peaks if exhaust is neglected.",
        tradeoff_analysis="Zero time difference; tiny electricity cost (₹4); prevents severe respiratory irritation for children and elderly at home.",
        exposure_reduction_percent=69,
        emissions_delta_kg=0.15,
        calculation_method="Kitchen Aerosol Evacuation Rate & Burner Combustion Byproducts",
        uncertainties=["Exhaust fan cubic feet per minute (CFM) capacity."],
        assumptions=["Cooking dinner for 4 people."]
    )
]

class ScenarioEngine:
    def __init__(self):
        self.scenarios = {s.id: s for s in DEFAULT_SCENARIOS}

    def list_scenarios(self, category: Optional[str] = None) -> List[WhatIfScenarioItem]:
        if category and category != "all":
            return [s for s in self.scenarios.values() if s.category.lower() == category.lower()]
        return list(self.scenarios.values())

    def get_scenario(self, scenario_id: str) -> Optional[WhatIfScenarioItem]:
        return self.scenarios.get(scenario_id)

    def simulate(
        self,
        scenario_id: str,
        distance_km: float = 14.0,
        wind_modifier: float = 1.0
    ) -> Dict[str, Any]:
        sc = self.get_scenario(scenario_id) or DEFAULT_SCENARIOS[0]
        
        # Adjust reduction percent based on wind dispersion
        adjusted_reduction = int(min(96, max(20, sc.exposure_reduction_percent * (1.0 / max(0.5, wind_modifier)))))
        
        # Adjust emissions based on distance
        emissions_calc = impact_calculator.calculate_transit_emissions_avoided(
            original_mode="motorbike",
            adapted_mode="metro",
            distance_km=distance_km
        )
        adjusted_emissions = emissions_calc.get("estimated_kg_co2_avoided", sc.emissions_delta_kg) if sc.category == "Commute" else sc.emissions_delta_kg

        return {
            "scenario": sc,
            "adjusted_reduction_percent": adjusted_reduction,
            "adjusted_emissions_delta_kg": adjusted_emissions,
            "qualitative_summary": f"Under current conditions, choosing {sc.option_b.name} yields an estimated {adjusted_reduction}% reduction in respiratory exposure burden."
        }

scenario_engine = ScenarioEngine()
