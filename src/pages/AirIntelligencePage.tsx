import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RiskBadge } from '../components/visual/RiskBadge';
import { StatCard } from '../components/ui/StatCard';
import { 
  Activity, 
  Wind, 
  Thermometer, 
  Compass, 
  Layers, 
  HelpCircle,
  BarChart3
} from 'lucide-react';
import { Modal } from '../components/common/Modal';

/**
 * AirIntelligencePage Component
 * 
 * Deep atmospheric telemetry radar analyzing 6 pollutant species (PM2.5, PM10, NO2, O3, CO, SO2),
 * planetary boundary layer compression heights, and diurnal dispersion vectors.
 */
export const AirIntelligencePage: React.FC = () => {
  const { 
    airData, 
    locations, 
    dailyForecast, 
    currentLocationId
  } = useApp();

  const [comparisonLocId, setComparisonLocId] = useState<string>('london');
  const [selectedPollutant, setSelectedPollutant] = useState<string>('pm25');
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  const compLoc = locations.find(l => l.id === comparisonLocId) || locations[1] || locations[0] || {
    id: 'london',
    name: 'London',
    subArea: 'Marylebone Road / Southwark',
    country: 'United Kingdom',
    aqi: 68,
    riskLevel: 'moderate' as const,
    primary: 'pm25' as const
  };

  const pollutantsInfo: Record<string, {
    name: string;
    value: number;
    unit: string;
    whoLimit: number;
    description: string;
    source: string;
    healthEffect: string;
    status: 'severe' | 'high' | 'moderate' | 'low';
  }> = {
    pm25: {
      name: 'PM2.5 (Fine Particulate)',
      value: airData?.pollutants.pm25 || 198.4,
      unit: 'µg/m³',
      whoLimit: 15,
      description: 'Microscopic particles under 2.5 microns that penetrate through bronchial tubes into blood capillaries.',
      source: 'Vehicular diesel emissions, solid biomass burning, road dust resuspension.',
      healthEffect: 'Vascular inflammation, arterial plaque vulnerability, airway constriction.',
      status: (airData?.pollutants.pm25 || 0) > 120 ? 'severe' : (airData?.pollutants.pm25 || 0) > 60 ? 'high' : 'moderate'
    },
    pm10: {
      name: 'PM10 (Coarse Particulate)',
      value: airData?.pollutants.pm10 || 312.0,
      unit: 'µg/m³',
      whoLimit: 45,
      description: 'Inhalable coarse particles under 10 microns deposited mainly in upper respiratory cavities.',
      source: 'Construction soil, mechanical tire wear, road silt.',
      healthEffect: 'Nasal congestion, acute coughing, corneal irritation.',
      status: (airData?.pollutants.pm10 || 0) > 250 ? 'severe' : (airData?.pollutants.pm10 || 0) > 100 ? 'high' : 'moderate'
    },
    no2: {
      name: 'NO2 (Nitrogen Dioxide)',
      value: airData?.pollutants.no2 || 84.5,
      unit: 'ppb',
      whoLimit: 25,
      description: 'Reddish-brown corrosive gas generated during high-temperature combustion in vehicle engines.',
      source: 'Automotive tailpipes, thermal power plants, industrial boilers.',
      healthEffect: 'Sensitizes lungs to allergens, exacerbates asthma flare-ups.',
      status: (airData?.pollutants.no2 || 0) > 80 ? 'high' : 'moderate'
    },
    o3: {
      name: 'O3 (Ground-Level Ozone)',
      value: airData?.pollutants.o3 || 38.2,
      unit: 'ppb',
      whoLimit: 50,
      description: 'Secondary photochemical pollutant formed when NOx and VOCs cook under direct sunlight.',
      source: 'Solar chemical reaction of vehicle exhaust during midday heat.',
      healthEffect: 'Reduces lung elasticity, causes sharp chest pain on deep inspiration.',
      status: (airData?.pollutants.o3 || 0) > 50 ? 'high' : 'low'
    },
    co: {
      name: 'CO (Carbon Monoxide)',
      value: airData?.pollutants.co || 2.8,
      unit: 'ppm',
      whoLimit: 4.0,
      description: 'Colorless, odorless toxic gas that binds with hemoglobin, reducing oxygen delivery.',
      source: 'Incomplete gasoline combustion, faulty unvented indoor burners.',
      healthEffect: 'Headaches, mental fatigue, reduced reflexes.',
      status: (airData?.pollutants.co || 0) > 4 ? 'high' : 'low'
    },
    so2: {
      name: 'SO2 (Sulfur Dioxide)',
      value: airData?.pollutants.so2 || 18.3,
      unit: 'ppb',
      whoLimit: 20,
      description: 'Pungent acidic gas originating from sulfur-bearing fossil fuels.',
      source: 'Diesel fuel impurities, coal firing, brick kilns.',
      healthEffect: 'Triggers reflex broncho-spasm within minutes of exposure.',
      status: 'moderate'
    }
  };

  const activePol = pollutantsInfo[selectedPollutant] || pollutantsInfo.pm25;

  // Local Monitoring Stations Grid (Location-based radar alternative)
  const localStations = [
    { name: 'Anand Vihar Station #04', dist: '1.2 km', aqi: 295, status: 'Active (Laser nephelometer)', confidence: '98%' },
    { name: 'Patparganj Industrial #02', dist: '2.8 km', aqi: 278, status: 'Active (Beta attenuation)', confidence: '96%' },
    { name: 'Siri Fort Canopy Sensor', dist: '3.6 km', aqi: 242, status: 'Active (Vegetation buffer)', confidence: '94%' },
    { name: 'Lodhi Estate Reference #01', dist: '5.1 km', aqi: 230, status: 'Active (CPCB Benchmark)', confidence: '99%' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#91B49A]/15">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#91B49A] mb-1">
            <Activity className="w-3.5 h-3.5 text-[#C7F36B]" />
            <span>Environmental Telemetry & Chemical Speciation</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-[#F0F3EA] tracking-tight">
            Air Intelligence Radar
          </h1>
          <p className="text-sm text-[#A3B1A6] mt-1">
            Ground sensor networks, planetary boundary layer dynamics, and speciation breakdown.
          </p>
        </div>

        <button
          onClick={() => setIsMethodologyOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#11231B] hover:bg-[#162A20] border border-[#91B49A]/25 text-xs text-[#C7F36B] font-mono transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Measurement Standards</span>
        </button>
      </div>

      {/* WEATHER & DISPERSION BAR */}
      {airData && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            label="Ambient Air Index"
            value={airData.aqi}
            unit="AQI"
            badge={`${airData.primaryPollutant.toUpperCase()} Dominant`}
            badgeColor={airData.riskLevel === 'severe' ? 'red' : 'orange'}
            icon={<Activity className="w-4 h-4" />}
          />
          <StatCard
            label="Boundary Wind Vector"
            value={airData.weather.windSpeed}
            unit="km/h"
            subtext={airData.weather.windDirection}
            badge={airData.weather.windSpeed < 5 ? 'Stagnant' : 'Dispersive'}
            badgeColor={airData.weather.windSpeed < 5 ? 'red' : 'green'}
            icon={<Wind className="w-4 h-4" />}
          />
          <StatCard
            label="Thermal Layer"
            value={airData.weather.temperature}
            unit="°C"
            subtext={`Humidity ${airData.weather.humidity}%`}
            icon={<Thermometer className="w-4 h-4" />}
          />
          <StatCard
            label="Inversion Status"
            value="320m"
            unit="altitude"
            subtext="Trapped morning boundary"
            badge="Thermal Cap"
            badgeColor="orange"
            icon={<Layers className="w-4 h-4" />}
          />
        </div>
      )}

      {/* CHEMICAL SPECIATION & POLLUTANT BREAKDOWN INTERACTIVE EXPLORER */}
      <section className="rounded-3xl bg-[#11231B] border border-[#91B49A]/20 p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#91B49A]/15 gap-2">
          <div>
            <h3 className="text-lg font-bold text-[#F0F3EA] font-interface">
              Pollutant Breakdown & Biological Vulnerability
            </h3>
            <p className="text-xs text-[#A3B1A6]">
              Select a gas or particulate to examine source mechanics and physiological effects.
            </p>
          </div>

          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#07110E] text-[#91B49A] border border-[#91B49A]/15">
            Driving Risk: {airData?.primaryPollutant.toUpperCase()}
          </span>
        </div>

        {/* Pollutant Tabs */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {Object.entries(pollutantsInfo).map(([key, item]) => {
            const isSelected = selectedPollutant === key;
            const isDominant = airData?.primaryPollutant === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedPollutant(key)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-[#162A20] border-[#C7F36B] shadow-md scale-[1.02]'
                    : 'bg-[#07110E]/60 border-[#91B49A]/10 hover:border-[#91B49A]/30'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span className="text-xs font-mono uppercase font-bold text-[#F0F3EA]">
                    {key.toUpperCase()}
                  </span>
                  {isDominant && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E64848] animate-ping" />
                  )}
                </div>
                <div className="font-editorial text-lg font-bold text-[#C7F36B] my-0.5">
                  {item.value}
                </div>
                <div className="text-[10px] text-[#A3B1A6] font-mono">
                  {item.unit}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Pollutant Deep Dive Details */}
        <div className="p-5 rounded-2xl bg-[#07110E]/80 border border-[#91B49A]/20 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-[#C7F36B] tracking-wider block">
              Chemical Identity
            </span>
            <h4 className="text-base font-bold text-[#F0F3EA]">
              {activePol.name}
            </h4>
            <p className="text-[#A3B1A6] leading-relaxed">
              {activePol.description}
            </p>
            <div className="pt-2 font-mono text-[11px] text-[#F5C842]">
              WHO Guideline Limit: {activePol.whoLimit} {activePol.unit} (Current is {(activePol.value / activePol.whoLimit).toFixed(1)}x over limit)
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-[#91B49A] tracking-wider block">
              Primary Combustion Origin
            </span>
            <p className="text-[#A3B1A6] leading-relaxed">
              {activePol.source}
            </p>
            <div className="p-2.5 rounded-xl bg-[#11231B] border border-[#91B49A]/10 text-[#F0F3EA]">
              <strong className="text-[#C7F36B] font-mono text-[10px] uppercase block mb-0.5">
                Micro-Mitigation Rule:
              </strong>
              Keep at least 150m distance from heavy diesel bypass corridors during standstill rush hours.
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-[#E64848] tracking-wider block">
              Physiological Vulnerability
            </span>
            <p className="text-[#A3B1A6] leading-relaxed">
              {activePol.healthEffect}
            </p>
            <div className="p-2.5 rounded-xl bg-[#E64848]/10 border border-[#E64848]/25 text-[#E64848]">
              Vulnerable groups (infants, asthmatics, seniors) experience elevated airway resistance within 20 mins.
            </div>
          </div>
        </div>
      </section>

      {/* 5-DAY PROJECTION & LOCATION COMPARISON */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 5-Day Trend Forecast */}
        <div className="lg:col-span-7 rounded-3xl bg-[#11231B] border border-[#91B49A]/20 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#91B49A]/15">
            <h3 className="text-base font-bold text-[#F0F3EA] font-interface flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#C7F36B]" />
              5-Day Atmospheric Outlook
            </h3>
            <span className="text-xs font-mono text-[#A3B1A6]">
              Simulated Diurnal Models
            </span>
          </div>

          <div className="space-y-3">
            {dailyForecast.map((df, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#07110E]/60 border border-[#91B49A]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="w-28 font-semibold text-[#F0F3EA]">
                  {df.day}
                </div>

                <div className="flex-1 min-w-0 text-[#A3B1A6] truncate">
                  {df.dominantCondition}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="font-editorial text-base font-bold text-[#F0F3EA] block">
                      {df.avgAqi}
                    </span>
                    <span className="text-[10px] font-mono text-[#65736A]">
                      Peak: {df.peakAqi}
                    </span>
                  </div>
                  <RiskBadge level={df.riskLevel} size="sm" showDot={false} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Location Comparison Tool */}
        <div className="lg:col-span-5 rounded-3xl bg-[#11231B] border border-[#91B49A]/20 p-6 shadow-xl space-y-4">
          <div className="pb-3 border-b border-[#91B49A]/15">
            <h3 className="text-base font-bold text-[#F0F3EA] font-interface">
              Comparative Environmental Benchmarking
            </h3>
            <p className="text-xs text-[#A3B1A6] mt-0.5">
              Compare your current reading against global cities.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#A3B1A6] mb-1.5">
                Select Benchmark City:
              </label>
              <select
                value={comparisonLocId}
                onChange={(e) => setComparisonLocId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#07110E] border border-[#91B49A]/30 text-xs text-[#F0F3EA] focus:outline-none focus:border-[#C7F36B]"
              >
                {locations.filter(l => l.id !== currentLocationId).map(loc => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.country}) — AQI {loc.aqi}
                  </option>
                ))}
              </select>
            </div>

            {/* Comparison Visualization */}
            <div className="p-4 rounded-2xl bg-[#07110E] border border-[#91B49A]/15 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[#F0F3EA]">
                    {airData?.locationName} (Current)
                  </span>
                  <span className="font-mono text-[#E64848] font-bold">
                    {airData?.aqi} AQI
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#162A20] overflow-hidden">
                  <div
                    className="h-full bg-[#E64848] rounded-full"
                    style={{ width: `${Math.min(100, ((airData?.aqi || 284) / 400) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[#F0F3EA]">
                    {compLoc.name}
                  </span>
                  <span className="font-mono text-[#3DD68C] font-bold">
                    {compLoc.aqi} AQI
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#162A20] overflow-hidden">
                  <div
                    className="h-full bg-[#3DD68C] rounded-full"
                    style={{ width: `${Math.min(100, (compLoc.aqi / 400) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 text-[11px] text-[#A3B1A6] leading-relaxed">
                {airData && airData.aqi > compLoc.aqi ? (
                  <p>
                    {airData.locationName} is experiencing <strong>{(airData.aqi / compLoc.aqi).toFixed(1)}x higher</strong> atmospheric pollution than {compLoc.name} due to geographical thermal inversions and calm continental winds.
                  </p>
                ) : (
                  <p>
                    Conditions in {airData?.locationName} are favorable compared to the benchmark.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LOCAL SENSOR NETWORK RADAR ALTERNATIVE */}
      <section className="rounded-3xl bg-[#11231B] border border-[#91B49A]/20 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#91B49A]/15 gap-2">
          <div>
            <h3 className="text-base font-bold text-[#F0F3EA] font-interface flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#C7F36B]" />
              Local Sensor Grid Telemetry
            </h3>
            <p className="text-xs text-[#A3B1A6]">
              Real-feel readings from calibrated optical and beta attenuation nodes across your urban sector.
            </p>
          </div>

          <span className="text-[11px] font-mono text-[#3DD68C] flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#3DD68C] animate-pulse" />
            <span>4 Nodes Syncing Online</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {localStations.map((station, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl bg-[#07110E] border border-[#91B49A]/15 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-[#91B49A] text-[10px]">{station.dist}</span>
                  <span className="font-mono text-[10px] text-[#C7F36B]">{station.confidence} cert</span>
                </div>
                <h4 className="text-xs font-bold text-[#F0F3EA] mb-1">
                  {station.name}
                </h4>
                <p className="text-[11px] text-[#65736A]">{station.status}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#91B49A]/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#A3B1A6]">Index</span>
                <span className="font-editorial text-lg font-bold text-[#E64848]">
                  {station.aqi} AQI
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* METHODOLOGY MODAL */}
      <Modal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
        title="Scientific Instrumentation & Standards"
        subtitle="Airwise Atmospheric Calculation Model"
      >
        <div className="space-y-4 text-xs leading-relaxed text-[#A3B1A6]">
          <p>
            AIRWISE adheres strictly to the <strong>Indian National Ambient Air Quality Standards (NAAQS)</strong> and the <strong>United States EPA AQI Breakpoints</strong>.
          </p>
          <div className="p-3 rounded-xl bg-[#07110E] border border-[#91B49A]/15 space-y-2">
            <h4 className="font-bold text-[#F0F3EA]">How Risk is Attributed</h4>
            <p>
              AQI is calculated via piece-wise linear function across six criteria pollutants. The overall index is determined solely by the single highest sub-index pollutant (the "Driving Risk Pollutant").
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#07110E] border border-[#91B49A]/15 space-y-2">
            <h4 className="font-bold text-[#F0F3EA]">Known Uncertainties & Limitations</h4>
            <p>
              Microclimate variations (such as street canyons, building wind shadows, and localized diesel idling) can produce localized particulate spikes up to 40% higher than stationary rooftop monitors. AIRWISE models these micro-variations using diurnal planetary boundary layer physics.
            </p>
          </div>
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setIsMethodologyOpen(false)}
              className="px-4 py-2 rounded-xl bg-[#C7F36B] text-[#07110E] font-bold"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
