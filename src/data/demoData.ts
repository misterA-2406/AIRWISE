import { 
  AirQualityData, 
  HourlyForecast, 
  DailyForecast, 
  PlanAction, 
  UserRoutineProfile, 
  IndoorSourceCheck, 
  IndoorRecommendation, 
  WhatIfScenario, 
  CommunityMission, 
  AirwiseNotification,
  LocationOption 
} from '../types';

export const DEMO_LOCATIONS: LocationOption[] = [
  {
    id: 'delhi',
    name: 'Delhi NCR',
    subArea: 'Anand Vihar & South Ext',
    country: 'India',
    aqi: 284,
    riskLevel: 'severe',
    primary: 'pm25'
  },
  {
    id: 'london',
    name: 'London',
    subArea: 'Marylebone Road / Southwark',
    country: 'United Kingdom',
    aqi: 68,
    riskLevel: 'moderate',
    primary: 'no2'
  },
  {
    id: 'newyork',
    name: 'New York City',
    subArea: 'Midtown Manhattan & Queens',
    country: 'United States',
    aqi: 45,
    riskLevel: 'low',
    primary: 'o3'
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    subArea: 'Shinjuku & Shibuya basin',
    country: 'Japan',
    aqi: 32,
    riskLevel: 'low',
    primary: 'pm25'
  },
  {
    id: 'jakarta',
    name: 'Jakarta',
    subArea: 'Central Jakarta & Rawamangun',
    country: 'Indonesia',
    aqi: 168,
    riskLevel: 'high',
    primary: 'pm25'
  }
];

export const INITIAL_AIR_DATA: Record<string, AirQualityData> = {
  delhi: {
    aqi: 284,
    standard: 'IN_NAAQS',
    riskLevel: 'severe',
    primaryPollutant: 'pm25',
    pollutants: {
      pm25: 198.4,
      pm10: 312.0,
      o3: 38.2,
      no2: 84.5,
      co: 2.8,
      so2: 18.3
    },
    weather: {
      temperature: 24,
      humidity: 68,
      windSpeed: 4.8,
      windDirection: 'NW (Inversion Layer)',
      condition: 'Atmospheric Haze & Calm Winds',
      uvIndex: 4
    },
    timestamp: 'Today at 08:30 AM (Station Sync)',
    confidenceScore: 94,
    activeSensors: 14,
    outdoorRecommendation: 'Avoid strenuous outdoor activities; shift workouts indoors and wear certified N95 for road commutes.',
    healthAdvisory: 'Micro-fine particulates can penetrate deep alveolar tissue. Vulnerable members should strictly maintain indoor filtered air.',
    locationName: 'Delhi NCR',
    subArea: 'Anand Vihar & South Ext',
    isDemo: true
  },
  london: {
    aqi: 68,
    standard: 'WHO_2021',
    riskLevel: 'moderate',
    primaryPollutant: 'no2',
    pollutants: {
      pm25: 14.2,
      pm10: 24.1,
      o3: 42.0,
      no2: 56.4,
      co: 0.6,
      so2: 5.1
    },
    weather: {
      temperature: 15,
      humidity: 78,
      windSpeed: 16.2,
      windDirection: 'SW (Breezy oceanic)',
      condition: 'Overcast with roadside vehicle emissions',
      uvIndex: 2
    },
    timestamp: 'Today at 08:30 AM (Station Sync)',
    confidenceScore: 96,
    activeSensors: 28,
    outdoorRecommendation: 'Moderate air quality. Sensitive individuals should avoid prolonged exposure along heavily trafficked arterial corridors.',
    healthAdvisory: 'Nitrogen dioxide levels peaked near major ring roads. Quiet backstreets offer 40% lower particulate exposure.',
    locationName: 'London',
    subArea: 'Marylebone Road / Southwark',
    isDemo: true
  },
  newyork: {
    aqi: 45,
    standard: 'US_AQI',
    riskLevel: 'low',
    primaryPollutant: 'o3',
    pollutants: {
      pm25: 8.5,
      pm10: 16.0,
      o3: 38.0,
      no2: 21.0,
      co: 0.4,
      so2: 3.2
    },
    weather: {
      temperature: 19,
      humidity: 55,
      windSpeed: 11.4,
      windDirection: 'NE (Coastal dispersion)',
      condition: 'Clear sky, high dispersion index',
      uvIndex: 6
    },
    timestamp: 'Today at 08:30 AM (Station Sync)',
    confidenceScore: 98,
    activeSensors: 32,
    outdoorRecommendation: 'Air quality is favorable for all regular outdoor activities, sports, and home ventilation.',
    healthAdvisory: 'Low environmental health risk. Great window for morning and evening outdoor cross-ventilation.',
    locationName: 'New York City',
    subArea: 'Midtown Manhattan & Queens',
    isDemo: true
  },
  tokyo: {
    aqi: 32,
    standard: 'WHO_2021',
    riskLevel: 'low',
    primaryPollutant: 'pm25',
    pollutants: {
      pm25: 6.8,
      pm10: 12.2,
      o3: 26.0,
      no2: 18.0,
      co: 0.3,
      so2: 2.1
    },
    weather: {
      temperature: 17,
      humidity: 52,
      windSpeed: 8.5,
      windDirection: 'SE (Tokyo Bay Breeze)',
      condition: 'Clean maritime airflow',
      uvIndex: 5
    },
    timestamp: 'Today at 08:30 AM (Station Sync)',
    confidenceScore: 99,
    activeSensors: 40,
    outdoorRecommendation: 'Ideal conditions for cycling, jogging, and natural home aeration.',
    healthAdvisory: 'Minimal airborne risk. Optimal baseline for active green transit.',
    locationName: 'Tokyo',
    subArea: 'Shinjuku & Shibuya basin',
    isDemo: true
  },
  jakarta: {
    aqi: 168,
    standard: 'US_AQI',
    riskLevel: 'high',
    primaryPollutant: 'pm25',
    pollutants: {
      pm25: 88.5,
      pm10: 142.0,
      o3: 45.0,
      no2: 48.0,
      co: 1.6,
      so2: 12.0
    },
    weather: {
      temperature: 31,
      humidity: 82,
      windSpeed: 6.0,
      windDirection: 'Calm / Trapped humidity',
      condition: 'Humid haze with thermal trapping',
      uvIndex: 8
    },
    timestamp: 'Today at 08:30 AM (Station Sync)',
    confidenceScore: 91,
    activeSensors: 19,
    outdoorRecommendation: 'Elevated pollution during midday and commuter peaks. Reduce prolonged physical exertion outdoors.',
    healthAdvisory: 'Elevated PM2.5 may aggravate respiratory and allergic symptoms. Close street-facing windows during peak traffic.',
    locationName: 'Jakarta',
    subArea: 'Central Jakarta & Rawamangun',
    isDemo: true
  }
};

