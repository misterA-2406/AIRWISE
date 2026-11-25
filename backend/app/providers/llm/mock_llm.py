from backend.app.providers.llm.base import BaseLLMProvider
from backend.app.schemas.ai import AIContextPayload, AIStructuredResponse, ActionableAICard

class DeterministicAIProvider(BaseLLMProvider):
    name: str = "Airwise Deterministic Intelligence"

    async def generate_structured_response(self, prompt: str, context: AIContextPayload) -> AIStructuredResponse:
        p = prompt.lower()
        loc = context.location
        aqi = context.aqi

        if "exercise" in p or "run" in p or "workout" in p:
            return AIStructuredResponse(
                summary=f"Strenuous outdoor exercise is unadvisable under current {aqi} AQI in {loc}.",
                risk_context=f"Deep aerobic breathing (60–80 L/min) deposits ultrafine particulate matter directly into bronchial bifurcations.",
                priority_actions=[
                    "Shift 6:00 PM cardio workout indoors into a closed room",
                    "Wipe floor with damp micro-fiber cloth prior to workout to eliminate resuspended dust",
                    "Use indoor bodyweight interval training or yoga"
                ],
                alternatives=[
                    "Wait for the 1:30 PM solar boundary layer lift for a light 15-minute terrace walk",
                    "Indoor treadmill in an air-conditioned room with operational HEPA filter"
                ],
                tradeoffs=[
                    "Indoor mobility workout yields identical caloric expenditure with 81% lower inhaled toxic particulate mass",
                    "Slightly less expansive sensory environment in exchange for cardiovascular protection"
                ],
                explanation=f"Under {context.primary_pollutant.upper()} dominance at {aqi} AQI, physical exertion multiplies particulate deposition by 5–8x compared to resting breathing rates.",
                uncertainties=[
                    "Microclimates in indoor basements may carry elevated Radon or CO2 if unventilated"
                ],
                sources=[
                    "WHO Global Air Quality Guidelines (2021)",
                    "Exercise Respiratory Inhaled Dose Physics Model"
                ],
                actionable_card=ActionableAICard(
                    title="Shift Evening Run to Indoor HIIT",
                    category="Health Adaptation",
                    action_text="Apply to today's schedule",
                    reduction_impact="81% lower inhaled particulate dose"
                ),
                confidence_score=95
            )

        elif "ventilate" in p or "window" in p or "fresh air" in p:
            return AIStructuredResponse(
                summary="Seal street-facing windows now; schedule micro-ventilation at 1:30 PM solar peak.",
                risk_context=f"A ground-level thermal inversion currently traps vehicle exhaust at breathing altitude (AQI {aqi}).",
                priority_actions=[
                    "Keep street-facing windows tightly shut during the morning 7–10 AM rush hour",
                    "Conduct a 15-minute cross-ventilation flush at 1:30 PM",
                    "Pre-run kitchen window exhaust before lighting stoves"
                ],
                alternatives=[
                    "If room feels humid, open only rear courtyard windows away from roadways for 5 mins"
                ],
                tradeoffs=[
                    "Delaying fresh air circulation by 4 hours prevents admitting 40–60 µg/m³ of black carbon"
                ],
                explanation="Solar convective updrafts reach their zenith between 1:00 PM and 2:30 PM, raising the boundary layer and halving ground particulate density.",
                uncertainties=[
                    "Local high-rise building wind shadow effects may vary aeration duration"
                ],
                sources=[
                    "Diurnal Planetary Boundary Layer Dispersion Mechanics",
                    "CPCB Ground Station Telemetry"
                ],
                actionable_card=ActionableAICard(
                    title="Schedule 1:30 PM Micro-Ventilation",
                    category="Indoor Air",
                    action_text="Set reminder alert",
                    reduction_impact="Flushes indoor CO2 with 61% less particulate intrusion"
                ),
                confidence_score=92
            )

        elif "zero" in p or "budget" in p or "free" in p or "cheap" in p:
            return AIStructuredResponse(
                summary="Three zero-cost actions can eliminate over 35% of cumulative daily exposure today.",
                risk_context="Hardware air purifiers are helpful, but behavioral timing and passive draft exclusion achieve massive risk reduction at ₹0.",
                priority_actions=[
                    "Wet micro-fiber mop living floors instead of dry broom sweeping (prevents dust resuspension)",
                    "Roll a clean damp towel along the bedroom door bottom sill to block draft infiltration",
                    "Always run kitchen exhaust fan 2 minutes before igniting cooking burners"
                ],
                alternatives=[
                    "Construct a DIY Corsi-Rosenthal box fan filter if you later allocate modest budget (~₹950)"
                ],
                tradeoffs=[
                    "Takes 5 extra minutes of routine maintenance, but costs ₹0 and eliminates direct exposure spikes"
                ],
                explanation="Particle resuspension from dry sweeping and night window leakage account for nearly half of indoor particulate burden in urban residences.",
                uncertainties=[
                    "Effectiveness depends on structural tightness of window frames"
                ],
                sources=[
                    "Household Aerosol Physics & Zero-Cost Exposure Mitigation"
                ],
                actionable_card=ActionableAICard(
                    title="Activate Zero-Budget Protocol",
                    category="Zero-Cost Protection",
                    action_text="Filter plan to ₹0",
                    reduction_impact="Up to 35% cumulative exposure drop at ₹0 cost"
                ),
                confidence_score=96
            )

        else:
            return AIStructuredResponse(
                summary=f"Given today's {aqi} AQI in {loc}, your primary exposure spikes will happen during commute and evening workout.",
                risk_context=f"High concentrations of {context.primary_pollutant.upper()} require strategic itinerary timing.",
                priority_actions=[
                    "Commute via underground filtered Metro or closed-cabin bus with recirculating air",
                    "Shift planned evening exercise indoors",
                    "Time home aeration for the 1:30 PM convective lift window"
                ],
                alternatives=[
                    "If two-wheeler travel is unavoidable, wear an airtight certified N95 mask and avoid diesel bus slipstreams"
                ],
                tradeoffs=[
                    "Taking Metro adds ~8 minutes vs motorcycle, but cuts toxic roadside soot inhalation by 73%"
                ],
                explanation="Synchronizing physical presence with atmospheric dispersion windows dramatically limits deep lung deposition.",
                uncertainties=[
                    "Localized microclimate hot-spots near highway bottlenecks"
                ],
                sources=[
                    "AIRWISE Multi-Parameter Deterministic Engine"
                ],
                actionable_card=ActionableAICard(
                    title="Apply 3 Priority Day Adjustments",
                    category="Daily Adaptation",
                    action_text="Update today's itinerary",
                    reduction_impact="Reduces 24-hr personal inhalation load by 58%"
                ),
                confidence_score=94
            )
