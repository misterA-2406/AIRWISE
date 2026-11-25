from typing import List, Dict, Any, Optional
from backend.app.schemas.community import CommunityChallengeSchema, LeaderboardEntry, CommunityOverviewResponse

CHALLENGES_SEED = [
    CommunityChallengeSchema(
        id="com-1",
        title="Shift 3 Peak Rush-Hour Commutes to Metro or Rail",
        description="Commit to substituting 3 open road commutes with zero-tailpipe public transit during morning inversion peaks.",
        scope="Neighborhood",
        total_goal=1000,
        current_progress=742,
        unit="trips shifted",
        participants_count=384,
        days_remaining=4,
        joined=True,
        completed_by_me=False,
        estimated_emissions_avoided_kg=618.5,
        methodology_note="Calculated using IPCC 2021 urban emission factors comparing 125cc two-wheelers against electrified rail occupancy averages."
    ),
    CommunityChallengeSchema(
        id="com-2",
        title="Apartment Complex Smoke & Incense Holiday Truce",
        description="Encourage apartment towers to substitute open incense and mosquito coils with clean mesh screens and essential reed diffusers.",
        scope="Apartment",
        total_goal=120,
        current_progress=94,
        unit="households switched",
        participants_count=94,
        days_remaining=6,
        joined=True,
        completed_by_me=True,
        estimated_emissions_avoided_kg=142.0,
        methodology_note="Estimates based on peer-reviewed indoor combustion emission benchmarks (30g particulate mass avoided per weekly household)."
    ),
    CommunityChallengeSchema(
        id="com-3",
        title="University Campus Clean Air Corridor Mapping",
        description="Students and faculty map lower-exposure pedestrian paths between lecture halls away from perimeter diesel bus stops.",
        scope="Campus",
        total_goal=50,
        current_progress=41,
        unit="routes surveyed",
        participants_count=162,
        days_remaining=9,
        joined=False,
        completed_by_me=False,
        estimated_emissions_avoided_kg=45.0,
        methodology_note="Evaluated by comparing roadside micro-sensor logs against pedestrian greenway transects."
    ),
    CommunityChallengeSchema(
        id="com-4",
        title="Family Clean Bedroom Sanctuary Audit",
        description="Audit 5 vulnerable rooms in your extended family: seal draft gaps, remove open burning, establish morning damp-wipe routine.",
        scope="Family",
        total_goal=5,
        current_progress=4,
        unit="rooms fortified",
        participants_count=6,
        days_remaining=2,
        joined=True,
        completed_by_me=False,
        estimated_emissions_avoided_kg=0.0,
        methodology_note="Direct health resilience metric; zero carbon factor applied as this focuses purely on personal exposure reduction."
    )
]

LEADERBOARD_SEED = [
    LeaderboardEntry(rank=1, name="Anand Vihar Resident Green Collective", actions=1240, streak="28 days", scope="Neighborhood"),
    LeaderboardEntry(rank=2, name="IIT Delhi Clean Mobility Cohort", actions=980, streak="21 days", scope="Campus"),
    LeaderboardEntry(rank=3, name="Siri Fort Tower B Residents", actions=742, streak="14 days", scope="Apartment"),
    LeaderboardEntry(rank=4, name="Sharma Family Circle", actions=142, streak="9 days", scope="Family")
]

class CommunityService:
    def __init__(self):
        self.challenges = {c.id: c for c in CHALLENGES_SEED}
        self.leaderboard = list(LEADERBOARD_SEED)

    def get_overview(self) -> CommunityOverviewResponse:
        total_actions = sum(c.current_progress for c in self.challenges.values())
        total_emissions = sum(c.estimated_emissions_avoided_kg for c in self.challenges.values())
        return CommunityOverviewResponse(
            total_verified_actions=total_actions,
            total_estimated_avoided_emissions_kg=round(total_emissions, 1),
            active_participants_count=646,
            challenges=list(self.challenges.values()),
            leaderboard=self.leaderboard
        )

    def toggle_join(self, challenge_id: str) -> Optional[CommunityChallengeSchema]:
        if challenge_id in self.challenges:
            c = self.challenges[challenge_id]
            new_joined = not c.joined
            new_count = c.participants_count + (1 if new_joined else -1)
            updated = c.model_copy(update={"joined": new_joined, "participants_count": new_count})
            self.challenges[challenge_id] = updated
            return updated
        return None

    def log_action(self, challenge_id: str) -> Optional[CommunityChallengeSchema]:
        if challenge_id in self.challenges:
            c = self.challenges[challenge_id]
            updated = c.model_copy(update={
                "current_progress": min(c.total_goal, c.current_progress + 1),
                "completed_by_me": True,
                "estimated_emissions_avoided_kg": round(c.estimated_emissions_avoided_kg + 1.2, 1)
            })
            self.challenges[challenge_id] = updated
            return updated
        return None

community_service = CommunityService()