export const HOURLY_TIMELINE_DATA: HourlyForecast[] = [
  { hour: '06:00', aqi: 310, riskLevel: 'severe', pm25: 220, windSpeed: 2.1, label: 'Morning Inversion Peak' },
  { hour: '08:00', aqi: 284, riskLevel: 'severe', pm25: 198, windSpeed: 3.5, label: 'Morning Commute' },
  { hour: '10:00', aqi: 235, riskLevel: 'high', pm25: 160, windSpeed: 5.2, label: 'Solar Heating Lift' },
  { hour: '12:00', aqi: 185, riskLevel: 'high', pm25: 110, windSpeed: 7.8, label: 'Midday Dispersion' },
  { hour: '14:00', aqi: 145, riskLevel: 'moderate', pm25: 75, windSpeed: 8.5, label: 'Best Aeration Window' },
  { hour: '16:00', aqi: 172, riskLevel: 'moderate', pm25: 92, windSpeed: 6.1, label: 'Pre-Rush Rebound' },
  { hour: '18:00', aqi: 248, riskLevel: 'high', pm25: 168, windSpeed: 3.8, label: 'Evening Traffic Spike' },
  { hour: '20:00', aqi: 295, riskLevel: 'severe', pm25: 210, windSpeed: 2.4, label: 'Nocturnal Boundary Drop' },
  { hour: '22:00', aqi: 320, riskLevel: 'severe', pm25: 235, windSpeed: 1.8, label: 'Overnight Stagnation' }
];

export const DAILY_FORECAST_DATA: DailyForecast[] = [
  { day: 'Today (Fri)', avgAqi: 245, peakAqi: 320, riskLevel: 'severe', dominantCondition: 'Trapped fine particulates & low wind' },
  { day: 'Tomorrow (Sat)', avgAqi: 210, peakAqi: 275, riskLevel: 'high', dominantCondition: 'Slight westerly breeze in late afternoon' },
  { day: 'Sun', avgAqi: 165, peakAqi: 215, riskLevel: 'high', dominantCondition: 'Reduced industrial & commercial transit' },
  { day: 'Mon', avgAqi: 230, peakAqi: 290, riskLevel: 'severe', dominantCondition: 'Weekday commute surge and stagnant thermal inversion' },
  { day: 'Tue', avgAqi: 190, peakAqi: 240, riskLevel: 'high', dominantCondition: 'Passing cloud cover with slight turbulent mixing' }
];

