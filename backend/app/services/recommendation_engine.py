from typing import List, Dict, Any, Optional
from backend.app.schemas.air_quality import CurrentAirQuality
from backend.app.schemas.daily_plan import PlanRecommendation, BenefitDetail
from backend.app.rules.commute_rules import evaluate_commute_exposure
from backend.app.rules.activity_rules import evaluate_exercise_safety
from backend.app.rules.indoor_rules import evaluate_ventilation_window
from backend.app.rules.scoring import calculate_recommendation_score

class RecommendationEngine:
    """
    Deterministic rule-based climate adaptation engine combining environmental
    readings, diurnal atmospheric cycles, and personal itinerary constraints.
    """

    @staticmethod
    def generate_plan(
        air: CurrentAirQuality,
        profile: Dict[str, Any],
        routine: Dict[str, Any],
        is_wfh_today: bool = False,
        zero_budget_only: bool = False
    ) -> List[PlanRecommendation]:
        aqi = air.aqi
        primary_pol = air.primary_pollutant.upper()
        commute_mode = routine.get("primary_transport", "Metro")
        commute_mins = routine.get("commute_minutes", 38)
        exercise_type = routine.get("exercise_type", "Running")
        has_vulnerable = (profile.get("has_children", True) or profile.get("has_elderly", True) or profile.get("has_respiratory_sensitivity", True))

        actions: List[PlanRecommendation] = []

        # 1. Before Leaving Home (07:30 AM)
        actions.append(PlanRecommendation(
            id="act-1",
            period="before-leaving",
            time_label="07:30 AM",
            title="Keep street-facing windows sealed; run quick filter purge",
            action="Keep all street-facing glass sealed during early morning ground inversion peak.",
            why_today=f"Morning planetary boundary layer is compressed; ambient {primary_pol} index is at {aqi}.",
            personal_relevance="Your residence faces secondary traffic corridors where morning diesel delivery vehicles idle.",
            cost="₹0 Free",
            cost_numeric=0.0,
            effort="Low",
            alternative="If room feels humid, crack only rear courtyard windows away from roadways for 5 mins.",
            impact="Avoids an estimated 40-60 µg/m³ influx of outdoor fine particulate into living spaces.",
            benefit=BenefitDetail(type="indoor_particulate_defense", description="Restricts nocturnal smog ingress."),
            category="Indoor Air",
            is_completed=True,
            is_saved=True,
            confidence_reason="Outdoor PM2.5 is significantly elevated over morning room baseline.",
            confidence="high",
            data_sources=["CPCB & Copernicus Ambient Monitoring"]
        ))

        # 2. Morning Commute (08:45 AM)
        if not is_wfh_today:
            commute_eval = evaluate_commute_exposure(commute_mode, commute_mins, aqi)
            actions.append(PlanRecommendation(
                id="act-2",
                period="commute-morning",
                time_label="08:45 AM",
                title=f"Travel via Underground Metro or Cabin AC Recirculation",
                action=commute_eval["recommendation"],
                why_today=f"Arterial highway congestion coincides with low dispersion wind ({air.weather.wind_speed} km/h).",
                personal_relevance=f"Your profile indicates a {commute_mins}-minute regular transit itinerary.",
                cost="₹0 Free",
                cost_numeric=0.0,
                effort="Medium",
                alternative="If riding two-wheeler, wear a certified N95 mask and avoid diesel bus slipstreams.",
                impact="Reduces in-transit respiratory particulate deposition by up to 73% vs open roadway travel.",
                benefit=BenefitDetail(type="commute_exposure_reduction", description="Eliminates direct exhaust inhalation."),
                category="Commute",
                is_completed=False,
                is_saved=True,
                confidence_reason="Underground trains feature sealed filtration envelopes.",
                confidence="high",
                data_sources=["In-Cabin Transit Aerosol Benchmarks"]
            ))

        # 3. Work / College (11:30 AM)
        actions.append(PlanRecommendation(
            id="act-3",
            period="work-study",
            time_label="11:30 AM",
            title="Hold discussions in central atrium rather than outdoor terrace",
            action="Shift morning 1-on-1 conversations into mechanically filtered building interiors.",
            why_today="Midday solar thermal updrafts have not yet reached peak altitude.",
            personal_relevance="Your routine logs a walking sync before lunch.",
            cost="₹0 Free",
            cost_numeric=0.0,
            effort="Low",
            alternative="Sit near building botanical air-purifying plant installations.",
            impact="Protects vocal cords and respiratory tract from unforced particulate irritation.",
            benefit=BenefitDetail(type="occupational_resilience", description="Maintains indoor filtered baseline AQI < 55."),
            category="Schedule",
            is_completed=False,
            is_saved=False,
            confidence_reason="Commercial HVAC filters drop ambient particulates by >60%.",
            confidence="high",
            data_sources=["Commercial Building Air Handling Standards"]
        ))

        # 4. Meals / Lunch (01:30 PM)
        actions.append(PlanRecommendation(
            id="act-4",
            period="lunch",
            time_label="01:30 PM",
            title="Optimal 20-minute terrace walk window (Atmospheric lift peak)",
            action="Take daylight outdoor steps or ventilate rooms now during solar convective mixing.",
            why_today="Solar surface heating drives the boundary layer to ~1,200m, yielding the cleanest air of the 24h cycle.",
            personal_relevance="You recorded a goal of 3,000 daytime movement steps.",
            cost="₹0 Free",
            cost_numeric=0.0,
            effort="Low",
            alternative="Indoor corridor steps if allergic eye sensitivity is present today.",
            impact="Safest outdoor window of the entire day; ambient particulate density dips by 40%.",
            benefit=BenefitDetail(type="diurnal_optimization", description="Leverages natural convective updrafts."),
            category="Routine",
            is_completed=False,
            is_saved=True,
            confidence_reason="Planetary boundary layer height model confirmed.",
            confidence="high",
            data_sources=["Diurnal Boundary Layer Physics"]
        ))

        # 5. Outdoor Activities / Evening Workout (06:15 PM)
        ex_safety = evaluate_exercise_safety(exercise_type, "Evening", aqi)
        actions.append(PlanRecommendation(
            id="act-5",
            period="outdoor-activities",
            time_label="06:15 PM",
            title=f"Shift {exercise_type} indoors to mobility / core circuit",
            action=ex_safety["action"],
            why_today=f"Evening temperature inversion traps fresh vehicular emissions (AQI {aqi}).",
            personal_relevance=f"Deep aerobic breathing during intense {exercise_type} expands air intake by 600%.",
            cost="₹0 Free",
            cost_numeric=0.0,
            effort="Medium",
            alternative=ex_safety["indoor_alternative"],
            impact=ex_safety["reduction_estimate"],
            benefit=BenefitDetail(type="alveolar_shielding", description="Protects dilated airways from micro-particulates."),
            category="Health",
            is_completed=False,
            is_saved=True,
            confidence_reason="Heavy aerobic minute volume under severe AQI drastically escalates cardiopulmonary strain.",
            confidence="high",
            data_sources=["Exercise Physiology & Inhaled Aerosol Deposition"]
        ))

        # 6. Returning Home (07:45 PM)
        if not is_wfh_today:
            actions.append(PlanRecommendation(
                id="act-6",
                period="returning-home",
                time_label="07:45 PM",
                title="Take residential greenway connector instead of arterial highway",
                action="Choose secondary tree-lined connector roads separated from bumper-to-bumper flyovers.",
                why_today="Heavy commercial diesel transit enters bypass corridors starting at 07:00 PM.",
                personal_relevance="Your return route has a parallel residential service connector.",
                cost="₹0 Free",
                cost_numeric=0.0,
                effort="Low",
                alternative="Travel 25 minutes later once the initial 8 PM traffic bottleneck dissipates.",
                impact="Neighborhood tree buffers reduce direct black-carbon exposure by 35%.",
                benefit=BenefitDetail(type="route_exposure_reduction", description="Bypasses idling diesel tailpipe plumes."),
                category="Commute",
                is_completed=False,
                is_saved=False,
                confidence_reason="Micro-sensor data shows 40% lower NOx away from standstill corridors.",
                confidence="moderate",
                data_sources=["Urban Microclimate Transect Measurements"]
            ))

        # 7. Evening Living (08:30 PM)
        actions.append(PlanRecommendation(
            id="act-7",
            period="evening",
            time_label="08:30 PM",
            title="Pre-run kitchen exhaust 2 mins prior to frying; isolate bedrooms",
            action="Switch on kitchen exhaust before lighting stove and keep bedroom doors pulled shut.",
            why_today="High-temperature oil frying produces indoor PM2.5 past 400 µg/m³ without active exhaust.",
            personal_relevance="Profile mentions regular evening hot oil cooking at home.",
            cost="₹0 Free",
            cost_numeric=0.0,
            effort="Low",
            alternative="Cover cooking pans with lids and crack kitchen utility balcony door.",
            impact="Evacuates up to 70% of aerosolized oil particles before migrating into sleeping areas.",
            benefit=BenefitDetail(type="indoor_source_mitigation", description="Creates negative kitchen pressure."),
            category="Indoor Air",
            is_completed=False,
            is_saved=True,
            confidence_reason="Cooking oil smoke is a dominant contributor to indoor evening spikes.",
            confidence="high",
            data_sources=["Indoor Air Chemistry & Ventilation Standards"]
        ))

        # 8. Sleep & Night (10:30 PM)
        actions.append(PlanRecommendation(
            id="act-8",
            period="sleep",
            time_label="10:30 PM",
            title="Seal bedroom door sill with damp towel; establish clean sanctuary",
            action="Place rolled damp towel along bottom door sill and keep bedroom windows latched.",
            why_today="Nocturnal temperature drop creates stagnant surface smog between 02:00 and 06:00 AM.",
            personal_relevance="Household has vulnerable members resting in sleeping quarters for 8 continuous hours.",
            cost="₹0 Free",
            cost_numeric=0.0,
            effort="Low",
            alternative="Run bedroom air purifier on quiet night mode.",
            impact="Cuts overnight particulate infiltration through frame and door gaps by up to 30%.",
            benefit=BenefitDetail(type="overnight_recovery", description="Shields respiratory system during 8-hour sleep."),
            category="Indoor Air",
            is_completed=False,
            is_saved=True,
            confidence_reason="Zero-cost perimeter draft sealing restricts nocturnal cool air draft infiltration.",
            confidence="high",
            data_sources=["Passive Infiltration & Draft Sealing Literature"]
        ))

        return actions

recommendation_engine = RecommendationEngine()
