import { 
  AirQualityData, 
  HourlyForecast, 
  DailyForecast, 
  PlanAction, 
  UserRoutineProfile, 
  IndoorRecommendation, 
  IndoorSourceCheck,
  WhatIfScenario, 
  CommunityMission, 
  AirwiseNotification,
  LocationOption 
} from '../types';

import { 
  DEMO_LOCATIONS, 
  INITIAL_AIR_DATA, 
  HOURLY_TIMELINE_DATA, 
  DAILY_FORECAST_DATA, 
  INITIAL_PLAN_ACTIONS, 
  INITIAL_USER_ROUTINE, 
  INDOOR_SOURCE_CHECKLIST,
  INDOOR_PRACTICAL_ACTIONS, 
  WHAT_IF_SCENARIOS, 
  COMMUNITY_MISSIONS, 
  NOTIFICATIONS_DATA 
} from '../data/demoData';

const BACKEND_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.port === '5173'
    ? 'http://127.0.0.1:8000/api'
    : '/api');

// Fetch helper with timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 2500): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timeoutId);
  }
}

export class AirwiseApiService {
  private static locations: LocationOption[] = [...DEMO_LOCATIONS];
  private static airData: Record<string, AirQualityData> = { ...INITIAL_AIR_DATA };
  private static hourlyForecast: HourlyForecast[] = [...HOURLY_TIMELINE_DATA];
  private static dailyForecast: DailyForecast[] = [...DAILY_FORECAST_DATA];
  private static planActions: PlanAction[] = [...INITIAL_PLAN_ACTIONS];
  private static routineProfile: UserRoutineProfile = { ...INITIAL_USER_ROUTINE };
  private static indoorChecks: IndoorSourceCheck[] = [...INDOOR_SOURCE_CHECKLIST];
  private static indoorRecommendations: IndoorRecommendation[] = [...INDOOR_PRACTICAL_ACTIONS];
  private static scenarios: WhatIfScenario[] = [...WHAT_IF_SCENARIOS];
  private static missions: CommunityMission[] = [...COMMUNITY_MISSIONS];
  private static notifications: AirwiseNotification[] = [...NOTIFICATIONS_DATA];

  // Locations
  static async getLocations(): Promise<LocationOption[]> {
    return [...this.locations];
  }