export const INITIAL_PLAN_ACTIONS: PlanAction[] = [
  {
    id: 'act-1',
    period: 'before-leaving',
    timeLabel: '07:30 AM',
    title: 'Keep street-facing windows sealed; run quick filter purge',
    whyToday: 'Morning ground inversion has pinned fine particulates at breathing height (AQI 284).',
    personalRelevance: 'Your apartment faces a secondary collector road with early bus congestion.',
    cost: '₹0 Free',
    costNumeric: 0,
    effort: 'Low',
    alternative: 'If room feels stuffy, open only rear courtyard windows for 5 minutes max.',
    impact: 'Avoids admitting an estimated 40-60 µg/m³ spike of outdoor particulate into living quarters.',
    category: 'Indoor Air',
    isCompleted: true,
    isSaved: true,
    isSkipped: false,
    confidenceReason: 'Measured outdoor PM2.5 is 4.8x higher than typical morning room baseline.'
  },
  {
    id: 'act-2',
    period: 'commute-morning',
    timeLabel: '08:45 AM',
    title: 'Opt for Underground Metro or AC Bus with recirculating air',
    whyToday: 'Arterial ring road exhaust levels are peaking between 08:30 and 10:00 AM.',
    personalRelevance: 'You normally commute 42 minutes; open motorbike or rickshaw exposure would be intense.',
    cost: '₹0 Free',
    costNumeric: 0,
    effort: 'Medium',
    alternative: 'If riding two-wheeler, wear an airtight N95/FFP2 mask and avoid diesel bus slipstreams.',
    impact: 'Reduces in-transit particulate inhalation by up to 65% compared to open-air road travel.',
    category: 'Commute',
    isCompleted: false,
    isSaved: true,
    isSkipped: false,
    confidenceReason: 'In-cabin filtered vehicle transit cuts direct exposure to tailpipe black carbon.'
  },
  {
    id: 'act-3',
    period: 'work-study',
    timeLabel: '11:30 AM',
    title: 'Hold 1-on-1 discussion in central atrium rather than outdoor terrace',
    whyToday: 'Midday sunshine hasn’t yet dispersed the lower boundary layer sufficiently.',
    personalRelevance: 'Your schedule has a 30-min walking meeting penciled in before lunch.',
    cost: '₹0 Free',
    costNumeric: 0,
    effort: 'Low',
    alternative: 'Sit near indoor botanical green wall if available in office lobby.',
    impact: 'Protects vocal cords and respiratory tract from unforced particulate irritation.',
    category: 'Schedule',
    isCompleted: false,
    isSaved: false,
    isSkipped: false,
    confidenceReason: 'Indoor filtered building envelope maintains AQI under 55.'
  },
  {
    id: 'act-4',
    period: 'lunch',
    timeLabel: '01:30 PM',
    title: 'Optimal 20-minute terrace walk window (Atmospheric lift peak)',
    whyToday: 'Midday solar thermal updrafts temporarily lower breathing-zone PM2.5 to 75 µg/m³.',
    personalRelevance: 'You logged a daily desire for at least 3,000 steps of daylight movement.',
    cost: '₹0 Free',
    costNumeric: 0,
    effort: 'Low',
    alternative: 'Indoor corridor laps if you experience allergic eye itchiness today.',
    impact: 'Safest outdoor window of the entire 24-hour cycle today.',
    category: 'Routine',
    isCompleted: false,
    isSaved: true,
    isSkipped: false,
    confidenceReason: 'Boundary layer height is currently at maximum 1,200m before evening descent.'
  },
  {
    id: 'act-5',
    period: 'outdoor-activities',
    timeLabel: '06:15 PM',
    title: 'Shift planned 5km outdoor run to indoor bodyweight circuit',
    whyToday: 'Evening rush hour + descending temperature inversion creates a dangerous particulate trap (AQI 248-295).',
    personalRelevance: 'Deep aerobic breathing during intense running increases lung air volume by 600%.',
    cost: '₹0 Free',
    costNumeric: 0,
    effort: 'Medium',
    alternative: 'Do a 25-minute indoor mobility and core workout in a closed room with air purifier or damp floor wipe.',
    impact: 'Avoids an estimated 140 µg of deep alveolar particulate deposition compared to a street run.',
    category: 'Health',
    isCompleted: false,
    isSaved: true,
    isSkipped: false,
    confidenceReason: 'High ventilation rates in severe ambient air drastically escalate cardio-pulmonary strain.'
  },
  {
    id: 'act-6',
    period: 'returning-home',
    timeLabel: '07:45 PM',
    title: 'Take back-alley residential connector instead of arterial highway',
    whyToday: 'Heavy diesel trucks enter perimeter bypass at 07:00 PM.',
    personalRelevance: 'Your route home has a 1.2km bypass lane that avoids the standstill flyover bottleneck.',
    cost: '₹0 Free',
    costNumeric: 0,
    effort: 'Low',
    alternative: 'Travel 20 minutes later after initial 8 PM bottleneck dissolves.',
    impact: 'Local microclimate measurements show 35% lower NOx concentrations away from standstill lines.',
    category: 'Commute',
    isCompleted: false,
    isSaved: false,
    isSkipped: false,
    confidenceReason: 'Stagnant stop-and-go diesel traffic concentrates ultra-fine particles at windshield level.'
  },
  {
    id: 'act-7',
    period: 'evening',
    timeLabel: '08:30 PM',
    title: 'Operate kitchen chimney or window exhaust while frying / tempering',
    whyToday: 'High indoor frying temperatures generate VOCs and ultrafine PM2.5 up to 450 µg/m³ indoors without exhaust.',
    personalRelevance: 'Household profile mentions regular evening hot oil cooking.',
    cost: '₹0 Free',
    costNumeric: 0,
    effort: 'Low',
    alternative: 'Cover cooking pans with lids and crack kitchen utility door away from bedrooms.',
    impact: 'Evacuates cooking aerosol before it diffuses into children’s and sleeping areas.',
    category: 'Indoor Air',
    isCompleted: false,
    isSaved: true,
    isSkipped: false,
    confidenceReason: 'Cooking oil aerosol is among the highest indoor particle contributors.'
  },
  {
    id: 'act-8',
    period: 'sleep',
    timeLabel: '10:30 PM',
    title: 'Place damp clean towel near bedroom door sill & keep bedroom enclosed',
    whyToday: 'Nighttime inversion will push ambient pollution to 320+ between 2 AM and 5 AM.',
    personalRelevance: 'You indicated a child in the second bedroom with mild morning nasal congestion.',
    cost: '₹0 Free',
    costNumeric: 0,
    effort: 'Low',
    alternative: 'Run bedroom air purifier on quiet night mode; seal window gap with masking tape.',
    impact: 'Cuts overnight particulate infiltration through floor gaps by up to 30%.',
    category: 'Indoor Air',
    isCompleted: false,
    isSaved: true,
    isSkipped: false,
    confidenceReason: 'Zero-cost draft sealing restricts nocturnal cool air draft infiltration.'
  }
];

