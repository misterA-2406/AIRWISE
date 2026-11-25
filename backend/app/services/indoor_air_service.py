from typing import List, Dict, Any
from backend.app.schemas.indoor import IndoorCheckItem, IndoorRecommendationItem, IndoorAssessmentResponse

INDOOR_CHECKS_SEED = [
    IndoorCheckItem(
        id="chk-1",
        source="Incense (Agarbatti) & Dhoop",
        detected_or_reported=True,
        impact_level="severe",
        typical_pollutant="High VOCs, Benzene & PM2.5 (>250 µg/m³ in room)",
        free_mitigation="Substitute with aromatic dried natural herbs, essential oil reed diffuser, or open-air balcony placement.",
        paid_mitigation="Flameless ceramic aroma stone or active carbon room purifier."
    ),
    IndoorCheckItem(
        id="chk-2",
        source="Cooking Fumes & Hot Oil Tadka",
        detected_or_reported=True,
        impact_level="high",
        typical_pollutant="Acrolein, ultrafine combustion grease particles",
        free_mitigation="Always switch on exhaust 2 min prior to lighting stove; keep kitchen doors shut to isolate bedrooms; cover pans.",
        paid_mitigation="High-suction baffle filter chimney (1200+ m³/hr)."
    ),
    IndoorCheckItem(
        id="chk-3",
        source="Mosquito Coils & Liquid Vaporizers",
        detected_or_reported=True,
        impact_level="high",
        typical_pollutant="Allethrin, micro-soot comparable to 70-100 cigarettes per coil",
        free_mitigation="Fit fine mesh wire screens on windows; use magnetic doorway fly curtains and safe bed nets.",
        paid_mitigation="UV bug zappers or electric ultrasonic deterrents."
    ),
    IndoorCheckItem(
        id="chk-4",
        source="Street Dust & Peak Outdoor Infiltration",
        detected_or_reported=True,
        impact_level="high",
        typical_pollutant="Silica, heavy-metal vehicular brake dust, coarse PM10",
        free_mitigation="Damp-wipe surfaces rather than dry sweeping; place damp washable mats at outside doors; close street-facing windows 7-10 AM & 6-10 PM.",
        paid_mitigation="Silicone weather-stripping tape along window frame gaps."
    ),
    IndoorCheckItem(
        id="chk-5",
        source="Synthetic Air Fresheners & Aerosol Sprays",
        detected_or_reported=False,
        impact_level="moderate",
        typical_pollutant="Phthalates, terpene reacting with ozone to generate secondary particles",
        free_mitigation="Discontinue pressurized synthetic sprays; simmer cinnamon bark and citrus peels on stove for 5 min.",
        paid_mitigation="Zeolite mineral odor-absorbing bags."
    ),
    IndoorCheckItem(
        id="chk-6",
        source="Candles & Open Wick Flames",
        detected_or_reported=False,
        impact_level="moderate",
        typical_pollutant="Paraffin black soot, polycyclic hydrocarbons",
        free_mitigation="Trim wicks to 5mm; avoid drafty flickering spots; replace with LED ambient illumination.",
        paid_mitigation="100% pure beeswax or soy-based clean wicks."
    )
]

