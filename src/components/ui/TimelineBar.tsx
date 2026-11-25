import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RiskBadge } from '../visual/RiskBadge';
import { Info, Sun, Wind, Clock } from 'lucide-react';

export const TimelineBar: React.FC = () => {
  const { hourlyForecast } = useApp();
  const [selectedHour, setSelectedHour] = useState<string>(hourlyForecast[1]?.hour || '08:00');

  const selectedData = hourlyForecast.find(h => h.hour === selectedHour) || hourlyForecast[0];

  const windows = [
    { label: 'Morning Commute', hours: '07:00 - 09:30', risk: 'severe', note: 'Ground inversion trap; particulate peak' },
    { label: 'Work / Study', hours: '09:30 - 13:00', risk: 'high', note: 'Filtered indoor HVAC environment recommended' },
    { label: 'Lunch / Solar Lift', hours: '13:00 - 14:30', risk: 'moderate', note: 'Peak solar thermal dispersion (Best outdoor air)' },
    { label: 'Afternoon', hours: '14:30 - 17:30', risk: 'moderate', note: 'Pre-rush stability with moderate wind' },
    { label: 'Evening Commute', hours: '17:30 - 20:00', risk: 'high', note: 'Diesel tailpipe surge & declining temperatures' },
    { label: 'Evening / Exercise', hours: '20:00 - 22:00', risk: 'severe', note: 'Cooling ground boundary traps fresh particulates' },
    { label: 'Overnight Stagnation', hours: '22:00 - 06:00', risk: 'severe', note: 'Surface calm; keep bedrooms sealed' }
  ];

  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#11231B] to-[#0B1914] border border-[#91B49A]/20 p-5 shadow-xl">
      {/* Header with explicit scientific labeling */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#91B49A]/15 gap-2">
        <div>
          <h3 className="text-sm font-bold text-[#F0F3EA] uppercase tracking-wider font-mono flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C7F36B]" />
            Diurnal Environmental Risk Windows
          </h3>
          <p className="text-xs text-[#A3B1A6] mt-0.5">
            Atmospheric dispersion profile throughout today’s 24-hour cycle.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#07110E] border border-[#91B49A]/15 text-[11px] font-mono text-[#91B49A]">
          <Info className="w-3 h-3 text-[#C7F36B]" />
          <span>Ambient Risk Windows (Not Individual Inhaled Dose)</span>
        </div>
      </div>

      {/* Hourly Interactive Ticks Bar */}
      <div className="my-5 overflow-x-auto pb-2">
        <div className="min-w-[580px]">
          <div className="grid grid-cols-9 gap-2">
            {hourlyForecast.map((item) => {
              const isSelected = item.hour === selectedHour;
              const barHeightPercent = Math.min(100, Math.max(20, (item.aqi / 350) * 100));
              const riskColor = {
                low: '#3DD68C',
                moderate: '#F5C842',
                high: '#F28B36',
                severe: '#E64848'
              }[item.riskLevel];

              return (
                <button
                  key={item.hour}
                  onClick={() => setSelectedHour(item.hour)}
                  className={`flex flex-col items-center p-2 rounded-xl border transition-all text-center group ${
                    isSelected
                      ? 'bg-[#162A20] border-[#C7F36B] shadow-md scale-105'
                      : 'bg-[#07110E]/60 border-[#91B49A]/10 hover:border-[#91B49A]/30'
                  }`}
                >
                  <span className="text-[11px] font-mono text-[#A3B1A6] mb-1">
                    {item.hour}
                  </span>

                  {/* Vertical bar showing relative intensity */}
                  <div className="w-4 h-16 bg-[#11231B] rounded-full flex flex-col justify-end p-0.5 my-1">
                    <div
                      className="w-full rounded-full transition-all duration-500"
                      style={{
                        height: `${barHeightPercent}%`,
                        backgroundColor: riskColor
                      }}
                    />
                  </div>

                  <span className="font-editorial text-sm font-bold text-[#F0F3EA] my-0.5">
                    {item.aqi}
                  </span>
                  <RiskBadge level={item.riskLevel} size="sm" showDot={false} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Selected Hour Insight Callout */}
      {selectedData && (
        <div className="p-3.5 rounded-xl bg-[#07110E]/80 border border-[#91B49A]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#162A20] border border-[#C7F36B]/25 flex items-center justify-center text-[#C7F36B] font-mono text-sm font-bold">
              {selectedData.hour}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#F0F3EA] text-sm">
                  {selectedData.label || 'Environmental Window'}
                </span>
                <RiskBadge level={selectedData.riskLevel} size="sm" />
              </div>
              <p className="text-xs text-[#A3B1A6] mt-0.5">
                Simulated PM2.5: {selectedData.pm25} µg/m³ • Surface Wind: {selectedData.windSpeed} km/h
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            {selectedData.hour === '14:00' ? (
              <span className="px-3 py-1 rounded-full bg-[#3DD68C]/15 text-[#3DD68C] border border-[#3DD68C]/30 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5" />
                Optimal Ventilation Window
              </span>
            ) : selectedData.riskLevel === 'severe' ? (
              <span className="px-3 py-1 rounded-full bg-[#E64848]/15 text-[#E64848] border border-[#E64848]/30">
                Peak Particle Trapping
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-[#F5C842]/15 text-[#F5C842] border border-[#F5C842]/30">
                Moderate Dispersion
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