export const INITIAL_USER_ROUTINE: UserRoutineProfile = {
  name: 'Aarav Sharma',
  homeLocation: 'South Extension, Delhi',
  workLocation: 'Cyber Hub / Connaught Place',
  primaryTransport: 'Metro',
  commuteMinutes: 38,
  exerciseTime: 'Evening',
  exerciseType: 'Running',
  householdSize: 4,
  vulnerableMembers: {
    children: true,
    elderly: true,
    asthmaOrAllergies: true,
    cardiacHistory: false
  },
  homeVentilation: 'Cross-ventilation windows',
  airPurifierOwned: true,
  cookingFuel: 'LPG Gas',
  commonIndoorSources: ['Cooking fumes', 'Incense sticks (Agarbatti)', 'Street dust from windows'],
  budgetPreference: 'zero-budget',
  activities: [
    { id: 'act-r1', time: '06:30 - 07:15', name: 'Morning wake-up & tea', type: 'indoor', location: 'Home Kitchen', isFlexible: false, exposureRisk: 'moderate' },
    { id: 'act-r2', time: '08:30 - 09:15', name: 'Commute to Office', type: 'commute', location: 'Metro Yellow Line', transport: 'Metro', isFlexible: true, exposureRisk: 'high' },
    { id: 'act-r3', time: '09:30 - 13:00', name: 'Work at Desk', type: 'work', location: 'Office Tower (HEPA HVAC)', isFlexible: false, exposureRisk: 'low' },
    { id: 'act-r4', time: '13:00 - 13:45', name: 'Lunch & Steps', type: 'meal', location: 'Office Garden Walkway', isFlexible: true, exposureRisk: 'moderate' },
    { id: 'act-r5', time: '14:00 - 18:00', name: 'Focus Work & Calls', type: 'work', location: 'Office Floor 4', isFlexible: false, exposureRisk: 'low' },
    { id: 'act-r6', time: '18:15 - 19:00', name: 'Return Commute', type: 'commute', location: 'Metro + Last Mile Auto', transport: 'Metro', isFlexible: true, exposureRisk: 'high' },
    { id: 'act-r7', time: '19:30 - 20:15', name: 'Cardio / Workout', type: 'exercise', location: 'Local Park (Flagged)', isFlexible: true, exposureRisk: 'severe' },
    { id: 'act-r8', time: '20:30 - 22:30', name: 'Dinner & Family time', type: 'indoor', location: 'Living Room', isFlexible: false, exposureRisk: 'low' }
  ]
};

