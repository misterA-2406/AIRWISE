export type RiskLevel = 'low' | 'moderate' | 'high' | 'severe';

export type AQIStandard = 'US_AQI' | 'IN_NAAQS' | 'WHO_2021';

export type TimeWindow = 
  | 'before-leaving'
  | 'commute-morning'
  | 'work-study'
  | 'lunch'
  | 'afternoon'
  | 'commute-evening'
  | 'outdoor-activities'
  | 'returning-home'
  | 'evening'
  | 'sleep';

export type EffortLevel = 'Low' | 'Medium' | 'High';

export type CostLevel = '₹0 Free' | 'Low-cost' | 'Optional Expense';

export interface PollutantValues {
  pm25: number;   // µg/m³
  pm10: number;   // µg/m³
  o3: number;     // ppb
  no2: number;    // ppb
  co: number;     // ppm
  so2: number;    // ppb
}

export interface WeatherData {
  temperature: number; // °C
  humidity: number;    // %
  windSpeed: number;   // km/h
  windDirection: string;
  condition: string;
  uvIndex: number;
}

export interface AirQualityData {
  aqi: number;
  standard: AQIStandard;
  riskLevel: RiskLevel;
  primaryPollutant: keyof PollutantValues;
  pollutants: PollutantValues;
  weather: WeatherData;
  timestamp: string;
  confidenceScore: number; // 0-100%
  activeSensors: number;
  outdoorRecommendation: string;
  healthAdvisory: string;
  locationName: string;
  subArea: string;
  isDemo: boolean;
}

export interface HourlyForecast {
  hour: string;
  aqi: number;
  riskLevel: RiskLevel;
  pm25: number;
  windSpeed: number;
  label?: string;
}

export interface DailyForecast {
  day: string;
  avgAqi: number;
  peakAqi: number;
  riskLevel: RiskLevel;
  dominantCondition: string;
}

export interface PlanAction {
  id: string;
  period: TimeWindow;
  timeLabel: string;
  title: string;
  whyToday: string;
  personalRelevance: string;
  cost: CostLevel;
  costNumeric: number;
  effort: EffortLevel;
  alternative: string;
  impact: string;
  category: 'Commute' | 'Indoor Air' | 'Health' | 'Schedule' | 'Routine';
  isCompleted: boolean;
  isSaved: boolean;
  isSkipped: boolean;
  confidenceReason?: string;
}

export interface RoutineActivity {
  id: string;
  time: string;
  name: string;
  type: 'commute' | 'work' | 'exercise' | 'meal' | 'indoor' | 'outdoor' | 'rest';
  location: string;
  transport?: 'Metro' | 'Cycling' | 'Walking' | 'Bus' | 'Car' | 'None';
  isFlexible: boolean;
  exposureRisk: RiskLevel;
}

export interface UserRoutineProfile {
  name: string;
  homeLocation: string;
  workLocation: string;
  primaryTransport: 'Metro' | 'Bus' | 'Cycling' | 'Walking' | 'Car' | 'Motorbike';
  commuteMinutes: number;
  exerciseTime: 'Early Morning' | 'Late Afternoon' | 'Evening' | 'Indoor Only';
  exerciseType: 'Running' | 'Gym' | 'Yoga / Home' | 'Cycling' | 'Walking';
  householdSize: number;
  vulnerableMembers: {
    children: boolean;
    elderly: boolean;
    asthmaOrAllergies: boolean;
    cardiacHistory: boolean;
  };
  homeVentilation: 'Cross-ventilation windows' | 'Single side windows' | 'Central HVAC' | 'Balcony doors only';
  airPurifierOwned: boolean;
  cookingFuel: 'LPG Gas' | 'Induction / Electric' | 'Piped Natural Gas' | 'Traditional Solid Fuel';
  commonIndoorSources: string[];
  budgetPreference: 'zero-budget' | 'practical' | 'unrestricted';
  activities: RoutineActivity[];
}

export interface IndoorSourceCheck {
  id: string;
  source: string;
  detectedOrReported: boolean;
  impactLevel: 'low' | 'moderate' | 'high' | 'severe';
  typicalPollutant: string;
  freeMitigation: string;
  paidMitigation?: string;
}

export interface IndoorRecommendation {
  id: string;
  timeframe: 'Immediate' | 'Today' | 'This Week' | 'Long-term';
  title: string;
  cost: CostLevel;
  costNumeric: number;
  effort: EffortLevel;
  reason: string;
  expectedUsefulness: string;
  limitations: string;
  isZeroBudgetEligible: boolean;
  isImplemented: boolean;
}

export interface WhatIfScenario {
  id: string;
  title: string;
  category: 'Commute' | 'Exercise' | 'Ventilation' | 'Route' | 'Cooking' | 'Purification';
  description: string;
  optionA: {
    name: string;
    details: string;
    exposureScore: number; // 0-100 (higher = worse exposure)
    emissionsKgCo2: number;
    timeMinutes: number;
    costInr: number;
    healthTradeoff: string;
  };
  optionB: {
    name: string;
    details: string;
    exposureScore: number;
    emissionsKgCo2: number;
    timeMinutes: number;
    costInr: number;
    healthTradeoff: string;
  };
  aiVerdict: string;
  tradeoffAnalysis: string;
  exposureReductionPercent: number;
  emissionsDeltaKg: number;
}

export interface CommunityMission {
  id: string;
  title: string;
  description: string;
  scope: 'Apartment' | 'Neighborhood' | 'Campus' | 'Family';
  totalGoal: number;
  currentProgress: number;
  unit: string;
  participantsCount: number;
  daysRemaining: number;
  joined: boolean;
  completedByMe: boolean;
  estimatedEmissionsAvoidedKg: number;
  methodologyNote: string;
}

export interface AirwiseNotification {
  id: string;
  type: 'peak_alert' | 'ventilation' | 'plan_ready' | 'community' | 'tip';
  title: string;
  message: string;
  time: string;
  read: boolean;
  severity: 'info' | 'warning' | 'alert';
}

export interface LocationOption {
  id: string;
  name: string;
  subArea: string;
  country: string;
  aqi: number;
  riskLevel: RiskLevel;
  primary: keyof PollutantValues;
}