INDOOR_RECOMMENDATIONS_SEED = [
    IndoorRecommendationItem(
        id="ind-1",
        timeframe="Immediate",
        title="Switch on kitchen exhaust 3 minutes before cooking and run 5 minutes after",
        cost="₹0 Free",
        cost_numeric=0.0,
        effort="Low",
        reason="Pre-establishes a negative pressure gradient, preventing VOCs from escaping into sleeping quarters.",
        expected_usefulness="Eliminates up to 70% of grease and particulate migration.",
        limitations="Requires functional exhaust fan or chimney.",
        is_zero_budget_eligible=True,
        is_implemented=True
    ),
    IndoorRecommendationItem(
        id="ind-2",
        timeframe="Immediate",
        title="Adopt 'Micro-Ventilation' during today's 1:30 PM solar peak",
        cost="₹0 Free",
        cost_numeric=0.0,
        effort="Low",
        reason="Ambient outdoor air is at its cleanest daily window. Stale indoor CO2 needs purging.",
        expected_usefulness="Flushes out indoor stale carbon dioxide without flooding room with heavy soot.",
        limitations="Only keep open for 15-20 minutes maximum.",
        is_zero_budget_eligible=True,
        is_implemented=False
    ),
    IndoorRecommendationItem(
        id="ind-3",
        timeframe="Today",
        title="Switch from dry broom sweeping to wet micro-fiber mopping",
        cost="₹0 Free",
        cost_numeric=0.0,
        effort="Low",
        reason="Dry brooms resuspend settled toxic fine dust back into the breathing zone for up to 2 hours.",
        expected_usefulness="Captures floor particulate safely with zero resuspension.",
        limitations="Takes slightly longer to dry in humid weather.",
        is_zero_budget_eligible=True,
        is_implemented=True
    ),
    IndoorRecommendationItem(
        id="ind-4",
        timeframe="Today",
        title="Designate the bedroom as a strict 'Clean Air Sanctuary'",
        cost="₹0 Free",
        cost_numeric=0.0,
        effort="Low",
        reason="Adults and children spend 7-9 hours sleeping in one static breathing zone.",
        expected_usefulness="Keeping one room strictly isolated reduces 35% of total 24-hr personal exposure load.",
        limitations="Room door must remain pulled shut when people enter and leave.",
        is_zero_budget_eligible=True,
        is_implemented=False
    ),
    IndoorRecommendationItem(
        id="ind-5",
        timeframe="This Week",
        title="Install self-adhesive foam rubber draft seals around door & window edges",
        cost="Low-cost",
        cost_numeric=250.0,
        effort="Medium",
        reason="Window perimeter gaps account for up to 45% of passive outdoor pollution seepage during nightly inversions.",
        expected_usefulness="Reduces involuntary night air leakage by 40-50%.",
        limitations="Needs reapplying every 12 months in hot climates.",
        is_zero_budget_eligible=False,
        is_implemented=False
    ),
    IndoorRecommendationItem(
        id="ind-6",
        timeframe="This Week",
        title="Make a DIY Clean Air Box (Corsi-Rosenthal principle with pedestal fan)",
        cost="Low-cost",
        cost_numeric=950.0,
        effort="Medium",
        reason="Achieves high Clean Air Delivery Rate (CADR) at a fraction of branded purifier costs.",
        expected_usefulness="High volume filtration suited for large living rooms.",
        limitations="Slightly noisier than brushless commercial purifiers.",
        is_zero_budget_eligible=False,
        is_implemented=False
    ),
    IndoorRecommendationItem(
        id="ind-7",
        timeframe="Long-term",
        title="Transition stove from fossil LPG gas to induction cooktop",
        cost="Optional Expense",
        cost_numeric=2800.0,
        effort="Medium",
        reason="Gas burners produce unvented NO2, carbon monoxide, and formaldehyde directly inside the kitchen.",
        expected_usefulness="100% elimination of indoor combustion byproduct emissions during cooking.",
        limitations="Requires induction-compatible cookware and reliable electricity supply.",
        is_zero_budget_eligible=False,
        is_implemented=False
    )
]

class IndoorAirService:
    """Service managing household indoor air quality assessments and zero-budget protocols."""

    def __init__(self) -> None:
        """Initialize in-memory audit checks and mitigation recommendations."""
        self.checks = {c.id: c for c in INDOOR_CHECKS_SEED}
        self.recommendations = {r.id: r for r in INDOOR_RECOMMENDATIONS_SEED}

    def get_assessment(self, zero_budget_only: bool = False) -> IndoorAssessmentResponse:
        """Retrieve compiled assessment of indoor pollution sources and filtered interventions.

        Args:
            zero_budget_only: When True, filters out all commercial equipment recommendations.

        Returns:
            IndoorAssessmentResponse with sources audited and prioritized actions.
        """
        recs = list(self.recommendations.values())
        if zero_budget_only:
            recs = [r for r in recs if r.is_zero_budget_eligible]

        priorities = [
            "1. Timed Solar Aeration (1:30 PM) — ₹0 Free",
            "2. Silicone Weather-Stripping on bedroom window gaps — ~₹250",
            "3. DIY Corsi-Rosenthal Fan Box Filter — ~₹950 (5x cheaper than commercial HEPA)"
        ]

        return IndoorAssessmentResponse(
            zero_budget_active=zero_budget_only,
            sources_audited=list(self.checks.values()),
            recommendations=recs,
            home_priorities=priorities
        )

    def toggle_check(self, check_id: str) -> List[IndoorCheckItem]:
        """Toggle detection state for a specific indoor pollution source hazard.

        Args:
            check_id: Identifier of the source hazard check item.

        Returns:
            Updated list of all source hazard audit items.
        """
        if check_id in self.checks:
            curr = self.checks[check_id]
            self.checks[check_id] = curr.model_copy(update={"detected_or_reported": not curr.detected_or_reported})
        return list(self.checks.values())

    def toggle_recommendation(self, rec_id: str) -> List[IndoorRecommendationItem]:
        """Toggle implementation status of an indoor mitigation protocol.

        Args:
            rec_id: Identifier of the indoor recommendation item.

        Returns:
            Updated list of all indoor recommendation items.
        """
        if rec_id in self.recommendations:
            curr = self.recommendations[rec_id]
            self.recommendations[rec_id] = curr.model_copy(update={"is_implemented": not curr.is_implemented})
        return list(self.recommendations.values())

indoor_air_service = IndoorAirService()