export const INDOOR_SOURCE_CHECKLIST: IndoorSourceCheck[] = [
  {
    id: 'chk-1',
    source: 'Incense (Agarbatti) & Dhoop',
    detectedOrReported: true,
    impactLevel: 'severe',
    typicalPollutant: 'High VOCs, Benzene & PM2.5 (>250 µg/m³ in room)',
    freeMitigation: 'Substitute with aromatic dried natural herbs, essential oil reed diffuser, or open-air balcony placement.',
    paidMitigation: 'Flameless ceramic aroma stone or active carbon room purifier.'
  },
  {
    id: 'chk-2',
    source: 'Cooking Fumes & Hot Oil Tadka',
    detectedOrReported: true,
    impactLevel: 'high',
    typicalPollutant: 'Acrolein, ultrafine combustion grease particles',
    freeMitigation: 'Always switch on exhaust 2 min prior to lighting stove; keep kitchen doors shut to isolate bedrooms; cover pans.',
    paidMitigation: 'High-suction baffle filter chimney (1200+ m³/hr).'
  },
  {
    id: 'chk-3',
    source: 'Mosquito Coils & Liquid Vaporizers',
    detectedOrReported: true,
    impactLevel: 'high',
    typicalPollutant: 'Allethrin, micro-soot comparable to 70-100 cigarettes per coil',
    freeMitigation: 'Fit fine mesh wire screens on windows; use magnetic doorway fly curtains and safe bed nets.',
    paidMitigation: 'UV bug zappers or electric ultrasonic deterrents.'
  },
  {
    id: 'chk-4',
    source: 'Street Dust & Peak Outdoor Infiltration',
    detectedOrReported: true,
    impactLevel: 'high',
    typicalPollutant: 'Silica, heavy-metal vehicular brake dust, coarse PM10',
    freeMitigation: 'Damp-wipe surfaces rather than dry sweeping; place damp washable mats at outside doors; close street-facing windows 7-10 AM & 6-10 PM.',
    paidMitigation: 'Silicone weather-stripping tape along window frame gaps.'
  },
  {
    id: 'chk-5',
    source: 'Synthetic Air Fresheners & Aerosol Sprays',
    detectedOrReported: false,
    impactLevel: 'moderate',
    typicalPollutant: 'Phthalates, terpene reacting with ozone to generate secondary particles',
    freeMitigation: 'Discontinue pressurized synthetic sprays; simmer cinnamon bark and citrus peels on stove for 5 min.',
    paidMitigation: 'Zeolite mineral odor-absorbing bags.'
  },
  {
    id: 'chk-6',
    source: 'Candles & Open Wick Flames',
    detectedOrReported: false,
    impactLevel: 'moderate',
    typicalPollutant: 'Paraffin black soot, polycyclic hydrocarbons',
    freeMitigation: 'Trim wicks to 5mm; avoid drafty flickering spots; replace with LED ambient illumination.',
    paidMitigation: '100% pure beeswax or soy-based clean wicks.'
  }
];