  // Air Quality
  static async getAirQuality(locationId: string = 'delhi'): Promise<AirQualityData> {
    const locMap: Record<string, { lat: number; lon: number; name: string }> = {
      delhi: { lat: 28.5672, lon: 77.2100, name: 'Delhi NCR' },
      london: { lat: 51.5074, lon: -0.1278, name: 'London' },
      newyork: { lat: 40.7128, lon: -74.0060, name: 'New York City' },
      tokyo: { lat: 35.6762, lon: 139.6503, name: 'Tokyo' },
      jakarta: { lat: -6.2088, lon: 106.8456, name: 'Jakarta' }
    };

    const target = locMap[locationId] || locMap.delhi;

    try {
      const res = await fetchWithTimeout(`${BACKEND_BASE_URL}/air/current?lat=${target.lat}&lon=${target.lon}&location_name=${encodeURIComponent(target.name)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          return {
            aqi: d.aqi,
            standard: d.standard,
            riskLevel: d.risk_level,
            primaryPollutant: d.primary_pollutant,
            pollutants: {
              pm25: d.pollutants?.pm25 || 0,
              pm10: d.pollutants?.pm10 || 0,
              o3: d.pollutants?.o3 || 0,
              no2: d.pollutants?.no2 || 0,
              co: d.pollutants?.co || 0,
              so2: d.pollutants?.so2 || 0
            },
            weather: {
              temperature: d.weather?.temperature || 24,
              humidity: d.weather?.humidity || 65,
              windSpeed: d.weather?.wind_speed || 4.8,
              windDirection: d.weather?.wind_direction || 'NW',
              condition: d.weather?.condition || 'Atmospheric Sync',
              uvIndex: d.weather?.uv_index || 4
            },
            timestamp: d.timestamp,
            confidenceScore: d.confidence_score,
            activeSensors: d.active_sensors,
            outdoorRecommendation: d.outdoor_recommendation,
            healthAdvisory: d.health_advisory,
            locationName: d.location_name,
            subArea: d.sub_area || 'Urban Sector',
            isDemo: d.is_demo
          };
        }
      }
    } catch {
      // Backend offline or timeout -> use local calibrated station simulator
    }

    const fallback = this.airData[locationId] || this.airData['delhi'];
    return { ...fallback };
  }

  // Hourly and Daily Forecast
  static async getForecast(locationId: string = 'delhi'): Promise<{
    hourly: HourlyForecast[];
    daily: DailyForecast[];
  }> {
    const locMap: Record<string, { lat: number; lon: number; name: string }> = {
      delhi: { lat: 28.5672, lon: 77.2100, name: 'Delhi NCR' },
      london: { lat: 51.5074, lon: -0.1278, name: 'London' },
      newyork: { lat: 40.7128, lon: -74.0060, name: 'New York City' },
      tokyo: { lat: 35.6762, lon: 139.6503, name: 'Tokyo' },
      jakarta: { lat: -6.2088, lon: 106.8456, name: 'Jakarta' }
    };

    const target = locMap[locationId] || locMap.delhi;

    try {
      const res = await fetchWithTimeout(`${BACKEND_BASE_URL}/air/forecast?lat=${target.lat}&lon=${target.lon}&location_name=${encodeURIComponent(target.name)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const h: HourlyForecast[] = json.data.hourly.map((item: any) => ({
            hour: item.hour,
            aqi: item.aqi,
            riskLevel: item.risk_level,
            pm25: item.pm25,
            windSpeed: item.wind_speed,
            label: item.label
          }));
          const d: DailyForecast[] = json.data.daily.map((item: any) => ({
            day: item.day,
            avgAqi: item.avg_aqi,
            peakAqi: item.peak_aqi,
            riskLevel: item.risk_level,
            dominantCondition: item.dominant_condition
          }));
          return { hourly: h, daily: d };
        }
      }
    } catch {
      // Fallback
    }

    const baseAir = this.airData[locationId] || this.airData['delhi'];
    const scale = baseAir.aqi / 284;
    
    const scaledHourly = this.hourlyForecast.map(h => ({
      ...h,
      aqi: Math.round(h.aqi * scale),
      pm25: Math.round(h.pm25 * scale),
      riskLevel: (h.aqi * scale > 250 ? 'severe' : h.aqi * scale > 150 ? 'high' : h.aqi * scale > 50 ? 'moderate' : 'low') as any
    }));

    const scaledDaily = this.dailyForecast.map(d => ({
      ...d,
      avgAqi: Math.round(d.avgAqi * scale),
      peakAqi: Math.round(d.peakAqi * scale),
      riskLevel: (d.avgAqi * scale > 250 ? 'severe' : d.avgAqi * scale > 150 ? 'high' : d.avgAqi * scale > 50 ? 'moderate' : 'low') as any
    }));

    return { hourly: scaledHourly, daily: scaledDaily };
  }

  // Daily Plan Actions
  static async getDailyPlan(): Promise<PlanAction[]> {
    try {
      const res = await fetchWithTimeout(`${BACKEND_BASE_URL}/plan/today`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data.actions) {
          return json.data.actions.map((a: any) => ({
            id: a.id,
            period: a.period,
            timeLabel: a.time_label,
            title: a.title,
            whyToday: a.why_today,
            personalRelevance: a.personal_relevance,
            cost: a.cost,
            costNumeric: a.cost_numeric,
            effort: a.effort,
            alternative: a.alternative,
            impact: a.impact,
            category: a.category,
            isCompleted: a.is_completed,
            isSaved: a.is_saved,
            isSkipped: a.is_skipped,
            confidenceReason: a.confidence_reason
          }));
        }
      }
    } catch {
      // Fallback
    }

