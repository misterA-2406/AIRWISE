import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { DemoBanner } from '../components/common/DemoBanner';
import { ParticleAtmosphere } from '../components/visual/ParticleAtmosphere';
import { AtmosphericHeroInstrument } from '../components/visual/AtmosphericHeroInstrument';
import { ToastContainer } from '../components/common/Toast';
import { 
  ArrowRight, 
  Wind, 
  ShieldCheck, 
  Compass, 
  Users, 
  Sparkles, 
  Sliders, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  Home,
  Bike,
  Flame,
  Clock,
  Layers,
  ChevronRight,
  TrendingDown,
  Scale
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  // Interactive Decision Demo state for Section 2
  const [selectedDomain, setSelectedDomain] = useState<'commute' | 'indoor' | 'exercise' | 'cooking'>('commute');
  
  // Interactive "Original Day vs AIRWISE Day" comparison state
  const [dayComparisonMode, setDayComparisonMode] = useState<'adapted' | 'original' | 'sideBySide'>('adapted');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<number>(0);

  const decisionMatrix = {
    commute: {
      title: 'Commute Dynamics: Road Inversion vs Metro Air',
      unaware: 'Open two-wheeler or rickshaw along ring road. Inhales ~180 µg/m³ peak diesel black carbon.',
      airwise: 'Shift 15 mins earlier to underground filtered Metro. Reduces direct roadside particulate exposure by 73%.',
      impact: '73% less toxic soot',
      icon: Bike
    },
    indoor: {
      title: 'Ventilation Timing: Morning Smog vs Solar Window',
      unaware: 'Open windows at 8:00 AM to "let in morning air." Traps ground inversion smog directly in bedrooms.',
      airwise: 'Keep windows sealed until 1:30 PM solar convection lifts boundary layer. Flush CO2 safely.',
      impact: '61% lower indoor PM2.5 intake',
      icon: Home
    },
    exercise: {
      title: 'Physical Exertion: Arterial Road Run vs Indoor Mobility',
      unaware: '6:00 PM 5km outdoor run during diesel freight rush. 70 L/min deep respiratory deposition.',
      airwise: 'Perform indoor interval circuit in closed room. Protects alveoli while preserving cardiovascular load.',
      impact: '81% alveolar dose avoided',
      icon: Activity
    },
    cooking: {
      title: 'Culinary Airflow: Unvented Oil Frying vs Exhaust Isolation',
      unaware: 'High-heat oil frying without pre-exhaust. Indoor PM2.5 spikes to 420 µg/m³ across living areas.',
      airwise: 'Run exhaust 2 mins prior to heat pan; seal bedroom doors. VOCs evacuate immediately outdoors.',
      impact: '70% grease particulate eliminated',
      icon: Flame
    }
  };

  const dayJourneySlots = [
    {
      time: '07:00 AM',
      period: 'Morning Routine',
      original: {
        title: 'Outdoor 5km Road Jog along Main Arterial',
        risk: 'Deep breathing (60 L/min) during nocturnal boundary inversion. Inhales ~180 µg toxic soot directly into alveoli.',
        badge: 'Severe Toxic Inhalation',
        color: '#E64848'
      },
      adapted: {
        title: 'Indoor Core & Mobility Circuit in Sealed Room',
        benefit: 'Preserves cardiovascular exercise while avoiding ground-level diesel smoke completely.',
        badge: '-81% Alveolar Soot Inhaled',
        color: '#3DD68C'
      }
    },
    {
      time: '08:30 AM',
      period: 'Morning Commute',
      original: {
        title: 'Open Petrol Two-Wheeler on Congested Ring Road',
        risk: 'Direct tailpipe particulate exposure (PM2.5 > 280 µg/m³) in bumper-to-bumper standstill traffic.',
        badge: 'High Tailpipe Soot',
        color: '#E64848'
      },
      adapted: {
        title: 'Underground Electric Metro (Filtered Carriage)',
        benefit: 'Bypasses surface traffic; saves 1.12 kg CO2e (IPCC 2021) and cuts roadside soot intake by 73%.',
        badge: '-73% Exposure • -1.12 kg CO2',
        color: '#3DD68C'
      }
    },
    {
      time: '01:30 PM',
      period: 'Solar Peak Window',
      original: {
        title: 'Windows Kept Sealed Shut All Day and Night',
        risk: 'Indoor CO2 levels exceed 1,800 ppm, causing cognitive fatigue, headaches, and stale moisture buildup.',
        badge: 'Severe Indoor CO2 Trap',
        color: '#F28B36'
      },
      adapted: {
        title: 'Timed 20-Minute Cross-Ventilation Aeration',
        benefit: 'Solar convection lifts boundary layer to 1,200m (cleanest air of the day). Flushes stale air safely.',
        badge: 'Cleanest 2-Hour Window',
        color: '#3DD68C'
      }
    },
    {
      time: '06:30 PM',
      period: 'Evening Living',
      original: {
        title: 'Unvented High-Heat Oil Frying with Open Bedroom Doors',
        risk: 'Aerosolized oil soot and acrolein VOCs spike indoor PM2.5 to 420 µg/m³ across living and sleep quarters.',
        badge: 'Indoor Particulate Spike',
        color: '#E64848'
      },
      adapted: {
        title: '2-Minute Pre-Exhaust Negative Pressure Routine',
        benefit: 'Run exhaust 2 mins before heating pan; seal internal doors. VOCs evacuate immediately outdoors.',
        badge: '-70% Cooking Soot Spikes',
        color: '#3DD68C'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-[#07110E] text-[#F0F3EA] font-interface selection:bg-[#C7F36B] selection:text-[#07110E] relative overflow-x-hidden">
      <ParticleAtmosphere />
      <DemoBanner />
      <Navbar />

      {/* ========================================================= */}
      {/* 1. HERO SECTION                                           */}
      {/* ========================================================= */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#11231B] border border-[#C7F36B]/30 text-xs font-mono text-[#C7F36B]">
              <span className="w-2 h-2 rounded-full bg-[#C7F36B] animate-pulse" />
              <span>PERSONAL AIR INTELLIGENCE</span>
            </div>

            <h1 className="font-editorial text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#F0F3EA] leading-[1.05]">
              The air changes. <br />
              <span className="italic text-[#C7F36B] font-normal">Your day should, too.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#A3B1A6] max-w-2xl leading-relaxed">
              AIRWISE turns raw pollution telemetry into practical daily decisions for your commute, home ventilation, health-conscious routines, and community.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/app"
                className="px-6 py-3.5 rounded-2xl bg-[#C7F36B] hover:bg-[#A8D957] text-[#07110E] font-bold text-sm transition-all shadow-xl hover:shadow-[#C7F36B]/20 flex items-center gap-2 group"
              >
                <span>Explore Daily Adaptation</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/app/what-if"
                className="px-6 py-3.5 rounded-2xl bg-[#11231B] hover:bg-[#162A20] text-[#F0F3EA] border border-[#91B49A]/25 text-sm font-semibold transition-all flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-[#C7F36B]" />
                <span>Launch What-if Simulator</span>
              </Link>
            </div>

            <div className="pt-6 border-t border-[#91B49A]/15 grid grid-cols-3 gap-4 text-xs font-mono text-[#A3B1A6]">
              <div>
                <span className="block text-lg font-bold text-[#F0F3EA] font-editorial">₹0</span>
                <span>Zero-Cost Focus</span>
              </div>
              <div>
                <span className="block text-lg font-bold text-[#3DD68C] font-editorial">-73%</span>
                <span>Commute Exposure</span>
              </div>
              <div>
                <span className="block text-lg font-bold text-[#C7F36B] font-editorial">24h</span>
                <span>Diurnal Physics Model</span>
              </div>
            </div>
          </div>

          {/* Right Column: Original Atmospheric Visualization Instrument */}
          <div className="lg:col-span-5 flex justify-center">
            <AtmosphericHeroInstrument />
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. INTERACTIVE STORY: ORIGINAL DAY → AIRWISE-ADAPTED DAY */}
      {/* ========================================================= */}
      <section id="day-journey" className="py-20 bg-[#0B1914] border-y border-[#91B49A]/15 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#C7F36B] uppercase tracking-wider font-bold">
              <span className="w-2 h-2 rounded-full bg-[#C7F36B]" />
              Interactive Adaptation Preview
            </div>
            <h2 className="font-editorial text-4xl sm:text-5xl font-bold text-[#F0F3EA] tracking-tight">
              Original day → AIRWISE-adjusted day.
            </h2>
            <p className="text-sm sm:text-base text-[#A3B1A6] leading-relaxed">
              Witness how subtle, zero-cost timing shifts transform an otherwise hazardous smoggy winter day into a protected, low-emission daily routine.
            </p>
          </div>

          {/* Perspective View Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-2 rounded-2xl bg-[#07110E] border border-[#91B49A]/20">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[#A3B1A6] px-2 hidden sm:inline">Compare Modes:</span>
              <button
                onClick={() => setDayComparisonMode('adapted')}
                className={`px-4 py-2 rounded-xl transition-all font-bold ${
                  dayComparisonMode === 'adapted'
                    ? 'bg-[#3DD68C] text-[#07110E] shadow-md'
                    : 'text-[#A3B1A6] hover:text-[#F0F3EA]'
                }`}
              >
                With AIRWISE
              </button>
              <button
                onClick={() => setDayComparisonMode('original')}
                className={`px-4 py-2 rounded-xl transition-all font-bold ${
                  dayComparisonMode === 'original'
                    ? 'bg-[#E64848] text-[#07110E] shadow-md'
                    : 'text-[#A3B1A6] hover:text-[#F0F3EA]'
                }`}
              >
                Unadapted Default
              </button>
              <button
                onClick={() => setDayComparisonMode('sideBySide')}
                className={`px-4 py-2 rounded-xl transition-all font-bold ${
                  dayComparisonMode === 'sideBySide'
                    ? 'bg-[#C7F36B] text-[#07110E] shadow-md'
                    : 'text-[#A3B1A6] hover:text-[#F0F3EA]'
                }`}
              >
                Side-by-Side Walkthrough
              </button>
            </div>

            <span className="text-xs font-mono text-[#91B49A] px-2">
              4 Diurnal Touchpoints
            </span>
          </div>

          {/* Interactive Touchpoint Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dayJourneySlots.map((slot, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[#11231B] border border-[#91B49A]/20 flex flex-col justify-between space-y-4 shadow-lg hover:border-[#C7F36B]/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#91B49A]/15 font-mono text-xs">
                    <span className="text-[#C7F36B] font-bold">{slot.time}</span>
                    <span className="text-[#A3B1A6] uppercase text-[10px]">{slot.period}</span>
                  </div>

                  {/* Mode Content */}
                  {dayComparisonMode === 'original' ? (
                    <div className="pt-3 space-y-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-[#E64848]/15 text-[#E64848] border border-[#E64848]/30 inline-block">
                        {slot.original.badge}
                      </span>
                      <h3 className="text-base font-bold text-[#F0F3EA]">
                        {slot.original.title}
                      </h3>
                      <p className="text-xs text-[#A3B1A6] leading-relaxed">
                        {slot.original.risk}
                      </p>
                    </div>
                  ) : dayComparisonMode === 'adapted' ? (
                    <div className="pt-3 space-y-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-[#3DD68C]/15 text-[#3DD68C] border border-[#3DD68C]/30 inline-block">
                        {slot.adapted.badge}
                      </span>
                      <h3 className="text-base font-bold text-[#F0F3EA]">
                        {slot.adapted.title}
                      </h3>
                      <p className="text-xs text-[#A3B1A6] leading-relaxed">
                        {slot.adapted.benefit}
                      </p>
                    </div>
                  ) : (
                    <div className="pt-3 space-y-3">
                      <div className="p-3 rounded-xl bg-[#07110E] border border-[#E64848]/30 space-y-1">
                        <span className="text-[10px] font-mono text-[#E64848] uppercase font-bold block">
                          Unadapted:
                        </span>
                        <div className="text-xs font-semibold text-[#F0F3EA]">
                          {slot.original.title}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-[#07110E] border border-[#3DD68C]/35 space-y-1">
                        <span className="text-[10px] font-mono text-[#3DD68C] uppercase font-bold block">
                          Airwise Adaptation:
                        </span>
                        <div className="text-xs font-semibold text-[#F0F3EA]">
                          {slot.adapted.title}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#91B49A]/10 text-[11px] font-mono text-[#91B49A]">
                  Zero added cost • Preserves daily goals
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. PHILOSOPHY: AIR IS NOT JUST A NUMBER                  */}
      {/* ========================================================= */}
      <section id="why-aqi" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#C7F36B]">
            Philosophical Foundation
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl font-bold text-[#F0F3EA] tracking-tight">
            Air is not just a number.
          </h2>
          <p className="text-sm sm:text-base text-[#A3B1A6] leading-relaxed">
            Standard weather apps show an AQI of "284" and tell you to "stay indoors." But real life doesn’t stop. You have to commute, care for children, cook meals, and stay active.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#11231B] border border-[#91B49A]/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#E64848]/15 border border-[#E64848]/30 flex items-center justify-center text-[#E64848]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F0F3EA]">The Flaw of Static AQI</h3>
            <p className="text-xs text-[#A3B1A6] leading-relaxed">
              AQI measures city-wide ambient air at 10 meters height. It ignores whether you travel by underground train or open motorbike, or whether your windows face a park or a diesel corridor.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#11231B] border border-[#91B49A]/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5C842]/15 border border-[#F5C842]/30 flex items-center justify-center text-[#F5C842]">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F0F3EA]">Diurnal Boundary Shifts</h3>
            <p className="text-xs text-[#A3B1A6] leading-relaxed">
              Air quality changes drastically throughout a single day. Ground inversions trap morning smoke at breathing level, while 1:30 PM solar convection creates a clean aeration window.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#11231B] border border-[#C7F36B]/30 space-y-3 glow-primary">
            <div className="w-10 h-10 rounded-xl bg-[#C7F36B]/15 border border-[#C7F36B]/30 flex items-center justify-center text-[#C7F36B]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F0F3EA]">The Airwise Breakthrough</h3>
            <p className="text-xs text-[#A3B1A6] leading-relaxed">
              We combine atmospheric science with your daily itinerary. Instead of passive dread, you get concrete schedule adjustments that eliminate up to 70% of your respiratory exposure.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. REAL-WORLD DECISION PHYSICS & DOMAINS                  */}
      {/* ========================================================= */}
      <section id="decision-impact" className="py-20 bg-[#0B1914] border-t border-[#91B49A]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#C7F36B]">
                Real-World Exposure Physics
              </span>
              <h2 className="font-editorial text-4xl sm:text-5xl font-bold text-[#F0F3EA] tracking-tight mt-1">
                Everyday decisions have different consequences.
              </h2>
            </div>
            <p className="text-xs text-[#A3B1A6] max-w-md">
              Click through common daily touchpoints to witness how subtle behavioral timing protects human lungs without costing a rupee.
            </p>
          </div>

          {/* Domain Tab Selector */}
          <div className="flex flex-wrap gap-2 border-b border-[#91B49A]/15 pb-4">
            {(['commute', 'indoor', 'exercise', 'cooking'] as const).map((key) => {
              const item = decisionMatrix[key];
              const isSelected = selectedDomain === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedDomain(key)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-[#C7F36B] text-[#07110E] shadow-md'
                      : 'bg-[#11231B] text-[#A3B1A6] hover:text-[#F0F3EA] border border-[#91B49A]/15'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="capitalize">{key}</span>
                </button>
              );
            })}
          </div>

          {/* Side-by-side Decision Comparison Card */}
          {(() => {
            const current = decisionMatrix[selectedDomain];
            return (
              <div className="p-8 rounded-3xl bg-gradient-to-b from-[#11231B] to-[#07110E] border border-[#91B49A]/20 shadow-2xl">
                <div className="flex items-center justify-between pb-6 border-b border-[#91B49A]/15 mb-6">
                  <h3 className="text-lg font-bold text-[#F0F3EA]">
                    {current.title}
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-[#3DD68C]/15 border border-[#3DD68C]/30 text-[#3DD68C] text-xs font-mono font-bold">
                    {current.impact}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-[#07110E]/80 border border-[#E64848]/25 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#E64848] uppercase">
                      <span className="w-2 h-2 rounded-full bg-[#E64848]" />
                      <span>Unadapted Default Routine</span>
                    </div>
                    <p className="text-xs text-[#A3B1A6] leading-relaxed pt-1">
                      {current.unaware}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#07110E]/80 border border-[#C7F36B]/35 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#C7F36B] uppercase">
                      <span className="w-2 h-2 rounded-full bg-[#C7F36B]" />
                      <span>Airwise Adapted Decision</span>
                    </div>
                    <p className="text-xs text-[#F0F3EA] leading-relaxed pt-1">
                      {current.airwise}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#91B49A]/10 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <span className="text-[#A3B1A6]">
                    Simulate custom route and timing trade-offs inside our interactive engine.
                  </span>
                  <Link
                    to="/app/what-if"
                    className="text-[#C7F36B] hover:underline font-mono flex items-center gap-1 font-semibold"
                  >
                    <span>Launch What-if Simulator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};
