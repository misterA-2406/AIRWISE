import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WhatIfScenario } from '../types';
import { 
  Sliders, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Leaf, 
  Activity, 
  ShieldCheck, 
  AlertTriangle,
  Bookmark,
  PlusCircle,
  HelpCircle,
  Zap,
  RotateCcw,
  Scale,
  Gauge,
  TrendingDown,
  Info,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Modal } from '../components/common/Modal';

export const WhatIfLabPage: React.FC = () => {
  const { 
    scenarios, 
    activeScenarioId, 
    setActiveScenarioId, 
    applyScenarioToToday, 
    setIsAIDrawerOpen,
    setAiSuggestedPrompt,
    addToast 
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Interactive Simulation Sliders
  const [commuteDistanceKm, setCommuteDistanceKm] = useState<number>(14);
  const [ambientWindModifier, setAmbientWindModifier] = useState<number>(1.0); // 0.6 to 1.6

  // Mobile option view toggle: 'both' | 'optionA' | 'optionB'
  const [mobileOptionView, setMobileOptionView] = useState<'both' | 'optionA' | 'optionB'>('both');
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  const activeScenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];

  const categories = ['all', 'Commute', 'Exercise', 'Ventilation', 'Route', 'Cooking'];

  const filteredScenarios = scenarios.filter(s => 
    activeCategory === 'all' || s.category === activeCategory
  );

  // Dynamic calculations factoring in sliders
  const dynamicReduction = activeScenario ? Math.round(
    Math.min(96, Math.max(20, (activeScenario.exposureReductionPercent || 40) * (1 / (ambientWindModifier || 1.0))))
  ) : 0;

  const dynamicEmissionsDelta = activeScenario ? Number(
    ((activeScenario.emissionsDeltaKg || 0) * (commuteDistanceKm / 14)).toFixed(2)
  ) : 0;

  const timeA = activeScenario ? Math.round(activeScenario.optionA.timeMinutes * (commuteDistanceKm / 14)) : 0;
  const timeB = activeScenario ? Math.round(activeScenario.optionB.timeMinutes * (commuteDistanceKm / 14)) : 0;
  const timeDelta = timeB - timeA;

  const costDelta = activeScenario ? activeScenario.optionB.costInr - activeScenario.optionA.costInr : 0;

  const handleApplyToPlan = () => {
    if (activeScenario) {
      applyScenarioToToday(activeScenario.id);
    }
  };

  const handleAskAIAboutScenario = () => {
    if (activeScenario) {
      setAiSuggestedPrompt(
        `In the scenario "${activeScenario.title}", why does Option B reduce respiratory exposure by ${dynamicReduction}% under ${ambientWindModifier}x atmospheric dispersion? Break down the exact physiological trade-offs.`
      );
      setIsAIDrawerOpen(true);
    }
  };

  const handleSaveScenario = () => {
    if (activeScenario) {
      addToast('Scenario Saved', `"${activeScenario.title}" saved to your comparison library.`, 'info');
    }
  };

  if (!activeScenario) {
    return (
      <div className="p-12 text-center text-[#91B49A]">
        <div className="animate-spin w-8 h-8 border-2 border-[#C7F36B] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="font-mono text-xs">Calibrating decision models...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ========================================================= */}
      {/* 1. HEADER & COGNITIVE STAGE NAVIGATION                   */}
      {/* ========================================================= */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#91B49A]/15">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#91B49A] mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#C7F36B]/20 text-[#C7F36B] font-bold text-[10px] uppercase tracking-wider">
              Signature Decision Engine
            </span>
            <span>Comparative Exposure & Carbon Simulator</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-[#F0F3EA] tracking-tight">
            What-if Decision Lab
          </h1>
          <p className="text-sm text-[#A3B1A6] mt-1 max-w-2xl">
            Simulate the respiratory exposure, carbon emissions, and time trade-offs between everyday choices before you make them.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsMethodologyOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#11231B] hover:bg-[#162A20] border border-[#91B49A]/20 text-[#A3B1A6] hover:text-[#F0F3EA] text-xs font-mono transition-all"
          >
            <Info className="w-3.5 h-3.5 text-[#C7F36B]" />
            <span>Calculation Methodology</span>
          </button>

          <button
            onClick={handleAskAIAboutScenario}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#11231B] hover:bg-[#162A20] border border-[#C7F36B]/35 text-[#C7F36B] text-xs font-semibold transition-all shadow-md w-fit"
          >
            <Sparkles className="w-4 h-4" />
            <span>Explain with AI</span>
          </button>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. STEP 1: WHAT DECISION AM I COMPARING?                  */}
      {/* ========================================================= */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-mono font-bold uppercase text-[#C7F36B] mr-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C7F36B]" />
              1. Select Everyday Decision:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs transition-colors capitalize font-mono ${
                  activeCategory === cat
                    ? 'bg-[#C7F36B] text-[#07110E] font-bold'
                    : 'bg-[#11231B] text-[#A3B1A6] hover:text-[#F0F3EA] border border-[#91B49A]/15'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="text-[11px] font-mono text-[#91B49A]">
            {filteredScenarios.length} Scenarios Calibrated
          </span>
        </div>

        {/* Carousel / Grid of Scenarios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredScenarios.map((sc) => {
            const isSelected = sc.id === activeScenarioId;
            return (
              <button
                key={sc.id}
                onClick={() => setActiveScenarioId(sc.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#162A20] border-[#C7F36B] shadow-lg ring-1 ring-[#C7F36B]/50'
                    : 'bg-[#0B1914] border-[#91B49A]/15 hover:border-[#91B49A]/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                  <span className="text-[10px] uppercase text-[#C7F36B]">
                    {sc.category}
                  </span>
                  <span className="text-[10px] text-[#3DD68C] font-semibold">
                    -{sc.exposureReductionPercent}% Exposure Cut
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#F0F3EA] leading-snug line-clamp-1">
                  {sc.title}
                </h4>
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. STEP 2: CALIBRATE PHYSICAL CONDITIONS (SLIDERS)        */}
      {/* ========================================================= */}
      <section className="p-5 rounded-3xl bg-[#0B1914] border border-[#91B49A]/20 space-y-4">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-[#C7F36B] uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#C7F36B]" />
            2. Calibrate Physical & Meteorological Parameters
          </span>
          <span className="text-[#A3B1A6]">Interactive Sliders Alter Calculated Outcome</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
          <div>
            <div className="flex items-center justify-between font-mono mb-2">
              <span className="text-[#A3B1A6] uppercase text-[11px] flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-[#C7F36B]" />
                Commute / Activity Distance
              </span>
              <span className="text-[#C7F36B] font-bold text-sm">{commuteDistanceKm} km</span>
            </div>
            <input
              type="range"
              min="3"
              max="30"
              value={commuteDistanceKm}
              onChange={(e) => setCommuteDistanceKm(Number(e.target.value))}
              className="w-full accent-[#C7F36B] cursor-pointer bg-[#162A20] h-2 rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#65736A] mt-1.5">
              <span>Short Trip (3 km)</span>
              <span>Typical Daily (14 km)</span>
              <span>Cross-City (30 km)</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between font-mono mb-2">
              <span className="text-[#A3B1A6] uppercase text-[11px] flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-[#C7F36B]" />
                Atmospheric Mixing & Inversion Trap
              </span>
              <span className="text-[#C7F36B] font-bold text-sm">
                {ambientWindModifier <= 0.8 ? 'Severe Inversion Trap (0.6x)' : ambientWindModifier >= 1.4 ? 'Turbulent Dispersion (1.6x)' : 'Typical Season (1.0x)'}
              </span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.6"
              step="0.2"
              value={ambientWindModifier}
              onChange={(e) => setAmbientWindModifier(Number(e.target.value))}
              className="w-full accent-[#C7F36B] cursor-pointer bg-[#162A20] h-2 rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#65736A] mt-1.5">
              <span>Stagnant Smog (Trapped)</span>
              <span>Normal Baseline</span>
              <span>Breezy Solar Convection</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. STEP 3 & 4: THE ILLUMINATED DELTA VERDICT HUD          */}
      {/* ========================================================= */}
      <section className="p-6 rounded-3xl bg-gradient-to-r from-[#11231B] via-[#0E1F18] to-[#11231B] border border-[#C7F36B]/40 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C7F36B] block font-bold">
              3. Calculated Outcome Delta
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#F0F3EA]">
              Net Adaptation Advantage
            </h3>
            <p className="text-xs text-[#A3B1A6]">
              Real-time variance when enacting Option B over Option A under {commuteDistanceKm}km and {ambientWindModifier}x atmospheric dispersion.
            </p>
          </div>

          {/* Key Metric Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
            <div className="p-3 rounded-2xl bg-[#07110E] border border-[#3DD68C]/30">
              <span className="text-[10px] text-[#A3B1A6] uppercase block">Inhaled Dose</span>
              <span className="font-editorial text-2xl sm:text-3xl font-bold text-[#3DD68C]">
                -{dynamicReduction}%
              </span>
              <span className="text-[10px] text-[#3DD68C] block font-sans">*Estimated Deposition</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#07110E] border border-[#C7F36B]/30">
              <span className="text-[10px] text-[#A3B1A6] uppercase block">Carbon Avoided</span>
              <span className="font-editorial text-2xl sm:text-3xl font-bold text-[#C7F36B]">
                -{dynamicEmissionsDelta} kg
              </span>
              <span className="text-[10px] text-[#91B49A] block font-sans">CO2e (IPCC 2021)</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#07110E] border border-[#91B49A]/20">
              <span className="text-[10px] text-[#A3B1A6] uppercase block">Transit Time</span>
              <span className="font-editorial text-2xl sm:text-3xl font-bold text-[#F0F3EA]">
                {timeDelta > 0 ? `+${timeDelta}` : timeDelta} min
              </span>
              <span className="text-[10px] text-[#A3B1A6] block font-sans">Time Variance</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#07110E] border border-[#91B49A]/20">
              <span className="text-[10px] text-[#A3B1A6] uppercase block">Direct Budget</span>
              <span className="font-editorial text-2xl sm:text-3xl font-bold text-[#F5C842]">
                {costDelta >= 0 ? `+₹${costDelta}` : `-₹${Math.abs(costDelta)}`}
              </span>
              <span className="text-[10px] text-[#A3B1A6] block font-sans">Net Cash Variance</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. COMPARISON COCKPIT: OPTION A VS OPTION B               */}
      {/* ========================================================= */}
      {/* Mobile Perspective Switcher */}
      <div className="flex md:hidden p-1 rounded-xl bg-[#0B1914] border border-[#91B49A]/20 text-xs font-mono">
        <button
          onClick={() => setMobileOptionView('both')}
          className={`flex-1 py-1.5 rounded-lg text-center ${mobileOptionView === 'both' ? 'bg-[#162A20] text-[#C7F36B] font-bold' : 'text-[#A3B1A6]'}`}
        >
          Side-by-Side
        </button>
        <button
          onClick={() => setMobileOptionView('optionA')}
          className={`flex-1 py-1.5 rounded-lg text-center ${mobileOptionView === 'optionA' ? 'bg-[#E64848]/20 text-[#E64848] font-bold' : 'text-[#A3B1A6]'}`}
        >
          Option A (Unadapted)
        </button>
        <button
          onClick={() => setMobileOptionView('optionB')}
          className={`flex-1 py-1.5 rounded-lg text-center ${mobileOptionView === 'optionB' ? 'bg-[#3DD68C]/20 text-[#3DD68C] font-bold' : 'text-[#A3B1A6]'}`}
        >
          Option B (Adapted)
        </button>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* OPTION A: DEFAULT STATUS QUO */}
        {(mobileOptionView === 'both' || mobileOptionView === 'optionA') && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1914] border border-[#E64848]/35 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#91B49A]/10 font-mono text-xs">
                <span className="uppercase text-[#E64848] font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Option A: Conventional Habit
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E64848]/15 text-[#E64848] border border-[#E64848]/30 text-[10px]">
                  High Exposure Dose
                </span>
              </div>

              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#F0F3EA] mt-4 mb-2">
                {activeScenario.optionA.name}
              </h3>
              <p className="text-xs text-[#A3B1A6] leading-relaxed">
                {activeScenario.optionA.details}
              </p>

              {/* Metrics Ribbon */}
              <div className="grid grid-cols-2 gap-3 my-5 font-mono text-xs">
                <div className="p-3 rounded-xl bg-[#07110E] border border-[#91B49A]/15">
                  <span className="text-[10px] text-[#65736A] uppercase block">Exposure Load</span>
                  <span className="text-xl font-bold text-[#E64848] font-editorial">
                    {activeScenario.optionA.exposureScore}/100
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#07110E] border border-[#91B49A]/15">
                  <span className="text-[10px] text-[#65736A] uppercase block">Carbon Footprint</span>
                  <span className="text-xl font-bold text-[#F0F3EA] font-editorial">
                    {activeScenario.optionA.emissionsKgCo2} kg
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#07110E] border border-[#91B49A]/15">
                  <span className="text-[10px] text-[#65736A] uppercase block">Travel Duration</span>
                  <span className="text-xl font-bold text-[#F0F3EA] font-editorial">
                    {timeA} mins
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#07110E] border border-[#91B49A]/15">
                  <span className="text-[10px] text-[#65736A] uppercase block">Estimated Cost</span>
                  <span className="text-xl font-bold text-[#F0F3EA] font-editorial">
                    ₹{activeScenario.optionA.costInr}
                  </span>
                </div>
              </div>

              {/* Health Tradeoff Alert */}
              <div className="p-4 rounded-2xl bg-[#E64848]/10 border border-[#E64848]/30 text-xs text-[#E64848] space-y-1">
                <span className="font-mono text-[10px] uppercase font-bold block">
                  Respiratory Health Penalty
                </span>
                <p className="leading-relaxed">
                  {activeScenario.optionA.healthTradeoff}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* OPTION B: AIRWISE ADAPTATION */}
        {(mobileOptionView === 'both' || mobileOptionView === 'optionB') && (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#11231B] via-[#0E1F18] to-[#07110E] border border-[#C7F36B]/50 flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C7F36B]/5 rounded-bl-full pointer-events-none" />

            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#91B49A]/15 font-mono text-xs">
                <span className="uppercase text-[#C7F36B] font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#3DD68C]" />
                  Option B: Airwise Adaptation
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#3DD68C]/20 text-[#3DD68C] border border-[#3DD68C]/35 text-[10px] font-bold">
                  -{dynamicReduction}% Exposure Cut
                </span>
              </div>

              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#F0F3EA] mt-4 mb-2">
                {activeScenario.optionB.name}
              </h3>
              <p className="text-xs text-[#A3B1A6] leading-relaxed">
                {activeScenario.optionB.details}
              </p>

              {/* Metrics Ribbon */}
              <div className="grid grid-cols-2 gap-3 my-5 font-mono text-xs">
                <div className="p-3 rounded-xl bg-[#07110E] border border-[#3DD68C]/30">
                  <span className="text-[10px] text-[#3DD68C] uppercase block font-bold">Exposure Load</span>
                  <span className="text-xl font-bold text-[#3DD68C] font-editorial">
                    {Math.round(activeScenario.optionB.exposureScore * ambientWindModifier)}/100
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#07110E] border border-[#91B49A]/15">
                  <span className="text-[10px] text-[#65736A] uppercase block">Carbon Footprint</span>
                  <span className="text-xl font-bold text-[#C7F36B] font-editorial">
                    {activeScenario.optionB.emissionsKgCo2} kg
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#07110E] border border-[#91B49A]/15">
                  <span className="text-[10px] text-[#65736A] uppercase block">Travel Duration</span>
                  <span className="text-xl font-bold text-[#F0F3EA] font-editorial">
                    {timeB} mins
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#07110E] border border-[#91B49A]/15">
                  <span className="text-[10px] text-[#65736A] uppercase block">Estimated Cost</span>
                  <span className="text-xl font-bold text-[#F0F3EA] font-editorial">
                    ₹{activeScenario.optionB.costInr}
                  </span>
                </div>
              </div>

              {/* Health Protection Note */}
              <div className="p-4 rounded-2xl bg-[#3DD68C]/10 border border-[#3DD68C]/30 text-xs text-[#F0F3EA] space-y-1">
                <span className="font-mono text-[10px] uppercase font-bold text-[#3DD68C] block">
                  Alveolar Protection Mechanism
                </span>
                <p className="leading-relaxed text-[#A3B1A6]">
                  {activeScenario.optionB.healthTradeoff}
                </p>
              </div>
            </div>

            {/* Action Decision Controls */}
            <div className="pt-4 border-t border-[#91B49A]/15 flex items-center justify-between gap-3">
              <button
                onClick={handleSaveScenario}
                className="p-2.5 rounded-xl bg-[#07110E] hover:bg-[#162A20] text-[#91B49A] hover:text-[#F0F3EA] border border-[#91B49A]/20 transition-colors"
                title="Save Scenario"
              >
                <Bookmark className="w-4 h-4" />
              </button>

              <button
                onClick={handleApplyToPlan}
                className="px-5 py-2.5 rounded-xl bg-[#C7F36B] hover:bg-[#A8D957] text-[#07110E] text-xs font-bold font-mono flex items-center gap-2 transition-all shadow-lg"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Apply to Today's Plan</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* METHODOLOGY & DATA TRANSPARENCY MODAL */}
      <Modal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
        title="Scientific Methodology & Calculation Transparency"
        subtitle="How AIRWISE calculates exposure cuts, carbon emissions, and trade-offs."
      >
        <div className="space-y-4 text-xs text-[#A3B1A6] leading-relaxed">
          <div className="p-3 rounded-xl bg-[#07110E] border border-[#91B49A]/15 space-y-1">
            <strong className="text-[#C7F36B] font-mono text-[11px] uppercase block">
              1. Avoided Greenhouse Emissions Model (IPCC 2021)
            </strong>
            <p>
              Emissions delta is calculated using published urban passenger transport emission factors from IPCC AR6:
              ΔE = d × (F_baseline - F_alternative), where petrol two-wheeler factor is 0.055 kg CO2/km and electric mass rapid transit is 0.015 kg CO2/km.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#07110E] border border-[#91B49A]/15 space-y-1">
            <strong className="text-[#3DD68C] font-mono text-[11px] uppercase block">
              2. Alveolar Particulate Inhalation Estimate
            </strong>
            <p>
              Respiratory soot deposition estimates factor in minute-ventilation rate (VE): resting office work (12 L/min) vs brisk cycling or street running (45–60 L/min). Deposition volume is estimated using ICRP aerodynamic diameter models.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#07110E] border border-[#91B49A]/15 space-y-1">
            <strong className="text-[#F5C842] font-mono text-[11px] uppercase block">
              3. Model Uncertainty & Transparency
            </strong>
            <p>
              Values are model-derived estimates rather than in-vivo clinical measurements. Actual individual inhalation varies based on lung physiology, personal mask filtration efficiency, and local micrometeorological wind variations.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