export const INDOOR_PRACTICAL_ACTIONS: IndoorRecommendation[] = [
  {
    id: 'ind-1',
    timeframe: 'Immediate',
    title: 'Switch on kitchen exhaust 3 minutes before cooking and run 5 minutes after',
    cost: '₹0 Free',
    costNumeric: 0,
    effort: 'Low',
    reason: 'Pre-establishes a negative pressure gradient, preventing VOCs from escaping into sleeping quarters.',
    expectedUsefulness: 'Eliminates up to 70% of grease and particulate migration.',
    limitations: 'Requires functional exhaust fan or chimney.',
    isZeroBudgetEligible: true,
    isImplemented: true
  },
  {
    id: 'ind-2',
    timeframe: 'Immediate',
    title: 'Adopt "Micro-Ventilation" during today’s 1:30 PM solar peak',
    cost: '₹0 Free',
    costNumeric: 0,
    effort: 'Low',
    reason: 'Ambient outdoor air is at its cleanest daily window (AQI 145 vs morning 310). Stale indoor CO2 needs purging.',
    expectedUsefulness: 'Flushes out indoor stale carbon dioxide without flooding room with heavy soot.',
    limitations: 'Only keep open for 15-20 minutes maximum.',
    isZeroBudgetEligible: true,
    isImplemented: false
  },
  {
    id: 'ind-3',
    timeframe: 'Today',
    title: 'Switch from dry broom sweeping to wet micro-fiber mopping',
    cost: '₹0 Free',
    costNumeric: 0,
    effort: 'Low',
    reason: 'Dry brooms resuspend settled toxic fine dust back into the breathing zone for up to 2 hours.',
    expectedUsefulness: 'Captures floor particulate safely with zero resuspension.',
    limitations: 'Takes slightly longer to dry in humid weather.',
    isZeroBudgetEligible: true,
    isImplemented: true
  },
  {
    id: 'ind-4',
    timeframe: 'Today',
    title: 'Designate the bedroom as a strict "Clean Air Sanctuary"',
    cost: '₹0 Free',
    costNumeric: 0,
    effort: 'Low',
    reason: 'Adults and children spend 7-9 hours sleeping in one static breathing zone.',
    expectedUsefulness: 'Keeping one room strictly isolated reduces 35% of total 24-hr personal exposure load.',
    limitations: 'Room door must remain pulled shut when people enter and leave.',
    isZeroBudgetEligible: true,
    isImplemented: false
  },
  {
    id: 'ind-5',
    timeframe: 'This Week',
    title: 'Install self-adhesive foam rubber draft seals around door & window edges',
    cost: 'Low-cost',
    costNumeric: 250,
    effort: 'Medium',
    reason: 'Window perimeter gaps account for up to 45% of passive outdoor pollution seepage during nightly inversions.',
    expectedUsefulness: 'Reduces involuntary night air leakage by 40-50%.',
    limitations: 'Needs reapplying every 12 months in hot climates.',
    isZeroBudgetEligible: false,
    isImplemented: false
  },
  {
    id: 'ind-6',
    timeframe: 'This Week',
    title: 'Make a DIY Clean Air Box (Corsi-Rosenthal principle with pedestal fan)',
    cost: 'Low-cost',
    costNumeric: 950,
    effort: 'Medium',
    reason: 'Achieves high Clean Air Delivery Rate (CADR) at a fraction of branded purifier costs.',
    expectedUsefulness: 'High volume filtration suited for large living rooms.',
    limitations: 'Slightly noisier than brushless commercial purifiers.',
    isZeroBudgetEligible: false,
    isImplemented: false
  },
  {
    id: 'ind-7',
    timeframe: 'Long-term',
    title: 'Transition stove from fossil LPG gas to induction cooktop',
    cost: 'Optional Expense',
    costNumeric: 2800,
    effort: 'Medium',
    reason: 'Gas burners produce unvented NO2, carbon monoxide, and formaldehyde directly inside the kitchen.',
    expectedUsefulness: '100% elimination of indoor combustion byproduct emissions during cooking.',
    limitations: 'Requires induction-compatible cookware and reliable electricity supply.',
    isZeroBudgetEligible: false,
    isImplemented: false
  }
];

