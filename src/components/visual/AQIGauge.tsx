import React from 'react';
import { RiskLevel, AQIStandard } from '../../types';
import { RiskBadge } from './RiskBadge';
import { Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface AQIGaugeProps {
  aqi: number;
  riskLevel: RiskLevel;
  standard: AQIStandard;
  primaryPollutant: string;
  confidenceScore: number;
  outdoorRecommendation?: string;
  size?: 'compact' | 'normal' | 'hero';
}

export const AQIGauge: React.FC<AQIGaugeProps> = ({
  aqi,
  riskLevel,
  standard,
  primaryPollutant,
  confidenceScore,
  outdoorRecommendation,
  size = 'normal'
}) => {
  // Max AQI scale reference is 500
  const normalizedValue = Math.min(Math.max(aqi, 0), 500);
  // Circle geometry
  const radius = size === 'hero' ? 120 : size === 'normal' ? 95 : 65;
  const strokeWidth = size === 'hero' ? 14 : size === 'normal' ? 10 : 8;
  const circumference = 2 * Math.PI * radius;
  // We use a 240-degree arc instead of full 360 for instrument gauge aesthetic
  const arcLength = circumference * (240 / 360);
  const strokeDashoffset = arcLength - (arcLength * (normalizedValue / 500));

  const riskColor = {
    low: '#3DD68C',
    moderate: '#F5C842',
    high: '#F28B36',
    severe: '#E64848'
  }[riskLevel];

  const standardLabel = {
    'US_AQI': 'EPA US AQI',
    'IN_NAAQS': 'National NAAQS',
    'WHO_2021': 'WHO Reference'
  }[standard] || standard;

  return (
    <div className="relative flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-[#11231B] to-[#0B1914] border border-[#91B49A]/15 shadow-xl">
      {/* Top Meta Header */}
      <div className="w-full flex items-center justify-between mb-4 text-xs text-[#A3B1A6]">
        <span className="flex items-center gap-1.5 font-mono">
          <Activity className="w-3.5 h-3.5 text-[#C7F36B]" />
          <span>{standardLabel}</span>
        </span>
        <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#162A20] text-[#91B49A] text-[11px] font-mono">
          {confidenceScore}% confidence
        </span>
      </div>

      {/* SVG Arc Gauge */}
      <div className="relative flex items-center justify-center">
        <svg
          width={radius * 2 + strokeWidth * 2 + 10}
          height={radius * 2 + strokeWidth * 2 + 10}
          className="transform -rotate-[210deg] transition-transform duration-700"
        >
          {/* Background Track */}
          <circle
            cx={radius + strokeWidth + 5}
            cy={radius + strokeWidth + 5}
            r={radius}
            fill="none"
            stroke="#162A20"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />

          {/* Calibrated Tick Marks / Segments */}
          <circle
            cx={radius + strokeWidth + 5}
            cy={radius + strokeWidth + 5}
            r={radius}
            fill="none"
            stroke={riskColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 10px ${riskColor}40)`
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] uppercase tracking-widest text-[#A3B1A6] font-mono">
            Index
          </span>
          <span 
            className={`font-editorial font-bold tracking-tight text-[#F0F3EA] ${
              size === 'hero' ? 'text-7xl' : size === 'normal' ? 'text-5xl' : 'text-4xl'
            }`}
          >
            {aqi}
          </span>
          <div className="mt-1">
            <RiskBadge level={riskLevel} size="sm" />
          </div>
          <span className="mt-1 text-[11px] font-mono text-[#A3B1A6]">
            {primaryPollutant.toUpperCase()} DRIVEN
          </span>
        </div>
      </div>

      {/* Outdoor Guidance Pill */}
      {outdoorRecommendation && (
        <div className="mt-4 w-full p-3 rounded-xl bg-[#07110E]/70 border border-[#91B49A]/10 text-xs text-[#F0F3EA]/90 flex items-start gap-2.5">
          {riskLevel === 'severe' || riskLevel === 'high' ? (
            <ShieldAlert className="w-4 h-4 text-[#F28B36] shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-[#3DD68C] shrink-0 mt-0.5" />
          )}
          <span className="leading-relaxed">{outdoorRecommendation}</span>
        </div>
      )}
    </div>
  );
};