    return [...this.planActions];
  }

  static async toggleActionComplete(actionId: string): Promise<PlanAction[]> {
    this.planActions = this.planActions.map(action => 
      action.id === actionId ? { ...action, isCompleted: !action.isCompleted } : action
    );
    try {
      await fetchWithTimeout(`${BACKEND_BASE_URL}/recommendations/${actionId}/complete`, { method: 'POST' });
    } catch {}
    return [...this.planActions];
  }

  static async toggleActionSave(actionId: string): Promise<PlanAction[]> {
    this.planActions = this.planActions.map(action => 
      action.id === actionId ? { ...action, isSaved: !action.isSaved } : action
    );
    return [...this.planActions];
  }

  static async skipAction(actionId: string): Promise<PlanAction[]> {
    this.planActions = this.planActions.map(action => 
      action.id === actionId ? { ...action, isSkipped: true } : action
    );
    try {
      await fetchWithTimeout(`${BACKEND_BASE_URL}/recommendations/${actionId}/skip`, { method: 'POST' });
    } catch {}
    return [...this.planActions];
  }

  static async replaceAction(actionId: string, customTitle: string, customAlt: string): Promise<PlanAction[]> {
    this.planActions = this.planActions.map(action => 
      action.id === actionId ? {
        ...action,
        title: customTitle,
        alternative: customAlt,
        isSkipped: false
      } : action
    );
    try {
      await fetchWithTimeout(`${BACKEND_BASE_URL}/recommendations/${actionId}/alternative`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: customTitle, alternative: customAlt })
      });
    } catch {}
    return [...this.planActions];
  }

  // Routine & Lifestyle
  static async getRoutine(): Promise<UserRoutineProfile> {
    try {
      const res = await fetchWithTimeout(`${BACKEND_BASE_URL}/routine`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          return {
            ...this.routineProfile,
            homeLocation: d.home_location,
            workLocation: d.work_location,
            primaryTransport: d.primary_transport,
            commuteMinutes: d.commute_minutes,
            exerciseTime: d.exercise_time,
            exerciseType: d.exercise_type
          };
        }
      }
    } catch {}
    return { ...this.routineProfile };
  }

  static async updateRoutine(profile: Partial<UserRoutineProfile>): Promise<UserRoutineProfile> {
    this.routineProfile = { ...this.routineProfile, ...profile };
    try {
      await fetchWithTimeout(`${BACKEND_BASE_URL}/routine`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          home_location: profile.homeLocation,
          work_location: profile.workLocation,
          primary_transport: profile.primaryTransport,
          commute_minutes: profile.commuteMinutes,
          exercise_time: profile.exerciseTime,
          exercise_type: profile.exerciseType
        })
      });
    } catch {}
    return { ...this.routineProfile };
  }

  // Indoor Air Coach
  static async getIndoorChecks(): Promise<IndoorSourceCheck[]> {
    return [...this.indoorChecks];
  }

  static async toggleIndoorCheck(checkId: string): Promise<IndoorSourceCheck[]> {
    this.indoorChecks = this.indoorChecks.map(item =>
      item.id === checkId ? { ...item, detectedOrReported: !item.detectedOrReported } : item
    );
    try {
      await fetchWithTimeout(`${BACKEND_BASE_URL}/indoor/check/${checkId}/toggle`, { method: 'POST' });
    } catch {}
    return [...this.indoorChecks];
  }

  static async getIndoorRecommendations(): Promise<IndoorRecommendation[]> {
    return [...this.indoorRecommendations];
  }

  static async toggleIndoorRecommendationImplemented(id: string): Promise<IndoorRecommendation[]> {
    this.indoorRecommendations = this.indoorRecommendations.map(item =>
      item.id === id ? { ...item, isImplemented: !item.isImplemented } : item
    );
    try {
      await fetchWithTimeout(`${BACKEND_BASE_URL}/indoor/recommendation/${id}/toggle`, { method: 'POST' });
    } catch {}
    return [...this.indoorRecommendations];
  }

  // What-If Scenarios
  static async getScenarios(): Promise<WhatIfScenario[]> {
    try {
      const res = await fetchWithTimeout(`${BACKEND_BASE_URL}/scenarios`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data.map((s: any) => ({
            id: s.id,
            title: s.title,
            category: s.category,
            description: s.description,
            optionA: {
              name: s.option_a.name,
              details: s.option_a.details,
              exposureScore: s.option_a.exposure_score,
              emissionsKgCo2: s.option_a.emissions_kg_co2,
              timeMinutes: s.option_a.time_minutes,
              costInr: s.option_a.cost_inr,
              healthTradeoff: s.option_a.health_tradeoff
            },
            optionB: {
              name: s.option_b.name,
              details: s.option_b.details,
              exposureScore: s.option_b.exposure_score,
              emissionsKgCo2: s.option_b.emissions_kg_co2,
              timeMinutes: s.option_b.time_minutes,
              costInr: s.option_b.cost_inr,
              healthTradeoff: s.option_b.health_tradeoff
            },
            aiVerdict: s.ai_verdict,
            tradeoffAnalysis: s.tradeoff_analysis,
            exposureReductionPercent: s.exposure_reduction_percent,
            emissionsDeltaKg: s.emissions_delta_kg
          }));
        }
      }
    } catch {}
    return [...this.scenarios];
  }

  static async runScenarioSimulation(scenarioId: string, customParams?: any): Promise<WhatIfScenario> {
    const sc = this.scenarios.find(s => s.id === scenarioId) || this.scenarios[0];
    try {
      const res = await fetchWithTimeout(`${BACKEND_BASE_URL}/scenarios/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario_id: scenarioId,
          distance_km: customParams?.distanceKm || 14.0,
          wind_condition_modifier: customParams?.windModifier || 1.0
        })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return {
            ...sc,
            exposureReductionPercent: json.data.adjusted_reduction_percent,
            emissionsDeltaKg: json.data.adjusted_emissions_delta_kg
          };
        }
      }
    } catch {}

    if (customParams) {
      return {
        ...sc,
        exposureReductionPercent: Math.min(95, Math.max(15, sc.exposureReductionPercent + (customParams.windBonus ? 10 : 0)))
      };
    }
    return { ...sc };
  }

  // Community
  static async getCommunity(): Promise<CommunityMission[]> {
    try {
      const res = await fetchWithTimeout(`${BACKEND_BASE_URL}/community`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data.challenges) {
          return json.data.challenges.map((c: any) => ({
            id: c.id,
            title: c.title,
            description: c.description,
            scope: c.scope,
            totalGoal: c.total_goal,
            currentProgress: c.current_progress,
            unit: c.unit,
            participantsCount: c.participants_count,
            daysRemaining: c.days_remaining,
            joined: c.joined,
            completedByMe: c.completed_by_me,
            estimatedEmissionsAvoidedKg: c.estimated_emissions_avoided_kg,
            methodologyNote: c.methodology_note
          }));
        }
      }
    } catch {}
    return [...this.missions];
  }

  static async toggleJoinMission(missionId: string): Promise<CommunityMission[]> {
    this.missions = this.missions.map(m =>
      m.id === missionId ? {
        ...m,
        joined: !m.joined,
        participantsCount: m.joined ? m.participantsCount - 1 : m.participantsCount + 1
      } : m
    );
    try {
      await fetchWithTimeout(`${BACKEND_BASE_URL}/community/challenges/${missionId}/join`, { method: 'POST' });
    } catch {}
    return [...this.missions];
  }

  static async completeMissionStep(missionId: string): Promise<CommunityMission[]> {
    this.missions = this.missions.map(m =>
      m.id === missionId ? {
        ...m,
        completedByMe: true,
        currentProgress: Math.min(m.totalGoal, m.currentProgress + 1),
        estimatedEmissionsAvoidedKg: Number((m.estimatedEmissionsAvoidedKg + 1.2).toFixed(1))
      } : m
    );
    try {
      await fetchWithTimeout(`${BACKEND_BASE_URL}/community/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challenge_id: missionId, action_type: 'step_completed' })
      });
    } catch {}
    return [...this.missions];
  }

  // Notifications
  static async getNotifications(): Promise<AirwiseNotification[]> {
    try {
      const res = await fetchWithTimeout(`${BACKEND_BASE_URL}/notifications`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data.map((n: any) => ({
            id: n.id,
            type: n.type,
            title: n.title,
            message: n.message,
            time: n.created_at,
            read: n.is_read,
            severity: n.severity
          }));
        }
      }
    } catch {}
    return [...this.notifications];
  }

  static async markNotificationRead(id: string): Promise<AirwiseNotification[]> {
    this.notifications = this.notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    try {
      await fetchWithTimeout(`${BACKEND_BASE_URL}/notifications/${id}/read`, { method: 'POST' });
    } catch {}
    return [...this.notifications];
  }

  static async markAllNotificationsRead(): Promise<AirwiseNotification[]> {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
    try {
      await fetchWithTimeout(`${BACKEND_BASE_URL}/notifications/read-all`, { method: 'POST' });
    } catch {}
    return [...this.notifications];
  }

  // AI Assistant Contextual Reasoning
  static async queryAirwiseAI(prompt: string, context: {
    location: string;
    aqi: number;
    routine: UserRoutineProfile;
    activeScreen?: string;
  }): Promise<{
    answer: string;
    actionableCard?: {
      title: string;
      category: string;
      actionText: string;
      reductionImpact: string;
    };
    confidenceScore: number;
    sourceCitation: string;
    medicalDisclaimer: string;
  }> {
    try {
      const res = await fetchWithTimeout(`${BACKEND_BASE_URL}/ai/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          context: {
            location: context.location,
            aqi: context.aqi,
            primary_pollutant: 'pm25',
            weather_condition: 'Hazy',
            commute_mode: context.routine.primaryTransport || 'Metro',
            has_vulnerable_members: true,
            budget_mode: 'zero-budget',
            active_screen: context.activeScreen
          }
        })
      }, 10000);

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          return {
            answer: d.summary + (d.explanation ? `\n\n${d.explanation}` : ''),
            actionableCard: d.actionable_card ? {
              title: d.actionable_card.title,
              category: d.actionable_card.category,
              actionText: d.actionable_card.action_text,
              reductionImpact: d.actionable_card.reduction_impact
            } : undefined,
            confidenceScore: d.confidence_score || 94,
            sourceCitation: (d.sources && d.sources.length) ? d.sources.join('; ') : 'AIRWISE Climate Intelligence Engine',
            medicalDisclaimer: d.medical_disclaimer
          };
        }
      }
    } catch {}

    // Fallback deterministic logic
    const p = prompt.toLowerCase();
    if (p.includes('exercise') || p.includes('run') || p.includes('workout')) {
      return {
        answer: `Outdoor running under current ${context.aqi} AQI in ${context.location} is not advisable. Deep aerobic ventilation (60–80 L/min) would deliver ~140 µg of particulate mass deep into your lower airways within 35 minutes. Shift your workout to an indoor mobility session or wait for the 1:30 PM atmospheric boundary layer lift.`,
        actionableCard: {
          title: 'Shift 6:00 PM Run to Indoor HIIT',
          category: 'Health Adaptation',
          actionText: 'Apply to today’s schedule',
          reductionImpact: '81% lower inhaled particulate dose'
        },
        confidenceScore: 94,
        sourceCitation: 'WHO Ambient Air Guidelines & Exercise Respiratory Deposition Models',
        medicalDisclaimer: 'This environmental adaptation guidance does not replace clinical consultation for pre-existing respiratory conditions.'
      };
    }

    if (p.includes('ventilate') || p.includes('window') || p.includes('fresh air')) {
      return {
        answer: `Do not ventilate now. A ground-level thermal inversion is currently trapping emissions near the surface. The cleanest atmospheric window today opens between 1:00 PM and 2:15 PM, where solar convective heating pushes the boundary layer to ~1,200m and disperses fine particulates. Keep windows tightly shut until then.`,
        actionableCard: {
          title: 'Schedule 1:30 PM Micro-Ventilation (15 mins)',
          category: 'Indoor Air',
          actionText: 'Set reminder alert',
          reductionImpact: 'Flushes indoor CO2 with 61% less particulate intrusion'
        },
        confidenceScore: 91,
        sourceCitation: 'Diurnal Boundary Layer Dispersion Models & CPCB Local Station Feed',
        medicalDisclaimer: 'Keep windows sealed if vulnerable elderly or infant family members are resting near outer walls.'
      };
    }

    return {
      answer: `Given today’s ${context.aqi} AQI in ${context.location}, your primary exposure spikes will happen during the 8:30 AM commute and the 6:00 PM workout. Your Metro transit choice is sound (+73% cleaner than road travel). We recommend shifting your evening exercise indoors and delaying home window ventilation to 1:30 PM.`,
      actionableCard: {
        title: 'Apply 3 Priority Day Adjustments',
        category: 'Daily Adaptation',
        actionText: 'Update today’s itinerary',
        reductionImpact: 'Reduces 24-hr personal inhalation load by 58%'
      },
      confidenceScore: 93,
      sourceCitation: 'Airwise Personal Exposure Synthesis Engine (Deterministic)',
      medicalDisclaimer: 'AIRWISE provides environmental decision intelligence and does not provide formal medical diagnosis.'
    };
  }
}