export const WHAT_IF_SCENARIOS: WhatIfScenario[] = [
  {
    id: 'sc-1',
    title: 'Commute Choice: Underground Metro vs Open-Air Two-Wheeler',
    category: 'Commute',
    description: 'Compare personal respiratory exposure and transit emissions on your standard 14km peak morning route.',
    optionA: {
      name: 'Open-Air Two-Wheeler (Motorbike)',
      details: 'Riding direct on arterial road behind diesel trucks and stop-and-go traffic.',
      exposureScore: 88,
      emissionsKgCo2: 0.95,
      timeMinutes: 32,
      costInr: 65,
      healthTradeoff: 'Severe direct inhalation of fresh diesel soot and brake dust particles at street level.'
    },
    optionB: {
      name: 'Underground Metro + 5m Walk',
      details: 'Air-conditioned underground train carriage with positive pressure filtration.',
      exposureScore: 24,
      emissionsKgCo2: 0.12,
      timeMinutes: 40,
      costInr: 40,
      healthTradeoff: 'Slightly higher crowd density, but 73% lower toxic combustion aerosol inhalation.'
    },
    aiVerdict: 'The Metro is decisively healthier today. While taking 8 extra minutes, you avoid inhaling an estimated 48 µg of fresh carcinogenic black carbon during the worst inversion peak.',
    tradeoffAnalysis: 'Convenience trade-off is minor (+8 mins), financial cost is 38% lower, and personal toxic exposure drops by nearly three-quarters.',
    exposureReductionPercent: 73,
    emissionsDeltaKg: 0.83
  },
  {
    id: 'sc-2',
    title: 'Workout Decision: 6:00 PM Street Run vs 6:00 PM Indoor HIIT',
    category: 'Exercise',
    description: 'Decide whether to proceed with your scheduled 5km run along the perimeter park or shift indoors.',
    optionA: {
      name: '6:00 PM Outdoor Road Run (5 km)',
      details: 'Continuous aerobic breathing (60-80 L/min) alongside peak evening commute traffic (AQI 260).',
      exposureScore: 94,
      emissionsKgCo2: 0,
      timeMinutes: 35,
      costInr: 0,
      healthTradeoff: 'High respiratory minute volume deposits particulate deep into bronchial bifurcations, triggering systemic vascular inflammation.'
    },
    optionB: {
      name: '6:00 PM Indoor Bodyweight HIIT',
      details: 'High intensity interval training inside a closed room with air purifier or damp floor wipe (AQI ~45).',
      exposureScore: 18,
      emissionsKgCo2: 0,
      timeMinutes: 35,
      costInr: 0,
      healthTradeoff: 'Maintains cardiovascular fitness and VO2 stimulus with minimal particulate lung burden.'
    },
    aiVerdict: 'Indoor HIIT is unequivocally the wiser choice this evening. Aerobic exercise under Severe AQI delivers the particulate equivalent of smoking multiple unfiltered cigarettes directly into dilated alveoli.',
    tradeoffAnalysis: 'Zero financial cost, identical calorie burn (~320 kcal), but an 81% reduction in total inhaled PM2.5 mass.',
    exposureReductionPercent: 81,
    emissionsDeltaKg: 0
  },
  {
    id: 'sc-3',
    title: 'Ventilation Strategy: Open Windows Now vs Post-Lunch Solar Window',
    category: 'Ventilation',
    description: 'Evaluate when to flush stagnant indoor CO2 from living spaces without flooding the house with smoke.',
    optionA: {
      name: 'Open Windows at 08:00 AM',
      details: 'Wide cross-ventilation during morning rush hour and nocturnal inversion trap.',
      exposureScore: 82,
      emissionsKgCo2: 0,
      timeMinutes: 20,
      costInr: 0,
      healthTradeoff: 'Indoor PM2.5 climbs from 35 µg/m³ to 180 µg/m³ within 15 minutes, remaining elevated for 4 hours.'
    },
    optionB: {
      name: 'Open Windows at 01:30 PM (Solar Peak)',
      details: 'Timed 15-minute cross-draft when planetary boundary layer is highest and ambient AQI dips to 145.',
      exposureScore: 32,
      emissionsKgCo2: 0,
      timeMinutes: 15,
      costInr: 0,
      healthTradeoff: 'Flushes CO2 and humidity effectively with 61% less particulate intake than morning airing.'
    },
    aiVerdict: 'Wait until 1:30 PM. Solar heating breaks the night inversion layer, increasing vertical atmospheric dispersion and halving particulate density.',
    tradeoffAnalysis: 'Requires delaying fresh air circulation by a few hours, but saves indoor living areas from persistent toxic smog accumulation.',
    exposureReductionPercent: 61,
    emissionsDeltaKg: 0
  },
  {
    id: 'sc-4',
    title: 'Route Selection: Direct Arterial Ring Road vs Quiet Residential Greenway',
    category: 'Route',
    description: 'Compare cycling or e-rickshaw route along the primary multi-lane road versus quiet neighborhood streets.',
    optionA: {
      name: 'Direct Arterial Ring Road (6.2 km)',
      details: 'Heavy diesel truck traffic, elevated flyover congestion, bumper-to-bumper vehicle tailpipes.',
      exposureScore: 86,
      emissionsKgCo2: 0.4,
      timeMinutes: 22,
      costInr: 0,
      healthTradeoff: 'Direct exposure to unburned hydrocarbons, brake pad dust, and high roadside NO2 spikes.'
    },
    optionB: {
      name: 'Residential Greenway & Service Lanes (7.4 km)',
      details: 'Secondary tree-lined streets separated 150m from arterial corridors by buildings and canopy.',
      exposureScore: 48,
      emissionsKgCo2: 0.45,
      timeMinutes: 28,
      costInr: 0,
      healthTradeoff: 'Urban vegetation and distance from tailpipe exhaust drops local fine particulate concentrations by 44%.'
    },
    aiVerdict: 'Take the residential greenway. Even though the distance is 1.2 km longer and adds 6 minutes, the barrier effect of buildings and tree canopy substantially filters roadway soot.',
    tradeoffAnalysis: '6 minutes of additional travel yields a 44% reduction in direct toxic exhaust exposure.',
    exposureReductionPercent: 44,
    emissionsDeltaKg: -0.05
  },
  {
    id: 'sc-5',
    title: 'Cooking Method: High-Heat Unvented Frying vs Induction with Exhaust',
    category: 'Cooking',
    description: 'Assess indoor particulate generation when cooking dinner for a family of 4.',
    optionA: {
      name: 'High-Heat Tadka / Frying without Exhaust',
      details: 'Open wok cooking with cooking oil reaching smoke point; kitchen doors open to living room.',
      exposureScore: 91,
      emissionsKgCo2: 0.4,
      timeMinutes: 25,
      costInr: 0,
      healthTradeoff: 'Spikes indoor PM2.5 past 400 µg/m³, which remains suspended for up to 3 hours.'
    },
    optionB: {
      name: 'Induction Temperature Control + Window Exhaust Fan',
      details: 'Pre-ventilated cooking with pan lid and active kitchen exhaust evacuating fumes outdoors.',
      exposureScore: 28,
      emissionsKgCo2: 0.25,
      timeMinutes: 25,
      costInr: 4,
      healthTradeoff: 'Evacuates over 70% of aerosolized oil particles before dispersion to living spaces.'
    },
    aiVerdict: 'Pre-ventilate and control cooking oil heat. Indoor cooking can easily exceed outdoor pollution peaks if exhaust is neglected.',
    tradeoffAnalysis: 'Zero time difference; tiny electricity cost (₹4); prevents severe respiratory irritation for children and elderly at home.',
    exposureReductionPercent: 69,
    emissionsDeltaKg: 0.15
  }
];

