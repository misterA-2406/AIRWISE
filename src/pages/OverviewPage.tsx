import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { RiskBadge } from '../components/visual/RiskBadge';
import { TimelineBar } from '../components/ui/TimelineBar';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  Activity, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Flame, 
  Zap, 
  Bell, 
  HelpCircle, 
  TrendingUp, 
  Target, 
  ChevronRight,
  Wind,
  Droplets,
  Thermometer,
  Compass,
  Check,
  RotateCcw,
  Sliders,
  Radio,
  Eye,
  Info,
  Calendar,
  AlertTriangle
} from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const { 
    airData, 
    planActions, 
    routineProfile, 
    completedActionsCount, 
    totalActionsCount,
    toggleCompleteAction,
    setIsAIDrawerOpen,
    setAiSuggestedPrompt,
    addToast,
    viewMode,
    toggleViewMode,
    isLiveTelemetry
  } = useApp();

  const [isDecisionDone, setIsDecisionDone] = useState(false);
  const [showAlternative, setShowAlternative] = useState(false);
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);

  // Daily primary decision definition
  const heroDecision = {
    id: 'hero-decision-1',
    title: 'Shift your 6:00 PM workout indoors',
    time: '06:00 PM',
    period: 'Evening Peak Smog Window',
    whySimple: 'Cold winter air traps fresh diesel exhaust near the ground between 5:30 PM and 8:00 PM, making heavy breathing outdoors dangerous.',
    whyTechnical: 'Nocturnal boundary layer compresses to 320m with near-zero wind dispersion (4.2 km/h NW), spiking ambient PM2.5 to 248 µg/m³ along arterial corridors.',
    personalRelevance: 'Your baseline profile includes evening running. Exercising at 45 L/min ventilation volume under this AQI deposits ~140 µg of toxic soot deep into alveolar lung tissues.',
    alternative: 'Perform a 30-minute indoor mobility and core routine in a sealed room with air filtration or fresh damp floor wipe.',
    impact: '~140 µg estimated alveolar soot avoided',
    cost: '₹0 Free • Behavioral',
    category: 'Exercise'
  };

  const handleDecisionDone = () => {
    setIsDecisionDone(!isDecisionDone);
    addToast(
      !isDecisionDone ? 'Safeguard Enacted' : 'Safeguard Reset',
      !isDecisionDone ? 'Evening workout scheduled safely indoors. High toxic exposure avoided!' : 'Status reset to pending.',
      'success'
    );
  };

  const handleRemindMe = () => {
    addToast('Reminder Active', 'Airwise will alert you at 5:15 PM before your workout window.', 'info');
  };

  const handleAskCopilot = () => {
    setAiSuggestedPrompt('Why is it critical to shift my evening workout indoors today? Explain the exact cardiopulmonary difference under current AQI.');
    setIsAIDrawerOpen(true);
  };

  // Remaining upcoming chronological actions
  const upcomingActions = planActions.slice(1, 5);

  const riskColor = {
    low: '#3DD68C',
    moderate: '#F5C842',
    high: '#F28B36',
    severe: '#E64848'
  }[airData?.riskLevel || 'severe'];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ========================================================= */}
      {/* 1. HEADER WITH PERSPECTIVE TOGGLE & DATA PROVENANCE       */}
      {/* ========================================================= */}
      <section className="pt-1 pb-4 border-b border-[#91B49A]/15">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#11231B] border border-[#C7F36B]/30 text-[#C7F36B] font-bold text-[10px] tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C7F36B] animate-ping" />
                {isLiveTelemetry ? 'Copernicus Live Telemetry' : 'Calibrated Model Mesh'}
              </span>
              <span className="text-[#91B49A] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#C7F36B]" />
                {airData?.locationName || 'Delhi NCR'} • {airData?.subArea || 'Central Basin'}
              </span>
              <span className="text-[#65736A] hidden sm:inline">• Synced {airData?.timestamp || 'Today'}</span>
            </div>

            <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-[#F0F3EA] tracking-tight">
              Good morning, {routineProfile?.name ? routineProfile.name.split(' ')[0] : 'Aarav'}.
            </h1>
          </div>

          {/* Controls: Mode Switcher & Copilot Button */}
          <div className="flex items-center gap-3 shrink-0">
            {/* View Mode Toggle Pill (Simple Family View vs Detailed Air Science) */}
            <div className="p-1 rounded-xl bg-[#0B1914] border border-[#91B49A]/20 flex items-center text-xs font-mono">
              <button
                onClick={() => toggleViewMode()}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'simple'
                    ? 'bg-[#C7F36B] text-[#07110E] font-bold shadow-sm'
                    : 'text-[#A3B1A6] hover:text-[#F0F3EA]'
                }`}
                title="Simplified recommendations for everyday family decisions"
              >
                <span>Simple View</span>
              </button>
              <button
                onClick={() => toggleViewMode()}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'detailed'
                    ? 'bg-[#162A20] text-[#C7F36B] font-bold border border-[#C7F36B]/40 shadow-sm'
                    : 'text-[#A3B1A6] hover:text-[#F0F3EA]'
                }`}
                title="In-depth environmental science, models, and speciation"
              >
                <span>Air Science</span>
              </button>
            </div>

            <button
              onClick={() => setIsAIDrawerOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#11231B] hover:bg-[#162A20] border border-[#C7F36B]/35 text-[#C7F36B] text-xs font-semibold transition-all shadow-md group"
            >
              <Sparkles className="w-3.5 h-3.5 transition-transform group-hover:rotate-12" />
              <span>Ask Copilot</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. SECTION 1: WHAT IS THE AIR LIKE NOW?                   */}
      {/* ========================================================= */}
      <section className="p-6 rounded-3xl bg-gradient-to-br from-[#11231B] via-[#0E1F18] to-[#07110E] border border-[#91B49A]/20 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Prominent AQI Indicator & Main Pollutant */}
          <div className="flex items-center gap-6">
            <div className="relative flex items-center justify-center shrink-0">
              {/* Outer Semantic Ring */}
              <div 
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 flex flex-col items-center justify-center text-center shadow-lg transition-all"
                style={{ 
                  borderColor: riskColor,
                  boxShadow: `0 0 25px ${riskColor}30`,
                  backgroundColor: '#07110E'
                }}
              >
                <span className="text-[10px] font-mono uppercase text-[#A3B1A6] tracking-widest">
                  AQI
                </span>
                <span className="font-editorial text-4xl sm:text-5xl font-bold text-[#F0F3EA] leading-none my-0.5">
                  {airData?.aqi || 284}
                </span>
                <span 
                  className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ color: riskColor, backgroundColor: `${riskColor}18` }}
                >
                  {airData?.riskLevel || 'Severe'}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#162A20] text-[#91B49A] border border-[#91B49A]/20">
                  Main Driver: <strong className="text-[#F0F3EA] uppercase">{airData?.primaryPollutant || 'PM2.5'}</strong>
                </span>
                <span className="text-xs font-mono text-[#65736A]">
                  (Fine Combustion Particulate)
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-[#F0F3EA] tracking-tight">
                {viewMode === 'simple' ? 'Outdoor Air is Hazardous Today' : 'Severe Tropospheric Particulate Inversion'}
              </h2>

              <p className="text-xs sm:text-sm text-[#A3B1A6] max-w-xl leading-relaxed">
                {viewMode === 'simple'
                  ? 'Fine soot from vehicle exhaust and smoke is trapped near breathing level. Keep windows sealed this morning; the safest time to step outdoors is between 1:00 PM and 3:30 PM.'
                  : `Ambient PM2.5 is at ${airData?.pollutants.pm25 || 198.4} µg/m³ (13× WHO guideline). Shallow atmospheric mixing layer (320m) prevents vertical dilution until solar noon.`
                }
              </p>
            </div>
          </div>

          {/* Quick Context Summary Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 text-xs font-mono shrink-0">
            <div className="p-3 rounded-2xl bg-[#07110E] border border-[#91B49A]/15">
              <span className="text-[10px] text-[#65736A] uppercase block">Cleanest Window</span>
              <span className="text-[#3DD68C] font-bold text-sm">1:00 PM – 3:30 PM</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#07110E] border border-[#91B49A]/15">
              <span className="text-[10px] text-[#65736A] uppercase block">Morning Hazard Trap</span>
              <span className="text-[#E64848] font-bold text-sm">7:00 AM – 10:30 AM</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#07110E] border border-[#91B49A]/15">
              <span className="text-[10px] text-[#65736A] uppercase block">Ground Temp & Wind</span>
              <span className="text-[#F0F3EA] font-semibold text-sm">{airData?.weather.temperature}°C • {airData?.weather.windSpeed} km/h</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#07110E] border border-[#91B49A]/15">
              <span className="text-[10px] text-[#65736A] uppercase block">Data Provenance</span>
              <span className="text-[#C7F36B] font-semibold text-sm">CAMS Copernicus</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. SECTION 2: YOUR PRIORITY TODAY                         */}
      {/* ========================================================= */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#11231B] via-[#0E1F18] to-[#07110E] border border-[#C7F36B]/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C7F36B]/5 rounded-bl-full pointer-events-none" />

        <div className="space-y-4">
          {/* Header Tag */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#91B49A]/15">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C7F36B]" />
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#C7F36B]">
                Your Single Most Important Action Today
              </span>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#07110E] border border-[#91B49A]/20 text-[#F0F3EA] text-xs font-mono">
              Target: <strong className="text-[#C7F36B]">{heroDecision.time}</strong> • {heroDecision.period}
            </span>
          </div>

          {/* Primary Action Headline */}
          <div>
            <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F0F3EA] tracking-tight leading-snug">
              {heroDecision.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#A3B1A6] mt-1.5 max-w-3xl leading-relaxed">
              {viewMode === 'simple' ? heroDecision.whySimple : heroDecision.whyTechnical}
            </p>
          </div>

          {/* Personal Relevance & Exposure Reduction Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-[#07110E]/80 border border-[#91B49A]/15 text-xs space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#91B49A] block font-bold">
                Why this matters for your routine
              </span>
              <p className="text-[#A3B1A6] leading-relaxed">
                {heroDecision.personalRelevance}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#3DD68C]/10 border border-[#3DD68C]/30 text-xs space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#3DD68C] block font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Estimated Health Benefit (Calculated)
              </span>
              <p className="text-[#F0F3EA] font-semibold leading-relaxed">
                {heroDecision.impact}
              </p>
              <span className="text-[10px] font-mono text-[#91B49A] block pt-1">
                *Estimated based on minute ventilation volume during aerobic cardio vs resting indoor air.
              </span>
            </div>
          </div>

          {/* Expandable Zero-Cost Alternative */}
          {showAlternative && (
            <div className="p-4 rounded-2xl bg-[#162A20] border border-[#F5C842]/40 text-xs animate-in fade-in duration-200 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#F5C842] font-bold block">
                Zero-Cost Practical Alternative (₹0 Free)
              </span>
              <p className="text-[#F0F3EA] leading-relaxed">
                {heroDecision.alternative}
              </p>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-4 border-t border-[#91B49A]/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleDecisionDone}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wide flex items-center gap-2 transition-all shadow-md ${
                  isDecisionDone
                    ? 'bg-[#3DD68C] text-[#07110E]'
                    : 'bg-[#C7F36B] hover:bg-[#A8D957] text-[#07110E]'
                }`}
              >
                {isDecisionDone ? <Check className="w-4 h-4 stroke-[3]" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>{isDecisionDone ? 'Safeguard Enacted Today' : 'Enact Safeguard'}</span>
              </button>

              <button
                onClick={handleRemindMe}
                className="px-3.5 py-2.5 rounded-xl bg-[#162A20] hover:bg-[#1D3529] border border-[#91B49A]/25 text-[#F0F3EA] text-xs font-mono transition-all flex items-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5 text-[#91B49A]" />
                <span>Remind me (5:15 PM)</span>
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <button
                onClick={() => setShowAlternative(!showAlternative)}
                className="text-[#91B49A] hover:text-[#C7F36B] text-xs underline underline-offset-4 transition-colors"
              >
                {showAlternative ? 'Hide Alternative' : 'View Alternative'}
              </button>

              <button
                onClick={handleAskCopilot}
                className="text-[#C7F36B] hover:underline flex items-center gap-1 font-semibold"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Ask AI Why</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. SECTION 3: YOUR DAY, ADAPTED (VISUAL TIMELINE)         */}
      {/* ========================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#91B49A]/15">
          <div>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#F0F3EA] tracking-tight">
              Your Day, Adapted
            </h3>
            <p className="text-xs text-[#A3B1A6]">
              {viewMode === 'simple'
                ? 'Your daily schedule synchronized to breathe the cleanest possible air at each hour.'
                : 'Diurnal boundary layer risk curves matched with routine minute-ventilation intervals.'
              }
            </p>
          </div>

          <Link
            to="/app/today"
            className="group flex items-center gap-1.5 text-xs font-mono text-[#C7F36B] hover:underline font-semibold"
          >
            <span>View All 8 Periods</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* The 24-Hour Diurnal Risk Bar */}
        <div className="p-4 rounded-2xl bg-[#0B1914] border border-[#91B49A]/15 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#A3B1A6] uppercase text-[11px]">
              24-Hour Pollution Curve & Safe Aeration Windows
            </span>
            <span className="text-[#3DD68C] font-semibold text-[11px]">
              Optimal Ventilation: 1:30 PM
            </span>
          </div>
          <TimelineBar />
        </div>

        {/* Clean, Scannable Adapted Schedule List */}
        <div className="divide-y divide-[#91B49A]/15 rounded-2xl bg-[#0B1914] border border-[#91B49A]/15 overflow-hidden">
          {upcomingActions.map((action) => (
            <div 
              key={action.id}
              className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-[#11231B] ${
                action.isCompleted ? 'bg-[#07110E]/50 opacity-75' : ''
              }`}
            >
              {/* Left: Time & Period indicator */}
              <div className="flex items-start gap-4">
                <div className="w-20 shrink-0 text-left font-mono">
                  <span className="block text-xs font-bold text-[#C7F36B]">
                    {action.timeLabel}
                  </span>
                  <span className="block text-[10px] text-[#65736A] uppercase">
                    {action.period.replace('-', ' ')}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#162A20] text-[#91B49A] uppercase tracking-wide text-[10px]">
                      {action.category}
                    </span>
                    <h4 className={`text-sm sm:text-base font-semibold text-[#F0F3EA] ${
                      action.isCompleted ? 'line-through text-[#65736A]' : ''
                    }`}>
                      {action.title}
                    </h4>
                  </div>
                  <p className="text-xs text-[#A3B1A6] max-w-2xl">
                    {viewMode === 'simple' ? action.whyToday : `${action.whyToday} — Impact: ${action.impact}`}
                  </p>
                </div>
              </div>

              {/* Right: Exposure delta & Fast check action */}
              <div className="flex items-center gap-4 self-end md:self-center shrink-0">
                <span className="px-2.5 py-1 rounded-full bg-[#3DD68C]/15 border border-[#3DD68C]/30 text-[#3DD68C] text-xs font-mono font-semibold">
                  {action.impact}
                </span>

                <button
                  onClick={() => toggleCompleteAction(action.id)}
                  className={`p-2 rounded-xl border transition-all ${
                    action.isCompleted
                      ? 'bg-[#3DD68C] border-[#3DD68C] text-[#07110E]'
                      : 'bg-[#162A20] hover:bg-[#1D3529] border-[#91B49A]/25 text-[#91B49A] hover:text-[#C7F36B]'
                  }`}
                  title={action.isCompleted ? 'Mark Pending' : 'Mark Completed'}
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. SECONDARY TELEMETRY & STATS (BELOW THE FIRST VIEWPORT) */}
      {/* ========================================================= */}
      <section className="p-6 rounded-3xl bg-[#0B1914] border border-[#91B49A]/15 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <span className="text-[11px] font-mono uppercase text-[#65736A] block mb-1">
            Actions Enacted
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-editorial text-3xl font-bold text-[#F0F3EA]">
              {completedActionsCount}
            </span>
            <span className="text-xs font-mono text-[#91B49A]">/ {totalActionsCount} planned</span>
          </div>
        </div>

        <div>
          <span className="text-[11px] font-mono uppercase text-[#65736A] block mb-1">
            Consistency Streak
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-editorial text-3xl font-bold text-[#C7F36B]">
              14
            </span>
            <span className="text-xs font-mono text-[#91B49A]">consecutive days</span>
          </div>
        </div>

        <div>
          <span className="text-[11px] font-mono uppercase text-[#65736A] block mb-1">
            Estimated Inhaled Soot Avoided
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-editorial text-3xl font-bold text-[#3DD68C]">
              ~180 µg
            </span>
            <span className="text-xs font-mono text-[#91B49A]">PM2.5 intake</span>
          </div>
        </div>

        <div>
          <span className="text-[11px] font-mono uppercase text-[#65736A] block mb-1">
            Household Status
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-editorial text-3xl font-bold text-[#F5C842]">
              Sanctuary
            </span>
            <span className="text-xs font-mono text-[#91B49A]">zero respiratory flares</span>
          </div>
        </div>
      </section>
    </div>
  );
};
