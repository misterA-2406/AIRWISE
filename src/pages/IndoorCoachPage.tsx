import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  ShieldCheck, 
  Check,
  ShieldAlert,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { RiskBadge } from '../components/visual/RiskBadge';

export const IndoorCoachPage: React.FC = () => {
  const { 
    indoorChecks, 
    toggleIndoorCheck, 
    indoorRecommendations, 
    toggleIndoorImplemented,
    isZeroBudgetOnly,
    setIsZeroBudgetOnly,
    addToast,
    viewMode
  } = useApp();

  const [isLongTermExpanded, setIsLongTermExpanded] = useState(false);

  const activeHazardCount = indoorChecks.filter(c => c.detectedOrReported).length;
  const implementedCount = indoorRecommendations.filter(r => r.isImplemented).length;

  // The primary indoor threat right now
  const topHazard = indoorChecks.find(c => c.detectedOrReported && c.impactLevel === 'severe') || indoorChecks[0];

  // Highest priority actions (Immediate & Today)
  const topPriorityActions = indoorRecommendations.filter(r => 
    (!isZeroBudgetOnly || r.isZeroBudgetEligible) && (r.timeframe === 'Immediate' || r.timeframe === 'Today')
  ).slice(0, 3);

  // Zero-budget checklist actions
  const zeroBudgetActions = indoorRecommendations.filter(r => r.isZeroBudgetEligible);


  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ========================================================= */}
      {/* 1. HEADER & PROMINENT ZERO-BUDGET TOGGLE                  */}
      {/* ========================================================= */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#91B49A]/15">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#91B49A] mb-1">
            <Home className="w-3.5 h-3.5 text-[#C7F36B]" />
            <span>Indoor Environmental Air Protocol</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-[#F0F3EA] tracking-tight">
            Indoor Air Coach
          </h1>
          <p className="text-sm text-[#A3B1A6] mt-1 max-w-2xl">
            Neutralize indoor combustion and establish a clean-air sanctuary using passive airflow science and zero-cost behavioral habits.
          </p>
        </div>

        {/* HIGHLY VISIBLE ZERO-BUDGET MODE TOGGLE */}
        <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#11231B] border border-[#3DD68C]/40 shadow-xl shrink-0">
          <div className="text-left">
            <span className="block text-xs font-bold text-[#3DD68C] font-mono uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#3DD68C] animate-pulse" />
              Zero-Budget Mode
            </span>
            <span className="text-[10px] text-[#A3B1A6]">
              {isZeroBudgetOnly ? 'Strictly ₹0 free behavioral actions' : 'Includes hardware upgrades'}
            </span>
          </div>

          <button
            onClick={() => {
              setIsZeroBudgetOnly(!isZeroBudgetOnly);
              addToast(
                !isZeroBudgetOnly ? 'Zero-Budget Mode Active' : 'All Actions Displayed',
                !isZeroBudgetOnly ? 'Showing 100% free non-monetary interventions.' : 'Hardware and low-cost options included.',
                'info'
              );
            }}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
              isZeroBudgetOnly ? 'bg-[#3DD68C]' : 'bg-[#162A20]'
            }`}
            aria-label="Toggle zero-budget mode"
          >
            <div
              className={`bg-[#07110E] w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                isZeroBudgetOnly ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. TIER 1: BIGGEST HOUSEHOLD CONCERN & 2-MIN ₹0 FIX       */}
      {/* ========================================================= */}
      {topHazard && (
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#162A20] via-[#11231B] to-[#0B1914] border border-[#F28B36]/40 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-[#E64848]/20 text-[#E64848] font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  #1 Active Household Air Concern
                </span>
                <span className="text-[#A3B1A6]">Source: {topHazard.typicalPollutant}</span>
              </div>

              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#F0F3EA]">
                {topHazard.source}: High Emission Spike
              </h2>

              <p className="text-xs sm:text-sm text-[#A3B1A6] max-w-2xl leading-relaxed">
                {viewMode === 'simple'
                  ? 'Unvented cooking oils or indoor burning release fine microscopic soot that stays suspended in bedrooms for up to 6 hours.'
                  : 'High-heat oil aerosolization releases ultra-fine PM0.1 and acrolein VOCs, elevating indoor particulate levels beyond 400 µg/m³.'}
              </p>
            </div>

            {/* Immediate 2-Minute Zero-Cost Solution Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#07110E]/90 border border-[#3DD68C]/35 shrink-0 max-w-md w-full space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#3DD68C] font-bold block flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Immediate ₹0 Zero-Cost Mitigation
              </span>
              <p className="text-xs text-[#F0F3EA] leading-relaxed font-semibold">
                {topHazard.freeMitigation}
              </p>
              <div className="text-[10px] font-mono text-[#91B49A] pt-1">
                Enacted in under 2 minutes • Protects children and vulnerable family members
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* 3. TIER 3: THREE HIGHEST-PRIORITY ACTIONS                  */}
      {/* ========================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#91B49A]/15">
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[#F0F3EA] tracking-tight">
              Top 3 Immediate Sanctuary Safeguards
            </h3>
            <p className="text-xs text-[#A3B1A6]">
              The three most effective steps you can take today to protect indoor breathing air.
            </p>
          </div>

          <span className="text-xs font-mono text-[#3DD68C]">
            {implementedCount} Safeguards Enacted
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topPriorityActions.map((rec) => (
            <div
              key={rec.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                rec.isImplemented
                  ? 'bg-[#0B1914]/60 border-[#3DD68C]/30 opacity-80'
                  : 'bg-[#11231B] border-[#91B49A]/20 hover:border-[#C7F36B]/40 shadow-md'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-[#162A20] text-[#C7F36B] text-[10px] uppercase font-bold">
                    {rec.timeframe}
                  </span>
                  <span className="text-[#3DD68C] text-[10px] font-semibold">
                    {rec.cost}
                  </span>
                </div>

                <h4 className={`text-sm sm:text-base font-semibold leading-snug ${
                  rec.isImplemented ? 'line-through text-[#65736A]' : 'text-[#F0F3EA]'
                }`}>
                  {rec.title}
                </h4>

                <p className="text-xs text-[#A3B1A6] leading-relaxed">
                  {rec.reason}
                </p>
              </div>

              <div className="pt-2 border-t border-[#91B49A]/10 flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-[#3DD68C] font-semibold">
                  {rec.expectedUsefulness}
                </span>

                <button
                  onClick={() => toggleIndoorImplemented(rec.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold border flex items-center gap-1.5 transition-all ${
                    rec.isImplemented
                      ? 'bg-[#3DD68C] border-[#3DD68C] text-[#07110E]'
                      : 'bg-[#162A20] hover:bg-[#1D3529] border-[#91B49A]/25 text-[#F0F3EA]'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{rec.isImplemented ? 'Done' : 'Enact'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. TIER 4: OTHER INDOOR SOURCES CHECKLIST (6 SOURCES)     */}
      {/* ========================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#91B49A]/15">
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[#F0F3EA] tracking-tight">
              Indoor Combustion & Source Audit
            </h3>
            <p className="text-xs text-[#A3B1A6]">
              Check active sources in your home to personalize guidance and calculate your vulnerability index.
            </p>
          </div>

          <span className="text-xs font-mono text-[#C7F36B]">
            {activeHazardCount} Active Hazards Flagged
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {indoorChecks.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleIndoorCheck(item.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer select-none ${
                item.detectedOrReported
                  ? 'bg-[#11231B] border-[#F28B36]/50 shadow-md ring-1 ring-[#F28B36]/30'
                  : 'bg-[#0B1914] border-[#91B49A]/15 hover:border-[#91B49A]/30 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                    item.detectedOrReported 
                      ? 'bg-[#F28B36] border-[#F28B36] text-[#07110E]' 
                      : 'bg-[#07110E] border-[#65736A] text-transparent'
                  }`}>
                    {item.detectedOrReported && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-[#F0F3EA]">
                      {item.source}
                    </h4>
                    <span className="text-[10px] font-mono text-[#E64848] block">
                      {item.typicalPollutant}
                    </span>
                  </div>
                </div>

                <RiskBadge level={item.impactLevel} size="sm" showDot={false} />
              </div>

              <div className="mt-4 pt-3 border-t border-[#91B49A]/10 text-xs">
                <span className="text-[10px] font-mono uppercase text-[#3DD68C] font-bold block mb-0.5">
                  ₹0 Behavioral Hack:
                </span>
                <p className="text-[#A3B1A6] text-xs leading-relaxed">
                  {item.freeMitigation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. TIER 5 & 6: ZERO-BUDGET PROTOCOLS & LONG-TERM UPGRADES */}
      {/* ========================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#91B49A]/15">
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[#F0F3EA] tracking-tight">
              Sanctuary Protocols & Long-Term Solutions
            </h3>
            <p className="text-xs text-[#A3B1A6]">
              {isZeroBudgetOnly ? 'Showing 100% free non-monetary physical interventions.' : 'Complete behavioral and hardware mitigation options.'}
            </p>
          </div>

          <button
            onClick={() => setIsLongTermExpanded(!isLongTermExpanded)}
            className="flex items-center gap-1 text-xs font-mono text-[#91B49A] hover:text-[#C7F36B] transition-colors"
          >
            <span>{isLongTermExpanded ? 'Collapse Detailed List' : 'Expand All Protocols'}</span>
            {isLongTermExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Action List */}
        <div className="space-y-3">
          {(isLongTermExpanded ? indoorRecommendations : zeroBudgetActions).map((rec) => (
            <div
              key={rec.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                rec.isImplemented
                  ? 'bg-[#0B1914]/60 border-[#3DD68C]/25 opacity-80'
                  : 'bg-[#11231B] border-[#91B49A]/15 hover:border-[#C7F36B]/35'
              }`}
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-[#162A20] text-[#C7F36B] text-[10px] uppercase font-bold">
                    {rec.timeframe}
                  </span>
                  <span className="text-[#65736A]">•</span>
                  <span className="text-[10px] text-[#A3B1A6] uppercase">
                    {rec.cost}
                  </span>
                  {rec.isZeroBudgetEligible && (
                    <span className="px-2 py-0.5 rounded bg-[#3DD68C]/15 text-[#3DD68C] text-[10px] border border-[#3DD68C]/25">
                      ₹0 Free
                    </span>
                  )}
                </div>

                <h4 className={`text-base font-semibold ${
                  rec.isImplemented ? 'line-through text-[#65736A]' : 'text-[#F0F3EA]'
                }`}>
                  {rec.title}
                </h4>
                <p className="text-xs text-[#A3B1A6] leading-relaxed">
                  {rec.reason}
                </p>
              </div>

              <div className="flex items-center gap-4 self-end md:self-center shrink-0">
                <span className="px-2.5 py-1 rounded-full bg-[#3DD68C]/15 border border-[#3DD68C]/30 text-[#3DD68C] text-xs font-mono font-semibold">
                  {rec.expectedUsefulness}
                </span>

                <button
                  onClick={() => toggleIndoorImplemented(rec.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold border flex items-center gap-1.5 transition-all ${
                    rec.isImplemented
                      ? 'bg-[#3DD68C] border-[#3DD68C] text-[#07110E]'
                      : 'bg-[#162A20] hover:bg-[#1D3529] border-[#91B49A]/25 text-[#F0F3EA]'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{rec.isImplemented ? 'Safeguard Active' : 'Enact Safeguard'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