export const COMMUNITY_MISSIONS: CommunityMission[] = [
  {
    id: 'com-1',
    title: 'Shift 3 Peak Rush-Hour Commutes to Metro or Rail',
    description: 'Commit to substituting 3 open road commutes with zero-tailpipe public transit during morning inversion peaks.',
    scope: 'Neighborhood',
    totalGoal: 1000,
    currentProgress: 742,
    unit: 'trips shifted',
    participantsCount: 384,
    daysRemaining: 4,
    joined: true,
    completedByMe: false,
    estimatedEmissionsAvoidedKg: 618.5,
    methodologyNote: 'Calculated using IPCC 2021 urban emission factors comparing 125cc two-wheelers and passenger cars against electrified rail occupancy averages.'
  },
  {
    id: 'com-2',
    title: 'Apartment Complex Smoke & Incense Holiday Truce',
    description: 'Encourage apartment towers to substitute open incense and mosquito coils with clean mesh screens and essential reed diffusers.',
    scope: 'Apartment',
    totalGoal: 120,
    currentProgress: 94,
    unit: 'households switched',
    participantsCount: 94,
    daysRemaining: 6,
    joined: true,
    completedByMe: true,
    estimatedEmissionsAvoidedKg: 142.0,
    methodologyNote: 'Estimates based on peer-reviewed indoor combustion emission benchmarks (30g particulate mass avoided per weekly household).'
  },
  {
    id: 'com-3',
    title: 'University Campus Clean Air Corridor Mapping',
    description: 'Students and faculty map lower-exposure pedestrian paths between lecture halls away from perimeter diesel bus stops.',
    scope: 'Campus',
    totalGoal: 50,
    currentProgress: 41,
    unit: 'routes surveyed',
    participantsCount: 162,
    daysRemaining: 9,
    joined: false,
    completedByMe: false,
    estimatedEmissionsAvoidedKg: 45.0,
    methodologyNote: 'Evaluated by comparing roadside micro-sensor logs against pedestrian greenway transects.'
  },
  {
    id: 'com-4',
    title: 'Family Clean Bedroom Sanctuary Audit',
    description: 'Audit 5 vulnerable rooms in your extended family: seal draft gaps, remove open burning, establish morning damp-wipe routine.',
    scope: 'Family',
    totalGoal: 5,
    currentProgress: 4,
    unit: 'rooms fortified',
    participantsCount: 6,
    daysRemaining: 2,
    joined: true,
    completedByMe: false,
    estimatedEmissionsAvoidedKg: 0,
    methodologyNote: 'Direct health resilience metric; zero carbon calculation applied as this focuses purely on personal exposure reduction.'
  }
];

export const NOTIFICATIONS_DATA: AirwiseNotification[] = [
  {
    id: 'notif-1',
    type: 'peak_alert',
    title: 'Severe Inversion Alert Active',
    message: 'Surface wind dropped to 2.4 km/h. Ambient PM2.5 at Anand Vihar reached 284 µg/m³. Shift outdoor cardio indoors.',
    time: '15m ago',
    read: false,
    severity: 'alert'
  },
  {
    id: 'notif-2',
    type: 'ventilation',
    title: 'Solar Aeration Window Approaching (1:30 PM)',
    message: 'Atmospheric boundary layer is lifting. Ideal 20-minute window for cross-ventilation to flush indoor CO2.',
    time: '1h ago',
    read: false,
    severity: 'info'
  },
  {
    id: 'notif-3',
    type: 'plan_ready',
    title: 'Your Daily Air Plan is Optimized',
    message: 'Based on your 08:30 commute and evening run, 8 personalized decisions are generated for today.',
    time: '2h ago',
    read: true,
    severity: 'info'
  },
  {
    id: 'notif-4',
    type: 'community',
    title: 'Community Milestone: 700+ Peak Trips Shifted!',
    message: 'Your neighborhood group reached 74% of the monthly goal, avoiding ~618 kg CO2 and roadside particulate.',
    time: '5h ago',
    read: true,
    severity: 'info'
  }
];
